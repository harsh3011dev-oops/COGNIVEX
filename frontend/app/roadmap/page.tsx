"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { RoadmapList } from "@/components/roadmap/RoadmapList"
import { getRoadmapProgress } from "@/lib/api"

function RoadmapContent() {
  const [completedCount, setCompletedCount] = React.useState(0)
  const [totalCount, setTotalCount] = React.useState(16) // 16 roadmap items total
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getRoadmapProgress()
        if (Array.isArray(data)) {
          setTotalCount(data.length || 16)
          setCompletedCount(data.filter((item: { completed: boolean }) => item.completed).length)
        }
      } catch (err) {
        console.error("Failed to load roadmap progress:", err)
      } finally {
        setLoading(false)
      }
    }
    loadProgress()
  }, [])

  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Determine current phase from progress
  const getPhaseLabel = (pct: number) => {
    if (pct >= 75) return "Phase 4: Mastery"
    if (pct >= 50) return "Phase 3: Advanced"
    if (pct >= 25) return "Phase 2: Building"
    return "Phase 1: Foundations"
  }

  return (
    <DashboardLayout title="Neural Architect Roadmap">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your curated path to mastering cognitive frameworks. Each milestone is designed to minimize friction and maximize retention.
        </p>
        <div className="inline-flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-full shadow-sm">
          <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
            <span
              className="text-xs font-bold w-full h-full rounded-full border-4 border-primary border-t-transparent absolute -top-1 -left-1"
              style={{ transform: "rotate(45deg)" }}
            ></span>
            <span className="text-[10px] font-bold text-gray-700">
              {loading ? "..." : `${progressPct}%`}
            </span>
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall Progress</div>
            <div className="font-semibold text-gray-900">
              {loading ? "Loading..." : getPhaseLabel(progressPct)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">
        <RoadmapList />
      </div>
    </DashboardLayout>
  )
}

export default function RoadmapPage() {
  return (
    <ProtectedRoute>
      <RoadmapContent />
    </ProtectedRoute>
  )
}
