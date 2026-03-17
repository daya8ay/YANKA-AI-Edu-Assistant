# YANKA Backend (FastAPI)

Minimal FastAPI backend, ready for video generation and other AI features. The support chatbot remains implemented in the Next.js frontend (`/api/chat`).

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
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Start the database with `docker compose -f database/docker-compose.yml up -d` if needed.
