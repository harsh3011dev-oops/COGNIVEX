import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface WeakAreasProps {
  topics?: string[];
}

export function WeakAreas({ topics = [] }: WeakAreasProps) {
  // If no real topics yet, show a placeholder message or the default mock
  const displayTopics = topics.length > 0 
    ? topics.map(name => ({ 
        name, 
        focus: "Review related concepts", 
        priority: "Needs Work", 
        color: "text-red-600 bg-red-50" 
      }))
    : [
        { name: "No Data Yet", focus: "Complete a practice test to see results", priority: "N/A", color: "text-blue-600 bg-blue-50" }
      ];

  return (
    <Card className="border-none shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">Targeted Revision</CardTitle>
        <button type="button" className="min-h-11 shrink-0 px-2 text-xs font-medium text-primary hover:underline">View All</button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 text-sm">
          {displayTopics.map((topic, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border-none bg-card p-3 transition-colors hover:bg-secondary/30 sm:gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${topic.color}`}>
                <span className="font-bold text-sm">{topic.name[0]}</span>
              </div>
              <div>
                <div className="break-words font-semibold text-foreground">{topic.name}</div>
                <div className="text-xs text-foreground/60 mb-1">{topic.focus}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {topic.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
