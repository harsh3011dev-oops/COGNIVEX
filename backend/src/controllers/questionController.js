const db = require('../config/db');

function shuffleArray(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function parseLimit(value, fallback = 10, max = 50) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) return fallback;
    return Math.min(parsed, max);
}

function parseCount(value, fallback = 10, max = 50) {
    return parseLimit(value, fallback, max);
}

function normalizeDifficulty(value) {
    if (!value || value === 'mixed') return null;
    const lower = String(value).toLowerCase();
    if (['easy', 'medium', 'hard'].includes(lower)) return lower;
    return null;
}

function stripCorrectAnswer(question) {
    const { correct_answer, ...rest } = question;
    return rest;
}

async function fetchTopicNameMap(topicIds) {
    if (!db || !topicIds.length) return new Map();

    const { data, error } = await db
        .from('topics')
        .select('id, name')
        .in('id', [...new Set(topicIds)]);

    if (error) {
        console.warn('Topic name fetch failed:', error.message || error);
        return new Map();
    }

    return new Map((data || []).map((row) => [row.id, row.name]));
}

function formatQuestion(row, topicNameMap) {
    return {
        id: row.id,
        subject_id: row.subject_id,
        topic_id: row.topic_id,
        topic_name: topicNameMap.get(row.topic_id) || null,
        question: row.question,
        options: row.options,
        explanation: row.explanation,
        difficulty: row.difficulty,
    };
}

