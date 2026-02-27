# YANKA Backend (FastAPI)

Python FastAPI backend for the YANKA Webapp. Connects to the frontend and handles sending/receiving data.

## Run with Docker (recommended)

From the **repository root**:

```bash
docker compose up --build
```

- **API:** http://localhost:8000  
- **Docs:** http://localhost:8000/docs  
- **DB:** Postgres on `localhost:5432` (user `yanka_user`, db `yanka_dev`)

## Run locally (no Docker)

```bash
cd yanka/Webapp/backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # optional: set PORT and FRONTEND_URL
```

## Run

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --port 4000
```

Server runs at **http://localhost:4000** by default.

## API

| Method | Path                          | Description                         |
|--------|-------------------------------|-------------------------------------|
| GET    | /api/health                   | Health check                        |
| GET    | /api/data                     | Get data (sent to frontend)         |
| POST   | /api/data                     | Receive JSON body from frontend     |
| POST   | /api/video-analytics/predict  | Run ML model on video metrics       |

## Frontend connection

In the frontend, set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `.env.local` and use the `api` client in `src/lib/api.ts` to call these endpoints.
