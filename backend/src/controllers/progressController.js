const db = require('../config/db');

const getTopicProgress = async (req, res) => {
    try {
        const userId = req.user.uid;

        if (!db) {
            return res.status(200).json([]);
        }

        const { data, error } = await db
            .from('topic_progress')
            .select('subject, topic, completed')
            .eq('user_id', userId);

        if (error) {
            console.warn("Topic progress table might be missing or error occurred:", error.message);
            return res.status(200).json([]);
        }

        return res.status(200).json(data || []);
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateTopicProgress = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { subject, topic, completed } = req.body;

        if (!db) {
            return res.status(200).json({ success: true, message: "Mock success - DB not connected" });
        }

        const { data, error } = await db
            .from('topic_progress')
            .upsert(
                { user_id: userId, subject, topic, completed, updated_at: new Date() },
                { onConflict: 'user_id, subject, topic' }
            )
            .select();

        if (error) {
            console.warn("Topic progress table might be missing:", error.message);
            return res.status(200).json({ success: true, message: "Mock success - DB table missing", data: { subject, topic, completed } });
        }

        return res.status(200).json({ success: true, data: data?.[0] || { subject, topic, completed } });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getRoadmapProgress = async (req, res) => {
    try {
        const userId = req.user.uid;

        if (!db) {
            return res.status(200).json([]);
        }

        const { data, error } = await db
            .from('roadmap_progress')
            .select('phase, item, completed')
            .eq('user_id', userId);

        if (error) {
            console.warn("Roadmap progress table might be missing or error occurred:", error.message);
            return res.status(200).json([]);
        }

        return res.status(200).json(data || []);
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateRoadmapProgress = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { phase, item, completed } = req.body;

        if (!db) {
            return res.status(200).json({ success: true, message: "Mock success - DB not connected" });
        }

        const { data, error } = await db
            .from('roadmap_progress')
            .upsert(
                { user_id: userId, phase, item, completed, updated_at: new Date() },
                { onConflict: 'user_id, phase, item' }
            )
            .select();

        if (error) {
            console.warn("Roadmap progress table might be missing:", error.message);
            return res.status(200).json({ success: true, message: "Mock success - DB table missing", data: { phase, item, completed } });
        }

        return res.status(200).json({ success: true, data: data?.[0] || { phase, item, completed } });
    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getTopicProgress,
    updateTopicProgress,
    getRoadmapProgress,
    updateRoadmapProgress
};
