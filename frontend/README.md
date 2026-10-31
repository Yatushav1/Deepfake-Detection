# AuthPulse AI dashboard

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

By default, the dashboard uses `http://127.0.0.1:8000`. Set `VITE_API_BASE_URL`
in a frontend `.env` file to point to a different backend.

The current backend supports health checks and session creation, but not
dashboard analytics or session listing. Overview charts and existing session
rows are therefore labeled demo data. Registration and login issue a bearer
token that is kept in the current browser tab. Creating a test session sends
that token to `POST /sessions/create` and displays the returned risk assessment.
