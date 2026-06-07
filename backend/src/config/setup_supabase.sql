-- ===================================================
-- COGNIVEX COMPLETE DATABASE SETUP SCHEMA FROM SCRATCH
-- ===================================================

-- 1. Create the user_profile table (Main User Registry)
CREATE TABLE IF NOT EXISTS user_profile (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    goal TEXT,
    days_left INT DEFAULT 180,
    domain TEXT DEFAULT 'DSA',
    level TEXT DEFAULT 'intermediate',
    confidence VARCHAR(50) DEFAULT '50',
    cognitive_score INT DEFAULT 50,
    speed INT DEFAULT 50,
    accuracy INT DEFAULT 50,
    last_score INT DEFAULT 0,
    total_tests INT DEFAULT 0,
    daily_streak INT DEFAULT 0,
    last_active_date VARCHAR(50),
    semester VARCHAR(50) DEFAULT '5th',
    target_timeline_months INT DEFAULT 6,
    placement_target VARCHAR(100) DEFAULT 'Not decided',
    weak_areas TEXT[] DEFAULT '{}'::TEXT[]
);

-- 2. Create the daily_tasks table (Streaks & Quests)
CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    date VARCHAR(50) NOT NULL,
    tasks TEXT[] DEFAULT '{}'::TEXT[],
    completed_tasks TEXT[] DEFAULT '{}'::TEXT[],
    is_all_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the test_results table (Mock Exams Stats)
CREATE TABLE IF NOT EXISTS test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    accuracy INT NOT NULL,
    weak_areas TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the topic_progress table (Semester Exams Checklists)
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

-- 5. Create the roadmap_progress table (Placement Milestones Checklists)
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
