const db = require('../config/db');
const { generateAIResponse } = require('../config/gemini');

/**
 * Build a dynamic, context-aware prompt and get a mentor response.
 * @param {string} userQuery - The student's question or request.
 * @param {object} userProfile - The student's profile data from Supabase.
 * @returns {Promise<string>} - The AI mentor's response.
 */
async function generateMentorResponse(userQuery, userProfile) {
    const level = userProfile?.level || 'Intermediate';
    const score = userProfile?.cognitive_score || 70;
    const domain = userProfile?.domain || 'DSA';
    const confidence = userProfile?.confidence || '50';
    const weakAreas = userProfile?.weak_areas ? userProfile.weak_areas.join(', ') : 'Not assessed yet';
    
    // New parameters
    const semester = userProfile?.semester || '5th';
    const goal = userProfile?.goal || 'Both';
    const placementTarget = userProfile?.placement_target || 'Not decided';
    const timelineMonths = userProfile?.target_timeline_months || 6;

    // Fetch low completion subjects if database is active
    let lowCompletionSubjects = '';
    let roadmapPhaseInfo = '';

    if (db && userProfile?.id) {
        try {
            const { data: topicProgress } = await db
                .from('topic_progress')
                .select('subject, completed')
                .eq('user_id', userProfile.id);
            
            if (topicProgress && topicProgress.length > 0) {
                const subjects = [
                    "Data Structures & Algorithms", 
                    "Operating Systems", 
                    "Database Management Systems", 
                    "Computer Networks", 
                    "Object Oriented Programming", 
                    "Software Engineering"
                ];
                const lowComp = [];
                subjects.forEach(sub => {
                    const completedCount = topicProgress.filter(t => t.subject === sub && t.completed).length;
                    const pct = (completedCount / 6) * 100;
                    if (pct < 60) {
                        lowComp.push(`${sub} (${pct.toFixed(0)}% complete)`);
                    }
                });
                if (lowComp.length > 0) {
                    lowCompletionSubjects = `\n- Subjects needing attention (low completion): ${lowComp.join(', ')}`;
                }
            }
        } catch (err) {
            console.error("Error fetching topic progress for AI context:", err);
        }

        try {
            const { data: roadmapProgress } = await db
                .from('roadmap_progress')
                .select('phase, completed')
                .eq('user_id', userProfile.id);

            if (roadmapProgress && roadmapProgress.length > 0) {
                const phases = [
                    { name: "Phase 1: DSA Basics", total: 5 },
                    { name: "Phase 2: DSA Advanced", total: 4 },
                    { name: "Phase 3: Core CS", total: 4 },
                    { name: "Phase 4: Soft Skills", total: 3 }
                ];
                const activePhases = [];
                phases.forEach(ph => {
                    const completed = roadmapProgress.filter(r => r.phase === ph.name && r.completed).length;
                    activePhases.push(`${ph.name} (${completed}/${ph.total} items checked)`);
                });
                roadmapPhaseInfo = `\n- Placement Roadmap Phase Status: ${activePhases.join(', ')}`;
            }
        } catch (err) {
            console.error("Error fetching roadmap progress for AI context:", err);
        }
    }

    const prompt = `You are an AI mentor named Cognivex Mentor, helping a CS/IT engineering student succeed in semester exams and placement interviews.

Student Learning Context:
- Primary Goal: ${goal}
- Current Semester: ${semester}
- Target Timeline: ${timelineMonths} Months
- Placement Target: ${placementTarget}
- Self-Confidence: ${confidence}%
- Cognitive Intelligence Score: ${score}/100
- Stated Focus Domain: ${domain}
- Stated Weak Areas: ${weakAreas}${lowCompletionSubjects}${roadmapPhaseInfo}

User Inquiry:
"${userQuery}"

Your response guidelines:
1. Explain the concepts clearly and simply, tailoring explanation depth to their semester level (${semester}) and cognitive rating (${score}/100).
2. If the user query is about a specific engineering subject topic (e.g. Normalization, Dijkstra, Paging), provide structural clarifications, typical exam weightage highlights (if semester goal is active), or standard coding interview questions (if placement goal is active).
3. Be structured and concise. Use bullet points and clean markdown format (bold text, code blocks for programming logic, etc.) for high readability.
4. Keep the tone encouraging, supportive, and highly technical yet intuitive. Do not output conversational filler.`;

    const response = await generateAIResponse(prompt);
    return response;
}

module.exports = { generateMentorResponse };
