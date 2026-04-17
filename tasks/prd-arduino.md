# Office Command - Arduino PRD

## Introduction / Overview
This document outlines the requirements for the Arduino component of the Office Command project. The Arduino acts as the primary hardware interface, directly reading analog and digital signals from connected sensors and formatting them for the ingestion layer.

## Goals
*   Accurately measure temperature, humidity, ambient light, and door open/closed status.
*   Provide a continuous, reliable data stream over a USB serial connection.
*   Maintain a simple, non-blocking execution loop.

## Development & Deployment Environment
*   **Version Control:** All source code and documentation must be stored within the central Git repository on the development server.
*   **Target Deployment:** The physical Arduino and its companion Raspberry Pi are a separate standalone setup. The user will manually deploy the sketch files from the repository to this separate hardware environment.

## Hardware Wiring Instructions
The Arduino will be responsible for interfacing directly with the sensors. The exact pinning is as follows:
*   **DHT22 (Temperature & Humidity):**
    *   VCC: Arduino 5V
    *   GND: Arduino GND
    *   DATA: **Digital Pin 2** (Use a 10k pull-up resistor between VCC and DATA)
*   **Photoresistor (Light Level):**
    *   Leg 1: Arduino 5V
    *   Leg 2: **Analog Pin A0**. Also connect this leg to GND through a 10k pull-down resistor to create a voltage divider.
*   **Reed Switch (Door Status):**
    *   Side 1: **Digital Pin 3**
    *   Side 2: Arduino GND
    *   *Note:* Initialize Digital Pin 3 with `INPUT_PULLUP` setting in Arduino code.

## Serial Transmission Specifications
The Arduino must output data to the serial port (baud rate: 9600) formatted as a single-line JSON string. It should output this string periodically (e.g., every 2 seconds).

**JSON Format Expected:**
```json
{
  "temperature": 72.5,
  "humidity": 45.0,
  "light": 180,
  "door_open": false
}
```
*   `temperature`: Float (Fahrenheit)
*   `humidity`: Float (Percentage)
*   `light`: Integer (Raw analog read 0-1023)
*   `door_open`: Boolean (`true` if switch circuit is broken/door open, `false` if closed)

## Functional Requirements
1.  **Sensor Reading:** The script must read from the DHT22, Photoresistor, and Reed Switch on every loop cycle.
2.  **Debouncing:** Implement simple debouncing or state-change detection for the Reed switch if necessary to prevent flickering readings.
3.  **JSON Formatting:** The script must construct a valid JSON string containing the current readings.
4.  **Serial Write:** Write the JSON string to the Serial output followed by a newline `\n`.
5.  **Watchdog Timer:** Implement a mechanism to automatically restart the system and recover if the execution loop ever hangs or freezes, ensuring continuous execution.

## Technical Considerations
*   Use standard Arduino libraries like `DHT.h` for the DHT22 sensor.
*   Consider using the AVR libc `<avr/wdt.h>` library for a hardware watchdog to reset the board if the loop gets stuck.
*   Ensure the code does not use blocking `delay()` calls excessively, though a small `delay(2000)` at the end of the `loop()` is acceptable for a steady 2-second sampling rate.
