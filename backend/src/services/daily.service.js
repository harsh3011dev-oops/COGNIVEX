const db = require('../config/db');

/**
 * Get or generate daily tasks for a user
 */
const getOrGenerateDailyTasks = async (userId) => {
    if (!db) return { tasks: ["Complete onboarding", "Explore dashboard"], completed_tasks: [] };

    const today = new Date().toISOString().split('T')[0];

    // 1. Check if tasks already exist for today
    const { data: existingTasks, error: fetchError } = await db
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    if (existingTasks) return existingTasks;

    // 2. Generate new tasks if none exist
    // Fetch profile to get weak areas and roadmap info
    const { data: profile } = await db
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .single();

    const weakAreas = profile?.weak_areas || [];
    const domain = profile?.domain || "General";
    
    let generatedTasks = [];
    
    // Rule: Weak areas first
    if (weakAreas.length > 0) {
        generatedTasks.push(`Revise ${weakAreas[0]}`);
    } else {
        generatedTasks.push(`Explore ${domain} fundamentals`);
    }

    // Rule: Roadmap / Practice
    generatedTasks.push(`Solve 5 ${domain} practice questions`);
    generatedTasks.push("Take a 10-minute mental agility test");

    // 3. Save to DB
    const { data: newTask, error: insertError } = await db
        .from('daily_tasks')
        .insert([{
            user_id: userId,
            date: today,
            tasks: generatedTasks,
            completed_tasks: []
        }])
        .select()
        .single();

    if (insertError) {
        console.error("Error creating daily tasks:", insertError);
        return { tasks: generatedTasks, completed_tasks: [] };
    }

    return newTask;
};

/**
 * Handle streak logic
 */
const updateStreak = async (userId) => {
    if (!db) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const { data: profile } = await db
        .from('user_profile')
        .select('daily_streak, last_active_date')
        .eq('id', userId)
        .single();

    if (!profile) return;

    let newStreak = profile.daily_streak || 0;
    const lastActive = profile.last_active_date;

    if (!lastActive) {
        newStreak = 1;
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayStr) {
            newStreak += 1;
        } else if (lastActive !== todayStr) {
            // Gap of more than 1 day
            newStreak = 1;
        }
    }

    await db
        .from('user_profile')
        .update({ 
            daily_streak: newStreak, 
            last_active_date: todayStr 
        })
        .eq('id', userId);

    return newStreak;
};

/**
 * Mark a specific task as complete
 */
const markTaskComplete = async (userId, taskText) => {
    if (!db) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: currentTasks } = await db
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

    if (!currentTasks) return;

    const updatedCompleted = [...new Set([...(currentTasks.completed_tasks || []), taskText])];
    const isAllDone = updatedCompleted.length >= currentTasks.tasks.length;

    const { data, error } = await db
        .from('daily_tasks')
        .update({ 
            completed_tasks: updatedCompleted,
            is_all_completed: isAllDone
        })
        .eq('id', currentTasks.id)
        .select()
        .single();

    // If all tasks completed today, ensure streak is updated (if not already)
    if (isAllDone) {
        await updateStreak(userId);
    }

    return data;
};

module.exports = {
    getOrGenerateDailyTasks,
    updateStreak,
    markTaskComplete
};
