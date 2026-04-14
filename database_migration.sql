-- Database Migration Script for Avatar Persistence
-- Run this on your AWS RDS PostgreSQL instance to update the schema

-- 1. Add cognito_sub field to Users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS cognito_sub VARCHAR(255) UNIQUE;

-- 2. Add owner_id and configuration fields to AI_Avatars table
ALTER TABLE ai_avatars
ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES users(user_id);

ALTER TABLE ai_avatars
ADD COLUMN IF NOT EXISTS configuration JSON;

-- 3. Update ai_avatars table to match new structure
-- Add type column if it doesn't exist
ALTER TABLE ai_avatars
ADD COLUMN IF NOT EXISTS type VARCHAR(50);

-- 4. Create index on cognito_sub for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_cognito_sub ON users(cognito_sub);

-- 5. Create index on owner_id for faster avatar queries
CREATE INDEX IF NOT EXISTS idx_avatars_owner_id ON ai_avatars(owner_id);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'ai_avatars'
ORDER BY ordinal_position;