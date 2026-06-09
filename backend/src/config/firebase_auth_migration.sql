-- Firebase Auth migration: store Firebase UID as user_profile.id
-- Run this in Supabase SQL Editor before using Firebase auth

ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- For new projects, use TEXT id instead of UUID:
-- ALTER TABLE user_profile ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE user_profile ALTER COLUMN id TYPE TEXT USING id::TEXT;