const getSubjects = async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        let subjects = null;
        let subjectsError = null;

        const withCode = await db
            .from('subjects')
            .select('id, name, code')
            .order('id', { ascending: true });

        if (withCode.error && /code/i.test(withCode.error.message || '')) {
            const withoutCode = await db
                .from('subjects')
                .select('id, name')
                .order('id', { ascending: true });
            subjects = withoutCode.data;
            subjectsError = withoutCode.error;
        } else {
            subjects = withCode.data;
            subjectsError = withCode.error;
        }

        if (subjectsError) {
            console.error('getSubjects error:', subjectsError.message || subjectsError);
            return res.status(500).json({ error: 'Failed to fetch subjects' });
        }

        if (!subjects || subjects.length === 0) {
            return res.status(503).json({
                error: 'Question bank is empty. Run backend/src/config/question_bank_seed.sql in the Supabase SQL Editor.',
            });
        }

        const { data: topics, error: topicsError } = await db
            .from('topics')
            .select('id, subject_id');

        if (topicsError) {
            console.error('getSubjects topics error:', topicsError.message || topicsError);
            return res.status(500).json({ error: 'Failed to fetch topic counts' });
        }

        const topicCounts = (topics || []).reduce((acc, row) => {
            acc[row.subject_id] = (acc[row.subject_id] || 0) + 1;
            return acc;
        }, {});

        const result = subjects.map((subject) => ({
            ...subject,
            code: subject.code || subject.name,
            topic_count: topicCounts[subject.id] || 0,
        }));

        return res.status(200).json(result);
    } catch (error) {
        console.error('getSubjects error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getQuestionsBySubject = async (req, res) => {
    try {
        const subjectId = parseInt(req.params.subjectId, 10);
        if (Number.isNaN(subjectId)) {
            return res.status(400).json({ error: 'Invalid subject ID' });
        }

        const limit = parseLimit(req.query.limit, 10, 50);
        const difficulty = normalizeDifficulty(req.query.difficulty);

        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        let query = db
            .from('questions')
            .select('id, subject_id, topic_id, question, options, explanation, difficulty')
            .eq('subject_id', subjectId);

        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }

        const { data, error } = await query.limit(limit);

        if (error) {
            console.error('getQuestionsBySubject error:', error.message || error);
            return res.status(500).json({ error: 'Failed to fetch questions' });
        }

        const topicNameMap = await fetchTopicNameMap((data || []).map((row) => row.topic_id));
        const questions = (data || []).map((row) => formatQuestion(row, topicNameMap));

        return res.status(200).json({ subject_id: subjectId, count: questions.length, questions });
    } catch (error) {
        console.error('getQuestionsBySubject error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getRandomQuestions = async (req, res) => {
    try {
        const count = parseCount(req.query.count, 10, 50);
        const difficulty = normalizeDifficulty(req.query.difficulty);
        const subjectParam = req.query.subject;

        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        let query = db.from('questions').select('id');

        if (subjectParam) {
            const subjectId = parseInt(subjectParam, 10);
            if (Number.isNaN(subjectId)) {
                return res.status(400).json({ error: 'Invalid subject parameter' });
            }
            query = query.eq('subject_id', subjectId);
        }

        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }

        const { data: idRows, error: idError } = await query;

        if (idError) {
            console.error('getRandomQuestions id error:', idError.message || idError);
            return res.status(500).json({ error: 'Failed to fetch question pool' });
        }

        if (!idRows || idRows.length === 0) {
            return res.status(404).json({ error: 'No questions found for the given filters' });
        }

        const selectedIds = shuffleArray(idRows.map((row) => row.id)).slice(0, count);

        const { data: questions, error: questionsError } = await db
            .from('questions')
            .select('id, subject_id, topic_id, question, options, explanation, difficulty')
            .in('id', selectedIds);

        if (questionsError) {
            console.error('getRandomQuestions fetch error:', questionsError.message || questionsError);
            return res.status(500).json({ error: 'Failed to fetch questions' });
        }

        const topicNameMap = await fetchTopicNameMap((questions || []).map((row) => row.topic_id));
        const ordered = selectedIds
            .map((id) => (questions || []).find((q) => q.id === id))
            .filter(Boolean)
            .map((row) => formatQuestion(row, topicNameMap));

        return res.status(200).json({ count: ordered.length, questions: ordered });
    } catch (error) {
        console.error('getRandomQuestions error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function fetchSubjectNameMap(subjectIds) {
    if (!db || !subjectIds.length) return new Map();

    const { data, error } = await db
        .from('subjects')
        .select('id, name')
        .in('id', [...new Set(subjectIds)]);

    if (error) {
        console.warn('Subject name fetch failed:', error.message || error);
        return new Map();
    }

    return new Map((data || []).map((row) => [row.id, row.name]));
}

async function upsertLearningStat(userId, subjectName, topicName, isCorrect, timeTaken = 0) {
    try {
        const { data: existing, error: fetchError } = await db
            .from('user_learning_stats')
            .select('*')
            .eq('user_id', userId)
            .eq('subject', subjectName)
            .eq('topic', topicName)
            .maybeSingle();

        if (fetchError) {
            console.warn('upsertLearningStat fetch error (non-fatal):', JSON.stringify(fetchError));
            return;
        }

        const attempts = (existing?.attempts || 0) + 1;
        const previousCorrect = existing
            ? Math.round(((existing.accuracy || 0) / 100) * (existing.attempts || 0))
            : 0;
        const correctCount = previousCorrect + (isCorrect ? 1 : 0);
        const accuracy = Math.round((correctCount / attempts) * 100);
        const previousAvg = existing?.avg_time || 0;
        const avg_time = attempts > 1
            ? Math.round(((previousAvg * (attempts - 1)) + timeTaken) / attempts)
            : timeTaken;

        const payload = {
            user_id: userId,
            subject: subjectName,
            topic: topicName,
            accuracy,
            attempts,
            avg_time,
            last_practiced: new Date().toISOString(),
        };

        if (existing) {
            const { error: updateError } = await db
                .from('user_learning_stats')
                .update(payload)
                .eq('id', existing.id);
            if (updateError) {
                console.warn('upsertLearningStat update error (non-fatal):', JSON.stringify(updateError));
            }
        } else {
            const { error: insertError } = await db
                .from('user_learning_stats')
                .insert([payload]);
            if (insertError) {
                console.warn('upsertLearningStat insert error (non-fatal):', JSON.stringify(insertError));
            }
        }
    } catch (err) {
        // Stats save failure must never crash the quiz submission
        console.warn('upsertLearningStat unexpected error (non-fatal):', err.message || err);
    }
}

const submitQuiz = async (req, res) => {
    try {
        const userId = req.user?.uid || req.body?.userId;
        const { answers } = req.body;

        console.log('submitQuiz request:', {
            userId,
            answerCount: Array.isArray(answers) ? answers.length : 0,
        });

        if (!userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }

        if (req.user?.uid && req.body?.userId && req.user.uid !== req.body.userId) {
            return res.status(403).json({ error: 'Forbidden: userId mismatch' });
        }

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'answers array is required' });
        }

        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const questionIds = answers
            .map((a) => a.questionId)
            .filter((id) => id !== null && id !== undefined);

        const { data: questionRows, error: questionsError } = await db
            .from('questions')
            .select('id, subject_id, topic_id, question, options, correct_answer, explanation, difficulty')
            .in('id', questionIds);

        if (questionsError) {
            console.error('submitQuiz questions error:', JSON.stringify(questionsError));
            return res.status(500).json({ error: 'Failed to load questions for grading' });
        }

        if (!questionRows || questionRows.length === 0) {
            console.error('submitQuiz: no matching questions for ids', questionIds);
            return res.status(400).json({ error: 'Could not find submitted questions in the database' });
        }

        const questionMap = new Map((questionRows || []).map((q) => [String(q.id), q]));
        const topicNameMap = await fetchTopicNameMap((questionRows || []).map((row) => row.topic_id));
        const subjectNameMap = await fetchSubjectNameMap((questionRows || []).map((row) => row.subject_id));

        let correctCount = 0;
        const results = [];   // renamed from `review` to match expected response shape
        const attemptRows = [];

        for (const answer of answers) {
            const question = questionMap.get(String(answer.questionId));
            if (!question) {
                console.warn('submitQuiz: missing question for id', answer.questionId);
                continue;
            }

            const selected = parseInt(answer.selectedAnswer, 10);
            const isCorrect = selected >= 0 && selected === question.correct_answer;
            if (isCorrect) correctCount += 1;

            const subjectName = subjectNameMap.get(question.subject_id) || 'General';
            const topicName = topicNameMap.get(question.topic_id) || 'General';
            const timeTaken = Math.max(0, parseInt(answer.timeTaken, 10) || 0);

            results.push({
                questionId: question.id,
                question: question.question,
                options: question.options,
                selectedAnswer: Number.isNaN(selected) ? -1 : selected,
                correctAnswer: question.correct_answer,
                isCorrect,
                explanation: question.explanation,
                topic_name: topicName,
                difficulty: question.difficulty,
            });

            attemptRows.push({
                user_id: userId,
                question_id: question.id,
                subject: subjectName,
                topic: topicName,
                is_correct: isCorrect,
                time_taken: timeTaken,
                difficulty: question.difficulty || 'medium',
            });

            // Non-fatal: stats save failure must not crash quiz submission
            try {
                await upsertLearningStat(userId, subjectName, topicName, isCorrect, timeTaken);
            } catch (statsErr) {
                console.warn('upsertLearningStat failed (non-fatal):', statsErr.message || statsErr);
            }
        }

        if (attemptRows.length === 0) {
            return res.status(400).json({ error: 'No valid answers to grade' });
        }

        const total = attemptRows.length;
        const score = Math.round((correctCount / total) * 100);
        const accuracy = score;

        // Attempt to persist quiz attempt rows — non-fatal if FK constraint blocks it
        let attemptId = null;
        const { data: savedAttempts, error: attemptError } = await db
            .from('quiz_attempts')
            .insert(attemptRows)
            .select('id');

        if (attemptError) {
            // Log the full Supabase error so we can diagnose FK / RLS issues
            console.error('Supabase error:', JSON.stringify(attemptError));
            console.warn(
                'submitQuiz: quiz_attempts insert failed (non-fatal) — returning score anyway.',
                'rowCount:', attemptRows.length,
                'sample userId:', attemptRows[0]?.user_id,
            );
            // Do NOT return 500 — fall through and still send the score back
        } else {
            attemptId = savedAttempts?.[0]?.id || null;
            console.log('submitQuiz: quiz_attempts saved, attemptId:', attemptId);
        }

        // INSERT INTO test_results — NEW: Aggregated quiz result for dashboard
        // This creates ONE row per quiz submission (not per question)
        try {
            const subjectForResult = req.body?.subject || attemptRows[0]?.subject || 'Full Test';
            
            const testResultPayload = {
                user_id: userId,
                subject: subjectForResult,
                score: score,
                total_questions: total,
                questions_attempted: total,
                questions_correct: correctCount,
                accuracy: accuracy,
            };

            console.log('Inserting into test_results:', {
                userId,
                subject: subjectForResult,
                score,
                total,
                correctCount,
                accuracy,
            });

            const { data: testResultData, error: testResultError } = await db
                .from('test_results')
                .insert([testResultPayload])
                .select('id');

            if (testResultError) {
                console.error('test_results insert failed (non-fatal):', JSON.stringify(testResultError));
                console.warn(
                    'test_results insert error — dashboard may not update immediately.',
                    'userId:', userId,
                    'subject:', subjectForResult,
                );
            } else {
                const testResultId = testResultData?.[0]?.id || null;
                console.log('✅ test_results saved successfully, id:', testResultId);
            }
        } catch (testResultErr) {
            console.error('test_results insert exception (non-fatal):', testResultErr.message || testResultErr);
        }

        console.log('submitQuiz success:', { userId, total, correctCount, score });

        return res.status(200).json({
            success: true,
            attemptId,
            score,
            correctCount,
            total,
            accuracy,
            results,          // primary field (renamed from review)
            review: results,  // kept for backwards-compat with older frontend code
        });
    } catch (error) {
        console.error('submitQuiz unexpected error:', error.message || error, error.stack);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (req.user?.uid && req.user.uid !== userId) {
            return res.status(403).json({ error: 'Forbidden: cannot access another user stats' });
        }

        if (!db) {
            return res.status(503).json({ error: 'Database not connected' });
        }

        const { data: stats, error: statsError } = await db
            .from('user_learning_stats')
            .select('subject, topic, accuracy, attempts, avg_time, last_practiced')
            .eq('user_id', userId);

        if (statsError) {
            console.error('getUserStats error:', statsError.message || statsError);
            return res.status(500).json({ error: 'Failed to fetch user stats' });
        }

        const bySubject = {};
        const byTopic = (stats || []).map((row) => {
            const subjectKey = row.subject;
            if (!bySubject[subjectKey]) {
                bySubject[subjectKey] = {
                    subject_name: row.subject,
                    attempts: 0,
                    accuracy_total: 0,
                    rows: 0,
                };
            }
            bySubject[subjectKey].attempts += row.attempts || 0;
            bySubject[subjectKey].accuracy_total += row.accuracy || 0;
            bySubject[subjectKey].rows += 1;

            return {
                subject_name: row.subject,
                topic_name: row.topic,
                attempts: row.attempts,
                accuracy: row.accuracy,
                avg_time: row.avg_time,
                last_practiced: row.last_practiced,
            };
        });

        const subjectStats = Object.values(bySubject).map((s) => ({
            subject_name: s.subject_name,
            attempts: s.attempts,
            accuracy: s.rows > 0 ? Math.round(s.accuracy_total / s.rows) : 0,
        }));

        return res.status(200).json({
            userId,
            by_subject: subjectStats,
            by_topic: byTopic,
        });
    } catch (error) {
        console.error('getUserStats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getSubjects,
    getQuestionsBySubject,
    getRandomQuestions,
    submitQuiz,
    getUserStats,
};
