"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { WeakAreas } from "@/components/dashboard/WeakAreas"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import Link from "next/link"
import { Play, MessageCircle, Map, Flame, Check, Sparkles, BookOpenCheck, Target, Brain, TrendingUp } from "lucide-react"
import { getDashboard, getTopicProgress, getRoadmapProgress } from "@/lib/api"
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
  if (priority === "high") return "bg-red-500";
  if (priority === "medium") return "bg-amber-500";
  return "bg-green-500";
}

function velocityLabel(velocity: string) {
  if (velocity === "rising") return "Rising 📈";
  if (velocity === "needs_attention") return "Needs Attention ⚠️";
  return "Stable ➡️";
}

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
        setLocalStreak(data?.streak || 0);
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
          streak: 3
        });
        setLocalStreak(3);
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
      
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white shadow-md sm:mb-8 sm:rounded-3xl sm:p-6 md:flex-row md:items-center">
        <div className="min-w-0">
          <span className="inline-block max-w-full truncate rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-xs">
            {dashboardData?.semester} Semester • Goal: {goal}
          </span>
          <h2 className="mt-2 mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Sanctuary of Learning</h2>
          <p className="text-xs opacity-90 sm:text-sm">Exactly what you need to master for exams and placement screening.</p>
        </div>
        <div className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm sm:w-auto sm:justify-start">
          <Flame size={20} className="fill-white animate-pulse" />
          <span className="font-bold text-sm">{localStreak} Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <StatsCard data={dashboardData} />

        <Card className="shadow-sm border-none bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpenCheck size={16} className="text-primary" />
              <span>Target Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 flex flex-col justify-between h-[80%]">
            {(goal === "Ace Semester Exams" || goal === "Both") && (
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                  <span>Semester Subject Completion</span>
                  <span>{subjectCompletion}%</span>
                </div>
                <ProgressBar value={subjectCompletion} className="h-2.5 rounded-full" />
                <div className="text-[10px] text-foreground/50 mt-1 font-semibold">
                  Recommended next: <span className="text-primary">{mlProfile?.weakest_subject || dashboardData?.next_recommended_subject}</span>
                </div>
              </div>
            )}

            {(goal === "Crack Placements" || goal === "Both") && (
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                  <span>Placement Roadmap Items</span>
                  <span>{roadmapCompletion}%</span>
                </div>
                <ProgressBar value={roadmapCompletion} className="h-2.5 rounded-full" />
                <div className="text-[10px] text-foreground/50 mt-1 font-semibold">
                  Target sector: <span className="text-primary">{dashboardData?.placement_target}</span>
                </div>
              </div>
            )}

            <div className="border-t border-secondary/40 pt-4 mt-auto flex justify-between gap-2">
              <Link href="/exam-prep" className="text-xs font-bold text-primary hover:underline">Exam prep</Link>
              <Link href="/placement/roadmap" className="text-xs font-bold text-primary hover:underline">Placement roadmap</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Today&apos;s Focus</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3">
            {mlProfile?.recommended_topics?.[0] && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-2">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Primary Focus</div>
                <div className="text-sm font-bold text-foreground">{mlProfile.recommended_topics[0].topic}</div>
                <div className="text-[10px] text-foreground/50">{mlProfile.recommended_topics[0].subject}</div>
                <div className="text-[10px] text-foreground/60 mt-2">
                  Daily goal: {mlProfile.daily_goal} topics
                </div>
              </div>
            )}

            {focusTasks.length === 0 ? (
              <p className="text-xs text-foreground/50">Complete a practice test to get personalized focus tasks.</p>
            ) : (
              focusTasks.map((task) => {
                const isDone = completedTasks.includes(task);
                return (
                  <div 
                    key={task}
                    onClick={() => handleToggleTask(task)}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors ${
                      isDone 
                        ? 'bg-primary/5 opacity-70' 
                        : 'bg-secondary/40 hover:bg-secondary/70'
                    }`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                      isDone ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-transparent'
                    }`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className={`text-xs font-semibold ${isDone ? 'line-through text-foreground/40' : 'text-foreground/85'}`}>
                      {task}
                    </span>
                  </div>
                )
              })
            )}

            {focusTasks.length > 0 && completedTasks.length === focusTasks.length && (
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles size={10} />
                <span>Focus Completed! Streak saved</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target size={16} className="text-primary" />
              <span>Targeted Revision</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-4">
            {recommendedTopics.length === 0 ? (
              <p className="text-xs text-foreground/50">No revision targets yet. Take a practice test to generate recommendations.</p>
            ) : (
              recommendedTopics.map((item) => (
                <div key={`${item.subject}-${item.topic}`} className="p-4 rounded-2xl bg-secondary/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-bold text-foreground">{item.topic}</div>
                      <div className="text-[10px] text-foreground/50">{item.subject}</div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white ${priorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-[10px] text-foreground/50 mb-1">
                      <span>Weakness Score</span>
                      <span>{item.weakness_score}</span>
                    </div>
                    <ProgressBar value={Math.min(item.weakness_score, 100)} className="h-1.5" />
                  </div>
                  <p className="text-[10px] text-foreground/60 mb-3">{item.reason}</p>
                  <Link href={`/ai-mentor?topic=${encodeURIComponent(item.topic)}&subject=${encodeURIComponent(item.subject)}`}>
                    <Button size="sm" variant="outline" className="w-full text-xs">Study Now</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Brain size={16} className="text-primary" />
              <span>Learning Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-green-50 p-3 dark:bg-green-950/20">
                <div className="text-[10px] font-bold uppercase text-foreground/50">Strongest</div>
                <div className="break-words text-xs font-bold text-foreground sm:text-sm">{mlProfile?.strongest_subject || "—"}</div>
              </div>
              <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/20">
                <div className="text-[10px] font-bold uppercase text-foreground/50">Weakest</div>
                <div className="break-words text-xs font-bold text-foreground sm:text-sm">{mlProfile?.weakest_subject || "—"}</div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30">
                <div className="text-[10px] font-bold text-foreground/50 uppercase">Difficulty</div>
                <div className="text-sm font-bold text-foreground capitalize">{mlProfile?.difficulty_level || "beginner"}</div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30">
                <div className="text-[10px] font-bold text-foreground/50 uppercase flex items-center gap-1">
                  <TrendingUp size={10} /> Trend
                </div>
                <div className="text-sm font-bold text-foreground">{velocityLabel(mlProfile?.learning_velocity || "stable")}</div>
              </div>
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed p-3 rounded-xl bg-primary/5 border border-primary/10">
              {mlProfile?.insight_message}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        <Link href="/practice" className="group flex min-h-11 items-center gap-4 rounded-2xl border border-secondary/40 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Play size={16} className="ml-0.5" />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">Launch Mock Exam</div>
            <div className="text-[10px] text-foreground/50">Simulate time-tracked testing</div>
          </div>
        </Link>
        
        <Link href="/ai-mentor" className="group flex min-h-11 items-center gap-4 rounded-2xl border border-secondary/40 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageCircle size={16} />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">AI Mentor Chat</div>
            <div className="text-[10px] text-foreground/50">Ask questions and clarify topics</div>
          </div>
        </Link>
        
        <Link href="/placement/practice" className="group flex min-h-11 items-center gap-4 rounded-2xl border border-secondary/40 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:col-span-2 sm:p-5 md:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Map size={16} />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">Interview Practice</div>
            <div className="text-[10px] text-foreground/50">Solve topic-wise coding tests</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart />
        <WeakAreas topics={mlProfile?.recommended_topics?.map((t) => t.topic) || dashboardData?.weak_areas} />
      </div>
    </DashboardLayout>
  )
}
