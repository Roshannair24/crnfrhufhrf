# Gridbricks — GB Wind Forecast vs. Actual Generation

 Pick a start and end time, and the dashboard plots **forecasted wind generation** against **actual (metered) wind generation** for that window on a line chart.

- **Frontend:** Next.js (React) app with a date/time picker and a Chart.js line chart.
- **Backend:** Express API that fetches elexon data.
- **Notebooks:** Jupyter notebook and sample JSON data used for offline/exploratory analysis of the same datasets.

## Live app

- **Frontend (Vercel):** https://crnfrhufhrf-frontend.vercel.app

## How the app fits together

1. The frontend's `Dashboard` component lets a user pick a start time, end time, and forecast horizon, then calls the backend's `/forecast` and `/prod` endpoints.
2. The backend validates the query params and calls Elexon's public BMRS API (`WINDFOR` for forecasts, `FUELHH` for actual generation), then returns the JSON response.
3. The frontend merges the two series by timestamp and renders them as a line chart (actual vs. forecasted generation).


## Running the application

### Option 1 — Docker Compose (recommended)

From the repo root:

```bash
docker compose up --build
```

This builds and starts both services:

- Backend → http://localhost:5000
- Frontend → http://localhost:3000

To stop: `docker compose down`.

### Option 2 — `start.sh` helper script

From the repo root, after installing dependencies in both `gridbricks-backend` and `gridbrics-frontend` (`npm install` in each):

```bash
./start.sh dev    # runs both apps in dev mode (nodemon + next dev)
# or
./start.sh prod   # builds the frontend and runs both apps in production mode
```

- Backend → http://localhost:5000
- Frontend → http://localhost:3000

Press `Ctrl+C` (or `kill` the printed PIDs) to stop both processes.

### Option 3 — Run each app manually

**Backend:**

```bash
cd gridbricks-backend
npm install
cp .env.example .env   # if present; otherwise create .env with ELEXON_BASE_URL (and FRONTEND_URL as needed)
npm run dev             # nodemon, http://localhost:5000
# or: npm start          # production mode
```

**Frontend:**

```bash
cd gridbrics-frontend
npm install
# create .env.local with NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
npm run dev              # http://localhost:3000
# or: npm run build && npm start

## Deployment

- The **frontend** is deployed to **Vercel**: https://crnfrhufhrf-frontend.vercel.app
- The **backend** includes a `vercel.json` for deployment as a Vercel serverless function, and a `gridbricks.Dockerfile` for container-based deployment elsewhere. When deploying the backend, set `ELEXON_BASE_URL` and `FRONTEND_URL` in the target platform's environment settings, and point the frontend's `NEXT_PUBLIC_API_BASE_URL` at the deployed backend URL.

## Note:
Claude was used to build `gridbrics-frontend\src\components\DateTimePicker.jsx` as I did not want to import another library apart from existing tailwind just for a component.