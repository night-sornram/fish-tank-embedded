#include <Arduino.h>
#include <SoftwareSerial.h>
#include <ESP32Servo.h>
#include <string>

EspSoftwareSerial::UART myPort;

#define TX_PIN 23
#define RX_PIN 22
#define servoPin 13
#define NTC 35
#define WTL 34

Servo servo1;
int water_level = 0;
float tempC = 0;

String data = "";
std::string servoStatus = "";

void setup()
{
  Serial.begin(115200);
  myPort.begin(38400, SWSERIAL_8N1, RX_PIN, TX_PIN, false);
  servo1.attach(servoPin);
}

void loop()
{
  water_level = map(analogRead(WTL), 0, 3000, 0, 40) + 40; 
  tempC = (1 / (log(1 / (4096.0 / analogRead(NTC) - 1)) / 4096 + 1.0 / 298.15) - 273.15) - 5;
  data = String(tempC) + "," + String(water_level);
  myPort.println(data);
  if (myPort.available() > 0)
  {
    servoStatus = myPort.readString().c_str();
    if (servoStatus.find("ON") != std::string::npos)
    {
      servo1.write(90);
      delay(1000);
      servo1.write(0);
    }
  }
  delay(2000);
}
