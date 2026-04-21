# Office Command - REST API & Database PRD

## Introduction / Overview
This document covers the unified Data and Presentation Server. A single monolithic Node.js/Express instance (`server.js`) is identically responsible for ingesting data from the Raspberry Pi, saving to MongoDB, and natively serving the compiled React web dashboard alongside the API endpoints.

**Development Environment:** 
The application is developed on the dev server in the `/home/bvanbeynum/dev/officecommand` directory. The frontend and backend share the same Node.js instance, and the core server logic resides in the `server.js` file at the root of the project.

## Goals
*   Provide robust and fast API routes for both ingestion (POST) and querying (GET).
*   Enforce a strict and predictable MongoDB schema for sensor logs.
*   Expose a consistent JSON response format for all API interactions.

## MongoDB Structure Specifications
The database will utilize a primary collection, `SensorLog`.

**Schema / Document Structure:**
```json
{
  "_id": "ObjectId",
  "timestamp": "ISODate",
  "temperature": "Number (Float)",
  "humidity": "Number (Float)",
  "light": "Number (Int)",
  "door_open": "Boolean"
}
```
*   **Data Retention:** Implement pruning for `SensorLog` and `ErrorLog` documents so that any messages or data points older than 24 hours are automatically removed (e.g., using a MongoDB TTL Index).
*   **Additional Collections:** `Settings` (to store user configurations like light threshold), `ErrorLog` (to log formatted errors from both the Raspberry Pi and the frontend), and `HeartbeatLog` (to record only the single most recent active status ping from the ingestion script; it does not keep a history).

## REST API Endpoint Specifications

### Ingestion Data (From Raspberry Pi & Frontend)
*   **Route:** `POST /api/sensors`
*   **Payload:** `{ "temperature": Number, "humidity": Number, "light": Number, "door_open": Boolean }`
*   **Behavior:** Validates payload, injects current server timestamp, saves to MongoDB `SensorLog` collection. The API or database must prune records older than 24 hours.
*   **Route:** `POST /api/errors`
*   **Payload:** `{ "source": String, "message": String, "details": String }`
*   **Behavior:** Receives error logs from either the Pi or Frontend, attaches a timestamp, and saves to the `ErrorLog` collection.
*   **Route:** `POST /api/heartbeat`
*   **Behavior:** Accepts a heartbeat ping from the Raspberry Pi and updates the single document in `HeartbeatLog` (overwriting the previous ping) to monitor ingestion layer uptime without building a history.

### Web Dashboard Data (To Frontend)
*   **Route:** `GET /api/sensors/current`
*   **Behavior:** Queries MongoDB for the single most recent document in `SensorLog` and returns it.
*   **Route:** `GET /api/sensors/history?timeframe=X`
*   **Query Params:** `timeframe` (e.g., `1h`, `5h`, `24h`)
*   **Behavior:** Returns an array of aggregated data points spanning the requested time window for charting.
*   **Route:** `POST /api/settings`
*   **Behavior:** Allows the dashboard to save or update preferences, such as the light threshold.
*   **Route:** `GET /api/errors`
*   **Behavior:** Fetches recent error logs from the database so they can be viewed directly on the dashboard.

## Details to Create the REST API
1.  **Architecture:** Use Node.js with the Express.js framework. Use `mongoose` or the native `mongodb` driver for DB interaction.
2.  **Standard Responses:** *All* API endpoints must return a consistent JSON structure formatted exactly as:
    `{ "success": true|false, "data": <payload object or array>, "error": "message string or null" }`
3.  **Unified Static Hosting:** The `server.js` Express application must serve the static frontend files (e.g., using `express.static(...)` pointing to the frontend's build directory) so that a single Node instance orchestrates the entire web layer perfectly.
4.  **Error Handling:** Implement centralized error handling middleware. Catch unhandled promise rejections. Do not allow silent failures.
5.  **Graceful Shutdown:** The Node app must listen for `SIGINT` and `SIGTERM` OS signals. Upon receiving, it must immediately stop accepting new HTTP requests and cleanly close the MongoDB connection before exiting.
6.  **Configuration:** Use a `config.js` (JSON format) loaded at application start for DB URI and Port definitions.
