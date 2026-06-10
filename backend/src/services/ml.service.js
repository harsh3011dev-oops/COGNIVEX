const db = require('../config/db');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysSince(dateValue) {
    if (!dateValue) return null;
    return (Date.now() - new Date(dateValue).getTime()) / MS_PER_DAY;
}

function recencyWeight(lastTestedAt) {
    if (!lastTestedAt) return 0.9;
    const days = daysSince(lastTestedAt);
    if (days <= 7) return 1.0;
    if (days <= 30) return 0.7;
    return 0.4;
}

function average(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function priorityFromScore(weaknessScore) {
    if (weaknessScore >= 70) return 'high';
    if (weaknessScore >= 40) return 'medium';
    return 'low';
}

function buildReason({ wrongAnswerRate, lastTestedAt, completed, cognitiveScore }) {
    const parts = [];

    if (wrongAnswerRate > 0) {
        parts.push(`${Math.round(wrongAnswerRate * 100)}% wrong answer rate in practice tests`);
    } else if (!lastTestedAt) {
        parts.push('No practice tests recorded for this topic yet');
    }

    const days = daysSince(lastTestedAt);
    if (lastTestedAt && days > 30) {
        parts.push(`last tested ${Math.round(days)} days ago`);
    } else if (lastTestedAt && days > 7) {
        parts.push('not reviewed in the last week');
    }

    if (!completed) {
        parts.push('marked incomplete in your study checklist');
    }

    if (cognitiveScore < 60) {
        parts.push(`cognitive score (${cognitiveScore}) suggests extra revision`);
    }

    return parts.length ? parts.join('; ') : 'Based on your current learning profile';
}

function calculateDifficultyLevel(testResults) {
    const overallTests = testResults
        .filter((row) => !row.topic)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const recentScores = overallTests.slice(0, 5).map((row) => row.score);

    if (!recentScores.length) {
        return 'beginner';
    }

    const averageScore = average(recentScores);
    if (averageScore >= 80) return 'hard';
    if (averageScore >= 50) return 'medium';
    return 'easy';
}

function calculateDailyGoal(difficultyLevel) {
    if (difficultyLevel === 'beginner' || difficultyLevel === 'easy') return 2;
    if (difficultyLevel === 'medium') return 3;
    return 5;
}

function calculateLearningVelocity(testResults, cognitiveScore) {
    const now = Date.now();
    const recentScores = [];
    const olderScores = [];

    testResults
        .filter((row) => !row.topic)
        .forEach((row) => {
            const age = now - new Date(row.created_at).getTime();
            if (age <= 7 * MS_PER_DAY) {
                recentScores.push(row.score);
            } else if (age <= 14 * MS_PER_DAY) {
                olderScores.push(row.score);
            }
        });

    if (!recentScores.length) {
        return 'stable';
    }

    const recentAvg = average(recentScores);
    const baseline = olderScores.length ? average(olderScores) : cognitiveScore;

    if (recentAvg > baseline + 5) return 'rising';
    if (recentAvg < baseline - 5) return 'needs_attention';
    return 'stable';
}

function buildInsightMessage({
    goal,
    semester,
    learningVelocity,
    weakestSubject,
    strongestSubject,
    difficultyLevel,
    hasData,
}) {
    if (!hasData) {
        return `Welcome! As a ${semester} semester student focused on "${goal}", complete your first practice test to unlock personalized recommendations.`;
    }

    if (learningVelocity === 'rising') {
        return `Great momentum! Your recent scores are improving. Double down on ${weakestSubject || 'your weak areas'} while maintaining strength in ${strongestSubject || 'your best subjects'}.`;
    }

    if (learningVelocity === 'needs_attention') {
        return `Your recent test scores dipped. Prioritize ${weakestSubject || 'unfinished topics'} at ${difficultyLevel} difficulty before moving ahead.`;
    }

    return `Steady progress at ${difficultyLevel} level. Focus on ${weakestSubject || 'incomplete topics'} to balance your profile across subjects.`;
}

function aggregateTopicStats(topicProgress, testResults) {
    const topicMap = new Map();

    topicProgress.forEach((row) => {
        topicMap.set(row.topic, {
            topic: row.topic,
            subject: row.subject,
            completed: row.completed,
            wrong_answers: 0,
            total_questions: 0,
            last_tested: null,
        });
    });

    testResults.forEach((row) => {
        if (row.topic) {
            const existing = topicMap.get(row.topic) || {
                topic: row.topic,
                subject: row.subject || 'General',
                completed: false,
                wrong_answers: 0,
                total_questions: 0,
                last_tested: null,
            };

            existing.wrong_answers += row.wrong_answers || 0;
            existing.total_questions += row.total_questions || 0;
            if (!existing.last_tested || new Date(row.created_at) > new Date(existing.last_tested)) {
                existing.last_tested = row.created_at;
            }
            if (row.subject) {
                existing.subject = row.subject;
            }

            topicMap.set(row.topic, existing);
            return;
        }

        const weakTopics = row.weak_areas || [];
        weakTopics.forEach((topic) => {
            const existing = topicMap.get(topic) || {
                topic,
                subject: 'General',
                completed: false,
                wrong_answers: 0,
                total_questions: 0,
                last_tested: null,
            };

            existing.wrong_answers += 1;
            existing.total_questions += 1;
            if (!existing.last_tested || new Date(row.created_at) > new Date(existing.last_tested)) {
                existing.last_tested = row.created_at;
            }

            topicMap.set(topic, existing);
        });
    });

    return Array.from(topicMap.values());
}

function calculateWeaknessScore(topic, cognitiveScore) {
    const wrongAnswerRate = topic.total_questions > 0
        ? topic.wrong_answers / topic.total_questions
        : 0;

    const recency = recencyWeight(topic.last_tested);
    const completionGap = topic.completed ? 0 : 1;
    const cognitivePenalty = (100 - (cognitiveScore || 50)) / 100;

    return (
        wrongAnswerRate * 40 +
        recency * 30 +
        completionGap * 20 +
        cognitivePenalty * 10
    );
}

function buildDefaultProfile(userProfile) {
    const goal = userProfile?.goal || 'Both';
    const semester = userProfile?.semester || '5th';
    const cognitiveScore = userProfile?.cognitive_score || 50;
    const weakAreas = userProfile?.weak_areas || [];

    const recommendedTopics = weakAreas.slice(0, 3).map((topic) => ({
        topic,
        subject: userProfile?.domain || 'General',
        weakness_score: Math.round((100 - cognitiveScore) * 0.6),
        reason: `Listed in your profile weak areas for ${goal} preparation`,
        priority: cognitiveScore < 50 ? 'high' : 'medium',
    }));

    return {
        recommended_topics: recommendedTopics,
        strongest_subject: userProfile?.domain || null,
        weakest_subject: userProfile?.domain || null,
        difficulty_level: 'beginner',
        learning_velocity: 'stable',
        daily_goal: 2,
        insight_message: buildInsightMessage({
            goal,
            semester,
            learningVelocity: 'stable',
            weakestSubject: null,
            strongestSubject: null,
            difficultyLevel: 'beginner',
            hasData: false,
        }),
    };
}

async function fetchUserMLData(userId) {
    if (!db) {
        return {
            userProfile: null,
            testResults: [],
            topicProgress: [],
            dailyTasks: [],
        };
    }

    const [profileResult, testResult, topicResult, dailyResult] = await Promise.all([
        db.from('user_profile').select('*').eq('id', userId).maybeSingle(),
        db.from('test_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        db.from('topic_progress').select('subject, topic, completed, updated_at').eq('user_id', userId),
        db.from('daily_tasks').select('completed_tasks, created_at, is_all_completed').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    if (profileResult.error) {
        console.error('ML profile fetch error (user_profile):', profileResult.error.message || profileResult.error);
    }
    if (testResult.error) {
        console.error('ML profile fetch error (test_results):', testResult.error.message || testResult.error);
    }
    if (topicResult.error) {
        console.error('ML profile fetch error (topic_progress):', topicResult.error.message || topicResult.error);
    }
    if (dailyResult.error) {
        console.error('ML profile fetch error (daily_tasks):', dailyResult.error.message || dailyResult.error);
    }

    return {
        userProfile: profileResult.data || null,
        testResults: testResult.data || [],
        topicProgress: topicResult.data || [],
        dailyTasks: dailyResult.data || [],
    };
}

async function generateMLProfile(userId) {
    const { userProfile, testResults, topicProgress, dailyTasks } = await fetchUserMLData(userId);

    if (!userProfile && !testResults.length && !topicProgress.length) {
        return buildDefaultProfile(userProfile);
    }

    const cognitiveScore = userProfile?.cognitive_score ?? 50;
    const topics = aggregateTopicStats(topicProgress, testResults);

    if (!topics.length) {
        return buildDefaultProfile(userProfile);
    }

    const scoredTopics = topics.map((topic) => {
        const weaknessScore = calculateWeaknessScore(topic, cognitiveScore);
        const wrongAnswerRate = topic.total_questions > 0
            ? topic.wrong_answers / topic.total_questions
            : 0;

        return {
            topic: topic.topic,
            subject: topic.subject,
            weakness_score: Math.round(weaknessScore * 10) / 10,
            reason: buildReason({
                wrongAnswerRate,
                lastTestedAt: topic.last_tested,
                completed: topic.completed,
                cognitiveScore,
            }),
            priority: priorityFromScore(weaknessScore),
        };
    });

    scoredTopics.sort((a, b) => b.weakness_score - a.weakness_score);

    const subjectStrength = new Map();
    scoredTopics.forEach((item) => {
        if (!subjectStrength.has(item.subject)) {
            subjectStrength.set(item.subject, []);
        }
        subjectStrength.get(item.subject).push(100 - item.weakness_score);
    });

    const subjectScores = Array.from(subjectStrength.entries()).map(([subject, scores]) => ({
        subject,
        strength: average(scores),
    }));

    subjectScores.sort((a, b) => b.strength - a.strength);

    const difficultyLevel = calculateDifficultyLevel(testResults);
    const learningVelocity = calculateLearningVelocity(testResults, cognitiveScore);

    let adjustedVelocity = learningVelocity;
    const recentDailyTasks = dailyTasks.filter((task) => daysSince(task.created_at) <= 7);
    if (recentDailyTasks.length >= 3) {
        const completionRate = average(
            recentDailyTasks.map((task) => (task.is_all_completed ? 1 : Math.min((task.completed_tasks?.length || 0) / 3, 1)))
        );

        if (completionRate < 0.3 && learningVelocity === 'stable') {
            adjustedVelocity = 'needs_attention';
        } else if (completionRate >= 0.8 && learningVelocity === 'stable' && testResults.length > 0) {
            adjustedVelocity = 'rising';
        }
    }

    const goal = userProfile?.goal || 'Both';
    const semester = userProfile?.semester || '5th';

    return {
        recommended_topics: scoredTopics.slice(0, 10),
        strongest_subject: subjectScores[0]?.subject || null,
        weakest_subject: subjectScores[subjectScores.length - 1]?.subject || null,
        difficulty_level: difficultyLevel,
        learning_velocity: adjustedVelocity,
        daily_goal: calculateDailyGoal(difficultyLevel),
        insight_message: buildInsightMessage({
            goal,
            semester,
            learningVelocity: adjustedVelocity,
            weakestSubject: subjectScores[subjectScores.length - 1]?.subject,
            strongestSubject: subjectScores[0]?.subject,
            difficultyLevel,
            hasData: testResults.length > 0 || topicProgress.length > 0,
        }),
    };
}

module.exports = { generateMLProfile };
