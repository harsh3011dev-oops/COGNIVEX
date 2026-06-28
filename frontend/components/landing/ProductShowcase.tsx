"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, BrainCircuit, MessageSquare, BarChart3, TrendingUp } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Semester Exam Prep",
    description: "Master university subjects with structured learning paths.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Map,
    title: "Placement Roadmaps",
    description: "Follow AI-generated roadmaps for DSA, Development, AIML and interviews.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BrainCircuit,
    title: "Smart Practice",
    description: "Practice topic-wise MCQs and coding concepts.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: MessageSquare,
    title: "AI Mentor",
    description: "Get personalized recommendations and study guidance.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Learning Intelligence",
    description: "Track speed, confidence, accuracy and cognitive score.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Identify weak areas and measure improvement over time.",
    gradient: "from-rose-500 to-pink-500",
  },
];

export default function ProductShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Everything You Need to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Comprehensive tools designed for CS/IT students to excel in academics and placements
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
