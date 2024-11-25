#include <Arduino.h>

#define NTC 35
#define WTL 34

int water_level = 0;

void setup() {
  Serial.begin(115200);
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

  delay(1000);
}
