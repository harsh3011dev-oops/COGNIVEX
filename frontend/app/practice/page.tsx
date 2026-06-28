"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { PdfUploader } from "@/components/ui/PdfUploader"
import { Button } from "@/components/ui/Button"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import {
  getQuestionSubjects,
  getRandomQuestions,
  submitQuiz,
  generateQuizFromPdf,
  type QuestionSubject,
  type QuizQuestion,
  type QuizSubmitResult,
} from "@/lib/api"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/AuthContext"
import { useMLProfile, dispatchMLRefetch } from "@/hooks/useMLProfile"
import {
  BrainCircuit,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BookOpen,
  FileText,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "setup" | "loading" | "quiz" | "results"
type Difficulty = "mixed" | "easy" | "medium" | "hard"

interface AnswerRecord {
  questionId: number | string
  selectedAnswer: number
  timeTaken: number
}

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <PracticeContent />
    </ProtectedRoute>
  )
}

function QuestionTimer({
  seconds,
  onExpire,
  resetKey,
}: {
  seconds: number
  onExpire: () => void
  resetKey: number
}) {
  const [timeLeft, setTimeLeft] = React.useState(seconds)
  const expiredRef = React.useRef(false)

  React.useEffect(() => {
    setTimeLeft(seconds)
    expiredRef.current = false
  }, [resetKey, seconds])

  React.useEffect(() => {
    if (timeLeft <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true
        onExpire()
      }
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onExpire])

  const urgent = timeLeft <= 10

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-semibold shadow-sm",
        urgent
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-secondary/40 bg-card text-foreground"
      )}
    >
      <span>{String(Math.floor(timeLeft / 60)).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(timeLeft % 60).padStart(2, "0")}</span>
    </div>
  )
}

