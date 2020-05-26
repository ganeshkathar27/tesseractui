# Tesseract UI
* This is the UI part for Tesseract. Details of tesseract are stated below.

## Tech stack
* Angular 7
* Docker (For deployment)
* Docker-Compose (For deployment)

## Setup
* Go to /angular-app/Tesseract
* Copy firebase-api-key.ts to Tesseract/src/environments/firebase-api-key.ts
* Run: npm install 
* Run: ng serve --host 0.0.0.0 --proxy-config proxy.config.json

### Note
* If you want to point to a server deployed locally, use command: ng serve --host 0.0.0.0 --proxy-config local-proxy.config.json

## Container Details
* Angular App
  * Angular app running with ng serve and a proxy config
  * Port 80

## Development
* Angular App
  * Changes will be reflected immediatedly

# About Tesseract
A Data Analytics Tool with felxible archiecture to visualize and analyze data

## Features
* Descriptive Analytics
  * Widgets supported
     * Bar
     * Pie
     * Line
     * Data Value
     * Dial
     * Images
  * Global and specific slices supported
* Various Time Series analysis supported
  * STL Decomposition
  * Arima Forecasting
  * Forecasting using XGBoost
  * Auto Forecasting
  * Trend Forecasting
  * Sub seasonal plot
* Support for streams using following sources
  * CSV Stream
  * Pubnub Stream
  * Android Sensor Stream
* Rich Data Sources support
  * CSV
  * Yahoo Finance
  * CSV with multiple time series