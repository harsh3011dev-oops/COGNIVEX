"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { WeakAreas } from "@/components/dashboard/WeakAreas"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import Link from "next/link"
import { Play, MessageCircle, Map, Flame, Check, Sparkles, BookOpenCheck, Target, Brain, TrendingUp, Trophy, ArrowRight, Lightbulb } from "lucide-react"
import { getDashboard, getTopicProgress, getRoadmapProgress, type SubjectAccuracy, type RecentTest } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useMLProfile } from "@/hooks/useMLProfile"
import { Button } from "@/components/ui/Button"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function priorityColor(priority: string) {
  if (priority === "high") return "bg-red-500/20 text-red-400 border border-red-500/30";
  if (priority === "medium") return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  return "bg-green-500/20 text-green-400 border border-green-500/30";
}

function velocityLabel(velocity: string) {
  if (velocity === "rising") return "Rising 📈";
  if (velocity === "needs_attention") return "Needs Attention ⚠️";
  return "Stable ➡️";
}

const mockBadges = [
  { name: "First Milestone", desc: "Completed 1st practice test", color: "from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/20" },
  { name: "Code Committer", desc: "Logged 3 day learning streak", color: "from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20" },
  { name: "DSA Initiate", desc: "First roadmap checkpoint cleared", color: "from-orange-500/10 to-amber-500/10 text-orange-400 border-orange-500/20" }
];

