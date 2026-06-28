import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { WeeklyActivity } from "@/lib/api"

interface ProgressChartProps {
  weeklyData?: WeeklyActivity[];
}

export function ProgressChart({ weeklyData }: ProgressChartProps) {
  // Default to empty 7 days if no data provided
  const data = weeklyData && weeklyData.length > 0
    ? weeklyData
    : Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quizzes_attempted: 0,
        avg_accuracy: 0
      })).reverse();

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get the day index for each data point
  const getHeight = (quizzes: number, maxQuizzes: number) => {
    if (maxQuizzes === 0) return 0;
    return Math.max(10, (quizzes / maxQuizzes) * 100);
  };

  const maxQuizzes = Math.max(...data.map(d => d.quizzes_attempted), 1);

  return (
    <Card className="flex flex-col border-none shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-foreground">Weekly Activity</CardTitle>
          <span className="shrink-0 text-xs text-foreground/40">Last 7 Days</span>
        </div>
        <p className="text-xs text-foreground/60">Quizzes attempted per day</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end p-4 pt-0 sm:p-6">
        <div className="overflow-x-auto -mx-1 px-1 pb-1">
          <div className="relative flex h-32 min-w-[280px] w-full items-end justify-between gap-2">
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
              <div className="w-full border-b border-input/30"></div>
              <div className="w-full border-b border-input/30"></div>
              <div className="w-full border-b border-input/30"></div>
            </div>
            
            {data.map((day, i) => (
              <div key={i} className="group relative z-10 flex h-full w-full min-w-[28px] flex-col justify-end">
                <div 
                  className="w-full rounded-t-md bg-secondary transition-colors duration-300 group-hover:bg-primary flex items-end justify-center pb-1"
                  style={{ height: `${getHeight(day.quizzes_attempted, maxQuizzes)}%` }}
                  title={`${day.quizzes_attempted} quiz${day.quizzes_attempted !== 1 ? 'zes' : ''} • Avg: ${day.avg_accuracy}%`}
                >
                  {day.quizzes_attempted > 0 && (
                    <span className="text-[8px] font-bold text-foreground/60 group-hover:text-white">
                      {day.quizzes_attempted}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center text-[10px] font-medium text-foreground/40 group-hover:text-foreground">
                  {days[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
