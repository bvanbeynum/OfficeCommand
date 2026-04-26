const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const apiRoutes = require('./routes'); // Import API routes

const app = express();
const port = config.port || 9007;

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Declare serverInstance variable in a scope accessible by gracefulShutdown
let serverInstance;

// Database connection (Task 2.1)
const mongoUri = `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=${config.db.authenticationSource}`;

mongoose.connect(mongoUri, {
// Options useNewUrlParser and useUnifiedTopology are no longer supported
})
// Assign the server instance to the higher-scoped variable
.then(() => { // Removed mongoConnection as it's not used directly here
	console.log('MongoDB connected successfully');
	serverInstance = app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
});

// Configure webpack ====================================================

const isDevelopmentMode = process.env.NODE_ENV === 'development';

if (isDevelopmentMode) {
	Promise.all([
		import("webpack"),
		import("webpack-dev-middleware"),
		import("./frontend/webpack.dev.js")
	])
	.then(([webpack, webpackDevMiddleware, webpackConfig]) => {
		const webpackLoader = webpack.default;
		const middleware = webpackDevMiddleware.default;

		const compilier = webpackLoader(webpackConfig.default);
		app.use(middleware(compilier, { publicPath: "/" }));
	});
}
else {
	app.use(express.static(path.join(__dirname, 'build')));
}

// Register API routes
app.use('/api', apiRoutes);

// Task 5.3: Catch all unhandled promise rejections system-wide
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Log this error to MongoDB using the ErrorLog model
	// Need to import ErrorLog model in server.js to use it here
	const { ErrorLog } = require('./models');
	ErrorLog.create({
		source: 'backend-unhandled-rejection',
		message: reason instanceof Error ? reason.message : 'An unhandled promise rejection occurred',
		details: reason instanceof Error ? reason.stack : JSON.stringify(reason)
	}).catch(err => {
		console.error('Error saving unhandledRejection to ErrorLog:', err);
	});
	// In production, you might want to consider process.exit(1) here
	// after a short delay to allow logs to be written. For development,
	// we might let the process continue to observe more errors.
});

// Task 5.3: Catch all uncaught exceptions system-wide
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	// Log this error to MongoDB using the ErrorLog model
	// Need to import ErrorLog model in server.js to use it here
	const { ErrorLog } = require('./models');
	ErrorLog.create({
		source: 'backend-uncaught-exception',
		message: error.message || 'An uncaught exception occurred',
		details: error.stack || JSON.stringify(error)
	}).catch(err => {
		console.error('Error saving uncaughtException to ErrorLog:', err);
	});
	// For uncaught exceptions, it's generally considered best practice to exit
	// the process after logging to prevent an unstable state.
});

// Task 5.1: Centralized error handling middleware
// This middleware captures any request/route errors.
app.use((error, req, res, next) => {
	console.error('Unhandled error:', error); // Log the error for debugging purposes

	// Task 5.2: Ensure identical JSON responses for errors
	res.status(error.status || 500).json({
		success: false,
		data: null,
		error: error.message || 'Internal server error'
	});
});

// Task 5.4: Implement Graceful Shutdown
const gracefulShutdown = (signal) => {
	console.log(`\n${signal} received. Initiating graceful shutdown...`);

	// Close HTTP server to stop accepting new requests
	if (serverInstance) {
		serverInstance.close(() => {
			console.log('HTTP server closed.');
			// Once HTTP server is closed, close DB connection
			closeDbAndExit();
		});
	} else {
		// If server wasn't even started, just close DB
		closeDbAndExit();
	}
};

// Helper function to close DB and exit
const closeDbAndExit = async () => {
	try {
		console.log('Closing MongoDB connection...');
		await mongoose.disconnect();
		console.log('MongoDB disconnected.');
	} catch (err) {
		console.error('Error during MongoDB disconnection:', err);
	} finally {
		console.log('Process exiting.');
		process.exit(0); // Exit cleanly
	}
};

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // docker stop, kill command
