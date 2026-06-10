import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function ProgressChart() {
  return (
    <Card className="flex flex-col border-none shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-foreground">Weekly Improvement</CardTitle>
          <span className="shrink-0 text-xs text-foreground/40">Last 7 Days</span>
        </div>
        <p className="text-xs text-foreground/60">Averaged across all subjects</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end p-4 pt-0 sm:p-6">
        <div className="overflow-x-auto -mx-1 px-1 pb-1">
          <div className="relative flex h-32 min-w-[280px] w-full items-end justify-between gap-2">
            <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
              <div className="w-full border-b border-input/30"></div>
              <div className="w-full border-b border-input/30"></div>
              <div className="w-full border-b border-input/30"></div>
            </div>
            
            {[30, 45, 40, 60, 55, 75, 80].map((height, i) => (
              <div key={i} className="group relative z-10 flex h-full w-full min-w-[28px] flex-col justify-end">
                <div 
                  className="w-full rounded-t-md bg-secondary transition-colors duration-300 group-hover:bg-primary"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="mt-2 text-center text-[10px] font-medium text-foreground/40 group-hover:text-foreground">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
