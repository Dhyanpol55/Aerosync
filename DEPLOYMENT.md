# AirSync C2 — Dual Deployment Guide
## Deploying Backend to Railway & Frontend to Vercel

This repository is configured for decoupled dual deployment:
- **Backend (Express + C2 REST API & Data Fusion)** ➡️ Deployed on **Railway**
- **Frontend (React 19 + Vite + Tailwind + Leaflet GIS Map)** ➡️ Deployed on **Vercel**

---

## Architecture Summary

```
                       ┌─────────────────────────┐
                       │      User Browser       │
                       └────────────┬────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           │                                                 │
     Static Web App (HTML/JS/CSS)                      REST API & Telemetry
           │                                                 │
           ▼                                                 ▼
┌──────────────────────┐                         ┌───────────────────────┐
│        VERCEL        │                         │        RAILWAY        │
│  (Frontend Hosting)  │                         │   (Backend Engine)    │
│                      │                         │                       │
│  - Vite build (dist) │    VITE_API_URL         │  - Express server.ts  │
│  - vercel.json SPA   │ ──────────────────────> │  - 13 API endpoints   │
│    rewrites          │  (CORS enabled)         │  - Data Fusion Bus    │
│                      │                         │  - /health check      │
└──────────────────────┘                         └───────────────────────┘
```

---

## Part 1: Deploy Backend to Railway

Railway runs Node.js natively with automatic SSL, automatic port binding, and continuous deployment from GitHub.

### Step 1: Push Code to GitHub
Ensure your repository is pushed to GitHub.

### Step 2: Create a New Project on Railway
1. Go to [railway.app](https://railway.app/) and sign in.
2. Click **"+ New Project"** ➜ **"Deploy from GitHub repo"**.
3. Select your repository.

### Step 3: Configure Railway Settings
Railway will automatically detect `railway.json` and `package.json`. Verify the following in the Railway Dashboard:
- **Root Directory**: `/` (Leave as default)
- **Build Command**: (Nixpacks detects Node.js automatically; `npm install` runs automatically)
- **Start Command**: `npm run start` (or `tsx server.ts`)
- **Healthcheck Path**: `/health`

### Step 4: Generate Public Domain
1. In your Railway service dashboard, click **"Settings"**.
2. Scroll to **"Public Networking"** and click **"Generate Domain"**.
3. You will receive a URL such as:
   ```
   https://airsync-backend-production.up.railway.app
   ```
4. **Test your backend**:
   Open that URL in your browser:
   - Root: `https://<your-railway-url>/` ➜ Returns JSON listing all 13 API endpoints
   - Healthcheck: `https://<your-railway-url>/health` ➜ Returns `{"status":"ok", ...}`
   - Dashboard: `https://<your-railway-url>/api/dashboard` ➜ Returns operational state

---

## Part 2: Deploy Frontend to Vercel

Vercel provides edge caching and instant global CDN delivery for Vite React SPAs.

### Step 1: Import Project on Vercel
1. Go to [vercel.com](https://vercel.com/) and sign in.
2. Click **"Add New..."** ➜ **"Project"**.
3. Import the same GitHub repository.

### Step 2: Configure Build Settings
Vercel will detect Vite automatically using `vercel.json`:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables
Under the **Environment Variables** section, add:
- **Key**: `VITE_API_URL`
- **Value**: Your Railway backend domain without trailing slash, e.g.:
  ```
  https://airsync-backend-production.up.railway.app
  ```

### Step 4: Click Deploy
1. Click **"Deploy"**.
2. Vercel will build the frontend and provide your production URL (e.g. `https://airsync-frontend.vercel.app`).

---

## Part 3: Configuration Files Included

This repository comes pre-configured with all necessary deployment configs:

1. **`railway.json`**:
   Configures Nixpacks builder, start command (`npm run start`), and healthcheck path (`/health`).

2. **`vercel.json`**:
   Configures Vite build, output directory (`dist`), and SPA client-side route rewrites.

3. **`server.ts`**:
   - Enabled with `cors()` middleware to allow cross-origin requests from Vercel.
   - Built-in `/health` endpoint for Railway uptime monitors.
   - Dual-mode: serves REST API to remote frontend or serves static files if bundled together.

4. **`src/utils/api.ts`**:
   A dedicated API client that reads `import.meta.env.VITE_API_URL` to route requests to Railway.

5. **`package.json`**:
   `tsx` is in production `dependencies` to ensure runtime stability across all cloud platforms.

---

## Part 4: Testing & Verification Checklist

- [ ] **Railway Health**: Visit `https://<your-railway-url>/health` ➜ `{"status":"ok"}`
- [ ] **Railway API**: Visit `https://<your-railway-url>/api/dashboard` ➜ returns telemetry JSON
- [ ] **Vercel Frontend**: Visit `https://<your-vercel-url>/` ➜ app loads with full tactical map & widgets
- [ ] **CORS Verification**: Open DevTools Console on your Vercel URL. Ensure no CORS errors appear when fetching from Railway.
