# AuthPulse AI

Identity threat detection and response for authentication sessions.

## Start the app (Windows PowerShell)

Install dependencies once:

```powershell
cd backend
py -3.12 -m pip install -r requirements.txt
cd ..\frontend
npm install
cd ..
```

From the repository root, start both services and open the app:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

The launcher opens separate backend and frontend PowerShell windows, waits for
the API and UI to respond, and opens `http://127.0.0.1:5173`. Create an account
or sign in; successful authentication opens the dashboard. Keep both service
windows open while using the app. Close them to stop the app.

The launcher generates a local authentication secret for that server run, so
sign in again after restarting. For a long-running installation, configure a
persistent `AUTHPULSE_SECRET_KEY` and set `AUTHPULSE_ALLOWED_ORIGINS` to a
comma-separated list of trusted frontend origins.

## Deploy on Render

1. Push this repository to GitHub and create a new **Blueprint** in Render
   using the repository. Render will read [`render.yaml`](./render.yaml) and
   create the API and frontend services.
2. The API uses a persistent disk for SQLite data and a generated
   `AUTHPULSE_SECRET_KEY`. The disk requires a paid Render web-service plan;
   the Blueprint uses the Starter plan so accounts and sessions survive
   restarts and deploys.
3. Wait for both services to finish their first deploy, then open the
   `authpulse-dashboard` service URL.

The Blueprint connects the frontend to the API and restricts API CORS to the
deployed frontend origin. Local development continues to use SQLite in
`backend/authpulse.db` and the local Vite API URL.

The dashboard's example analytics are demo data. Creating a test session calls
the authenticated backend API and displays a Random Forest suspicious-login
probability, confidence, contributing signals, and recommended action. The
included model is a prototype trained on generated synthetic scenarios because
the repository does not include labeled authentication data. Its probabilities
are not calibrated or validated for production access-control decisions; train
and evaluate it on representative, consented, labeled data before operational
use. On a separate 3,000-row synthetic holdout (1,000 suspicious), the current
prototype scores 98.63% accuracy and 0.9795 F1 (97.95%); these synthetic-only
metrics do not estimate real-world performance.
