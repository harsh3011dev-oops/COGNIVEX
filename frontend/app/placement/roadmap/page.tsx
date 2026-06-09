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
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
          <Map size={24} />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Placement Roadmap</h2>
        <p className="text-sm text-foreground/50 leading-relaxed">
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
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
          <div className="relative border-l-2 border-dashed border-secondary/60 ml-4 pl-6 md:pl-10 space-y-12">
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
                  <div className={`absolute -left-[54px] md:-left-[62px] top-1 w-12 h-12 rounded-full flex items-center justify-center border-2 border-background shadow-md ${phase.color}`}>
                    <PhaseIcon size={20} />
                  </div>

                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-foreground mb-1">{phase.phase}</h3>
                    <p className="text-xs text-foreground/50">{phase.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {phase.items.map((item) => {
                      const active = isChecked(phase.phase, item);
                      return (
                        <div
                          key={item}
                          onClick={() => handleToggle(phase.phase, item)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-none shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                            active 
                              ? 'bg-primary/5 ring-1 ring-primary/20 opacity-90' 
                              : 'bg-card hover:bg-secondary/40 text-foreground'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all ${
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
