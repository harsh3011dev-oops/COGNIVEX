const db = require('../config/db');

const getDashboardData = async (req, res) => {
    try {
        // Mock fallback data
        let userData = {
            score: 72,
            speed: 84,
            accuracy: 68,
            confidence: 92,
            weak_areas: ["Arrays", "DBMS"],
            current_focus: "DSA 60-Day Plan",
            semester: "5th",
            goal: "Both",
            target_timeline_months: 6,
            placement_target: "Product company",
            subject_completion_pct: 35,
            roadmap_completion_pct: 25,
            next_recommended_subject: "Operating Systems",
            last_test_score: 80,
            total_tests: 3
        };
        
        if (db) {
            // Fetch latest user profile
            const { data, error } = await db
                .from('user_profile')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1);
                
            if (error) {
                console.error("Supabase fetch error:", error);
            } else if (data && data.length > 0) {
                const profile = data[0];
                
                userData = {
                    score: profile.cognitive_score || 50,
                    speed: profile.speed || 50,
                    accuracy: profile.accuracy || 50,
                    confidence: parseInt(profile.confidence) || 50,
                    weak_areas: profile.weak_areas || [],
                    current_focus: `${profile.goal === 'Crack Placements' ? 'Placement' : 'Exam'} Prep - ${profile.days_left} Days Left`,
                    last_test_score: profile.last_score || 0,
                    total_tests: profile.total_tests || 0,
                    semester: profile.semester || '5th',
                    goal: profile.goal || 'Both',
                    target_timeline_months: profile.target_timeline_months || 6,
                    placement_target: profile.placement_target || 'Not decided',
                    subject_completion_pct: 0,
                    roadmap_completion_pct: 0,
                    next_recommended_subject: "Data Structures & Algorithms"
                };

                // Fetch topic completion stats
                try {
                    const { data: topics, error: topicsError } = await db
                        .from('topic_progress')
                        .select('subject, completed')
                        .eq('user_id', profile.id);

                    if (!topicsError && topics && topics.length > 0) {
                        const completedCount = topics.filter(t => t.completed).length;
                        userData.subject_completion_pct = Math.round((completedCount / 36) * 100);
                        
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

                // Fetch roadmap progress stats
                try {
                    const { data: roadmap, error: roadmapError } = await db
                        .from('roadmap_progress')
                        .select('completed')
                        .eq('user_id', profile.id);

                    if (!roadmapError && roadmap && roadmap.length > 0) {
                        const completedCount = roadmap.filter(r => r.completed).length;
                        userData.roadmap_completion_pct = Math.round((completedCount / 16) * 100);
                    }
                } catch (err) {
                    console.error("Error calculating roadmap progress:", err);
                }
            }
        }
        
        return res.status(200).json(userData);

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getDashboardData };
