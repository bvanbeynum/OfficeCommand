#include <DHT.h>

const int DHT_PIN = 2;
const int LIGHT_PIN = A0;
const int REED_PIN = 3;

#define DHTTYPE DHT22
DHT dht(DHT_PIN, DHTTYPE);

void setup() {
  dht.begin();
  pinMode(REED_PIN, INPUT_PULLUP);
}

void loop() {
  float temperature = dht.readTemperature(true);
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LIGHT_PIN);
  int doorState = digitalRead(REED_PIN);
}
