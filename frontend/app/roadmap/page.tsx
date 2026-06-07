import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { RoadmapList } from "@/components/roadmap/RoadmapList"

export default function RoadmapPage() {
  return (
    <DashboardLayout title="Neural Architect Roadmap">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your curated path to mastering cognitive frameworks. Each milestone is designed to minimize friction and maximize retention.
        </p>
        <div className="inline-flex items-center gap-4 bg-white border border-gray-100 px-6 py-3 rounded-full shadow-sm">
          <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
            <span className="text-xs font-bold w-full h-full rounded-full border-4 border-primary border-t-transparent absolute -top-1 -left-1" style={{ transform: "rotate(45deg)" }}></span>
            <span className="text-[10px] font-bold text-gray-700">65%</span>
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall Progress</div>
            <div className="font-semibold text-gray-900">Phase 2: Mastery</div>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">
        <RoadmapList />
      </div>
    </DashboardLayout>
  )
}
