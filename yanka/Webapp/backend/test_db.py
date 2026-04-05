# Smoke test: tries to open a DB connection and run a minimal query (SELECT 1).
# If the connection is alive, it prints the results and says "DB connection OK"
# If it fails, it catches the exception and prints "DB connection FAILED" along with the error message.
from app.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("DB connection OK:", result.fetchone())
except Exception as e:
    print("DB connection FAILED:", e)
