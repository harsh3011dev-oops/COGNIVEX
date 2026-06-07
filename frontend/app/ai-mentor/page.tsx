"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ChatBox } from "@/components/ai/ChatBox"
import { useSearchParams } from "next/navigation"
import * as React from "react"

export default function AiMentorPage() {
  const searchParams = useSearchParams();
  const topic = searchParams?.get("topic") || "";
  const subject = searchParams?.get("subject") || "";
  const query = searchParams?.get("query") || "";

  return (
    <DashboardLayout title="AI Mentor">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <ChatBox initialTopic={topic} initialSubject={subject} initialQuery={query} />
      </div>
    </DashboardLayout>
  )
}
