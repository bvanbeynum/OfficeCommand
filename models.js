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
		required: true
	},
	humidity: {
		type: Number,
		required: true
	},
	light: {
		type: Number,
		required: true
	},
	doorOpen: { // Changed to camelCase for consistency with JavaScript conventions
		type: Boolean,
		required: true
	}
});

// Add a TTL index to prune documents older than 24 hours (24 * 60 * 60 seconds)
sensorLogSchema.index({
	timestamp: 1
}, {
	expireAfterSeconds: 24 * 60 * 60
});

const SensorLog = mongoose.model('SensorLog', sensorLogSchema);

module.exports = {
	SensorLog
};
