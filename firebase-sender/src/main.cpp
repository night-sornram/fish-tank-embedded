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
#define TX_PIN 17
#define RX_PIN 16

EspSoftwareSerial::UART myPort;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;
float waterLevel = 0;
float waterTemp = 0;

void setup()
{
  Serial.begin(115200);
  Serial1.begin(115200, SERIAL_8N1, RX_PIN, TX_PIN);
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
  if (Serial1.available())
  {
    String received = "";
    received = Serial1.readStringUntil('\n');
    Serial.println(received);
    int tempStart = received.indexOf("Temperature: ") + 13;
    int tempEnd = received.indexOf(" ℃");
    int levelStart = received.indexOf("Water Level: ") + 13;
    int levelEnd = received.indexOf(" mm");

    waterTemp = received.substring(tempStart, tempEnd).toFloat();
    waterLevel = received.substring(levelStart, levelEnd).toFloat();

    if (Firebase.ready() && signupOK)
    {
      if (Firebase.RTDB.setFloat(&fbdo, "waterLevel/float", waterLevel))
      {
        Serial.println("Water Level PASSED");
      }
      else
      {
        Serial.println("Water Level FAILED");
      }

      if (Firebase.RTDB.setFloat(&fbdo, "waterTemperature/float", waterTemp))
      {
        Serial.println("Temperature PASSED");
      }
      else
      {
        Serial.println("Temperature FAILED");
      }
    }
  }
  if(Firebase.ready() && signupOK)
  {
    if (Firebase.RTDB.getBool(&fbdo, "servo/bool"))
    {
      if(fbdo.boolData())
      {
        Serial1.println("ON");
        Firebase.RTDB.setBool(&fbdo, "servo/bool", false);
      }
    }
    else
    {
      Serial.println("Failed to get Servo status");
    }

  }
}