# Office Command - Project Overview

## Introduction
The **Office Command** project is a local web-based dashboard and sensor network designed to monitor environmental conditions in an office space. The system captures temperature, humidity, ambient light, and door status.

## Architecture
The system is divided into four distinct components to ensure reliability and modularity:
1.  **Arduino (Hardware Layer):** Interfaces directly with physical sensors and streams data via a USB serial connection.
2.  **Raspberry Pi (Ingestion Layer):** Reads the serial data from the Arduino and forwards it to the backend REST API over the local network using a Python job.
3.  **REST API & Database (Data Layer):** A Node.js/Express server that ingests sensor data, stores it in a MongoDB database, and serves it back to the frontend.
4.  **Web Dashboard (Presentation Layer):** A modern, dark-themed React web application that visualizes the current readouts and historical data.

## Overall Goals
*   **Data Collection & Storage:** Securely collect and store environmental data from the office.
*   **Data Visualization:** Visualize the current and historical sensor data accurately on a visually striking web dashboard.
*   **Reliability:** Provide a reliable, low-maintenance hardware/software pipeline from Arduino -> Pi 3 -> Node.js API -> MongoDB.

## Success Metrics
*   The entire system runs uninterrupted for 7 consecutive days, successfully capturing and logging data.
*   The web dashboard loads and displays the most recent data within 2 seconds of loading.
*   The simple password authentication successfully obstructs unauthorized direct URL access.

## Component PRDs
Please refer to the detailed Product Requirements Documents (PRDs) for each subsystem:
*   [Arduino PRD](./prd-arduino.md)
*   [Raspberry Pi Interface PRD](./prd-raspberry-pi.md)
*   [REST API PRD](./prd-rest-api.md)
*   [Web Dashboard PRD](./prd-web-dashboard.md)
