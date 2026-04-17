#!/usr/bin/env python3
import os
import sys
import json
import requests

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
