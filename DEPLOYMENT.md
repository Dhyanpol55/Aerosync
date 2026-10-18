# AirSync C2 — Multi-Cloud Deployment Guide
## Deploying Backend to Render / Railway & Frontend to Vercel

This repository supports flexible deployments:
- **Option 1 (Recommended)**: Backend on **Render** (`render.com`), Frontend on **Vercel** (`vercel.com`).
- **Option 2 (All-in-One)**: Full-Stack (Frontend + Backend on single URL) on **Render**.
- **Option 3**: Backend on **Railway** (`railway.app`), Frontend on **Vercel**.

---

## 🔍 How to Check If Your Backend Is Running

You can verify your backend status using any of the following 4 methods:

### 1. In Your Browser
Open these URLs in your web browser:
- **Healthcheck Endpoint**:  
  `https://your-service.onrender.com/health` (or `http://localhost:3000/health`)  
  **Expected Output**:
  ```json
  {
    "status": "ok",
    "service": "AirSync C2 Backend Engine",
    "uptimeSeconds": 142,
    "timestamp": "2026-10-18T09:47:18.000Z"
  }
  ```
- **Telemetry Dashboard Endpoint**:  
  `https://your-service.onrender.com/api/dashboard`  
  **Expected Output**:
  ```json
  {
    "operationalState": {
      "aircraftAvailability": { "available": 18, "total": 24, "percentage": 75 },
      "crewReadiness": { "ready": 104, "total": 120, "percentage": 87 },
      "overallStatus": "OPERATIONAL"
    },
    "systemStatus": "OPERATIONAL"
  }
  ```
- **API Catalog**:  
  Visiting the root `https://your-service.onrender.com/` returns a JSON directory of all 13 active endpoints.

---

### 2. Using Terminal / cURL
Run this in your command line:
```bash
# Check HTTP status and JSON response
curl -i https://your-service.onrender.com/health
```
Look for:
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

---

### 3. In the Render / Railway Dashboard
- **Render Status Indicator**: Look for the green **"Live"** badge in your Render Web Service dashboard.
- **Render Logs**: Click on the **"Logs"** tab. You should see:
  ```
  AirSync C2 server running at http://0.0.0.0:10000
  GET /health 200 - 1.42ms
  ```
- **Healthcheck Status**: Render will periodically ping `/health` to ensure the instance is active.

---

### 4. Note on Render Free Tier "Cold Starts"
Render's free tier spins down idle instances after 15 minutes of inactivity:
- When a new request arrives, Render takes **30–50 seconds** to boot up.
- Render shows "Spinning up..." during this period.
- Once it responds to `/health`, the service is fully operational.

---

## 🚀 Part 1: Deploying to Render (`render.com`)

### Method A: One-Click Blueprint (Recommended)
This repo contains a pre-configured `render.yaml` file:
1. Go to [dashboard.render.com](https://dashboard.render.com/) and sign in.
2. Click **"New +"** ➜ **"Blueprint"**.
3. Connect your GitHub repository.
4. Render will read `render.yaml` and configure:
   - **Service Name**: `airsync-c2-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/health`
5. Click **"Apply"** to deploy.

---

### Method B: Manual Web Service Setup on Render
1. In Render Dashboard, click **"New +"** ➜ **"Web Service"**.
2. Select your repository.
3. Configure these exact settings:
   - **Name**: `airsync-c2-backend` (or any name)
   - **Region**: Oregon (or nearest)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
4. Expand **Advanced**:
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: `Yes`
5. Click **"Create Web Service"**.
6. When deployment finishes, copy your Render URL:
   ```
   https://airsync-c2-backend.onrender.com
   ```

---

## ⚡ Part 2: Deploy Frontend to Vercel (`vercel.com`)

1. Go to [vercel.com](https://vercel.com/) and sign in.
2. Click **"Add New..."** ➜ **"Project"** and import your repository.
3. Vercel will auto-detect `vercel.json` and Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (e.g. `https://airsync-c2-backend.onrender.com`)
5. Click **"Deploy"**.

---

## 🚂 Part 3: Deploy Backend to Railway (`railway.app`)

1. Go to [railway.app](https://railway.app/) and sign in.
2. Click **"+ New Project"** ➜ **"Deploy from GitHub repo"**.
3. Railway automatically detects `railway.json`:
   - **Start Command**: `npm run start`
   - **Healthcheck Path**: `/health`
4. In Railway **Settings** ➜ **Public Networking**, click **"Generate Domain"**.
5. Put that URL into Vercel's `VITE_API_URL`.

---

## 📋 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server uptime & healthcheck |
| `GET` | `/api/dashboard` | Unified operational picture & telemetry counts |
| `GET` | `/api/data-sources` | Status of all 7 data fusion feeds |
| `GET` | `/api/aircraft` | Fleet availability ratio |
| `GET` | `/api/crew` | Crew readiness percentages |
| `GET` | `/api/resources` | Fuel and munitions capacity buffer |
| `GET` | `/api/airspace` | Airspace and corridor transit status |
| `GET` | `/api/weather` | Convective storm & meteorological status |
| `GET` | `/api/alerts` | Tactical warnings and system alerts |
| `GET` | `/api/history` | Audit trail and decision log |
| `GET` | `/api/system-status`| C2 system service status (DB, API, WS) |
| `POST`| `/api/analyse` | Trigger AI readiness & delay risk analysis |
| `POST`| `/api/reoptimise`| Execute constraint-based re-planning |
| `POST`| `/api/approve-demo`| Record human-in-the-loop decision review |
