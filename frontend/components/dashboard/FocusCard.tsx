import { Card, CardContent } from "@/components/ui/Card"

interface FocusCardProps {
  data?: {
    current_focus: string;
    days_left: number;
    last_test_score: number;
  } | null;
}

export function FocusCard({ data }: FocusCardProps) {
  const focus = data?.current_focus || "DSA 60-Day Plan";
  const daysLeft = data?.days_left || 14;
  const lastScore = data?.last_test_score || 0;

  return (
    <Card className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-none overflow-hidden relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/30 cursor-pointer">
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
      <CardContent className="p-6 relative z-10">
        <div className="text-xs font-semibold text-primary-foreground/80 mb-1 tracking-wider uppercase">Active Roadmap</div>
        <h3 className="text-2xl font-bold mb-8">{focus}</h3>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider font-semibold">Latest Test Score</div>
            <div className="font-semibold text-primary-foreground text-xl">{lastScore}%</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold tracking-tighter">{daysLeft}</div>
            <div className="text-xs text-primary-foreground/80 font-medium">Days Left</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
