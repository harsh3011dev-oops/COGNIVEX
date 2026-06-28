"use client";

import { motion } from "framer-motion";
import { Play, BookOpen, MessageSquare, Map, BarChart3, BrainCircuit, Target, Zap } from "lucide-react";

const bentoItems = [
  {
    icon: Play,
    title: "Practice Tests",
    description: "1000+ MCQs across 6 core subjects",
    size: "large",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
  },
  {
    icon: BookOpen,
    title: "Subject Preparation",
    description: "DSA, OS, DBMS, CN, OOP, SE",
    size: "small",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
  },
  {
    icon: MessageSquare,
    title: "AI Mentor",
    description: "24/7 personalized guidance",
    size: "small",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
  },
  {
    icon: Map,
    title: "Placement Roadmaps",
    description: "Structured interview prep paths",
    size: "large",
    gradient: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track progress and weak areas",
    size: "small",
    gradient: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/30",
  },
  {
    icon: BrainCircuit,
    title: "Learning Intelligence",
    description: "Cognitive score & insights",
    size: "small",
    gradient: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/30",
  },
];

const stats = [
  { value: "1000+", label: "Questions" },
  { value: "6", label: "Subjects" },
  { value: "AI", label: "Powered" },
  { value: "∞", label: "Roadmaps" },
];

export default function FeatureGrid() {
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
            Powerful Features for <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Modern Learning</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Premium tools designed to accelerate your learning journey
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
        >
          {bentoItems.map((item, index) => {
            const Icon = item.icon;
            const isLarge = item.size === "large";
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative p-6 rounded-3xl bg-gradient-to-br ${item.gradient} border ${item.border} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${
                  isLarge ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </div>
                </div>
                
                {/* Floating accent */}
                <motion.div
                  className={`absolute -top-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-br ${item.gradient} blur-2xl opacity-50`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
