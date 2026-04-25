const express = require('express');
const { SensorLog, ErrorLog, HeartbeatLog, Settings } = require('./models'); // Import SensorLog, ErrorLog, HeartbeatLog, and Settings models

const router = express.Router();

router.post('/sensors', async (req, res) => {
	try {
		const { temperature, humidity, light, door_open } = req.body;

		// Basic payload validation
		if (
			typeof temperature !== 'number' ||
			typeof humidity !== 'number' ||
			typeof light !== 'number' ||
			typeof door_open !== 'boolean'
		) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Invalid payload: temperature (number), humidity (number), light (number), and door_open (boolean) are required.'
			});
		}

		// Inject server timestamp as per PRD
		const newSensorLog = new SensorLog({
			timestamp: new Date(), // Server timestamp
			temperature,
			humidity,
			light,
			doorOpen: door_open // Map to doorOpen as per schema
		});

		await newSensorLog.save();

		res.status(201).json({ success: true, data: newSensorLog, error: null });
	} catch (error) {
		console.error('Error saving sensor data:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

router.post('/errors', async (req, res) => {
	try {
		const { source, message, details } = req.body;

		// Basic payload validation for error fields
		if (typeof source !== 'string' || typeof message !== 'string' || typeof details !== 'string') {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Invalid payload: source (string), message (string), and details (string) are required.'
			});
		}

		const newErrorLog = new ErrorLog({
			timestamp: new Date(), // Server timestamp
			source,
			message,
			details
		});

		await newErrorLog.save();
		res.status(201).json({ success: true, data: newErrorLog, error: null });
	} catch (error) {
		console.error('Error saving error log:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

router.post('/heartbeat', async (req, res) => {
	try {
		const { status } = req.body;

		let heartbeatStatus = true; // Default to active (true) as per PRD's intention

		// If 'status' is explicitly provided in the payload and is a boolean 'false',
		// then set heartbeatStatus to false. Any other value (including undefined,
		// string "active", or boolean true) will result in heartbeatStatus being true.
		if (typeof status === 'boolean' && status === false) {
			heartbeatStatus = false;
		}

		// Overwrite the single existing document or create a new one if it doesn't exist.
		// Using an empty filter `{}` will match the first document found.
		const updatedHeartbeat = await HeartbeatLog.findOneAndUpdate(
			{}, // Filter: empty object to match any single document
			{
				status: heartbeatStatus, // Use the determined boolean status
				lastModifiedTime: new Date() // Explicitly update lastModifiedTime on every heartbeat
			},
			{
				upsert: true, // Create a new document if no document matches the filter
				new: true, // Return the updated document rather than the original
				setDefaultsOnInsert: true // Apply schema defaults when inserting a new document
			}
		);
		res.status(200).json({ success: true, data: updatedHeartbeat, error: null });
	} catch (error) {
		console.error('Error updating heartbeat log:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

// Task 4.1: GET /api/sensors/current - Fetch and return the single most recent document in SensorLog
router.get('/sensors/current', async (req, res) => {
	try {
		const latestSensorLog = await SensorLog.findOne().sort({
			timestamp: -1
		});

		if (!latestSensorLog) {
			return res.status(404).json({ success: false, data: null, error: 'No sensor data found.' });
		}

		res.status(200).json({ success: true, data: latestSensorLog, error: null });
	} catch (error) {
		console.error('Error fetching current sensor data:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

// Task 4.2: GET /api/sensors/history?timeframe=X - Process timeframe query and return the relevant aggregated array for charting.
router.get('/sensors/history', async (req, res) => {
	try {
		const { timeframe } = req.query;
		let startTime;

		switch (timeframe) {
			case '1h':
				startTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
				break;
			case '5h':
				startTime = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 hours ago
				break;
			case '24h':
				startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
				break;
			default:
				return res.status(400).json({
					success: false,
					data: null,
					error: 'Invalid timeframe. Accepted values are "1h", "5h", or "24h".'
				});
		}

		// Fetch sensor logs within the specified timeframe, sorted by timestamp
		const historicalSensorLogs = await SensorLog.find({
			timestamp: { $gte: startTime }
		}).sort({
			timestamp: 1
		});

		if (!historicalSensorLogs || historicalSensorLogs.length === 0) {
			// Return 200 with empty array if no data found for the timeframe, as per PRD "aggregated array for charting"
			return res.status(200).json({ success: true, data: [], error: null });
		}

		res.status(200).json({ success: true, data: historicalSensorLogs, error: null });
	} catch (error) {
		console.error('Error fetching historical sensor data:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

// Task 4.3: POST /api/settings - Save/update user preferences.
router.post('/settings', async (req, res) => {
	try {
		const { lightThreshold } = req.body;

		// Basic validation for lightThreshold (assuming it's the primary setting for now)
		if (typeof lightThreshold !== 'number' || lightThreshold < 0) {
			return res.status(400).json({
				success: false,
				data: null,
				error: 'Invalid payload: lightThreshold (number, must be non-negative) is required.'
			});
		}

		// Use findOneAndUpdate with upsert: true to either update the existing settings
		// or create a new document if one doesn't exist.
		// Assuming there will only be one settings document.
		const updatedSettings = await Settings.findOneAndUpdate(
			{}, // Empty filter to match the single settings document
			{
				lightThreshold: lightThreshold
				// Add other settings here as they are defined in the schema
			},
			{
				new: true, // Return the updated document
				upsert: true, // Create if no document matches
				setDefaultsOnInsert: true // Apply schema defaults on insert
			}
		);

		res.status(200).json({ success: true, data: updatedSettings, error: null });
	} catch (error) {
		console.error('Error saving/updating settings:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

// Task 4.4: GET /api/settings - Fetch settings so they can be displayed on the frontend.
router.get('/settings', async (req, res) => {
	try {
		// Fetch the single settings document.
		// Since we're using findOneAndUpdate with upsert, there should be at most one document.
		const currentSettings = await Settings.findOne({});

		if (!currentSettings) {
			// If no settings document exists yet (e.g., first fetch before any POST),
			// return an empty object or a default settings object if that's preferred.
			// For now, returning an empty object to indicate no explicit settings have been saved.
			// Alternatively, you could return the schema's default lightThreshold here if desired.
			return res.status(200).json({ success: true, data: {}, error: null });
		}

		res.status(200).json({ success: true, data: currentSettings, error: null });
	} catch (error) {
		console.error('Error fetching settings:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

// Task 4.5: GET /api/errors - Return a list of recent error logs to the dashboard.
router.get('/errors', async (req, res) => {
	try {
		// Fetch all error logs, sorted by timestamp descending (most recent first)
		const errorLogs = await ErrorLog.find({}).sort({
			timestamp: -1
		});

		if (!errorLogs || errorLogs.length === 0) {
			return res.status(200).json({ success: true, data: [], error: null });
		}

		res.status(200).json({ success: true, data: errorLogs, error: null });
	} catch (error) {
		console.error('Error fetching error logs:', error);
		res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
	}
});

module.exports = router;
