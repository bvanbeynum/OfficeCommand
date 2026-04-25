const express = require('express');
const { SensorLog, ErrorLog, HeartbeatLog } = require('./models'); // Import SensorLog, ErrorLog, and HeartbeatLog models

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
module.exports = router;