function DashboardContent() {
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [topicProgress, setTopicProgress] = React.useState<any[]>([]);
  const [roadmapProgress, setRoadmapProgress] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { mlProfile, loading: mlLoading } = useMLProfile();

  const [completedTasks, setCompletedTasks] = React.useState<string[]>([]);
  const [localStreak, setLocalStreak] = React.useState(0);

  const focusTasks = React.useMemo(() => {
    if (!mlProfile?.recommended_topics?.length) return [];
    const primary = mlProfile.recommended_topics[0];
    const tasks = [`Focus: ${primary.topic} (${primary.subject})`];
    mlProfile.recommended_topics.slice(1, 3).forEach((item) => {
      tasks.push(`Revise: ${item.topic}`);
    });
    return tasks;
  }, [mlProfile]);

  React.useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboardData(data);
        setLocalStreak(Number(localStorage.getItem("streak") || 0));
      } catch (error) {
        console.error("Failed to fetch dashboard data, using local storage fallback:", error);
        const onboardingSaved = localStorage.getItem("cognivex_onboarding");
        const onboarding = onboardingSaved ? JSON.parse(onboardingSaved) : null;

        setDashboardData({
          score: 72,
          speed: 84,
          accuracy: 68,
          confidence: 92,
          weak_areas: [],
          current_focus: "DSA 60-Day Plan",
          semester: onboarding?.semester || "5th",
          goal: onboarding?.goal || "Both",
          target_timeline_months: onboarding?.target_timeline_months || 6,
          placement_target: onboarding?.placement_target || "Product company",
          subject_completion_pct: 35,
          roadmap_completion_pct: 25,
          next_recommended_subject: "Operating Systems",
          last_test_score: 80,
          total_tests: 3,
          total_questions_attempted: 0,
          overall_accuracy_percent: 0,
          topics_completed_count: 0,
          subject_accuracy_breakdown: [],
          recent_tests: [],
          weekly_activity: []
        });
        setLocalStreak(Number(localStorage.getItem("streak") || 0));
      }

      try {
        const tp = await getTopicProgress();
        setTopicProgress(tp || []);
      } catch (err) {
        const saved = localStorage.getItem("cognivex_topic_progress");
        if (saved) setTopicProgress(JSON.parse(saved));
      }

      try {
        const rp = await getRoadmapProgress();
        setRoadmapProgress(rp || []);
      } catch (err) {
        const saved = localStorage.getItem("cognivex_roadmap_progress");
        if (saved) setRoadmapProgress(JSON.parse(saved));
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const handleToggleTask = (taskName: string) => {
    if (completedTasks.includes(taskName)) {
      setCompletedTasks(prev => prev.filter(t => t !== taskName));
    } else {
      const nextCompleted = [...completedTasks, taskName];
      setCompletedTasks(nextCompleted);
      if (nextCompleted.length === focusTasks.length && focusTasks.length > 0) {
        setLocalStreak(prev => prev + 1);
      }
    }
  };

  if (loading || mlLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const goal = dashboardData?.goal || "Both";
  const recommendedTopics = mlProfile?.recommended_topics?.slice(0, 3) || [];
  
  const totalExamTopics = 36;
  const completedExamTopics = topicProgress.filter(t => t.completed).length;
  const subjectCompletion = topicProgress.length > 0 ? Math.round((completedExamTopics / totalExamTopics) * 100) : (dashboardData?.subject_completion_pct || 0);

  const totalRoadmapItems = 16;
  const completedRoadmapItems = roadmapProgress.filter(r => r.completed).length;
  const roadmapCompletion = roadmapProgress.length > 0 ? Math.round((completedRoadmapItems / totalRoadmapItems) * 100) : (dashboardData?.roadmap_completion_pct || 0);

  return (
    <DashboardLayout title="Dashboard">
      
      {/* Welcome Hero Panel */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-4 text-white shadow-xl sm:mb-8 sm:rounded-2xl sm:p-6 md:flex-row md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="min-w-0 z-10">
          <span className="inline-block max-w-full truncate rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">
            {dashboardData?.semester} Semester • Goal: {goal}
          </span>
          <h2 className="mt-2 mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Learning Workspace</h2>
          <p className="text-xs text-zinc-400 font-semibold sm:text-sm">Ecosystem sync active. Access your customized roadmap options below.</p>
        </div>
        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 backdrop-blur-sm sm:w-auto sm:justify-start shrink-0 z-10">
          <Flame size={18} className="fill-orange-500 text-orange-500 animate-pulse" />
          <span className="font-bold text-xs font-mono text-blue-400">{localStreak} Day Streak</span>
        </div>
      </div>

      {/* Grid: Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Questions Attempted", value: dashboardData?.total_questions_attempted || 0, desc: "Total practice attempts" },
          { title: "Overall Accuracy", value: `${dashboardData?.overall_accuracy_percent || 0}%`, desc: "Correct answers ratio" },
          { title: "Tests Conducted", value: dashboardData?.total_tests || 0, desc: "Simulated assessments" },
          { title: "Topics Completed", value: dashboardData?.topics_completed_count || 0, desc: "Marked syllabus items" }
        ].map((item, idx) => (
          <Card key={idx} className="border border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700 transition-colors">
            <CardContent className="p-4 sm:p-5">
              <div className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-2 font-mono">{item.title}</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-mono tracking-tight">{item.value}</div>
              <div className="text-[10px] text-zinc-400 font-semibold">{item.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Intelligence stats */}
        <StatsCard data={dashboardData} />

        {/* Target Progress Card */}
        <Card className="border border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <BookOpenCheck size={14} className="text-blue-500" />
              <span>Target Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col justify-between h-[80%] min-h-[220px]">
            {(goal === "Ace Semester Exams" || goal === "Both") && (
              <div className="mb-4">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                  <span>Semester Subject progress</span>
                  <span>{subjectCompletion}%</span>
                </div>
                <ProgressBar value={subjectCompletion} className="h-2 rounded-full" />
                <div className="text-[10px] text-zinc-400 mt-2 font-semibold">
                  Syllabus vector: <span className="text-blue-500 font-mono">{mlProfile?.weakest_subject || dashboardData?.next_recommended_subject}</span>
                </div>
              </div>
            )}

            {(goal === "Crack Placements" || goal === "Both") && (
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                  <span>Placement Roadmap Milestones</span>
                  <span>{roadmapCompletion}%</span>
                </div>
                <ProgressBar value={roadmapCompletion} className="h-2 rounded-full animate-pulse" />
                <div className="text-[10px] text-zinc-400 mt-2 font-semibold">
                  Sector target: <span className="text-purple-400 font-mono">{dashboardData?.placement_target}</span>
                </div>
              </div>
            )}

            <div className="border-t border-zinc-850 pt-4 mt-auto flex justify-between gap-2">
              <Link href="/exam-prep" className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1">
                Syllabus prep <ArrowRight size={12} />
              </Link>
              <Link href="/placement/roadmap" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Roadmap <ArrowRight size={12} />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Focus Tasks Card */}
        <Card className="border border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <Check size={14} className="text-blue-500" />
              <span>Today&apos;s Focus Sandbox</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {mlProfile?.recommended_topics?.[0] && (
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-2">
                <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono mb-1">Recommended Node</div>
                <div className="text-xs font-bold text-white">{mlProfile.recommended_topics[0].topic}</div>
                <div className="text-[10px] text-zinc-400 font-semibold">{mlProfile.recommended_topics[0].subject}</div>
              </div>
            )}

            {focusTasks.length === 0 ? (
              <p className="text-xs text-zinc-500 font-medium">Complete simulated exams to deploy AI guidance focus steps.</p>
            ) : (
              <div className="space-y-2">
                {focusTasks.map((task) => {
                  const isDone = completedTasks.includes(task);
                  return (
                    <div 
                      key={task}
                      onClick={() => handleToggleTask(task)}
                      className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-colors ${
                        isDone 
                          ? 'bg-blue-500/5 border-blue-500/20 opacity-70' 
                          : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                        isDone ? 'bg-blue-500 border-blue-500 text-white' : 'bg-transparent border-zinc-700 text-transparent'
                      }`}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className={`text-[11px] font-semibold ${isDone ? 'line-through text-zinc-550' : 'text-zinc-200'}`}>
                        {task}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {focusTasks.length > 0 && completedTasks.length === focusTasks.length && (
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono text-center mt-2 flex items-center justify-center gap-1 animate-bounce">
                <Sparkles size={10} />
                <span>Node verified! Streak status updated</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid: AI Revision & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Targeted Revision */}
        <Card className="border border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <Target size={14} className="text-blue-500" />
              <span>Targeted AI Revisions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {recommendedTopics.length === 0 ? (
              <p className="text-xs text-zinc-500 font-medium">Diagnostic matrices clear. Start assessment tasks to retrieve revision loops.</p>
            ) : (
              recommendedTopics.map((item) => (
                <div key={`${item.subject}-${item.topic}`} className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-bold text-white">{item.topic}</div>
                      <div className="text-[10px] text-zinc-400 font-semibold">{item.subject}</div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded font-mono ${priorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-[9px] text-zinc-400 mb-1 font-mono">
                      <span>Weakness Diagnostic Rating</span>
                      <span>{item.weakness_score}/100</span>
                    </div>
                    <ProgressBar value={Math.min(item.weakness_score, 100)} className="h-1 rounded-full" />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-semibold mb-3 leading-relaxed">{item.reason}</p>
                  <Link href={`/ai-mentor?topic=${encodeURIComponent(item.topic)}&subject=${encodeURIComponent(item.subject)}`}>
                    <Button size="sm" variant="outline" className="w-full text-[10px] h-8 rounded-lg cursor-pointer">Consult AI Advisor</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* AI Learning Insights */}
        <Card className="border border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <Brain size={14} className="text-blue-500" />
              <span>AI Diagnostics & Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-3">
                <div className="text-[9px] font-bold uppercase text-green-400 font-mono mb-1">Strongest Core</div>
                <div className="break-words text-xs font-bold text-white">{mlProfile?.strongest_subject || "—"}</div>
              </div>
              <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
                <div className="text-[9px] font-bold uppercase text-red-400 font-mono mb-1">Weakest Node</div>
                <div className="break-words text-xs font-bold text-white">{mlProfile?.weakest_subject || "—"}</div>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="text-[9px] font-bold text-zinc-400 uppercase font-mono mb-1">Complexity Tag</div>
                <div className="text-xs font-bold text-white capitalize">{mlProfile?.difficulty_level || "beginner"}</div>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30">
                <div className="text-[9px] font-bold text-zinc-400 uppercase font-mono flex items-center gap-1">
                  <TrendingUp size={10} className="text-blue-500" /> Velocity
                </div>
                <div className="text-xs font-bold text-white">{velocityLabel(mlProfile?.learning_velocity || "stable")}</div>
              </div>
            </div>
            {mlProfile?.insight_message && (
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                  {mlProfile.insight_message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid: Actions Redirects */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/practice" className="group flex min-h-11 items-center gap-4 rounded-xl border border-zinc-850 bg-[#0c0c0e] hover:border-zinc-700 p-4 transition-all duration-300 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Play size={14} className="ml-0.5" />
          </div>
          <div>
            <div className="font-bold text-xs text-white">Assessments Center</div>
            <div className="text-[10px] text-zinc-400 font-semibold">Launch mock test session</div>
          </div>
        </Link>
        
        <Link href="/ai-mentor" className="group flex min-h-11 items-center gap-4 rounded-xl border border-zinc-850 bg-[#0c0c0e] hover:border-zinc-700 p-4 transition-all duration-300 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <MessageCircle size={14} />
          </div>
          <div>
            <div className="font-bold text-xs text-white">AI Mentor Console</div>
            <div className="text-[10px] text-zinc-400 font-semibold">Query custom nodes for advice</div>
          </div>
        </Link>
        
        <Link href="/placement/practice" className="group flex min-h-11 items-center gap-4 rounded-xl border border-zinc-850 bg-[#0c0c0e] hover:border-zinc-700 p-4 transition-all duration-300 shadow-sm sm:col-span-2 md:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Trophy size={14} />
          </div>
          <div>
            <div className="font-bold text-xs text-white">Company Practice sandbox</div>
            <div className="text-[10px] text-zinc-400 font-semibold">Deploy real interview tests</div>
          </div>
        </Link>
      </div>

      {/* Grid: Charts & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ProgressChart weeklyData={dashboardData?.weekly_activity} />
        
        {/* Subject Accuracy Breakdown */}
        <Card className="border border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <TrendingUp size={14} className="text-blue-500" />
              <span>Subject Accuracy Breakdowns</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {dashboardData?.subject_accuracy_breakdown && dashboardData.subject_accuracy_breakdown.length > 0 ? (
              <div className="space-y-3.5">
                {dashboardData.subject_accuracy_breakdown.map((subject: SubjectAccuracy) => (
                  <div key={subject.subject}>
                    <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-zinc-200">
                      <span>{subject.subject}</span>
                      <span className="font-mono text-blue-400">{subject.accuracy}%</span>
                    </div>
                    <ProgressBar value={subject.accuracy} className="h-1.5" />
                    <div className="text-[9px] text-zinc-400 font-semibold mt-1 font-mono">{subject.tests_attempted} session{subject.tests_attempted !== 1 ? 's' : ''} logged</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-semibold">Diagnostic logs clear. Complete assessments to update variables.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid: Recent Assessments & Achievement Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Tests Section */}
        <Card className="border border-zinc-800 bg-[#0c0c0e] lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <Play size={14} className="text-blue-500" />
              <span>Recent Assessment Logs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {dashboardData?.recent_tests && dashboardData.recent_tests.length > 0 ? (
              <div className="space-y-2.5">
                {dashboardData.recent_tests.map((test: RecentTest, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white">{test.subject}</div>
                      <div className="text-[10px] text-zinc-400 font-semibold font-mono">
                        {new Date(test.created_at).toLocaleDateString()} • {new Date(test.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-200 font-mono">
                          {test.questions_correct}/{test.questions_attempted} Qs
                        </div>
                        <div className={`text-[10px] font-bold font-mono ${test.accuracy >= 75 ? 'text-green-400' : test.accuracy >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {test.accuracy}% accuracy
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-semibold">No assessment records located. Launch the practice sandbox to log details!</p>
            )}
          </CardContent>
        </Card>

        {/* Achievement Badges Section */}
        <Card className="border border-zinc-800 bg-[#0c0c0e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-mono">
              <Trophy size={14} className="text-blue-500" />
              <span>Unlocked Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {mockBadges.map((badge, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-zinc-850 bg-zinc-900/10">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${badge.color} flex items-center justify-center shrink-0 border border-zinc-800`}>
                  <Trophy size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{badge.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5 leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeakAreas topics={mlProfile?.recommended_topics?.map((t) => t.topic) || dashboardData?.weak_areas} />
      </div>
    </DashboardLayout>
  )
}
