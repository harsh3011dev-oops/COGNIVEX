const db = require('../config/db');

const submitOnboarding = async (req, res) => {
    try {
        const { goal, days_left, domain, level, confidence, semester, target_timeline_months, placement_target } = req.body;
        
        if (!goal || !domain || !level || !confidence) {
            return res.status(400).json({ error: 'Goal, domain, level, and confidence are required' });
        }

        // Generate cognitive metrics
        let baseScore = 50;
        let p_level = level.toLowerCase();
        
        if (p_level === 'beginner') {
            baseScore = Math.floor(Math.random() * (50 - 40 + 1)) + 40; // 40-50
        } else if (p_level === 'intermediate') {
            baseScore = Math.floor(Math.random() * (70 - 55 + 1)) + 55; // 55-70
        } else if (p_level === 'advanced') {
            baseScore = Math.floor(Math.random() * (85 - 70 + 1)) + 70; // 70-85
        }

        const numericConfidence = parseInt(confidence) || 50;

        const generatedData = {
            cognitive_score: baseScore,
            speed: Math.floor(baseScore * 0.9), // rough derivative
            accuracy: Math.floor(baseScore * 0.95), // rough derivative
            confidence: numericConfidence
        };

        if (db) {
            const { data, error } = await db
                .from('user_profile')
                .insert([
                    {
                        goal,
                        days_left: parseInt(days_left) || (parseInt(target_timeline_months) * 30) || 180,
                        domain,
                        level,
                        confidence: confidence.toString(),
                        semester: semester || '5th',
                        target_timeline_months: parseInt(target_timeline_months) || 6,
                        placement_target: placement_target || 'Not decided',
                        cognitive_score: generatedData.cognitive_score,
                        speed: generatedData.speed,
                        accuracy: generatedData.accuracy
                    }
                ])
                .select();
                
            if (error) {
                console.error("Supabase insert error:", error.message || error);
                console.warn("Continuing despite DB error for prototyping purposes...");
            }
        } else {
            console.warn("DB not connected. Mocking success.");
        }

        return res.status(200).json(generatedData);

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { submitOnboarding };
