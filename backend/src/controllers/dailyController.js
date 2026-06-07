const db = require('../config/db');
const dailyService = require('../services/daily.service');

const getTodayFocus = async (req, res) => {
    try {
        let userId = req.headers['user-id']; // Optional header for multi-user

        if (!userId && db) {
            // Fallback: Get most recent user for prototype
            const { data } = await db
                .from('user_profile')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (data && data.length > 0) userId = data[0].id;
        }

        if (!userId) {
            return res.status(200).json({ 
                tasks: ["Complete onboarding", "Explore dashboard"], 
                completed_tasks: [],
                streak: 0 
            });
        }

        const dailyData = await dailyService.getOrGenerateDailyTasks(userId);
        
        // Fetch streak for UI
        const { data: profile } = await db
            .from('user_profile')
            .select('daily_streak')
            .eq('id', userId)
            .single();

        return res.status(200).json({
            ...dailyData,
            streak: profile?.daily_streak || 0
        });

    } catch (error) {
        console.error("Daily controller error:", error);
        res.status(500).json({ error: "Failed to fetch today's focus" });
    }
};

const completeTask = async (req, res) => {
    try {
        const { taskText } = req.body;
        let userId = req.headers['user-id'];

        if (!taskText) return res.status(400).json({ error: "Task text is required" });

        if (!userId && db) {
            const { data } = await db
                .from('user_profile')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1);
            if (data && data.length > 0) userId = data[0].id;
        }

        if (!userId) return res.status(400).json({ error: "User not found" });

        const result = await dailyService.markTaskComplete(userId, taskText);
        
        // Return updated stats
        const { data: profile } = await db
            .from('user_profile')
            .select('daily_streak')
            .eq('id', userId)
            .single();

        res.status(200).json({
            ...result,
            streak: profile?.daily_streak || 0
        });

    } catch (error) {
        console.error("Complete task error:", error);
        res.status(500).json({ error: "Failed to complete task" });
    }
};

module.exports = {
    getTodayFocus,
    completeTask
};
