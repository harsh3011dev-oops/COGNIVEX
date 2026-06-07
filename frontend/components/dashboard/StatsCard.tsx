import { Card, CardContent } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"

interface StatsCardProps {
  data?: {
    score: number;
    speed: number;
    accuracy: number;
    confidence: number;
  } | null;
}

export function StatsCard({ data }: StatsCardProps) {
  const score = data?.score || 72;
  const speed = data?.speed || 84;
  const accuracy = data?.accuracy || 68;
  const confidence = data?.confidence || 92;

  return (
    <Card className="shadow-sm border-none transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">Learning Intelligence</h3>
        <p className="text-xs text-foreground/60 mb-6">Your cognitive performance index</p>
        
        <div className="flex items-end gap-2 mb-8">
          <span className="text-6xl font-bold text-foreground tracking-tighter">{score}</span>
          <span className="text-sm font-semibold text-foreground/40 mb-2">/100</span>
        </div>
        
        <div className="space-y-4">
          <ProgressBar value={speed} label="Speed" />
          <ProgressBar value={accuracy} label="Accuracy" />
          <ProgressBar value={confidence} label="Confidence" />
        </div>
      </CardContent>
    </Card>
  )
}
