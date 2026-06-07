const db = require('../config/db');
const cognitiveService = require('../services/cognitive.service');

const submitTest = async (req, res) => {
    try {
        const { answers, correct_answers, time_taken, topics } = req.body;

        if (!answers || !correct_answers) {
            return res.status(400).json({ error: "Missing test data" });
        }

        // 1. Calculate Score & Accuracy
        const total = correct_answers.length;
        let correctCount = 0;
        let weakAreasDetected = [];

        answers.forEach((ans, index) => {
            if (ans === correct_answers[index]) {
                correctCount++;
            } else {
                // If wrong, add topic to weak areas
                if (topics && topics[index]) {
                    weakAreasDetected.push(topics[index]);
                }
            }
        });

        const score = Math.round((correctCount / total) * 100);
        const accuracy = Math.round((correctCount / total) * 100);

        // 2. Save Test Result
        let testId = null;
        if (db) {
            // First, get the latest profile ID to link (prototyping logic)
            const { data: profile } = await db
                .from('user_profile')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1);

            if (profile && profile.length > 0) {
                const { data: testResult, error: dbError } = await db
                    .from('test_results')
                    .insert([{
                        user_id: profile[0].id,
                        score: score,
                        total_questions: total,
                        accuracy: accuracy,
                        weak_areas: [...new Set(weakAreasDetected)]
                    }])
                    .select();

                if (dbError) {
                    console.error("Error saving test result:", dbError);
                } else {
                    testId = testResult[0].id;
                }

                // 3. Update Cognitive Profile
                await cognitiveService.updateCognitiveProfile(
                    profile[0].id,
                    score,
                    accuracy,
                    time_taken,
                    [...new Set(weakAreasDetected)]
                );
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
