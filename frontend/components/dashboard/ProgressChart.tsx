import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export function ProgressChart() {
  return (
    <Card className="shadow-sm border-none flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Weekly Improvement</CardTitle>
          <span className="text-xs text-foreground/40">Last 7 Days</span>
        </div>
        <p className="text-xs text-foreground/60">Averaged across all subjects</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end p-6 pt-0">
        {/* Simple mock chart using CSS */}
        <div className="h-32 w-full flex items-end justify-between gap-2 relative">
          <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
            <div className="border-b border-input/30 w-full"></div>
            <div className="border-b border-input/30 w-full"></div>
            <div className="border-b border-input/30 w-full"></div>
          </div>
          
          {[30, 45, 40, 60, 55, 75, 80].map((height, i) => (
            <div key={i} className="w-full relative group z-10 flex flex-col justify-end h-full">
              <div 
                className="w-full bg-secondary rounded-t-md group-hover:bg-primary transition-colors duration-300"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-[10px] text-foreground/40 text-center mt-2 font-medium group-hover:text-foreground">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
