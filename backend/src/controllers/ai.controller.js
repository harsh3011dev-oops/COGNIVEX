const db = require('../config/db');
const { generateMentorResponse } = require('../services/ai.service');
const dailyService = require('../services/daily.service');

/**
 * POST /ai-tutor
 * Accepts a user query, fetches their profile, and returns a personalized AI mentor response.
 */
const askAITutor = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({ error: 'Query is required.' });
        }

        // Fetch latest user profile from Supabase
        let userProfile = null;

        if (db) {
            const { data, error } = await db
                .from('user_profile')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                userProfile = data[0];
                
                // Fetch daily tasks to align AI
                try {
                    const dailyData = await dailyService.getOrGenerateDailyTasks(userProfile.id);
                    userProfile.today_focus = dailyData.tasks || [];
                } catch (err) {
                    console.error("Failed to fetch daily tasks for AI context:", err);
                }
            }
        }

        // Generate AI response
        const aiResponse = await generateMentorResponse(query, userProfile);

        return res.status(200).json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        console.error('AI Tutor error:', error.message || error);
        return res.status(500).json({
            success: false,
            error: 'AI Mentor is temporarily unavailable. Please try again.',
            fallback: "I'm having trouble connecting right now. In the meantime, try reviewing your notes or practicing with the questions in the Practice section!"
        });
    }
};

module.exports = { askAITutor };
