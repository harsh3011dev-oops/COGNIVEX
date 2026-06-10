const db = require('../config/db');
const { generateAIResponse } = require('../config/gemini');
const { generateMLProfile } = require('./ml.service');

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
    
    const semester = userProfile?.semester || '5th';
    const goal = userProfile?.goal || 'Both';
    const placementTarget = userProfile?.placement_target || 'Not decided';
    const timelineMonths = userProfile?.target_timeline_months || 6;

    let lowCompletionSubjects = '';
    let roadmapPhaseInfo = '';
    let mlContext = '';

    if (db && userProfile?.id) {
        try {
            const mlProfile = await generateMLProfile(userProfile.id);
            const weakTopics = (mlProfile.recommended_topics || []).slice(0, 3);
            const topicList = weakTopics.map((item) => `${item.topic} (${item.subject})`).join(', ') || 'Not enough data yet';

            const { data: recentTests } = await db
                .from('test_results')
                .select('score, created_at, topic')
                .eq('user_id', userProfile.id)
                .order('created_at', { ascending: false })
                .limit(10);

            const lastScores = (recentTests || [])
                .filter((row) => !row.topic)
                .slice(0, 3)
                .map((row) => row.score)
                .join(', ') || 'No tests yet';

            mlContext = `
Adaptive ML Insights (computed from real user data):
- Top weak topics: ${topicList}
- Current difficulty level: ${mlProfile.difficulty_level}
- Learning velocity: ${mlProfile.learning_velocity}
- Last 3 test scores: ${lastScores}
- Strongest subject: ${mlProfile.strongest_subject || 'N/A'}
- Weakest subject: ${mlProfile.weakest_subject || 'N/A'}

Instruction: Focus your explanations on these weak areas: ${topicList}.
Adjust complexity for a ${mlProfile.difficulty_level} level student.
Student is ${mlProfile.learning_velocity} — adjust encouragement accordingly.`;
        } catch (err) {
            console.error('Error fetching ML context for AI:', err);
        }

        try {
            const { data: topicProgress } = await db
                .from('topic_progress')
                .select('subject, completed')
                .eq('user_id', userProfile.id);
            
            if (topicProgress && topicProgress.length > 0) {
                const subjects = [...new Set(topicProgress.map((row) => row.subject))];
                const lowComp = [];
                subjects.forEach((sub) => {
                    const subjectTopics = topicProgress.filter((t) => t.subject === sub);
                    const completedCount = subjectTopics.filter((t) => t.completed).length;
                    const pct = subjectTopics.length ? (completedCount / subjectTopics.length) * 100 : 0;
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
                const phases = [...new Set(roadmapProgress.map((row) => row.phase))];
                const activePhases = phases.map((phaseName) => {
                    const phaseItems = roadmapProgress.filter((r) => r.phase === phaseName);
                    const completed = phaseItems.filter((r) => r.completed).length;
                    return `${phaseName} (${completed}/${phaseItems.length} items checked)`;
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
- Stated Weak Areas: ${weakAreas}${lowCompletionSubjects}${roadmapPhaseInfo}${mlContext}

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
