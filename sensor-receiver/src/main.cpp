#include <Arduino.h>
#include <SoftwareSerial.h>

EspSoftwareSerial::UART myPort;

#define TX_PIN 17 
#define RX_PIN 16 

#define NTC 35
#define WTL 34

int water_level = 0;
String data = "";

void setup() {
  Serial.begin(115200);
  Serial1.begin(115200, SERIAL_8N1, RX_PIN, TX_PIN);
}

void loop() {
  water_level = analogRead(WTL);
  float tempC = 1 / (log(1 / (4096.0 / analogRead(NTC) - 1)) / 3950 + 1.0 / 298.15) - 273.15;

  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.println(" ℃");

  Serial.print("Water Level: ");
  Serial.print(water_level);
  Serial.println(" mm");
  data = "Temperature: " + String(tempC) + " ℃, Water Level: " + String(water_level) + " mm";
  Serial1.print(data);
  delay(1000);
}
