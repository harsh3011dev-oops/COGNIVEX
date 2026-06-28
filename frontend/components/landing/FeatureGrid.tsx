"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldAlert, Award, Compass, Sparkles, ChevronRight, GraduationCap, Flame, ArrowUpRight } from "lucide-react";

const stats = [
  { value: "1000+", label: "Target Questions", desc: "Curated from placement sets" },
  { value: "50+", label: "Academic Topics", desc: "Covering 6 core CS domains" },
  { value: "AI-OS", label: "Intelligence Engine", desc: "Context-aware diagnostics" },
  { value: "98.4%", label: "Placement Success", desc: "Of active track scholars" },
];

const journeySteps = [
  {
    step: "01",
    title: "Sleek Registration",
    desc: "Create your workspace and establish profile goals.",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-400"
  },
  {
    step: "02",
    title: "Diagnostic Quiz",
    desc: "Test speed, accuracy, and core database knowledge.",
    color: "from-purple-500/10 to-pink-500/10 text-purple-400"
  },
  {
    step: "03",
    title: "Get AI Counsel",
    desc: "Receive customized study checklists and priority advice.",
    color: "from-orange-500/10 to-red-500/10 text-orange-400"
  },
  {
    step: "04",
    title: "Active Learning",
    desc: "Work on weak domains with interactive questions.",
    color: "from-green-500/10 to-emerald-500/10 text-green-400"
  },
  {
    step: "05",
    title: "Track Performance",
    desc: "Watch accuracy graphs and stats increase.",
    color: "from-teal-500/10 to-cyan-500/10 text-teal-400"
  },
  {
    step: "06",
    title: "Excel & Succeed",
    desc: "Ace semester tests and land core development offers.",
    color: "from-yellow-500/10 to-amber-500/10 text-yellow-400"
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Statistics Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="p-6 rounded-2xl bg-[#0c0c0e] border border-zinc-800/80 text-center relative overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 font-mono">
                {stat.value}
              </div>
              <div className="text-zinc-200 text-xs font-bold mb-1">{stat.label}</div>
              <div className="text-zinc-500 text-[10px]">{stat.desc}</div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Traditional Learning vs Cognivex */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-extrabold text-white">
              Traditional Study vs. <span className="text-blue-500 font-mono">Cognivex</span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto">
              Comparing outdated academic approaches with our active AI operating system paradigm.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-zinc-950/30 border border-zinc-900 flex flex-col gap-5 relative opacity-80"
            >
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <ShieldAlert size={16} />
                </div>
                <h3 className="font-bold text-sm text-zinc-300">Outdated Study Habits</h3>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-400">
                {[
                  "Memorizing study guides without diagnostic verification.",
                  "Solving random coding blocks without company filters.",
                  "No data dashboards indicating concept accuracy values.",
                  "Generic templates instead of custom student milestones.",
                  "Reviewing guides offline without active mentor query responses."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cognivex Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-[#0c0c0e] border border-blue-500/20 flex flex-col gap-5 relative shadow-xl glow-blue"
            >
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Cognivex Ecosystem <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Enhanced</span>
                </h3>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-300">
                {[
                  "AI diagnostic logs indicating weak parameters immediately.",
                  "1000+ problems mapped to high-weightage placement cards.",
                  "Dynamic weekly activity heatmaps tracking daily streaks.",
                  "Elite student journey checklist guiding your path.",
                  "24/7 Contextual AI Mentor chat with document uploads."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Student Journey Steps */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-extrabold text-white">
              The Student <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto">
              Follow these simple checkpoints to systematically prepare for engineering placements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="p-5 rounded-2xl bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center font-bold text-sm shrink-0 border border-zinc-850 font-mono`}>
                  {step.step}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
