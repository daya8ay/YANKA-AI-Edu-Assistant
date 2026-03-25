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

Start the database with `docker compose -f database/docker-compose.yml up -d` if needed.

## Testing the DB connection

**Prerequisites:** Docker Desktop must be running (check your system tray).

**1. Start the Postgres container if it's not already running**
```bash
docker start yanka_postgres_db
```

You only need to run `docker compose up -d` (from the `database/` directory) if the container doesn't exist yet
(For example, on a fresh machine or after a `docker compose down`)

**2. Run the db test**
```bash
cd yanka/Webapp/backend
python3 test_db.py
```

Expected output: `DB connection OK: (1,)`

**3. Run the schema test:**
```bash
python3 test_schemas.py
```

Expected output: `schemas OK`

**If the container has credential issues** (e.g., after changing env vars), nuke the volume and recreate ot:
```bash
cd database
docker compose down -v
docker compose up -d
```
This wipes the data volume and re-runs `init.sql` from scratch.

## Testing the API endpoints

### Visual testing — Swagger UI

Start the server:
```bash
cd yanka/Webapp/backend
uvicorn app.main:app --reload --port 8000
```

Open **http://localhost:8000/docs** in your browser. Every endpoint is listed — click one, hit "Try it out", fill in the fields, and send a real request. No extra tools needed.

### Visual testing — Database (pgAdmin)

The Docker setup includes pgAdmin for browsing the database visually.

Open **http://localhost:5050** in your browser.

Login credentials (from `.env`):
- Email: your `PGADMIN_DEFAULT_EMAIL`
- Password: your `PGADMIN_DEFAULT_PASSWORD`

To connect to the database in pgAdmin:
1. Right-click Servers → Register → Server
2. Name: `yanka_dev` (anything you like)
3. Connection tab → Host: `yanka_postgres_db`, Port: `5432`, Database: `yanka_dev`, Username: `yanka_user`, Password: `yanka_password`

> Note: use `yanka_postgres_db` (the container name) as the host, not `localhost` — pgAdmin runs inside Docker and sees the DB by container name.

### Automated tests — POST /users

```bash
cd yanka/Webapp/backend
python3 test_users.py
```

Expected output:
```
PASS  test_create_user
PASS  test_duplicate_email
PASS  test_missing_required_field
PASS  test_invalid_email_format

All tests passed.
```

What each test checks:
- **test_create_user** — happy path, new user created successfully (201)
- **test_duplicate_email** — same email twice returns 400 (server refuses the duplicate)
- **test_missing_required_field** — missing `role` returns 422 (request is malformed)
- **test_invalid_email_format** — non-email string returns 422 (validation failure)

## Run

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn app.main:app --reload --port 8000
```

Server runs at **http://localhost:8000** by default (same as Docker).

## API

| Method | Path                          | Description                         |
|--------|-------------------------------|-------------------------------------|
| GET    | /api/health                   | Health check                        |
| GET    | /api/data                     | Get data (sent to frontend)         |
| POST   | /api/data                     | Receive JSON body from frontend     |
| POST   | /api/video-analytics/predict  | Run ML model on video metrics       |

## Frontend connection

In the frontend, set `NEXT_PUBLIC_API_URL` in `.env.local` if your API is not on `http://localhost:8000` (see `src/lib/api.ts`) and use the `api` client to call these endpoints.
