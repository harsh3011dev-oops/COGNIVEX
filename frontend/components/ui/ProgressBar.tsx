import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 100
  label?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, label, className, ...props }, ref) => {
    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {label && (
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
            <span>{label}</span>
            <span>{Math.round(value)}%</span>
          </div>
        )}
        <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
