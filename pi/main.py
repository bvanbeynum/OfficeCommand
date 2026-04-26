#!/usr/bin/env python3
import os
import sys
import json
import requests
import time
import serial
import signal

# ---------------------------------------------------------
# Configuration Loading (Fail Fast)
# ---------------------------------------------------------
configPath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.js')
if not os.path.exists(configPath):
    sys.exit(f"ERROR: Config file not found at {configPath}")

try:
    with open(configPath, 'r') as f:
        configData = json.load(f)
    for expectedKey in ['apiUrl', 'serialPort', 'baudRate']:
        if expectedKey not in configData:
            sys.exit(f"ERROR: Missing required config key: {expectedKey}")
except Exception as e:
    sys.exit(f"ERROR: Config loading failed: {e}")

apiUrl = configData['apiUrl']
serialPort = configData['serialPort']
baudRate = int(configData['baudRate'])

# ---------------------------------------------------------
# State Management & Remote Error Logging (Tasks 2.1 & 2.2)
# ---------------------------------------------------------
lastLoggedError = None

def logRemoteError(errorDetails, source="ingestion_pi"):
    global lastLoggedError
    
    # Duplicate-error suppression logic
    if errorDetails == lastLoggedError:
        return
        
    try:
        payloadObj = {
            "source": source,
            "message": str(errorDetails),
            "details": str(errorDetails)
        }
        requests.post(
            f"{apiUrl}/api/errors", 
            json=payloadObj, 
            timeout=5
        )
        lastLoggedError = errorDetails
    except Exception:
        # Ignore failures to send the error. Unmonitored device means no local logging.
        pass

# Main business logic follows here...
activeSerialConn = None
lastSensorPostTime = 0
lastHeartbeatTime = 0

def gracefulExit(signum, frame):
    logRemoteError(f"Received signal {signum}, shutting down ingestion layer.")
    if activeSerialConn:
        activeSerialConn.close()
    sys.exit(0)

signal.signal(signal.SIGINT, gracefulExit)
signal.signal(signal.SIGTERM, gracefulExit)

while True:
    try:
        currentTime = time.time()
        
        # Task 3.6: POST to /api/heartbeat every 60 seconds (non-blocking)
        if (currentTime - lastHeartbeatTime) >= 60:
            try:
                requests.post(
                    f"{apiUrl}/api/heartbeat", 
                    json={},
                    timeout=5
                )
                lastHeartbeatTime = currentTime
            except Exception as e:
                logRemoteError(f"Failed to post heartbeat: {e}")
                
        # Task 3.2: Attempt a robust serial connection
        if activeSerialConn is None:
            activeSerialConn = serial.Serial(serialPort, baudRate, timeout=2)
            # Reset error logging state upon successful connection
            lastLoggedError = None
            
        # Task 3.3: Read newline-terminated strings
        serialLine = activeSerialConn.readline()
        if not serialLine:
            # Timeout reached with no data
            continue
            
        rawString = serialLine.decode('utf-8').strip()
        if not rawString:
            continue
            
        # Task 3.4: Validate the serial string as JSON
        try:
            sensorData = json.loads(rawString)
        except json.JSONDecodeError as e:
            logRemoteError(f"Invalid JSON from Arduino: {rawString} - {e}")
            continue
            
        # Task 3.5: POST valid JSON payloads to /api/sensors (10-second non-blocking interval)
        if (currentTime - lastSensorPostTime) >= 10:
            try:
                requests.post(
                    f"{apiUrl}/api/sensors", 
                    json=sensorData, 
                    timeout=5
                )
                lastSensorPostTime = currentTime
            except Exception as e:
                logRemoteError(f"Failed to post sensor data: {e}")
                
    except UnicodeDecodeError as e:
        logRemoteError(f"Serial decode error: {e}")
        continue
    except serial.SerialException as e:
        logRemoteError(f"Serial connection/read failed: {e}")
        if activeSerialConn:
            activeSerialConn.close()
        activeSerialConn = None
        time.sleep(5)
        continue
    except Exception as e:
        logRemoteError(f"Unexpected error in main loop: {e}")
        if activeSerialConn:
            activeSerialConn.close()
        activeSerialConn = None
        time.sleep(5)
        continue
        
    # Prevent CPU spiking in edge cases where data streams too rapidly
    time.sleep(0.1)
