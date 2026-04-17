# Office Command - Raspberry Pi Interface PRD

## Introduction / Overview
This document covers the Raspberry Pi ingestion layer. The Pi operates as a bridge: it runs a Python job continuously in the background to read serial data from the attached Arduino and forwards that data to the networked REST API.

## Environments & Deployment
*   **Authoring `[WIN]`:** Code is authored locally on a Windows machine.
*   **Version Control & Storage `[DEV_SERVER]`:** All codebase files must be stored on the central DEV server (a separate Raspberry Pi hosting Git and the core web/API application).
*   **Execution `[INGEST_PI]`:** The Python ingestion job must be deployed and executed on the Ingestion Pi, which is explicitly a *different* Raspberry Pi that is physically connected to the Arduino.

## Goals
*   Reliably capture the streaming telemetry from the Arduino over serial.
*   Act as a resilient client, pushing data to the API without failing permanently if the network drops.
*   Run autonomously as a background service on the Pi.

## Serial Ingestion Specifications
*   The Python script will connect to the Arduino via the USB serial interface (e.g., `/dev/ttyUSB0` or `/dev/ttyACM0`).
*   Baud rate must match the Arduino (9600).
*   The script will read newline-terminated strings.
*   **Expected Input Payload:** Valid JSON strings (e.g., `{"temperature": 72.5, "humidity": 45.0, "light": 180, "door_open": false}`).

## REST API Transmission Specifications
*   **Sensor Data Endpoint:** The script will send an `HTTP POST` request to the backend API endpoint (e.g., `http://<API_IP>:PORT/api/sensors`) with the parsed JSON from the Arduino. A 10-second interval is recommended.
*   **Heartbeat Endpoint:** The script must periodically (e.g., every 60 seconds) send an `HTTP POST` request to `http://<API_IP>:PORT/api/heartbeat` to inform the DB that the ingestion layer is active.
*   **Error Logging Endpoint:** If the Pi cannot read from the Arduino (e.g., disconnected, crashed), it must send an `HTTP POST` request to `http://<API_IP>:PORT/api/errors` detailing the failure.

## Detailed Creation Requirements for Python Script
1.  **Fail Fast & Error Handling:** The script should validate the existence of the serial port on startup. It must wrap serial reading and HTTP requests in robust `try...except` blocks. If reading from the Arduino fails, it must capture the error and log it to the backend via the `/api/errors` endpoint. It should not send another error message until after successful reconnection to the Arduino. Do not use empty exceptions.
2.  **JSON Validation:** The script must verify the string read from serial is valid JSON before attempting to forward it. Invalid or garbled lines (common during serial startup) should be ignored and logged to the backend via the `/api/errors` endpoint.
3.  **Logging & Heartbeat:** As this is an unmonitored device, no logs should be written locally (no stdout or local file logging). All errors and essential logs must be sent to the MongoDB backend via the `/api/errors` endpoint. Ensure the script runs a periodic heartbeat check to hit the `/api/heartbeat` endpoint.
4.  **Graceful Exit:** Handle `SIGINT` and `SIGTERM` signals to close the serial port cleanly before exiting.
5.  **Configuration:** All configurations (API URL, Serial Port Name, Baud Rate) must be loaded from a `config.js` file (in JSON format) at initiation.
6.  **Executable:** The script must be designed to run continuously (e.g., via a systemd service or Docker container). If an unrecoverable state occurs, exit with a non-zero status code so the supervisor restarts it.
