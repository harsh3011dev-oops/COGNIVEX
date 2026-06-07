"use client"

import * as React from "react"
import { Flag } from "lucide-react"

export function Timer({ initialMinutes = 30 }: { initialMinutes?: number }) {
  const [timeLeft, setTimeLeft] = React.useState(initialMinutes * 60)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center gap-4 bg-white border px-4 py-2 rounded-full shadow-sm">
      <div className="font-mono font-medium text-gray-700">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
      <div className="w-px h-4 bg-gray-200"></div>
      <button className="text-gray-400 hover:text-red-500 transition-colors" title="Flag Question">
        <Flag size={16} />
      </button>
    </div>
  )
}
