#include <Arduino.h>
#include <SoftwareSerial.h>
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "REPLACE_WITH_YOUR_SSID"
#define WIFI_PASSWORD "REPLACE_WITH_YOUR_PASSWORD"

#define API_KEY "REPLACE_WITH_YOUR_FIREBASE_PROJECT_API_KEY"
#define DATABASE_URL "REPLACE_WITH_YOUR_FIREBASE_DATABASE_URL"
#define TX_PIN 23
#define RX_PIN 22

EspSoftwareSerial::UART myPortTX;
EspSoftwareSerial::UART myPortRX;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;
float waterLevel = 0;
float waterTemp = 0;
boolean servoStatus = false;
String received = "";


void setup()
{
  Serial.begin(115200);
  myPortTX.begin(38400, SWSERIAL_8N1, -1, TX_PIN,false);
  myPortRX.begin(38400, SWSERIAL_8N1, RX_PIN, -1,false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("ok");
    signupOK = true;
  }
  else
  {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop()
{
  if (myPortRX.available() > 0)
  {
    received = myPortRX.readString();
    int commaIndex = received.indexOf(',');
    waterTemp = received.substring(0, commaIndex).toFloat();
    waterLevel = received.substring(commaIndex + 1).toFloat();

    if (Firebase.ready() && signupOK)
    {
      if (Firebase.RTDB.setFloat(&fbdo, "embedded/waterLevel/float", waterLevel))
      {
        Serial.println("Water Level PASSED");
      }
      else
      {
        Serial.println("Water Level FAILED");
      }

      if (Firebase.RTDB.setFloat(&fbdo, "embedded/waterTemperature/float", waterTemp))
      {
        Serial.println("Temperature PASSED");
      }
      else
      {
        Serial.println("Temperature FAILED");
      }
    }
  }
  if (Firebase.ready() && signupOK)
  {
    if (Firebase.RTDB.getBool(&fbdo, "embedded/servo/bool"))
    {
      if (fbdo.boolData() == true)
      {
        Serial.println("Servo ON");
        myPortTX.println("ON");
        Firebase.RTDB.setBool(&fbdo, "embedded/servo/bool", false);
        Firebase.RTDB.setTimestamp(&fbdo, "embedded/servo/timestamp");
      }
    }
    else
    {
      Serial.println("Failed to get Servo status");
    }
  }
  delay(1000);
}