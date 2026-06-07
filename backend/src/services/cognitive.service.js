const db = require('../config/db');

/**
 * Updates the user's cognitive profile based on test performance.
 * Rules:
 * - Accuracy > 70%: +3 to +7 points to cognitive_score
 * - Accuracy < 50%: -5 to -10 points to cognitive_score (min 30)
 * - Speed: Recalculated based on timeTaken vs totalQuestions
 * - Weak Areas: Dynamically updated from test results
 */
const updateCognitiveProfile = async (userId, score, accuracy, timeTaken, weakAreas) => {
    if (!db) return null;

    try {
        // 1. Fetch current profile
        // Since we are currently using LIMIT 1 for prototyping, we'll fetch the latest record
        const { data: profile, error: fetchError } = await db
            .from('user_profile')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        if (fetchError || !profile || profile.length === 0) {
            console.error("Profile not found for update");
            return null;
        }

        const currentProfile = profile[0];

        // 2. Calculate New Metrics
        let newCognitiveScore = currentProfile.cognitive_score || 50;
        if (accuracy > 70) {
            newCognitiveScore += Math.floor(Math.random() * 5) + 3;
        } else if (accuracy < 50) {
            newCognitiveScore -= Math.floor(Math.random() * 5) + 5;
        }
        newCognitiveScore = Math.max(30, Math.min(100, newCognitiveScore));

        // Speed calculation (seconds per question)
        // Assume lower is better? Or scale to 0-100.
        // Let's stick to a 0-100 metric for the dashboard.
        const speedFactor = Math.max(0, 100 - (timeTaken / currentProfile.days_left)); 
        const newSpeed = Math.floor((currentProfile.speed + speedFactor) / 2);

        // Update weak areas: merge and limit to top 5
        const existingWeak = currentProfile.weak_areas || [];
        const mergedWeak = [...new Set([...existingWeak, ...weakAreas])].slice(0, 5);

        // 3. Update DB
        const { data, error } = await db
            .from('user_profile')
            .update({
                cognitive_score: newCognitiveScore,
                accuracy: Math.floor((currentProfile.accuracy + accuracy) / 2),
                speed: newSpeed,
                weak_areas: mergedWeak,
                last_score: score,
                total_tests: (currentProfile.total_tests || 0) + 1,
                updated_at: new Date()
            })
            .eq('id', currentProfile.id)
            .select();

        if (error) throw error;
        return data[0];

    } catch (error) {
        console.error("Error in cognitive service:", error);
        throw error;
    }
};

module.exports = { updateCognitiveProfile };
