"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { QuestionCard } from "@/components/practice/QuestionCard"
import { Timer } from "@/components/practice/Timer"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { PdfUploader } from "@/components/ui/PdfUploader"
import { Button } from "@/components/ui/Button"
import { BrainCircuit, Loader2 } from "lucide-react"

export default function PracticePage() {
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
      const response = await fetch('http://localhost:5000/practice/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          correct_answers: questions.map(q => q.correct),
          time_taken: 120, // Mock time
          topics: questions.map(q => q.topic)
        })
      })
      
      const data = await response.json()
      setTestResults(data.results)
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
        <div className="max-w-3xl mx-auto mt-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
              <BrainCircuit size={32} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Generate Practice Assessment</h2>
            <p className="text-foreground/60 max-w-lg mx-auto">
              Upload any PDF study material. Cognivex AI will analyze the text and generate a targeted practice exam.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-sm border border-secondary/20">
            <PdfUploader onFileSelect={setSelectedFile} className="mb-8" />
            
            <div className="flex justify-end">
              <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={!selectedFile || phase === "generating"}
                className="w-full sm:w-auto min-w-[200px]"
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
          <div className="max-w-2xl mx-auto mt-10 p-8 bg-card rounded-3xl shadow-sm text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Submission Failed</h2>
            <p className="mb-6 opacity-60">Your results couldn't be saved to the database. Please ensure you've run the SQL migration in Supabase.</p>
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </DashboardLayout>
      )
    }

    return (
      <DashboardLayout title="Test Results">
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-card rounded-3xl shadow-sm text-center">
          <h2 className="text-3xl font-bold mb-6">Test Completed!</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-secondary/10 rounded-2xl">
              <div className="text-sm font-medium text-foreground/60">Score</div>
              <div className="text-4xl font-bold text-primary">{testResults?.score || 0}%</div>
            </div>
            <div className="p-6 bg-secondary/10 rounded-2xl">
              <div className="text-sm font-medium text-foreground/60">Correct</div>
              <div className="text-4xl font-bold text-green-600">
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

          <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Practice Assessment">
      <div className="flex justify-between items-center mb-8 bg-card p-5 rounded-2xl border-none drop-shadow-sm shadow-inner">
        <div className="w-1/2">
          <div className="flex justify-between text-xs font-bold text-foreground/60 mb-3 uppercase tracking-wider">
            <span>{selectedFile?.name || "Reasoning & Logic"}</span>
            <span className="text-primary">Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <ProgressBar value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
        <Timer initialMinutes={30} />
      </div>

      <div className="bg-card p-8 md:p-12 rounded-3xl border-none shadow-sm shadow-secondary/50">
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
