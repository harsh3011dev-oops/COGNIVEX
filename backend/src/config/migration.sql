-- Migration: Cognivex Semester & Placement Refactor

-- 1. Add new columns to user_profile if they do not exist
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS semester VARCHAR(50);
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS target_timeline_months INT;
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS placement_target VARCHAR(100);

-- 2. Create table for tracking semester exam topic progress
CREATE TABLE IF NOT EXISTS topic_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject, topic)
);

-- 3. Create table for tracking placement roadmap progress
CREATE TABLE IF NOT EXISTS roadmap_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    phase VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, phase, item)
);
