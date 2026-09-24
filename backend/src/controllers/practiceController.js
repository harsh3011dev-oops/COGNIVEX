const db = require('../config/db');
const cognitiveService = require('../services/cognitive.service');
const dailyService = require('../services/daily.service');

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
                subject: req.body.subject || 'General',
                accuracy: Math.round(((stats.total_questions - stats.wrong_answers) / stats.total_questions) * 100),
                attempts: stats.total_questions,
                avg_time: 0,
                last_practiced: new Date().toISOString(),
            }));

            if (topicRows.length) {
                // Upsert into user_learning_stats (correct table) — one row per topic
                for (const row of topicRows) {
                    const { data: existing } = await db
                        .from('user_learning_stats')
                        .select('id, attempts, accuracy')
                        .eq('user_id', userId)
                        .eq('topic', row.topic)
                        .maybeSingle();

                    if (existing) {
                        // Merge with existing attempts for running average
                        const totalAttempts = (existing.attempts || 0) + row.attempts;
                        const mergedAccuracy = Math.round(
                            ((existing.accuracy || 0) * (existing.attempts || 0) + row.accuracy * row.attempts) / totalAttempts
                        );
                        const { error: updateErr } = await db
                            .from('user_learning_stats')
                            .update({ accuracy: mergedAccuracy, attempts: totalAttempts, last_practiced: row.last_practiced })
                            .eq('id', existing.id);
                        if (updateErr) console.error('Error updating user_learning_stats:', updateErr.message || updateErr);
                    } else {
                        const { error: insertErr } = await db.from('user_learning_stats').insert([row]);
                        if (insertErr) console.error('Error inserting user_learning_stats:', insertErr.message || insertErr);
                    }
                }
            }

            await cognitiveService.updateCognitiveProfile(
                userId,
                score,
                accuracy,
                time_taken,
                [...new Set(weakAreasDetected)]
            );

            // Update daily streak (non-fatal)
            try {
                await dailyService.updateStreak(userId);
            } catch (streakErr) {
                console.warn('updateStreak failed (non-fatal):', streakErr.message || streakErr);
            }
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
