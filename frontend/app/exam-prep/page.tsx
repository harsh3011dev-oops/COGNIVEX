"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { getTopicProgress } from "@/lib/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Link from "next/link"
import { Code, Cpu, Database, Network, Box, Layers, ArrowRight, BookOpen } from "lucide-react"

const subjects = [
  {
    slug: "dsa",
    name: "Data Structures & Algorithms",
    icon: Code,
    desc: "Trees, Graphs, DP, Stacks, and Algorithmic Analysis.",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-100"
  },
  {
    slug: "os",
    name: "Operating Systems",
    icon: Cpu,
    desc: "Process Management, CPU Scheduling, Deadlocks, and Paging.",
    color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-100"
  },
  {
    slug: "dbms",
    name: "Database Management Systems",
    icon: Database,
    desc: "SQL, Normalization, Joins, Transactions, and ER Models.",
    color: "from-green-500/10 to-emerald-500/10 text-green-600 border-green-100"
  },
  {
    slug: "cn",
    name: "Computer Networks",
    icon: Network,
    desc: "OSI Layers, TCP/IP, IP Routing, Subnetting, and DNS.",
    color: "from-teal-500/10 to-cyan-500/10 text-teal-600 border-teal-100"
  },
  {
    slug: "oop",
    name: "Object Oriented Programming",
    icon: Box,
    desc: "Inheritance, Polymorphism, Abstraction, Classes, and Interfaces.",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100"
  },
  {
    slug: "se",
    name: "Software Engineering",
    icon: Layers,
    desc: "SDLC Models, Agile, System Architecture, and Design Patterns.",
    color: "from-red-500/10 to-rose-500/10 text-red-600 border-red-100"
  }
];

export default function ExamPrepPage() {
  return (
    <ProtectedRoute>
      <ExamPrepContent />
    </ProtectedRoute>
  );
}

function ExamPrepContent() {
  const [topicProgress, setTopicProgress] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getTopicProgress();
        setTopicProgress(data || []);
      } catch (err) {
        console.error("Failed to load progress from backend, using localStorage fallback...", err);
        const saved = localStorage.getItem("cognivex_topic_progress");
        if (saved) {
          setTopicProgress(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  const getSubjectCompletion = (subjectName: string) => {
    const completed = topicProgress.filter(t => t.subject === subjectName && t.completed).length;
    return Math.round((completed / 6) * 100);
  };

  return (
    <DashboardLayout title="Semester Exam Prep">
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
          <BookOpen size={24} />
        </div>
        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Semester Exam Prep Hub</h2>
        <p className="px-2 text-xs leading-relaxed text-foreground/50 sm:px-0 sm:text-sm">
          Master core engineering subjects. Complete all 6 topics per subject to score high in your semester assessments.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub, i) => {
            const completion = getSubjectCompletion(sub.name);
            return (
              <motion.div
                key={sub.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link href={`/exam-prep/${sub.slug}`} className="group block h-full">
                  <Card className="h-full border border-secondary/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card overflow-hidden">
                    <CardContent className="flex h-full min-h-[220px] flex-col justify-between p-4 sm:min-h-[250px] sm:p-6">
                      <div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center mb-4 border`}>
                          <sub.icon size={22} />
                        </div>
                        <h3 className="mb-2 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-foreground/60 leading-relaxed mb-6">
                          {sub.desc}
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-2 text-xs font-bold text-foreground/75 uppercase tracking-wider">
                          <span>Progress</span>
                          <span>{completion}%</span>
                        </div>
                        <ProgressBar value={completion} className="mb-4" />
                        <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all mt-2">
                          <span>Explore Topics</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
