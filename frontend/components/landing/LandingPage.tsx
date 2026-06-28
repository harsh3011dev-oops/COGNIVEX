"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen, Bot, FileText, BarChart3, Target, TrendingUp, ArrowRight, Code2, Brain, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const features = [
    {
      icon: BookOpen,
      title: "1000+ MCQs",
      description: "Comprehensive question bank covering all CS fundamentals",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Bot,
      title: "AI Mentor",
      description: "Get personalized guidance and real-time explanations",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "PDF to Quiz",
      description: "Convert your study materials into interactive quizzes",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track progress with detailed performance insights",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Placement Prep",
      description: "Structured roadmap for campus placements",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time metrics on your learning journey",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const floatingCards = [
    { text: "📚 1000+ MCQs", delay: 0 },
    { text: "🤖 AI Mentor", delay: 0.2 },
    { text: "📄 PDF to Quiz", delay: 0.4 },
    { text: "📊 Analytics", delay: 0.6 },
    { text: "🎯 Placement Prep", delay: 0.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Brain className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Cognivex
            </span>
          </motion.div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            >
              AI-Powered Learning<br />for Placements & Semester Success
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-slate-300 mb-4"
            >
              Practice. Analyze. Improve.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto"
            >
              Crack Placements and Exams with AI.
            </motion.p>

            {/* Floating cards showcase */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
            >
              {floatingCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay + 0.3 }}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors"
                >
                  <p className="text-sm sm:text-base font-semibold">{card.text}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => router.push("/auth")}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="px-8 py-4 rounded-lg border-2 border-slate-600 hover:border-blue-500/50 text-white hover:bg-slate-800/50 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2"
              >
                Login
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Powerful Features for<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Success
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to master computer science fundamentals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Questions" },
              { number: "5", label: "Core Subjects" },
              { number: "∞", label: "AI Recommendations" },
              { number: "Real-Time", label: "Analytics" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-cyan-500/0 rounded-2xl" />
            <div className="relative z-10 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Crack It?</h2>
              <p className="text-slate-300 mb-8 text-lg">
                Start your learning journey today and unlock your potential
              </p>
              <button
                onClick={() => router.push("/auth")}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-bold text-lg inline-flex items-center gap-2 group"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Brain className="w-6 h-6 text-blue-500" />
            <span className="font-bold">Cognivex</span>
          </div>
          <p className="text-slate-500 text-sm">
            AI-Powered Learning Platform © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
