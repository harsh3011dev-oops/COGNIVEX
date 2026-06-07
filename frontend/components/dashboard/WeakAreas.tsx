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
    <Card className="shadow-sm border-none transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-foreground">Targeted Revision</CardTitle>
        <button className="text-xs text-primary font-medium hover:underline">View All Topics</button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          {displayTopics.map((topic, i) => (
            <div key={i} className="flex gap-4 items-start p-3 rounded-xl bg-card border-none hover:bg-secondary/30 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${topic.color}`}>
                <span className="font-bold text-sm">{topic.name[0]}</span>
              </div>
              <div>
                <div className="font-semibold text-foreground">{topic.name}</div>
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
