"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { BrainCircuit, Sparkles, Building, Bookmark } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const practiceQuestions = [
  {
    id: 1,
    title: "Two Sum Problem",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    diffColor: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
    companies: ["Google", "Amazon", "Meta"],
    prompt: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. What is the time and space complexity of the optimal O(n) solution?"
  },
  {
    id: 2,
    title: "Reverse a Linked List",
    category: "Linked Lists",
    difficulty: "Medium",
    diffColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
    companies: ["Microsoft", "Amazon", "Netflix"],
    prompt: "Given the head of a singly linked list, reverse the list, and return the reversed list. Walk me through the iterative and recursive methods with space-complexity analysis."
  },
  {
    id: 3,
    title: "LRU Cache Design",
    category: "Data Structures (Advanced)",
    difficulty: "Hard",
    diffColor: "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400",
    companies: ["Google", "Uber", "Apple"],
    prompt: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. How do double-linked lists and hash-maps work together to provide O(1) fetch and insert?"
  },
  {
    id: 4,
    title: "Nth Highest Salary SQL Query",
    category: "DBMS & Databases",
    difficulty: "Medium",
    diffColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
    companies: ["Oracle", "Goldman Sachs", "TCS"],
    prompt: "Write a SQL query to find the Nth highest salary from an Employee table. Explain the query performance using indexes, CTEs, and dense_rank window functions."
  },
  {
    id: 5,
    title: "CPU Scheduling & Starvation",
    category: "Operating Systems",
    difficulty: "Medium",
    diffColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
    companies: ["Intel", "Qualcomm", "Cisco"],
    prompt: "What is thread starvation in CPU scheduling? Compare Round Robin, Shortest Job First, and Priority Scheduling. How does aging prevent thread starvation?"
  },
  {
    id: 6,
    title: "TCP 3-Way Handshake Protocol",
    category: "Computer Networks",
    difficulty: "Easy",
    diffColor: "text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400",
    companies: ["Cisco", "Cloudflare", "Jio"],
    prompt: "Explain how the TCP 3-Way Handshake establishes a reliable connection. What are SYN, SYN-ACK, and ACK packets, and what security vulnerabilities exist at this layer (e.g., SYN flooding)?"
  }
];

export default function PlacementPracticePage() {
  return (
    <ProtectedRoute>
      <PlacementPracticeContent />
    </ProtectedRoute>
  );
}

function PlacementPracticeContent() {
  const router = useRouter();

  const handleSolveWithAI = (q: typeof practiceQuestions[0]) => {
    const query = `I am practicing the placement interview question: "${q.title}" (${q.category}).\n\nProblem context:\n${q.prompt}\n\nPlease explain the optimal approach, provide clean code/diagrams, and give me a quick quiz question to verify my understanding.`;
    router.push(`/ai-mentor?query=${encodeURIComponent(query)}&topic=${encodeURIComponent(q.title)}&subject=${encodeURIComponent(q.category)}`);
  };

  return (
    <DashboardLayout title="Placement Practice">
      <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
          <BrainCircuit size={24} />
        </div>
        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Placement Practice</h2>
        <p className="px-2 text-xs leading-relaxed text-foreground/50 sm:px-0 sm:text-sm">
          Master high-frequency interview questions curated from placement tests. Click **Solve with AI** to get interactive, guided solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {practiceQuestions.map((q, index) => {
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border border-secondary/40 shadow-sm hover:shadow-md transition-all duration-300 bg-card h-full flex flex-col justify-between">
                <CardContent className="flex h-full min-h-[240px] flex-col justify-between p-4 sm:min-h-[260px] sm:p-6">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                        {q.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${q.diffColor}`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <h3 className="mb-2 flex items-start gap-2 text-base font-bold text-foreground sm:text-lg">
                      <Bookmark size={16} className="text-foreground/40" />
                      {q.title}
                    </h3>
                    <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                      {q.prompt.substring(0, 140)}...
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-5">
                      <span className="text-[10px] font-bold text-foreground/40 flex items-center gap-1">
                        <Building size={10} />
                        TESTED IN:
                      </span>
                      {q.companies.map((comp) => (
                        <span key={comp} className="text-[10px] font-semibold bg-secondary/80 border border-secondary text-foreground/60 px-2 py-0.5 rounded-full">
                          {comp}
                        </span>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleSolveWithAI(q)}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs text-primary-foreground shadow-sm hover:bg-primary/95"
                    >
                      <Sparkles size={14} />
                      <span>Solve with AI Mentor</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
