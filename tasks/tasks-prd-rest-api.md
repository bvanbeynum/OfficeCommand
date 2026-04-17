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

- [ ] 1.0 Project Setup & Server Initialization
  - [ ] 1.1 [RPI] Initialize the unified Node.js project (`npm init -y`) in the root directory via the Pi.
  - [ ] 1.2 (No separate `backend` folder needed; core files stay at root).
  - [ ] 1.3 [RPI] Install necessary minimum dependencies via the Pi (e.g., `express`, `mongoose`, `cors`). Keep packages minimal per security rules.
  - [ ] 1.4 [WIN] Create `config.js` using JSON format for environment variables (Port default to 9006, MongoDB URI). Update `.gitignore` to ignore this file.
  - [ ] 1.5 [WIN] Create `server.js` to initialize the Express app and start listening on the configured port.
  - [ ] 1.6 [WIN] Configure `express.static(...)` in `server.js` to serve a placeholder build directory for the frontend.
  - [ ] 1.7 [RPI] Deploy current progress, run via Docker natively on the Pi, and test that the Express server starts successfully on the target port.

- [ ] 2.0 Database Connection & Schema Definition
  - [ ] 2.1 [WIN] Set up MongoDB connection in `server.js` strictly using `mongoose`. Construct the URI as: `mongodb://${config.db.user}:${config.db.pass}@$huntington.beynum.com:27017/beynum?authSource=beynum`.
  - [ ] 2.2 [WIN] Create `models.js` and define `SensorLog` schema with fields: `timestamp` (ISODate), `temperature` (Float), `humidity` (Float), `light` (Int), `door_open` (Boolean). Add a MongoDB TTL Index to automatic prune documents older than 24 hours.
  - [ ] 2.3 [WIN] In `models.js`, define `ErrorLog` schema with fields: `source`, `message`, `details`, and `timestamp`. Do not prune error logs.
  - [ ] 2.4 [WIN] In `models.js`, define `Settings` schema for configuration items (e.g., light threshold).
  - [ ] 2.5 [WIN] In `models.js`, define `HeartbeatLog` schema to store a single ping document containing the status and last modified time.
  - [ ] 2.6 [RPI] Deploy models, run server via Docker, and verify MongoDB connects successfully without crashing.

- [ ] 3.0 Ingestion API Endpoints (POST routes)
  - [ ] 3.1 [WIN] Create `routes.js` and implement `POST /api/sensors`. Validate payload variables, inject server timestamp, and save to `SensorLog`.
  - [ ] 3.2 [WIN] In `routes.js`, implement `POST /api/errors`. Process input, attach timestamp, and save to `ErrorLog`.
  - [ ] 3.3 [WIN] In `routes.js`, implement `POST /api/heartbeat`. Overwrite the single existing document in `HeartbeatLog` without creating a history.
  - [ ] 3.4 [RPI] Deploy and use tests (e.g., cURL/Node scripts) against the Docker-hosted Pi backend to verify `/api/sensors`, `/api/errors`, and `/api/heartbeat` ingest correctly.

- [ ] 4.0 Web Dashboard API Endpoints (GET & POST routes)
  - [ ] 4.1 [WIN] In `routes.js`, implement `GET /api/sensors/current`. Fetch and return the single most recent document in `SensorLog`.
  - [ ] 4.2 [WIN] In `routes.js`, implement `GET /api/sensors/history?timeframe=X`. Process `timeframe` query and return the relevant aggregated array for charting.
  - [ ] 4.3 [WIN] In `routes.js`, implement `POST /api/settings` to save/update user preferences.
  - [ ] 4.4 [WIN] In `routes.js`, implement `GET /api/settings` to fetch settings so they can be displayed on the frontend.
  - [ ] 4.5 [WIN] In `routes.js`, implement `GET /api/errors` to return a list of recent error logs to the dashboard.
  - [ ] 4.6 [WIN] Ensure all successful responses are wrapped in `{ "success": true, "data": data, "error": null }`.
  - [ ] 4.7 [RPI] Deploy and test querying endpoints against the Pi, validating correct output constraints natively.

- [ ] 5.0 Error Handling, Middleware & Graceful Shutdown
  - [ ] 5.1 [WIN] In `server.js`, implement a centralized error handling middleware that captures any request/route errors.
  - [ ] 5.2 [WIN] Ensure identical JSON responses for errors: `{ "success": false, "data": null, "error": "error message" }`.
  - [ ] 5.3 [WIN] Catch all unhandled promise rejections system-wide and map them to the unified logger instead of a silent failure.
  - [ ] 5.4 [WIN] Implement Graceful Shutdown in `server.js`: listen for `SIGINT` and `SIGTERM`, stop accepting new HTTP connections, and cleanly close the MongoDB connection before exiting.
  - [ ] 5.5 [RPI] Deploy and execute negative tests inside Docker (induce an error and observe middleware correctly catching it and gracefully shutting down on SIGINT).
