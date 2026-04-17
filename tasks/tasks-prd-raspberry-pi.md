## Relevant Files
- `pi/main.py` - The main Python script that acts as the background ingestion service for reading serial data and forwarding it to the API.
- `pi/config.js` - JSON-structured configuration file that holds parameters like the global API URL, Serial Port Name, and Baud Rate.
- `pi/requirements.txt` - Python dependencies (e.g., `pyserial`, `requests`).

## Tasks

- [ ] 1.0 Setup Python Project and Configuration Loader
  - [ ] 1.1 `[WIN]` Create the `pi` directory and a `requirements.txt` containing dependencies like `pyserial` and `requests`.
  - [ ] 1.2 `[WIN]` Create `pi/config.js` (in JSON format) containing keys for `api_url`, `serial_port`, and `baud_rate`. Ensure it's in `.gitignore`.
  - [ ] 1.3 `[WIN]` Create `pi/main.py` and write the top-level configuration loader to ingest `config.js` at script initiation (fail fast if config cannot be read).
  - [ ] 1.4 `[DEV_SERVER]` Move code to DEV_SERVER and commit to Git.
- [ ] 2.0 Create REST API Integration Utilities & Structures
  - [ ] 2.1 `[WIN]` Implement `log_remote_error(error_details)` function to send errors back to `/api/errors`. This is a valid use of a function to avoid code duplication. Ensure there is **no stdout/file logging**.
  - [ ] 2.2 `[WIN]` Add duplicate-error suppression logic (state management) within the error handling flow so the API is not flooded with identical errors.
  - [ ] 2.3 `[DEV_SERVER]` Move code to DEV_SERVER and commit to Git.
- [ ] 3.0 Develop the Main Event Loop & Inline Logic (Fail Fast, Serial, API)
  - [ ] 3.1 `[WIN]` Implement a continuous `while True` main event loop. All business logic must be inline here unless required for deduplication.
  - [ ] 3.2 `[WIN]` Inline logic: Attempt a robust serial connection. Wrap in `try...except` and call `log_remote_error()` on failure.
  - [ ] 3.3 `[WIN]` Inline logic: Read newline-terminated strings from the active serial interface (handling timeouts so loop avoids infinite blocking).
  - [ ] 3.4 `[WIN]` Inline logic: Validate the serial string as JSON. If invalid, ignore and `log_remote_error()`.
  - [ ] 3.5 `[WIN]` Inline logic: POST valid JSON payloads to `/api/sensors`, ensuring the 10-second interval is managed using non-blocking time checks.
  - [ ] 3.6 `[WIN]` Inline logic: POST to `/api/heartbeat` every 60 seconds (also managed via non-blocking time checks).
  - [ ] 3.7 `[DEV_SERVER]` Move code to DEV_SERVER and commit to Git.
- [ ] 4.0 Develop Graceful Shutdown and Containerization
  - [ ] 4.1 `[WIN]` Add signal handlers for `SIGINT` and `SIGTERM` to safely close the serial connection and exit cleanly.
  - [ ] 4.2 `[WIN]` Ensure any unrecoverable states trigger `sys.exit(1)` (non-zero) so the Docker container or service supervisor restarts the script.
  - [ ] 4.3 `[WIN]` Create a `pi/Dockerfile` using an `-alpine` variant to build and run the ingestion service container.
  - [ ] 4.4 `[DEV_SERVER]` Move code to DEV_SERVER and commit to Git.
- [ ] 5.0 Final Handover
  - [ ] 5.1 Notify the USER that the code is complete and ready for them to manually install/setup on the target Ingestion Pi.
