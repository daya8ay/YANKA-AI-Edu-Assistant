"""
One-time migration: adds heygen_avatar_id column to ai_avatars table.
Run from the backend directory with the venv activated:
    python3 migrate_add_heygen_avatar_id.py
"""
from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE ai_avatars ADD COLUMN IF NOT EXISTS heygen_avatar_id VARCHAR(255)"))
    conn.commit()

print("Migration complete: heygen_avatar_id column added to ai_avatars.")
