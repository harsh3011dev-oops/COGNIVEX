"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, BrainCircuit, MessageSquare, BarChart3, TrendingUp, CheckCircle, Cpu, Target, Award } from "lucide-react";

const successChecklist = [
  "Semester Exam Preparation",
  "DSA Preparation",
  "Mock Tests & Assessments",
  "Placement Practice Problems",
  "24/7 Context-Aware AI Mentor",
  "Progress Tracking Analytics",
  "Weak Area Diagnostic Reports",
  "Personalized Roadmap Pathways",
  "Cognitive Score Scoring Engine",
  "Goal-based Study Planning"
];

const features = [
  {
    icon: BookOpen,
    title: "Semester Exam Prep",
    description: "Master academic subjects with structured study marks, high-weightage topics, and custom redirects.",
    gradient: "from-blue-500/10 to-cyan-500/10 text-blue-400 border-blue-500/20",
    glow: "glow-blue"
  },
  {
    icon: Map,
    title: "Placement Roadmaps",
    description: "Follow customized milestone roadmaps tracking DSA, System Design, and core topics dynamically.",
    gradient: "from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/20",
    glow: "glow-purple"
  },
  {
    icon: BrainCircuit,
    title: "DSA Practice Engine",
    description: "Solve high-frequency coding questions tested at FAANG, complete with interactive AI solutions.",
    gradient: "from-orange-500/10 to-red-500/10 text-orange-400 border-orange-500/20",
    glow: "glow-blue"
  },
  {
    icon: MessageSquare,
    title: "AI Mentor Chat",
    description: "An intelligent study counselor mapped to your academic profile and weak concepts.",
    gradient: "from-green-500/10 to-emerald-500/10 text-green-400 border-green-500/20",
    glow: "glow-purple"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track speed metrics, test scores, weekly activity counts, and diagnostic trends in real-time.",
    gradient: "from-indigo-500/10 to-blue-500/10 text-indigo-400 border-indigo-500/20",
    glow: "glow-blue"
  },
  {
    icon: Cpu,
    title: "Learning Intelligence",
    description: "Statistical scoring engine checking accuracy, confidence, and weakness categories backing your roadmap.",
    gradient: "from-rose-500/10 to-pink-500/10 text-rose-400 border-rose-500/20",
    glow: "glow-purple"
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#09090b]">
      {/* Background grids */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* About Cognivex Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Modern Paradigm</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Designed to Accelerate Your <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Software Engineering Core.
              </span>
            </h2>

            <p className="text-zinc-400 text-sm leading-relaxed">
              Cognivex is built differently. It replaces passive reading with active recall, AI diagnostics, and gamified progress tracking. Every student dashboard becomes a dashboard toward career readiness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {successChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-zinc-300 font-medium text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-zinc-800 bg-[#0c0c0e]/95 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Target size={14} className="text-blue-500" />
                SYSTEM_DIAGNOSIS_OUTPUT.log
              </span>
              <span className="text-[10px] font-mono text-zinc-500">v1.2</span>
            </div>

            <div className="space-y-3 font-mono text-xs text-zinc-400">
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
                <span className="text-blue-500 shrink-0">✓</span>
                <p><strong>Semester Prep:</strong> Checked DSA linear trees and graphs milestones.</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
                <span className="text-purple-500 shrink-0">✓</span>
                <p><strong>Weak Area Diagnostic:</strong> OS Paging concepts identified at 42% accuracy. Automatically scheduled for active revision review.</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
                <span className="text-emerald-500 shrink-0">✓</span>
                <p><strong>Roadmap Update:</strong> Placement loops verified. Google and Meta interview benchmarks loaded.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Catalog Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful Core <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Capabilities</span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Everything necessary to transition from academic learning to professional grade coding assessments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group relative p-6 rounded-2xl bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-md ${feature.glow}`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 border border-zinc-800`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">{feature.description}</p>
                  
                  {/* Subtle Accent Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
