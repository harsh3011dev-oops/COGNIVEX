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
    <Card className="border-none shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <h3 className="mb-1 text-sm font-semibold text-foreground">Learning Intelligence</h3>
        <p className="mb-4 text-xs text-foreground/60 sm:mb-6">Your cognitive performance index</p>
        
        <div className="mb-6 flex items-end gap-2 sm:mb-8">
          <span className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl">{score}</span>
          <span className="mb-1 text-sm font-semibold text-foreground/40 sm:mb-2">/100</span>
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
