const express = require('express');
const path = require('path');
const config = require('./config'); // Assuming config.js exists and exports port

const app = express();
const port = config.port || 9006;

// Serve static files from the frontend build directory
// The 'frontend/dist' directory will contain the compiled React application.
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
