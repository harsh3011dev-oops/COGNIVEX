import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"

export function RoadmapList() {
  const weeks = [
    {
      title: "Current Week",
      subtitle: "Focusing on Foundations",
      days: [
        { date: "OCT 12", label: "TODAY", title: "Quantum Logic", isCompleted: false, isCurrent: true },
        { date: "OCT 13", label: "TOMORROW", title: "Neural Networks", isCompleted: false, isCurrent: false },
        { date: "OCT 14", label: "LATER", title: "System Synthesis", isCompleted: false, isCurrent: false },
      ]
    }
  ]

  const foundations = [
    { title: "Structural Cognitive Theory", desc: "Understanding the baseline architectural requirements.", modules: "4 Modules", hours: "12 Hours", status: "passed", isCompleted: true },
    { title: "Dynamic rewiring of dendritic hubs", desc: "Minimizing the topological path length between critical nodes.", modules: "2 Modules", hours: "5 Hours", status: "in progress", isCompleted: false },
  ]

  return (
    <div className="space-y-8">
      {/* Current Week */}
      {weeks.map((week, wIdx) => (
        <section key={wIdx}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
            <h3 className="font-semibold text-gray-900">{week.title}</h3>
          </div>
          
          <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-2">
            {week.days.map((day, dIdx) => (
              <div key={dIdx} className={`relative p-4 rounded-xl border transition-colors ${day.isCurrent ? 'bg-orange-50 border-primary ml-4' : 'bg-white border-gray-100 ml-4 opacity-70'}`}>
                <div className={`absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${day.isCurrent ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded ${day.isCurrent ? 'bg-primary text-white' : 'bg-gray-100'}`}>{day.date}</span>
                      {day.label}
                    </div>
                    <div className={`font-semibold mt-1 ${day.isCurrent ? 'text-gray-900 text-lg' : 'text-gray-600'}`}>{day.title}</div>
                  </div>
                  {day.isCurrent && (
                    <button className="h-8 px-3 rounded-md bg-white border text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm">
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Foundation Layers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-sm">Foundation Layers</h3>
          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Completed</span>
        </div>
        
        <div className="space-y-4">
          {foundations.map((item, i) => (
            <Card key={i} className={`shadow-sm border-gray-100 ${item.isCompleted ? 'bg-gray-50/50' : 'bg-white text-gray-900'}`}>
              <CardContent className="p-5 flex gap-4">
                <div className="shrink-0 mt-1">
                  {item.isCompleted ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <Circle className="text-gray-300 w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold ${item.isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 mb-3">{item.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">{item.modules}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md">{item.hours}</span>
                    <span className="uppercase text-[10px] tracking-wider">{item.status === 'passed' ? 'Final Quiz Passed' : 'In Progress'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
