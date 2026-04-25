## Relevant Files

- `./package.json` - Defines monolithic project dependencies and scripts for the root application.
- `./server.js` - Main entry point for the unified Express server. Handles API routes and serves the static frontend build.
- `./config.js` - JSON configuration file (must be added to `.gitignore`) containing DB URI, port, and dev specifics.
- `./models.js` - Contains Mongoose schemas for all required collections.
- `./routes.js` - Contains all API route handlers.

### Notes

- The Unified Node.js server is to be constructed directly in the project root (`/home/bvanbeynum/dev/officecommand`).
- All Git commands should be executed from within `/home/bvanbeynum/dev/officecommand`.
- All Node.js logic must use `async/await` and adhere strictly to the rule: open brace on same line, close brace on own line, terminate with `;`.
- All JSON responses must follow the strict structure: `{ "success": true|false, "data": ..., "error": null }`.
- Ensure `config.js` is placed in `.gitignore`.

## Tasks

- [x] 1.0 Project Setup & Server Initialization
  - [x] 1.1 Initialize the unified Node.js project: `npm init -y`
  - [x] 1.2 (No separate `backend` folder needed; core files stay at root).
  - [x] 1.3 Install minimum dependencies: `npm install express mongoose cors`. Keep packages minimal per security rules.
  - [x] 1.4 Create config.js using JSON format for environment variables (Port default to 9006, MongoDB URI). Update .gitignore to ignore this file.
  - [x] 1.5 Create `server.js` to initialize the Express app and start listening on the configured port.
  - [x] 1.6 Configure `express.static(...)` in `server.js` to serve a placeholder build directory for the frontend.
  - [x] 1.7 Run the server and test that the Express app starts successfully on the target port.

- [x] 2.0 Database Connection & Schema Definition
  - [x] 2.1 Set up MongoDB connection in `server.js` strictly using `mongoose`. Construct the URI as: `mongodb://${config.db.user}:${config.db.pass}@$huntington.beynum.com:27017/beynum?authSource=beynum`.
  - [x] 2.2 Create `models.js` and define `SensorLog` schema with fields: `timestamp` (ISODate), `temperature` (Float), `humidity` (Float), `light` (Int), `door_open` (Boolean). Add a MongoDB TTL Index to automatic prune documents older than 24 hours.
  - [x] 2.3 In `models.js`, define `ErrorLog` schema with fields: `source`, `message`, `details`, and `timestamp`. Do not prune error logs.
  - [x] 2.4 In `models.js`, define `Settings` schema for configuration items (e.g., light threshold).
  - [x] 2.5 In `models.js`, define `HeartbeatLog` schema to store a single ping document containing the status and last modified time.
  - [x] 2.6 Run server and verify MongoDB connects successfully without crashing.

- [ ] 3.0 Ingestion API Endpoints (POST routes)
  - [x] 3.1 Create `routes.js` and implement `POST /api/sensors`. Validate payload variables, inject server timestamp, and save to `SensorLog`.
  - [x] 3.2 In `routes.js`, implement `POST /api/errors`. Process input, attach timestamp, and save to `ErrorLog`.
  - [x] 3.3 In `routes.js`, implement `POST /api/heartbeat`. Overwrite the single existing document in `HeartbeatLog` without creating a history.
  - [x] 3.4 Test (e.g., cURL/Node scripts) against the backend to verify `/api/sensors`, `/api/errors`, and `/api/heartbeat` ingest correctly.

- [ ] 4.0 Web Dashboard API Endpoints (GET & POST routes)
  - [ ] 4.1 In `routes.js`, implement `GET /api/sensors/current`. Fetch and return the single most recent document in `SensorLog`.
  - [ ] 4.2 In `routes.js`, implement `GET /api/sensors/history?timeframe=X`. Process `timeframe` query and return the relevant aggregated array for charting.
  - [ ] 4.3 In `routes.js`, implement `POST /api/settings` to save/update user preferences.
  - [ ] 4.4 In `routes.js`, implement `GET /api/settings` to fetch settings so they can be displayed on the frontend.
  - [ ] 4.5 In `routes.js`, implement `GET /api/errors` to return a list of recent error logs to the dashboard.
  - [ ] 4.6 Ensure all successful responses are wrapped in `{ "success": true, "data": data, "error": null }`.
  - [ ] 4.7 Test querying endpoints, validating correct output constraints natively.

- [ ] 5.0 Error Handling, Middleware & Graceful Shutdown
  - [ ] 5.1 In `server.js`, implement a centralized error handling middleware that captures any request/route errors.
  - [ ] 5.2 Ensure identical JSON responses for errors: `{ "success": false, "data": null, "error": "error message" }`.
  - [ ] 5.3 Catch all unhandled promise rejections system-wide and map them to the unified logger instead of a silent failure.
  - [ ] 5.4 Implement Graceful Shutdown in `server.js`: listen for `SIGINT` and `SIGTERM`, stop accepting new HTTP connections, and cleanly close the MongoDB connection before exiting.
  - [ ] 5.5 Execute negative tests (induce an error and observe middleware correctly catching it and gracefully shutting down on SIGINT).
