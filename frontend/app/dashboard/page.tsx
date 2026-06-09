"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { WeakAreas } from "@/components/dashboard/WeakAreas"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import Link from "next/link"
import { Play, MessageCircle, Map, BookOpen, Flame, Check, Sparkles, BookOpenCheck } from "lucide-react"
import { getDashboard, getTopicProgress, getRoadmapProgress } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [topicProgress, setTopicProgress] = React.useState<any[]>([]);
  const [roadmapProgress, setRoadmapProgress] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Local state for Today's Focus checklist
  const [focusTasks, setFocusTasks] = React.useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = React.useState<string[]>([]);
  const [localStreak, setLocalStreak] = React.useState(0);

  React.useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboardData(data);
        setLocalStreak(data?.streak || 0);
        
        // Generate Today's Focus based on weak areas
        const wa = data?.weak_areas || [];
        const tasks = [];
        if (wa.includes("Stacks") || wa.includes("Arrays")) {
          tasks.push("Revise Arrays & Strings (DSA)");
        } else {
          tasks.push("Revise Stack & Queue basics");
        }
        if (wa.includes("DBMS")) {
          tasks.push("Practice SQL Queries");
        } else {
          tasks.push("Explore Normalization Rules");
        }
        tasks.push("Review Process Management in OS");
        setFocusTasks(tasks);

      } catch (error) {
        console.error("Failed to fetch dashboard data, using local storage fallback:", error);
        // Fallback mock loading
        const onboardingSaved = localStorage.getItem("cognivex_onboarding");
        const onboarding = onboardingSaved ? JSON.parse(onboardingSaved) : null;
        
        setDashboardData({
          score: 72,
          speed: 84,
          accuracy: 68,
          confidence: 92,
          weak_areas: ["Stacks", "DBMS"],
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
        setFocusTasks([
          "Revise Arrays & Strings (DSA)",
          "Practice SQL Queries",
          "Review Process Management in OS"
        ]);
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
      // Increment streak if all done
      if (nextCompleted.length === focusTasks.length) {
        setLocalStreak(prev => prev + 1);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const goal = dashboardData?.goal || "Both";
  
  // Compute semester stats
  const totalExamTopics = 36;
  const completedExamTopics = topicProgress.filter(t => t.completed).length;
  const subjectCompletion = topicProgress.length > 0 ? Math.round((completedExamTopics / totalExamTopics) * 100) : (dashboardData?.subject_completion_pct || 0);

  // Compute placement stats
  const totalRoadmapItems = 16;
  const completedRoadmapItems = roadmapProgress.filter(r => r.completed).length;
  const roadmapCompletion = roadmapProgress.length > 0 ? Math.round((completedRoadmapItems / totalRoadmapItems) * 100) : (dashboardData?.roadmap_completion_pct || 0);

  return (
    <DashboardLayout title="Dashboard">
      
      {/* 1. Header Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            {dashboardData?.semester} Semester • Goal: {goal}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-2 mb-1">Sanctuary of Learning</h2>
          <p className="text-sm opacity-90">Exactly what you need to master for exams and placement screening.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
          <Flame size={20} className="fill-white animate-pulse" />
          <span className="font-bold text-sm">{localStreak} Day Streak</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Card: StatsCard (Learning Intelligence) */}
        <StatsCard data={dashboardData} />

        {/* Center Card: Goal-Based Completion Progress */}
        <Card className="shadow-sm border-none bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpenCheck size={16} className="text-primary" />
              <span>Target Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 flex flex-col justify-between h-[80%]">
            {/* Conditional Display for Exams */}
            {(goal === "Ace Semester Exams" || goal === "Both") && (
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2">
                  <span>Semester Subject Completion</span>
                  <span>{subjectCompletion}%</span>
                </div>
                <ProgressBar value={subjectCompletion} className="h-2.5 rounded-full" />
                <div className="text-[10px] text-foreground/50 mt-1 font-semibold">
                  Recommended next: <span className="text-primary">{dashboardData?.next_recommended_subject}</span>
                </div>
              </div>
            )}

            {/* Conditional Display for Placements */}
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

        {/* Right Card: Simplified Today's Focus Card */}
        <Card className="shadow-sm border-none bg-card hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Today's Focus</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3">
            {focusTasks.map((task) => {
              const isDone = completedTasks.includes(task);
              return (
                <div 
                  key={task}
                  onClick={() => handleToggleTask(task)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                    isDone 
                      ? 'bg-primary/5 opacity-70' 
                      : 'bg-secondary/40 hover:bg-secondary/70'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    isDone ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-transparent'
                  }`}>
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className={`text-xs font-semibold ${isDone ? 'line-through text-foreground/40' : 'text-foreground/85'}`}>
                    {task}
                  </span>
                </div>
              )
            })}
            {completedTasks.length === focusTasks.length && (
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles size={10} />
                <span>Focus Completed! Streak saved</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/practice" className="flex items-center gap-4 p-5 bg-card rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border border-secondary/40">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Play size={16} className="ml-0.5" />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">Launch Mock Exam</div>
            <div className="text-[10px] text-foreground/50">Simulate time-tracked testing</div>
          </div>
        </Link>
        
        <Link href="/ai-mentor" className="flex items-center gap-4 p-5 bg-card rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border border-secondary/40">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <MessageCircle size={16} />
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">AI Mentor Chat</div>
            <div className="text-[10px] text-foreground/50">Ask questions and clarify topics</div>
          </div>
        </Link>
        
        <Link href="/placement/practice" className="flex items-center gap-4 p-5 bg-card rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border border-secondary/40">
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
        <WeakAreas topics={dashboardData?.weak_areas} />
      </div>
    </DashboardLayout>
  )
}
