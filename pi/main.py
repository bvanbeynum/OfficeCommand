#!/usr/bin/env python3
import os
import sys
import json
import requests
import time
import serial

# ---------------------------------------------------------
# Configuration Loading (Fail Fast)
# ---------------------------------------------------------
CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.js')
if not os.path.exists(CONFIG_PATH):
    sys.exit(f"ERROR: Config file not found at {CONFIG_PATH}")

try:
    with open(CONFIG_PATH, 'r') as f:
        CONFIG = json.load(f)
    for key in ['api_url', 'serial_port', 'baud_rate']:
        if key not in CONFIG:
            sys.exit(f"ERROR: Missing required config key: {key}")
except Exception as e:
    sys.exit(f"ERROR: Config loading failed: {e}")

API_URL = CONFIG['api_url']
SERIAL_PORT = CONFIG['serial_port']
BAUD_RATE = int(CONFIG['baud_rate'])

# ---------------------------------------------------------
# State Management & Remote Error Logging (Tasks 2.1 & 2.2)
# ---------------------------------------------------------
last_logged_error = None

def log_remote_error(error_details, source="ingestion_pi"):
    global last_logged_error
    
    # Duplicate-error suppression logic
    if error_details == last_logged_error:
        return
        
    try:
        payload = {
            "source": source,
            "message": str(error_details),
            "details": str(error_details)
        }
        requests.post(
            f"{API_URL}/api/errors", 
            json=payload, 
            timeout=5
        )
        last_logged_error = error_details
    except Exception:
        # Ignore failures to send the error. Unmonitored device means no local logging.
        pass

# Main business logic follows here...
active_serial_conn = None
last_sensor_post_time = 0
last_heartbeat_time = 0

while True:
    try:
        current_time = time.time()
        
        # Task 3.6: POST to /api/heartbeat every 60 seconds (non-blocking)
        if (current_time - last_heartbeat_time) >= 60:
            try:
                requests.post(
                    f"{API_URL}/api/heartbeat", 
                    timeout=5
                )
                last_heartbeat_time = current_time
            except Exception as e:
                log_remote_error(f"Failed to post heartbeat: {e}")
                
        # Task 3.2: Attempt a robust serial connection
        if active_serial_conn is None:
            active_serial_conn = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
            # Reset error logging state upon successful connection
            last_logged_error = None
            
        # Task 3.3: Read newline-terminated strings
        serial_line = active_serial_conn.readline()
        if not serial_line:
            # Timeout reached with no data
            continue
            
        raw_string = serial_line.decode('utf-8').strip()
        if not raw_string:
            continue
            
        # Task 3.4: Validate the serial string as JSON
        try:
            sensor_data = json.loads(raw_string)
        except json.JSONDecodeError as e:
            log_remote_error(f"Invalid JSON from Arduino: {raw_string} - {e}")
            continue
            
        # Task 3.5: POST valid JSON payloads to /api/sensors (10-second non-blocking interval)
        current_time = time.time()
        if (current_time - last_sensor_post_time) >= 10:
            try:
                requests.post(
                    f"{API_URL}/api/sensors", 
                    json=sensor_data, 
                    timeout=5
                )
                last_sensor_post_time = current_time
            except Exception as e:
                log_remote_error(f"Failed to post sensor data: {e}")
                
    except UnicodeDecodeError as e:
        log_remote_error(f"Serial decode error: {e}")
        continue
    except serial.SerialException as e:
        log_remote_error(f"Serial connection/read failed: {e}")
        if active_serial_conn:
            active_serial_conn.close()
        active_serial_conn = None
        time.sleep(5)
        continue
    except Exception as e:
        log_remote_error(f"Unexpected error in main loop: {e}")
        if active_serial_conn:
            active_serial_conn.close()
        active_serial_conn = None
        time.sleep(5)
        continue

