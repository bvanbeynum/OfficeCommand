const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const apiRoutes = require('./routes'); // Import routes

const app = express();
const port = config.port || 9007;

// Serve static files from the frontend build directory
// The 'frontend/dist' directory will contain the compiled React application.
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Database connection (Task 2.1)
const mongoUri = `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=${config.db.authenticationSource}`;

mongoose.connect(mongoUri, {
// Options useNewUrlParser and useUnifiedTopology are no longer supported
})
.then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
});

// Register API routes
app.use('/api', apiRoutes);
