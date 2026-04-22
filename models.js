const mongoose = require('mongoose');

// SensorLog Schema
const sensorLogSchema = new mongoose.Schema({
	timestamp: {
		type: Date,
		default: Date.now,
		required: true
	},
	temperature: {
		type: Number,
		required: true,
		// Using Float (Number) as specified in PRD
	},
	humidity: {
		type: Number,
		required: true,
		// Using Float (Number) as specified in PRD
	},
	light: {
		type: Number,
		required: true,
		// Using Int (Number) as specified in PRD
	},
	doorOpen: { // Changed to camelCase for consistency with JavaScript conventions
		type: Boolean,
		required: true
	}
});

// Add a TTL index to prune SensorLog documents older than 24 hours (24 * 60 * 60 seconds)
sensorLogSchema.index({
	timestamp: 1
}, {
	expireAfterSeconds: 24 * 60 * 60
});

const SensorLog = mongoose.model('SensorLog', sensorLogSchema);

// ErrorLog Schema (Task 2.3)
const errorLogSchema = new mongoose.Schema({
	source: { type: String, required: true },
	message: { type: String, required: true },
	details: { type: String }, // Details can be optional
	timestamp: { type: Date, default: Date.now, required: true }
});

const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

// Settings Schema (Task 2.4)
const settingsSchema = new mongoose.Schema({
	// Example configuration item: light threshold
	lightThreshold: {
		type: Number,
		default: 500, // Default value for light threshold
		required: true
	}
	// Other settings can be added here as needed
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = {
	SensorLog,
	ErrorLog,
	Settings
};
