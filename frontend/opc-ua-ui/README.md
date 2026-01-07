# OPC UA UI — Data Flow Overview

This frontend demonstrates how data flows from the backend to the frontend UI. It is a minimal Vite + React app that fetches OPC UA data (or sample data served by the backend) and renders it in the browser.

## Data flow (backend → frontend)

- **Backend:** exposes an HTTP API endpoint that returns OPC UA data (JSON). Example: the backend serves data at a URL such as `http://localhost:3000/data` (see `backend/app.js`).
- **Frontend:** located in this folder (`src/`) fetches that endpoint and renders the received data in the UI.
- The frontend does not connect directly to OPC UA; it relies on the backend as a proxy/adapter that reads OPC UA and exposes a web-friendly API.

## Enable live data

To use live OPC UA data instead of static/sample data, update the backend to point at the live OPC UA source:

- Edit `backend/app.js` to replace the placeholder/sample URL with the live OPC UA or proxy endpoint, or make the backend read from the live OPC UA server directly.
- Prefer using an environment variable for the OPC UA endpoint (e.g. `OPCUA_ENDPOINT`) so you can switch between local/test/live without changing code.
- After changing the backend URL or configuration, restart the backend server so the changes take effect.

## Run locally

Requirements: Node.js (LTS)

1. Start the backend

```bash
cd backend
npm install
node app.js
```

2. Start the frontend

```bash
cd frontend/opc-ua-ui
npm install
npm run dev
```

3. Open the UI at the Vite dev URL (usually `http://localhost:5173`). The frontend will fetch data from the backend API.

## Notes

- This README shows how data flows from backend to frontend. If you want live data, change the backend URL/config to point at the live data source and restart the backend.
- If you want, I can add a short code example showing where to update the backend URL (tell me if you want that).
