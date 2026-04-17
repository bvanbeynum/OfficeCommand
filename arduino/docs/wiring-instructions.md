# Office Command - Arduino Wiring Instructions

## DHT22 Temperature & Humidity Sensor
- **VCC:** 5V
- **GND:** GND
- **Data (OUT):** Digital Pin 2 (D2)
- **Note:** Connect a 10k pull-up resistor between the Data pin and 5V.

## Photoresistor (Light Level)
- **Power:** Connect one leg to 5V.
- **Data (OUT):** Connect the other leg to Analog Pin 0 (A0).
- **Note:** Connect a 10k pull-down resistor between the A0 leg and GND (forming a voltage divider).

## Reed Switch (Door Sensor)
- **Pin 1:** Digital Pin 3 (D3)
- **Pin 2:** GND
- **Note:** No external resistor is required. The Arduino's internal pull-up resistor (`INPUT_PULLUP`) will be used.
