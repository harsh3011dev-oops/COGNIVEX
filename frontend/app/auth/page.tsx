"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Brain, Terminal, Shield, BarChart3, Target, Compass } from "lucide-react";
import { LogoIcon } from "@/components/layout/Sidebar";

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
      <div className="w-full h-screen bg-[#09090b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] grid-bg text-white flex flex-col justify-between">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181b] border border-zinc-800">
              <LogoIcon className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Cognivex
            </span>
          </button>
        </div>
      </nav>

      {/* Split Screen Layout */}
      <div className="pt-20 grid lg:grid-cols-2 min-h-[calc(100dvh-80px)] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto gap-8 items-center">
        
        {/* Left Side - Branding (Developer Console style) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center relative overflow-hidden p-8 rounded-3xl border border-zinc-850 bg-[#0c0c0e]/80 shadow-2xl backdrop-blur-md"
        >
          {/* Gradients */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                Enter the <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
                  Learning Sandbox.
                </span>
              </h2>
              <p className="text-sm text-zinc-400 mt-2 font-medium">
                Your credentials authenticate your learning vectors across all systems.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Terminal, title: "Custom Code Shell", desc: "Interact directly with simulated coding environments.", color: "text-blue-500 bg-blue-500/10" },
                { icon: Compass, title: "AI Mentor Chat", desc: "Consult your localized LLM guidance nodes at any step.", color: "text-purple-500 bg-purple-500/10" },
                { icon: BarChart3, title: "Diagnostic Logs", desc: "Review real-time performance graphs and weaknesses.", color: "text-emerald-500 bg-emerald-500/10" },
                { icon: Target, title: "Roadmap Milestones", desc: "Step-by-step developer checklists tracking placements.", color: "text-orange-500 bg-orange-500/10" },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex gap-4 items-start p-3 rounded-2xl border border-zinc-800/40 bg-zinc-900/10 hover:border-zinc-850 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl ${feature.color} flex items-center justify-center shrink-0 border border-zinc-800`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-white uppercase tracking-wider">{feature.title}</h3>
                      <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center py-8 w-full"
        >
          <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-zinc-850 bg-[#0c0c0e]/80 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Background Accent glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Tabs switcher */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#121214] border border-zinc-800 mb-6">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 h-9 rounded-lg font-bold text-xs tracking-tight transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-blue-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 h-9 rounded-lg font-bold text-xs tracking-tight transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-blue-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Signup
              </button>
            </div>

            {/* Form Content container */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
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

      {/* Footer copyright */}
      <div className="py-6 border-t border-zinc-950 text-center text-[10px] font-mono text-zinc-600 mt-8 z-10">
        COGNIVEX AUTHENTICATION PORTAL SECURE NODE © 2026
      </div>
    </div>
  );
}