function PracticeContent() {
  const { mlProfile } = useMLProfile()
  const { currentUser } = useAuth()
  const [phase, setPhase] = React.useState<Phase>("setup")
  const [subjects, setSubjects] = React.useState<QuestionSubject[]>([])
  const [subjectsLoading, setSubjectsLoading] = React.useState(true)
  const [subjectsError, setSubjectsError] = React.useState<string | null>(null)

  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string>("")
  const [difficulty, setDifficulty] = React.useState<Difficulty>("mixed")
  const [questionCount, setQuestionCount] = React.useState<number>(10)
  const [setupError, setSetupError] = React.useState<string | null>(null)
  const [quizError, setQuizError] = React.useState<string | null>(null)

  const [questions, setQuestions] = React.useState<QuizQuestion[]>([])
  const [isPdfQuiz, setIsPdfQuiz] = React.useState(false)
  const [pdfCorrectMap, setPdfCorrectMap] = React.useState<Record<number, number>>({})
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const selectedOptionRef = React.useRef<number | null>(null)
  const currentIndexRef = React.useRef(0)
  const questionsRef = React.useRef<QuizQuestion[]>([])
  const answersRef = React.useRef<AnswerRecord[]>([])
  const questionStartRef = React.useRef(Date.now())
  const isPdfQuizRef = React.useRef(false)
  const pdfCorrectMapRef = React.useRef<Record<number, number>>({})
  const isAdvancingRef = React.useRef(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [results, setResults] = React.useState<QuizSubmitResult | null>(null)

  const [showPdfSection, setShowPdfSection] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [pdfLoading, setPdfLoading] = React.useState(false)
  const [pdfError, setPdfError] = React.useState<string | null>(null)
  const [pdfQuestionCount, setPdfQuestionCount] = React.useState<number>(5)
  const [pdfSubjectId, setPdfSubjectId] = React.useState<string>("")
  const [pdfStatus, setPdfStatus] = React.useState<"idle" | "uploading" | "generating" | "error">("idle")

  React.useEffect(() => {
    if (!currentUser) {
      return
    }

    async function loadSubjects() {
      setSubjectsLoading(true)
      setSubjectsError(null)
      try {
        const data = await getQuestionSubjects()
        setSubjects(data)
        if (data.length > 0) {
          setSelectedSubjectId(String(data[0].id))
          setPdfSubjectId(String(data[0].id))
        }
      } catch (err) {
        setSubjects([])
        setSubjectsError(err instanceof Error ? err.message : "Failed to load subjects")
      } finally {
        setSubjectsLoading(false)
      }
    }

    loadSubjects()
  }, [currentUser])

  React.useEffect(() => {
    selectedOptionRef.current = selectedOption
  }, [selectedOption])

  React.useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  React.useEffect(() => {
    questionsRef.current = questions
  }, [questions])

  React.useEffect(() => {
    isPdfQuizRef.current = isPdfQuiz
  }, [isPdfQuiz])

  React.useEffect(() => {
    pdfCorrectMapRef.current = pdfCorrectMap
  }, [pdfCorrectMap])

  const finishQuiz = React.useCallback(async (finalAnswers: AnswerRecord[]) => {
    const userId = auth.currentUser?.uid
    if (!userId) {
      setQuizError("You must be logged in to submit.")
      isAdvancingRef.current = false
      return
    }

    setIsSubmitting(true)
    setQuizError(null)
    setPhase("loading")

    try {
      const quizQuestions = questionsRef.current

      if (isPdfQuizRef.current) {
        let correctCount = 0
        const map = pdfCorrectMapRef.current
        const review = quizQuestions.map((q, idx) => {
          const ans = finalAnswers[idx]
          const correctAnswer = map[q.id as number] ?? 0
          const isCorrect = ans?.selectedAnswer === correctAnswer
          if (isCorrect) correctCount += 1
          return {
            questionId: q.id,
            question: q.question,
            options: q.options,
            selectedAnswer: ans?.selectedAnswer ?? -1,
            correctAnswer,
            isCorrect,
            explanation: q.explanation,
            topic_name: q.topic_name,
            difficulty: q.difficulty,
          }
        })

        setResults({
          attemptId: "pdf-local",
          score: Math.round((correctCount / quizQuestions.length) * 100),
          correctCount,
          total: quizQuestions.length,
          accuracy: Math.round((correctCount / quizQuestions.length) * 100),
          review,
        })
        dispatchMLRefetch()
        setPhase("results")
        return
      }

      const submissionPayload = finalAnswers.map((a) => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        timeTaken: a.timeTaken,
      }))

      console.log("Submitting quiz:", { userId, answers: submissionPayload })

      const result = await submitQuiz(userId, submissionPayload)
      setResults(result)
      dispatchMLRefetch()
      setPhase("results")
    } catch (err) {
      console.error("Quiz submission failed:", err)
      setQuizError(err instanceof Error ? err.message : "Failed to submit quiz")
      setPhase("quiz")
    } finally {
      setIsSubmitting(false)
      isAdvancingRef.current = false
    }
  }, [])

  const resetQuizState = () => {
    setQuestions([])
    setIsPdfQuiz(false)
    setPdfCorrectMap({})
    setCurrentIndex(0)
    setSelectedOption(null)
    answersRef.current = []
    setResults(null)
    setSetupError(null)
    setQuizError(null)
    questionStartRef.current = Date.now()
    isAdvancingRef.current = false
  }

  const startBankQuiz = async () => {
    if (!selectedSubjectId) {
      setSetupError("Please select a subject.")
      return
    }

    setSetupError(null)
    setPhase("loading")

    try {
      const data = await getRandomQuestions({
        subject: parseInt(selectedSubjectId, 10),
        count: questionCount,
        difficulty,
      })

      if (!data.questions.length) {
        throw new Error("No questions found for this selection.")
      }

      setQuestions(data.questions)
      setIsPdfQuiz(false)
      setPdfCorrectMap({})
      setCurrentIndex(0)
      setSelectedOption(null)
      answersRef.current = []
      setQuizError(null)
      questionStartRef.current = Date.now()
      isAdvancingRef.current = false
      setPhase("quiz")
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : "Failed to start quiz")
      setPhase("setup")
    }
  }

  const startPdfQuiz = async () => {
    if (!selectedFile) return

    setPdfError(null)
    setPdfStatus("uploading")
    setPhase("loading")

    try {
      // Simulate file upload transition visually
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setPdfStatus("generating")

      const subjectName = subjects.find((s) => String(s.id) === pdfSubjectId)?.name || "General"
      const data = await generateQuizFromPdf(selectedFile, {
        questionCount: pdfQuestionCount,
        subject: subjectName,
      })

      const correctMap: Record<number, number> = {}
      const mapped: QuizQuestion[] = (data.questions || []).map((q: any, idx: number) => {
        const id = -(idx + 1)
        correctMap[id] = q.correct
        return {
          id,
          subject_id: parseInt(pdfSubjectId, 10) || 0,
          topic_id: 0,
          topic_name: q.topic || "From PDF",
          question: q.question,
          options: q.options,
          explanation: q.explanation || "",
          difficulty: difficulty === "mixed" ? "medium" : difficulty,
        }
      })

      if (!mapped.length) {
        throw new Error("No questions were generated from this PDF.")
      }

      setQuestions(mapped)
      setPdfCorrectMap(correctMap)
      setIsPdfQuiz(true)
      setCurrentIndex(0)
      setSelectedOption(null)
      answersRef.current = []
      questionStartRef.current = Date.now()
      isAdvancingRef.current = false
      setPdfStatus("idle")
      setPhase("quiz")
    } catch (err) {
      setPdfStatus("error")
      setPdfError(err instanceof Error ? err.message : "PDF quiz generation failed")
      setPhase("setup")
    }
  }

  const recordAnswer = React.useCallback((optionIndex: number) => {
    if (isAdvancingRef.current) return
    isAdvancingRef.current = true

    const timeTaken = Math.round((Date.now() - questionStartRef.current) / 1000)
    const idx = currentIndexRef.current
    const current = questionsRef.current[idx]
    if (!current) {
      isAdvancingRef.current = false
      return
    }

    const record: AnswerRecord = {
      questionId: current.id,
      selectedAnswer: optionIndex,
      timeTaken: Math.min(Math.max(timeTaken, 0), 30),
    }

    const nextAnswers = [...answersRef.current, record]
    answersRef.current = nextAnswers

    if (idx < questionsRef.current.length - 1) {
      setCurrentIndex(idx + 1)
      setSelectedOption(null)
      questionStartRef.current = Date.now()
      isAdvancingRef.current = false
    } else {
      void finishQuiz(nextAnswers)
    }
  }, [finishQuiz])

  const handleNext = () => {
    if (selectedOption === null || isSubmitting) return
    recordAnswer(selectedOption)
  }

  const handleSubmitQuiz = () => {
    handleNext()
  }

  const handleTimerExpire = React.useCallback(() => {
    const choice = selectedOptionRef.current ?? -1
    recordAnswer(choice)
  }, [recordAnswer])

  const handleRetake = () => {
    resetQuizState()
    setPhase("setup")
  }

  if (phase === "loading") {
    return (
      <DashboardLayout title="Practice Quiz">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-foreground/60">
            {pdfStatus === "uploading"
              ? "Uploading PDF..."
              : pdfStatus === "generating"
              ? "AI is generating questions..."
              : isSubmitting
              ? "Submitting your answers..."
              : "Loading questions..."}
          </p>
        </div>
      </DashboardLayout>
    )
  }

  if (phase === "results" && results) {
    return (
      <DashboardLayout title="Quiz Results">
        <div className="mx-auto max-w-3xl xl:max-w-4xl mt-4 sm:mt-8 space-y-6">
          <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-sm text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Quiz Complete</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-secondary/20 p-5">
                <div className="text-xs font-bold uppercase text-foreground/50 mb-1">Score</div>
                <div className="text-3xl font-bold text-primary">
                  {results.correctCount}/{results.total}
                </div>
              </div>
              <div className="rounded-2xl bg-secondary/20 p-5">
                <div className="text-xs font-bold uppercase text-foreground/50 mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-green-600">{results.accuracy}%</div>
              </div>
            </div>
            <ProgressBar value={results.accuracy} className="h-3 mb-2" />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg px-1">Question Review</h3>
            {results.review.map((item, idx) => (
              <div
                key={`${item.questionId}-${idx}`}
                className={cn(
                  "rounded-2xl border p-5 shadow-sm",
                  item.isCorrect
                    ? "border-green-200 bg-green-50/50 dark:bg-green-950/10"
                    : "border-red-200 bg-red-50/50 dark:bg-red-950/10"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  {item.isCorrect ? (
                    <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={20} />
                  ) : (
                    <XCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase text-foreground/40 mb-1">
                      Question {idx + 1}
                      {item.topic_name ? ` · ${item.topic_name}` : ""}
                    </div>
                    <p className="font-semibold text-foreground">{item.question}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 pl-8">
                  {item.options.map((opt, oi) => {
                    const isSelected = item.selectedAnswer === oi
                    const isCorrect = item.correctAnswer === oi
                    return (
                      <div
                        key={oi}
                        className={cn(
                          "rounded-xl px-3 py-2 text-sm border",
                          isCorrect && "border-green-500 bg-green-100/60 font-semibold",
                          isSelected && !isCorrect && "border-red-500 bg-red-100/60",
                          !isSelected && !isCorrect && "border-secondary/30 bg-card"
                        )}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                        {isCorrect && " ✓"}
                        {isSelected && !isCorrect && " ✗"}
                      </div>
                    )
                  })}
                </div>

                {!item.isCorrect && item.selectedAnswer >= 0 && (
                  <p className="text-xs text-foreground/60 pl-8 mb-2">
                    Your answer: {String.fromCharCode(65 + item.selectedAnswer)} · Correct:{" "}
                    {String.fromCharCode(65 + item.correctAnswer)}
                  </p>
                )}

                <p className="text-sm text-foreground/70 pl-8 leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleRetake} variant="outline" className="h-11 flex-1">
              Retake Quiz
            </Button>
            <Button onClick={() => (window.location.href = "/dashboard")} className="h-11 flex-1">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (phase === "quiz" && questions.length > 0) {
    const current = questions[currentIndex]

    return (
      <DashboardLayout title="Practice Quiz">
        <div className="mx-auto max-w-3xl xl:max-w-4xl">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-card p-4 sm:p-5 shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-primary capitalize">{current.difficulty}</span>
              </div>
              <ProgressBar value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
            </div>
            <QuestionTimer
              seconds={30}
              resetKey={currentIndex}
              onExpire={handleTimerExpire}
            />
          </div>

          <div className="rounded-3xl bg-card p-5 sm:p-8 shadow-sm">
            {quizError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-destructive/10 text-destructive p-3 text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{quizError}</span>
              </div>
            )}

            {current.topic_name && (
              <span className="inline-block mb-3 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                {current.topic_name}
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-6">{current.question}</h2>

            <div className="space-y-3 mb-8">
              {current.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  disabled={isSubmitting}
                  className={cn(
                    "flex min-h-11 w-full items-start rounded-xl border p-4 text-left transition-all",
                    selectedOption === idx
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-secondary/40 bg-card hover:border-primary/30 hover:bg-secondary/20"
                  )}
                >
                  <div
                    className={cn(
                      "mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                      selectedOption === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground/50"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm pt-0.5">{option}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={currentIndex < questions.length - 1 ? handleNext : handleSubmitQuiz}
                disabled={selectedOption === null || isSubmitting}
                className="h-11 px-8"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Practice Quiz Setup">
      <div className="mx-auto max-w-3xl xl:max-w-4xl mt-4 sm:mt-8 space-y-6">
        <div className="text-center mb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen size={28} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Question Bank Quiz</h2>
          <p className="text-sm text-foreground/60 mt-2 max-w-lg mx-auto">
            Pick a subject, difficulty, and question count. All questions come from the Cognivex question bank.
          </p>
          {mlProfile && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold capitalize">
              Suggested level: {mlProfile.difficulty_level}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-secondary/20 bg-card p-5 sm:p-8 shadow-sm space-y-6">
          {(subjectsError || setupError) && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/10 text-destructive p-3 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{subjectsError || setupError}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Subject</label>
            {subjectsLoading ? (
              <div className="flex items-center gap-2 text-sm text-foreground/50 h-12">
                <Loader2 size={16} className="animate-spin" /> Loading subjects...
              </div>
            ) : subjects.length === 0 ? (
              <div className="flex h-12 items-center rounded-xl border border-dashed border-input/50 px-4 text-sm text-foreground/50">
                No subjects available
              </div>
            ) : (
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full h-12 rounded-xl border border-input/50 bg-secondary/10 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} className="bg-card text-foreground">
                    {s.name} ({s.topic_count} topics)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Difficulty</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["mixed", "easy", "medium", "hard"] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-semibold capitalize transition-all",
                    difficulty === level
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-secondary/40 hover:bg-secondary/20"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Question Count</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-semibold transition-all",
                    questionCount === count
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-secondary/40 hover:bg-secondary/20"
                  )}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={startBankQuiz}
            disabled={subjectsLoading || !selectedSubjectId}
            className="w-full h-12 text-base font-bold"
          >
            Start Quiz
          </Button>
        </div>

        <div className="rounded-3xl border border-dashed border-secondary/40 bg-card/50 p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setShowPdfSection((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <FileText size={20} />
              </div>
              <div>
                <div className="font-semibold text-sm">Or generate quiz from your notes (PDF)</div>
                <div className="text-xs text-foreground/50">Secondary option · AI-generated from upload</div>
              </div>
            </div>
            <ChevronRight
              size={18}
              className={cn("text-foreground/40 transition-transform", showPdfSection && "rotate-90")}
            />
          </button>

          {showPdfSection && (
            <div className="mt-5 pt-5 border-t border-secondary/30 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Subject Tag</label>
                  {subjectsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-foreground/50 h-11">
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </div>
                  ) : (
                    <select
                      value={pdfSubjectId}
                      onChange={(e) => setPdfSubjectId(e.target.value)}
                      className="w-full h-11 rounded-xl border border-input/50 bg-secondary/10 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id} className="bg-card text-foreground">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Questions Count</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[5, 10, 15].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPdfQuestionCount(count)}
                        className={cn(
                          "h-11 rounded-xl border text-sm font-semibold transition-all",
                          pdfQuestionCount === count
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-secondary/40 hover:bg-secondary/20 bg-card"
                        )}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <PdfUploader onFileSelect={setSelectedFile} />
              
              {pdfError && (
                <div className="flex items-start gap-2 rounded-xl bg-destructive/10 text-destructive p-3 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{pdfError}</span>
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={startPdfQuiz}
                disabled={!selectedFile || pdfStatus !== "idle"}
                className="w-full h-11"
              >
                {pdfStatus === "uploading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading PDF...
                  </>
                ) : pdfStatus === "generating" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI is generating questions...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={16} className="mr-2" />
                    Generate from PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
