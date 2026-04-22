const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const port = config.port || 9006;

// Serve static files from the frontend build directory
// The 'frontend/dist' directory will contain the compiled React application.
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Database connection (Task 2.1)
const mongoUri = `mongodb://${config.db.user}:${config.db.pass}@${config.mongoUri}`;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
