"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { QuestionCard } from "@/components/practice/QuestionCard"
import { Timer } from "@/components/practice/Timer"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { PdfUploader } from "@/components/ui/PdfUploader"
import { Button } from "@/components/ui/Button"
import { auth } from "@/lib/firebase"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { BASE_URL } from "@/lib/api"
import { useMLProfile, dispatchMLRefetch } from "@/hooks/useMLProfile"
import { BrainCircuit, Loader2 } from "lucide-react"

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <PracticeContent />
    </ProtectedRoute>
  );
}

function difficultyBadgeLabel(level?: string) {
  if (!level) return "Beginner";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function PracticeContent() {
  const { mlProfile } = useMLProfile()
  const [phase, setPhase] = React.useState<"setup" | "generating" | "assessment" | "results">("setup")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [testResults, setTestResults] = React.useState<any>(null)

  // Mock questions for the prototype
  const questions = [
    {
      question: "Which data structure is best for implementing a LIFO (Last-In-First-Out) behavior?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correct: 1,
      topic: "Stacks"
    },
    {
      question: "What is the time complexity of searching an element in a balanced Binary Search Tree?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correct: 2,
      topic: "Trees"
    },
    {
      question: "Which of the following is not a primary constraint in a Relational Database?",
      options: ["Primary Key", "Foreign Key", "Unique Key", "Index Key"],
      correct: 3,
      topic: "DBMS"
    },
    {
      question: "In the context of Operating Systems, what does 'Paging' prevent?",
      options: ["External Fragmentation", "Internal Fragmentation", "Deadlocks", "Starvation"],
      correct: 0,
      topic: "Operating Systems"
    }
  ]

  const handleAnswerSubmit = (idx: number) => {
    const newAnswers = [...answers, idx]
    setAnswers(newAnswers)
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      finishTest(newAnswers)
    }
  }

  const finishTest = async (finalAnswers: number[]) => {
    setIsSubmitting(true)
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const response = await fetch(`${BASE_URL}/practice/submit-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          answers: finalAnswers,
          correct_answers: questions.map(q => q.correct),
          time_taken: 120, // Mock time
          topics: questions.map(q => q.topic)
        })
      })
      
      const data = await response.json()
      setTestResults(data.results)
      dispatchMLRefetch()
      setPhase("results")
    } catch (error) {
      console.error("Submission failed:", error)
      alert("Failed to save results. Backend might be offline.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerate = () => {
    if (!selectedFile) return
    setPhase("generating")
    setTimeout(() => {
      setPhase("assessment")
    }, 2000)
  }

  if (phase === "setup" || phase === "generating") {
    return (
      <DashboardLayout title="Practice Test Setup">
        <div className="mx-auto mt-4 max-w-3xl sm:mt-10">
          <div className="mb-8 text-center sm:mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm sm:mb-6 sm:h-16 sm:w-16">
              <BrainCircuit size={32} />
            </div>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Generate Practice Assessment</h2>
            <p className="mx-auto max-w-lg px-2 text-sm text-foreground/60 sm:px-0">
              Upload any PDF study material. Cognivex AI will analyze the text and generate a targeted practice exam.
            </p>
            {mlProfile && (
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <span>Current Level: {difficultyBadgeLabel(mlProfile.difficulty_level)} 🎯</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-secondary/20 bg-card p-4 shadow-sm sm:rounded-3xl sm:p-8">
            <PdfUploader onFileSelect={setSelectedFile} className="mb-6 sm:mb-8" />
            
            <div className="flex justify-stretch sm:justify-end">
              <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={!selectedFile || phase === "generating"}
                className="h-11 w-full min-w-0 sm:min-w-[200px] sm:w-auto"
              >
                {phase === "generating" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  "Generate Practice Test"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (phase === "results") {
    if (!testResults) {
      return (
        <DashboardLayout title="Error">
          <div className="mx-auto mt-4 max-w-2xl rounded-2xl bg-card p-5 text-center shadow-sm sm:mt-10 sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-red-600 sm:text-2xl">Submission Failed</h2>
            <p className="mb-6 text-sm opacity-60 sm:text-base">Your results couldn&apos;t be saved to the database. Please ensure you&apos;ve run the SQL migration in Supabase.</p>
            <Button onClick={() => window.location.href = '/dashboard'} className="h-11 w-full">
              Back to Dashboard
            </Button>
          </div>
        </DashboardLayout>
      )
    }

    return (
      <DashboardLayout title="Test Results">
        <div className="mx-auto mt-4 max-w-2xl rounded-2xl bg-card p-5 text-center shadow-sm sm:mt-10 sm:rounded-3xl sm:p-8">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Test Completed!</h2>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="rounded-2xl bg-secondary/10 p-5 sm:p-6">
              <div className="text-sm font-medium text-foreground/60">Score</div>
              <div className="text-3xl font-bold text-primary sm:text-4xl">{testResults?.score || 0}%</div>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-5 sm:p-6">
              <div className="text-sm font-medium text-foreground/60">Correct</div>
              <div className="text-3xl font-bold text-green-600 sm:text-4xl">
                {testResults?.correctCount || 0}/{testResults?.total || 0}
              </div>
            </div>
          </div>
          
          {testResults.weakAreas.length > 0 && (
            <div className="mb-8 text-left">
              <h3 className="font-semibold mb-3">Weak Areas Detected:</h3>
              <div className="flex flex-wrap gap-2">
                {testResults.weakAreas.map((area: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => window.location.href = '/dashboard'} className="h-11 w-full">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Practice Assessment">
      {mlProfile && (
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary sm:py-1.5">
            Adaptive Level: {difficultyBadgeLabel(mlProfile.difficulty_level)} 🎯
          </span>
        </div>
      )}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border-none bg-card p-4 shadow-inner drop-shadow-sm sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="w-full min-w-0 sm:w-1/2">
          <div className="mb-3 flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-foreground/60 sm:flex-row sm:justify-between">
            <span className="truncate">{selectedFile?.name || "Reasoning & Logic"}</span>
            <span className="shrink-0 text-primary">Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <ProgressBar value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
        <div className="flex justify-center sm:justify-end">
          <Timer initialMinutes={30} />
        </div>
      </div>

      <div className="rounded-2xl border-none bg-card p-4 shadow-sm shadow-secondary/50 sm:rounded-3xl sm:p-8 md:p-12">
        <QuestionCard 
          question={questions[currentQuestionIndex].question}
          options={questions[currentQuestionIndex].options}
          onSubmit={handleAnswerSubmit}
          disabled={isSubmitting}
        />
      </div>
    </DashboardLayout>
  )
}
