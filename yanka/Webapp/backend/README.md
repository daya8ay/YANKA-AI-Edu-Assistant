# YANKA Backend

Python FastAPI backend for the YANKA Webapp. Connects to the frontend and handles sending/receiving data.

## Setup

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

| Method | Path        | Description                    |
|--------|-------------|--------------------------------|
| GET    | /api/health | Health check                   |
| GET    | /api/data   | Get data (sent to frontend)    |
| POST   | /api/data   | Receive JSON body from frontend |

## Frontend connection

In the frontend, set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `.env.local` and use the `api` client in `src/lib/api.ts` to call these endpoints.
