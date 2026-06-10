const { generateMLProfile } = require('../services/ml.service');

const CACHE_TTL_MS = 5 * 60 * 1000;
const profileCache = new Map();

function getCachedProfile(userId) {
    const entry = profileCache.get(userId);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        profileCache.delete(userId);
        return null;
    }
    return entry.data;
}

function setCachedProfile(userId, data) {
    profileCache.set(userId, { data, timestamp: Date.now() });
}

const getMLProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (req.user?.uid && req.user.uid !== userId) {
            return res.status(403).json({ error: 'Forbidden: cannot access another user profile' });
        }

        const cached = getCachedProfile(userId);
        if (cached) {
            return res.status(200).json({ ...cached, cached: true });
        }

        const profile = await generateMLProfile(userId);
        setCachedProfile(userId, profile);

        return res.status(200).json({ ...profile, cached: false });
    } catch (error) {
        console.error('ML profile error:', error.message || error);
        return res.status(200).json({
            recommended_topics: [],
            strongest_subject: null,
            weakest_subject: null,
            difficulty_level: 'beginner',
            learning_velocity: 'stable',
            daily_goal: 2,
            insight_message: 'Unable to compute recommendations right now. Complete a practice test to get started.',
        });
    }
};

module.exports = { getMLProfile };
