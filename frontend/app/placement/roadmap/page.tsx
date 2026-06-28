"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { getRoadmapProgress, saveRoadmapProgress } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Check, Flame, Map, BookOpen, Compass, Shield } from "lucide-react"

const roadmapPhases = [
  {
    phase: "Phase 1: DSA Basics",
    desc: "Build strong logic foundations with core linear data structures.",
    items: ["Arrays", "Strings", "LinkedList", "Stack", "Queue"],
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600 border-blue-200"
  },
  {
    phase: "Phase 2: DSA Advanced",
    desc: "Tackle non-linear structures and dynamic optimization techniques.",
    items: ["Trees", "Graphs", "DP", "Recursion"],
    icon: Compass,
    color: "bg-purple-100 text-purple-600 border-purple-200"
  },
  {
    phase: "Phase 3: Core CS",
    desc: "Master operating systems, databases, and network architectures.",
    items: ["OS concepts", "DBMS concepts", "CN concepts", "OOP concepts"],
    icon: Shield,
    color: "bg-emerald-100 text-emerald-600 border-emerald-200"
  },
  {
    phase: "Phase 4: Soft Skills",
    desc: "Ace behavioral interviews, resume building, and speaking.",
    items: ["Resume tips", "HR questions", "Communication"],
    icon: Flame,
    color: "bg-amber-100 text-amber-600 border-amber-200"
  }
];

export default function PlacementRoadmapPage() {
  return (
    <ProtectedRoute>
      <PlacementRoadmapContent />
    </ProtectedRoute>
  );
}

function PlacementRoadmapContent() {
  const [completedItems, setCompletedItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadRoadmapProgress() {
      try {
        const data = await getRoadmapProgress();
        setCompletedItems(data || []);
      } catch (err) {
        console.error("Failed to load roadmap progress, reading local storage fallback...", err);
        const saved = localStorage.getItem("cognivex_roadmap_progress");
        if (saved) {
          setCompletedItems(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    }
    loadRoadmapProgress();
  }, []);

  const totalItemsCount = 16; // 5 + 4 + 4 + 3 = 16
  const completedCount = completedItems.filter(item => item.completed).length;
  const overallPercentage = Math.round((completedCount / totalItemsCount) * 100);

  const handleToggle = async (phaseName: string, itemName: string) => {
    const isCompleted = completedItems.some(i => i.phase === phaseName && i.item === itemName && i.completed);
    const updatedCompleted = !isCompleted;

    // Optimistic UI state update
    const updated = [...completedItems];
    const index = updated.findIndex(i => i.phase === phaseName && i.item === itemName);
    if (index > -1) {
      updated[index].completed = updatedCompleted;
    } else {
      updated.push({ phase: phaseName, item: itemName, completed: updatedCompleted });
    }
    setCompletedItems(updated);
    localStorage.setItem("cognivex_roadmap_progress", JSON.stringify(updated));

    try {
      await saveRoadmapProgress(phaseName, itemName, updatedCompleted);
    } catch (err) {
      console.error("Failed to sync roadmap checklist with DB:", err);
    }
  };

  const isChecked = (phaseName: string, itemName: string) => {
    return completedItems.some(i => i.phase === phaseName && i.item === itemName && i.completed);
  };

  return (
    <DashboardLayout title="Placement Roadmap">
      <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
          <Map size={24} />
        </div>
        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Placement Roadmap</h2>
        <p className="px-2 text-xs leading-relaxed text-foreground/50 sm:px-0 sm:text-sm">
          Follow this structured pathway to transition from academic engineering basics to landing your dream product or service sector offer.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overall Progress Meter */}
          <Card className="border border-secondary/40 shadow-sm bg-card">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-foreground">Roadmap Completion</span>
                  <span className="text-lg font-bold text-primary">{overallPercentage}%</span>
                </div>
                <ProgressBar value={overallPercentage} className="h-3 rounded-full" />
              </div>
              <div className="shrink-0 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 text-center">
                <div className="text-2xl font-bold text-primary">{completedCount} / {totalItemsCount}</div>
                <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Milestones Clear</div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Checklist Steps */}
          <div className="relative ml-2 space-y-8 overflow-hidden border-l-2 border-dashed border-secondary/60 pl-6 sm:ml-3 sm:space-y-10 sm:pl-8 md:ml-4 md:space-y-12 md:pl-10">
            {roadmapPhases.map((phase, pIdx) => {
              const PhaseIcon = phase.icon;
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: pIdx * 0.08 }}
                  className="relative"
                >
                  {/* Phase Marker Icon */}
                  <div className={`absolute -left-[38px] top-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background shadow-md sm:-left-[46px] sm:h-10 sm:w-10 md:-left-[54px] md:h-12 md:w-12 ${phase.color}`}>
                    <PhaseIcon size={18} />
                  </div>

                  <div className="mb-3">
                    <h3 className="mb-1 text-lg font-bold text-foreground sm:text-xl">{phase.phase}</h3>
                    <p className="text-xs text-foreground/50">{phase.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {phase.items.map((item) => {
                      const active = isChecked(phase.phase, item);
                      return (
                        <div
                          key={item}
                          onClick={() => handleToggle(phase.phase, item)}
                          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-none p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                            active 
                              ? 'bg-primary/5 ring-1 ring-primary/20 opacity-90' 
                              : 'bg-card hover:bg-secondary/40 text-foreground'
                          }`}
                        >
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            active 
                              ? 'bg-primary border-primary text-white' 
                              : 'bg-white border-gray-200 text-transparent'
                          }`}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span className={`text-sm font-semibold ${active ? 'line-through text-foreground/50' : 'text-foreground'}`}>
                            {item}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
