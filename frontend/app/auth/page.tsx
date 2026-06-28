"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Brain } from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.button
            onClick={() => router.push("/")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Brain className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Cognivex
            </span>
          </motion.button>
        </div>
      </nav>

      {/* Split Screen Layout */}
      <div className="pt-20 grid lg:grid-cols-2 min-h-[calc(100dvh-80px)]">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center px-8 relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-5xl font-bold mb-4">
                Welcome to <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Cognivex
                </span>
              </h2>
              <p className="text-xl text-slate-400">
                Your AI-powered learning companion for placements and exams
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: "📚", title: "Smart Learning", desc: "Personalized quizzes powered by AI" },
                { icon: "🤖", title: "AI Mentor", desc: "Get instant explanations and guidance" },
                { icon: "📊", title: "Analytics", desc: "Track your progress in real-time" },
                { icon: "🎯", title: "Placement Ready", desc: "Structured roadmap to success" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-6 sm:px-8 py-12 lg:px-12"
        >
          <div className="w-full max-w-md mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "login" ? (
                <LoginForm onSwitchTab={() => setActiveTab("signup")} />
              ) : (
                <SignupForm onSwitchTab={() => setActiveTab("login")} />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
