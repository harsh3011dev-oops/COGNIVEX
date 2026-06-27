-- Quiz generation: PDF-to-quiz tables and test_results extensions
-- Run in Supabase SQL Editor after setup_supabase.sql

-- 1. Generated quiz sessions (metadata; PDF bytes are not stored)
CREATE TABLE IF NOT EXISTS generated_quizzes (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    source_filename VARCHAR(500) NOT NULL,
    source_hash     VARCHAR(64),
    extracted_chars INT,
    subject         VARCHAR(255),
    difficulty      VARCHAR(50),
    question_count  INT NOT NULL,
    status          VARCHAR(50) DEFAULT 'ready',
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMPTZ
);

-- 2. Questions belonging to a generated quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id     UUID NOT NULL REFERENCES generated_quizzes(id) ON DELETE CASCADE,
    position    INT NOT NULL,
    question    TEXT NOT NULL,
    options     JSONB NOT NULL,
    correct     INT NOT NULL,
    topic       VARCHAR(255),
    explanation TEXT,
    UNIQUE(quiz_id, position)
);

-- 3. Link test submissions back to generated quizzes
ALTER TABLE test_results
    ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES generated_quizzes(id) ON DELETE SET NULL;

ALTER TABLE test_results
    ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual';

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_generated_quizzes_user_id ON generated_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_test_results_quiz_id ON test_results(quiz_id);
