"""
Migration: update generatedvideos table for S3 video storage.

Changes:
  1. Relaxes NOT NULL on source_content_id, creator_id, avatar_id
     (these were required in the original schema but are optional in our flow)
  2. Adds new columns: title, s3_key, heygen_video_id, source, language

Run once against RDS:
    python migrate_add_generated_videos_columns.py
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")

SQL = """
-- Relax NOT NULL constraints so rows can be inserted without source content / avatar
ALTER TABLE generatedvideos ALTER COLUMN source_content_id DROP NOT NULL;
ALTER TABLE generatedvideos ALTER COLUMN creator_id        DROP NOT NULL;
ALTER TABLE generatedvideos ALTER COLUMN avatar_id         DROP NOT NULL;

-- Add new columns (IF NOT EXISTS is safe to re-run)
ALTER TABLE generatedvideos ADD COLUMN IF NOT EXISTS title            VARCHAR(255);
ALTER TABLE generatedvideos ADD COLUMN IF NOT EXISTS s3_key           VARCHAR(512);
ALTER TABLE generatedvideos ADD COLUMN IF NOT EXISTS heygen_video_id  VARCHAR(255);
ALTER TABLE generatedvideos ADD COLUMN IF NOT EXISTS source           VARCHAR(50);
ALTER TABLE generatedvideos ADD COLUMN IF NOT EXISTS language         VARCHAR(50);
"""

def run():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    with conn.cursor() as cur:
        cur.execute(SQL)
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    run()
