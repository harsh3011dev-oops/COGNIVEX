const db = require('../config/db');

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.uid;

        // Initial userData structure
        let userData = {
            score: 50,
            speed: 50,
            accuracy: 50,
            confidence: 50,
            weak_areas: [],
            current_focus: "Begin your learning journey",
            semester: "5th",
            goal: "Both",
            target_timeline_months: 6,
            placement_target: "Not decided",
            subject_completion_pct: 0,
            roadmap_completion_pct: 0,
            next_recommended_subject: "Data Structures & Algorithms",
            last_test_score: 0,
            total_tests: 0,
            total_questions_attempted: 0,
            overall_accuracy_percent: 0,
            topics_completed_count: 0,
            subject_accuracy_breakdown: [],
            recent_tests: [],
            weekly_activity: []
        };
        
        if (!db) {
            return res.status(200).json(userData);
        }

        // 1. Fetch user profile
        const { data: profile, error: profileError } = await db
            .from('user_profile')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
        if (!profileError && profile) {
            userData = {
                ...userData,
                score: profile.cognitive_score || 50,
                speed: profile.speed || 50,
                accuracy: profile.accuracy || 50,
                confidence: parseInt(profile.confidence) || 50,
                weak_areas: profile.weak_areas || [],
                current_focus: `${profile.goal === 'Crack Placements' ? 'Placement' : 'Exam'} Prep - ${profile.days_left || '0'} Days Left`,
                last_test_score: profile.last_score || 0,
                total_tests: profile.total_tests || 0,
                semester: profile.semester || '5th',
                goal: profile.goal || 'Both',
                target_timeline_months: profile.target_timeline_months || 6,
                placement_target: profile.placement_target || 'Not decided'
            };
        } else if (profileError) {
            console.error("Error fetching user profile:", profileError);
        }

        // 2. Fetch and calculate topic progress
        try {
            const { data: topics, error: topicsError } = await db
                .from('topic_progress')
                .select('subject, completed')
                .eq('user_id', userId);

            if (!topicsError && topics && topics.length > 0) {
                const completedCount = topics.filter(t => t.completed).length;
                userData.subject_completion_pct = Math.round((completedCount / 36) * 100);
                userData.topics_completed_count = completedCount;
                
                const subjects = [
                    "Data Structures & Algorithms", 
                    "Operating Systems", 
                    "Database Management Systems", 
                    "Computer Networks", 
                    "Object Oriented Programming", 
                    "Software Engineering"
                ];
                let lowestPct = 100;
                subjects.forEach(sub => {
                    const completedSub = topics.filter(t => t.subject === sub && t.completed).length;
                    const subPct = (completedSub / 6) * 100;
                    if (subPct < lowestPct) {
                        lowestPct = subPct;
                        userData.next_recommended_subject = sub;
                    }
                });
            }
        } catch (err) {
            console.error("Error calculating topic progress:", err);
        }

        // 3. Fetch and calculate roadmap progress
        try {
            const { data: roadmap, error: roadmapError } = await db
                .from('roadmap_progress')
                .select('completed')
                .eq('user_id', userId);

            if (!roadmapError && roadmap && roadmap.length > 0) {
                const completedCount = roadmap.filter(r => r.completed).length;
                userData.roadmap_completion_pct = Math.round((completedCount / 16) * 100);
            }
        } catch (err) {
            console.error("Error calculating roadmap progress:", err);
        }

        // 4. Fetch test results for detailed analytics
        try {
            const { data: testResults, error: testError } = await db
                .from('test_results')
                .select('*')
                .eq('user_id', userId);

            if (!testError && testResults && testResults.length > 0) {
                // Calculate total questions attempted
                userData.total_questions_attempted = testResults.reduce((sum, test) => 
                    sum + (test.questions_attempted || 0), 0
                );

                // Calculate overall accuracy percentage
                const accuracies = testResults.map(t => t.accuracy).filter(a => a !== null && a !== undefined);
                if (accuracies.length > 0) {
                    userData.overall_accuracy_percent = Math.round(
                        (accuracies.reduce((a, b) => a + b, 0) / accuracies.length) * 100
                    ) / 100;
                }

                // Calculate subject-wise accuracy breakdown
                const subjectStats = {};
                testResults.forEach(test => {
                    if (!test.subject) return;
                    
                    if (!subjectStats[test.subject]) {
                        subjectStats[test.subject] = {
                            accuracies: [],
                            tests_attempted: 0
                        };
                    }
                    
                    if (test.accuracy !== null && test.accuracy !== undefined) {
                        subjectStats[test.subject].accuracies.push(test.accuracy);
                    }
                    subjectStats[test.subject].tests_attempted += 1;
                });

                userData.subject_accuracy_breakdown = Object.entries(subjectStats)
                    .map(([subject, data]) => ({
                        subject,
                        accuracy: data.accuracies.length > 0
                            ? Math.round(
                                (data.accuracies.reduce((a, b) => a + b, 0) / data.accuracies.length) * 100
                              ) / 100
                            : 0,
                        tests_attempted: data.tests_attempted
                    }))
                    .sort((a, b) => b.accuracy - a.accuracy);

                // Get recent tests (last 10)
                userData.recent_tests = testResults
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 10)
                    .map(test => ({
                        subject: test.subject || 'Full Test',
                        score: test.score,
                        questions_correct: test.questions_correct || 0,
                        questions_attempted: test.questions_attempted || 0,
                        accuracy: test.accuracy || 0,
                        created_at: test.created_at
                    }));

                // Calculate weekly activity (last 7 days)
                const weeklyStats = {};
                const today = new Date();
                
                // Initialize 7 days
                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    weeklyStats[dateStr] = {
                        quizzes_attempted: 0,
                        total_accuracy: 0,
                        count: 0
                    };
                }

                // Populate with actual data
                testResults.forEach(test => {
                    const dateStr = test.created_at.split('T')[0];
                    if (weeklyStats[dateStr]) {
                        weeklyStats[dateStr].quizzes_attempted += 1;
                        if (test.accuracy !== null && test.accuracy !== undefined) {
                            weeklyStats[dateStr].total_accuracy += test.accuracy;
                            weeklyStats[dateStr].count += 1;
                        }
                    }
                });

                userData.weekly_activity = Object.entries(weeklyStats)
                    .reverse()
                    .map(([date, data]) => ({
                        date,
                        quizzes_attempted: data.quizzes_attempted,
                        avg_accuracy: data.count > 0
                            ? Math.round((data.total_accuracy / data.count) * 100) / 100
                            : 0
                    }));
            }
        } catch (err) {
            console.error("Error fetching test results:", err);
        }
        
        return res.status(200).json(userData);

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getDashboardData };
