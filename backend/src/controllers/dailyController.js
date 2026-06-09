const db = require('../config/db');
const dailyService = require('../services/daily.service');

const getTodayFocus = async (req, res) => {
    try {
        const userId = req.user.uid;

        if (!db) {
            return res.status(200).json({ 
                tasks: ["Complete onboarding", "Explore dashboard"], 
                completed_tasks: [],
                streak: 0 
            });
        }

        const dailyData = await dailyService.getOrGenerateDailyTasks(userId);
        
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
        const userId = req.user.uid;
        const { taskText } = req.body;

        if (!taskText) return res.status(400).json({ error: "Task text is required" });

        if (!db) return res.status(400).json({ error: "Database not connected" });

        const result = await dailyService.markTaskComplete(userId, taskText);
        
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
