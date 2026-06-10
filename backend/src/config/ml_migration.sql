-- ML engine: per-topic test result tracking
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS topic VARCHAR(255);
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS wrong_answers INT DEFAULT 0;
ALTER TABLE test_results ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
