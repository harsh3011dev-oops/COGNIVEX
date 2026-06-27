-- Question bank RLS policies for Cognivex backend (anon key) and authenticated reads
-- Run in Supabase SQL Editor after creating subjects/topics/questions tables

-- Allow backend (anon key) and clients to read question bank catalog
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read subjects" ON subjects;
CREATE POLICY "Public read subjects" ON subjects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read topics" ON topics;
CREATE POLICY "Public read topics" ON topics
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read questions" ON questions;
CREATE POLICY "Public read questions" ON questions
    FOR SELECT USING (true);

-- Quiz attempts / stats: allow inserts and reads (backend uses service role ideally)
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow quiz attempt writes" ON quiz_attempts;
CREATE POLICY "Allow quiz attempt writes" ON quiz_attempts
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow learning stats writes" ON user_learning_stats;
CREATE POLICY "Allow learning stats writes" ON user_learning_stats
    FOR ALL USING (true) WITH CHECK (true);
