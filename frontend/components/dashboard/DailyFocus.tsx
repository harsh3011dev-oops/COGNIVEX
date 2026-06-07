"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { CheckCircle2, Circle, Flame, Check } from "lucide-react"
import { getDailyFocus, completeDailyTask } from "@/lib/api"

export function DailyFocus() {
  const [data, setData] = useState<{tasks: string[], completed_tasks: string[], streak: number} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const result = await getDailyFocus();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task: string) => {
    if (data?.completed_tasks.includes(task)) return;

    // Optimistic update
    const prevData = data;
    if (data) {
        setData({
            ...data,
            completed_tasks: [...data.completed_tasks, task]
        });
    }

    try {
      const result = await completeDailyTask(task);
      setData(result);
    } catch (err) {
      console.error("Failed to complete task", err);
      setData(prevData); // rollback
    }
  };

  if (loading) return (
    <Card className="bg-card shadow-sm animate-pulse">
        <CardContent className="p-6 h-48 flex items-center justify-center">
            <div className="text-foreground/40 font-medium">Loading focus...</div>
        </CardContent>
    </Card>
  );

  const tasks = data?.tasks || [];
  const completed = data?.completed_tasks || [];
  const streak = data?.streak || 0;

  return (
    <Card className="bg-card border shadow-sm h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full text-orange-600 dark:text-orange-400 font-bold text-sm shadow-sm">
            <Flame size={14} className="fill-orange-600 dark:fill-orange-400 animate-pulse" />
            <span>{streak} Day Streak</span>
        </div>
      </div>

      <CardContent className="p-6 pt-10">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Today's Focus</h3>
                <p className="text-xs text-foreground/60">Complete tasks to maintain your {streak}-day streak!</p>
            </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task, i) => {
            const isDone = completed.includes(task);
            return (
              <div 
                key={i} 
                onClick={() => handleToggle(task)}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer border ${
                    isDone 
                        ? 'bg-primary/5 border-primary/20 opacity-70' 
                        : 'bg-foreground/5 border-transparent hover:bg-foreground/10'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    isDone ? 'bg-primary text-white' : 'bg-white border-2 border-foreground/10 text-transparent'
                }`}>
                    <Check size={14} strokeWidth={3} />
                </div>
                <span className={`text-sm font-medium transition-all ${
                    isDone ? 'line-through text-foreground/50' : 'text-foreground'
                }`}>
                  {task}
                </span>
              </div>
            )
          })}
        </div>

        {completed.length === tasks.length && tasks.length > 0 && (
            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm animate-bounce">
                <CheckCircle2 size={16} />
                <span>All tasks done! Streak saved 🔥</span>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
