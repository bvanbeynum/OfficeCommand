#include <DHT.h>

// Sensor Pin Definitions (Matching office-command.ino)
const int DHT_PIN = 2;
const int LIGHT_PIN = A0;
const int REED_PIN = 3;

#define DHTTYPE DHT22
DHT dht(DHT_PIN, DHTTYPE);

void setup() {
  // Initialize Serial port for humans to read
  Serial.begin(9600);
  Serial.println("--- Office Command Sensor Diagnostics ---");
  Serial.println("Initializing sensors...");
  
  dht.begin();
  pinMode(REED_PIN, INPUT_PULLUP);
}

void loop() {
  Serial.println("\n-----------------------------------------");

  // 1. Read DHT22
  float h = dht.readHumidity();
  float t = dht.readTemperature(true); // true = Fahrenheit

  // Check if any reads failed to let the user know of wiring issues
  if (isnan(h) || isnan(t)) {
    Serial.println("DHT22 [ERROR]: Failed to read from sensor!");
  } else {
    Serial.print("DHT22 [OK]: Temperature = ");
    Serial.print(t);
    Serial.print(" F | Humidity = ");
    Serial.print(h);
    Serial.println(" %");
  }

  // 2. Read Photoresistor
  int lightLevel = analogRead(LIGHT_PIN);
  Serial.print("Photoresistor [OK]: Raw Analog Value (0-1023) = ");
  Serial.println(lightLevel);
  if (lightLevel <= 10) {
     Serial.println("  -> (Note: Extremely dark, ensure light isn't completely blocked or circuit broken)");
  }

  // 3. Read Reed Switch
  int doorState = digitalRead(REED_PIN);
  Serial.print("Reed Switch [OK]: State = ");
  if (doorState == HIGH) {
    Serial.println("HIGH (Circuit Open / Door Open)");
  } else {
    Serial.println("LOW (Circuit Closed / Door Closed)");
  }

  // Wait 2.5 seconds before next read (DHT sensors require ~2 seconds between readings)
  delay(2500);
}
