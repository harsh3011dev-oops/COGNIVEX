"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ChatBox } from "@/components/ai/ChatBox"
import { useSearchParams } from "next/navigation"
import * as React from "react"

function AiMentorContent() {
  const searchParams = useSearchParams();
  const topic = searchParams?.get("topic") || "";
  const subject = searchParams?.get("subject") || "";
  const query = searchParams?.get("query") || "";

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <ChatBox initialTopic={topic} initialSubject={subject} initialQuery={query} />
    </div>
  )
}

export default function AiMentorPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="AI Mentor">
        <React.Suspense fallback={<div className="flex items-center justify-center h-full text-foreground/50">Loading AI Mentor...</div>}>
          <AiMentorContent />
        </React.Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
