const db = require('../config/db');
const cognitiveService = require('../services/cognitive.service');

const submitTest = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { answers, correct_answers, time_taken, topics } = req.body;

        if (!answers || !correct_answers) {
            return res.status(400).json({ error: "Missing test data" });
        }

        const total = correct_answers.length;
        let correctCount = 0;
        let weakAreasDetected = [];

        answers.forEach((ans, index) => {
            if (ans === correct_answers[index]) {
                correctCount++;
            } else {
                if (topics && topics[index]) {
                    weakAreasDetected.push(topics[index]);
                }
            }
        });

        const score = Math.round((correctCount / total) * 100);
        const accuracy = Math.round((correctCount / total) * 100);

        let testId = null;
        if (db) {
            // Ensure user profile exists to avoid Foreign Key constraint violation
            const { data: profileExists, error: checkProfileErr } = await db
                .from('user_profile')
                .select('id')
                .eq('id', userId)
                .maybeSingle();

            if (!profileExists && !checkProfileErr) {
                console.log(`Auto-creating user profile for ${userId} during test submission...`);
                await db.from('user_profile').insert([{
                    id: userId,
                    user_id: userId,
                    goal: 'Both',
                    domain: 'DSA',
                    level: 'intermediate'
                }]);
            }

            const { data: testResult, error: dbError } = await db
                .from('test_results')
                .insert([{
                    user_id: userId,
                    subject: req.body.subject || 'PDF Quiz',
                    score: score,
                    total_questions: total,
                    questions_attempted: total,
                    questions_correct: correctCount,
                    accuracy: accuracy,
                    weak_areas: [...new Set(weakAreasDetected)]
                }])
                .select();

            if (dbError) {
                console.error("Error saving test result:", dbError);
            } else {
                testId = testResult[0].id;
            }

            const topicStats = {};
            answers.forEach((ans, index) => {
                const topic = topics?.[index];
                if (!topic) return;

                if (!topicStats[topic]) {
                    topicStats[topic] = { total_questions: 0, wrong_answers: 0 };
                }

                topicStats[topic].total_questions += 1;
                if (ans !== correct_answers[index]) {
                    topicStats[topic].wrong_answers += 1;
                }
            });

            const topicRows = Object.entries(topicStats).map(([topic, stats]) => ({
                user_id: userId,
                topic,
                score: Math.round(((stats.total_questions - stats.wrong_answers) / stats.total_questions) * 100),
                total_questions: stats.total_questions,
                wrong_answers: stats.wrong_answers,
                accuracy: Math.round(((stats.total_questions - stats.wrong_answers) / stats.total_questions) * 100),
            }));

            if (topicRows.length) {
                const { error: topicError } = await db.from('test_results').insert(topicRows);
                if (topicError) {
                    console.error('Error saving per-topic test results:', topicError.message || topicError);
                }
            }

            await cognitiveService.updateCognitiveProfile(
                userId,
                score,
                accuracy,
                time_taken,
                [...new Set(weakAreasDetected)]
            );
        }

        return res.status(200).json({
            message: "Test submitted successfully",
            testId,
            results: {
                score,
                accuracy,
                correctCount,
                total,
                weakAreas: [...new Set(weakAreasDetected)]
            }
        });

    } catch (error) {
        console.error("Submission error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { submitTest };
