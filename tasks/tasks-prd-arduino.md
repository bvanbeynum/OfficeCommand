## Relevant Files

- `arduino/office-command/office-command.ino` - Main Arduino sketch file containing the program logic, sensor readings, and serial output.
- `arduino/docs/wiring-instructions.md` - Documentation and instructions for wiring the sensors to the Arduino board.

### Notes

- Use the standard `DHT.h` library by Adafruit for the DHT22 temperature and humidity sensor.
- Ensure the code does not use blocking `delay()` calls excessively, except for the allowed steady 2-second sampling rate delay at the end of the main `loop()`.

## Tasks

- [x] 1.0 Project Setup & Structure
  - [x] [WIN] 1.1 Create the primary Arduino directory structure (`arduino/office-command`) within the project's central Git repository.
  - [x] [WIN] 1.2 Create the main `office-command.ino` file inside the directory.
  - [x] [WIN] 1.3 Add `#include <DHT.h>` to the top of the sketch.
  - [x] [WIN] 1.4 Define constant variables for all sensor pins (DHT_PIN = 2, LIGHT_PIN = A0, REED_PIN = 3).
  - [x] [RPI] 1.5 Move changed files to the dev server and commit via Git.
- [x] 2.0 Create Hardware Wiring Diagram / Instruction Sheet
  - [x] [WIN] 2.1 Create a `arduino/docs/wiring-instructions.md` file.
  - [x] [WIN] 2.2 Document DHT22 connection (5V, GND, Data on D2 with 10k pull-up resistor).
  - [x] [WIN] 2.3 Document Photoresistor connection (5V, A0 with 10k pull-down resistor to GND forming a voltage divider).
  - [x] [WIN] 2.4 Document Reed switch connection (D3, GND) noting that no external pull-up is needed as the internal one will be used.
  - [x] [RPI] 2.5 Move changed files to the dev server and commit via Git.
- [x] 3.0 Sensor Implementation (DHT22, Photoresistor, Reed Switch)
  - [x] [WIN] 3.1 Initialize the DHT sensor object globally.
  - [x] [WIN] 3.2 Initialize the DHT sensor within the `setup()` function (`dht.begin()`).
  - [x] [WIN] 3.3 Initialize the Reed switch pin (Pin 3) with `pinMode(REED_PIN, INPUT_PULLUP)` in `setup()`.
  - [x] [WIN] 3.4 In `loop()`, implement logic to read temperature and humidity as floats from the DHT22.
  - [x] [WIN] 3.5 In `loop()`, implement logic to read the analog value (0-1023) from the photoresistor.
  - [x] [WIN] 3.6 In `loop()`, implement logic to read the digital state of the Reed switch (HIGH = open circuit/door open, LOW = closed circuit/door closed).
  - [x] [RPI] 3.7 Move changed files to the dev server and commit via Git.
- [x] 4.0 Data Formatting & Construction (JSON)
  - [x] [WIN] 4.1 Construct a single string containing the JSON structure.
  - [x] [WIN] 4.2 Append the temperature (`F`) and humidity (`%`) measurements into their respective `temperature` and `humidity` JSON fields.
  - [x] [WIN] 4.3 Append the light level string into the `light` JSON field.
  - [x] [WIN] 4.4 Append `true` or `false` into the `door_open` JSON field depending on the evaluated Reed switch state.
  - [x] [RPI] 4.5 Move changed files to the dev server and commit via Git.
- [x] 5.0 Serial Transmission & Execution Control
  - [x] [WIN] 5.1 Initialize Serial communication with `Serial.begin(9600)` in `setup()`.
  - [x] [WIN] 5.2 Include `<avr/wdt.h>` at the top of the file and enable the watchdog timer in `setup()` using `wdt_enable(WDTO_4S)` (or higher) to prevent hangs.
  - [x] [WIN] 5.3 Call `wdt_reset()` at the start of the `loop()` to continuously reset the timer and keep the board from restarting during normal operation.
  - [x] [WIN] 5.4 Print the final concatenated JSON string to the Serial port followed by a newline (`Serial.println()`).
  - [x] [WIN] 5.5 Add a `delay(2000)` at the bottom of the `loop()` function to maintain a 2-second rate limit.
  - [x] [RPI] 5.6 Move changed files to the dev server and commit via Git.
- [x] 6.0 Finalization
  - [x] [WIN] 6.1 Notify the user that the Arduino codebase is final and ready to be manually deployed to the Arduino hardware.
