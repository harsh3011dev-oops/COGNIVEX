"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const [showSplash, setShowSplash] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowButtons(true);
    }, 2000);

    const heroTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <Brain className="w-12 h-12 text-blue-400" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Cognivex
              </h1>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl font-semibold text-slate-300 mb-4 text-center px-4"
            >
              Learn Smarter. Practice Better. Get Placement Ready.
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base md:text-lg text-slate-400 text-center max-w-2xl px-4"
            >
              AI-powered exam preparation and placement mastery platform built for ambitious students.
            </motion.p>

            <AnimatePresence>
              {showButtons && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-xs sm:max-w-none px-4 justify-center"
                >
                  <button
                    onClick={() => router.push("/auth")}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => router.push("/auth")}
                    className="px-8 py-4 rounded-xl border-2 border-slate-600 hover:border-blue-500/50 text-white font-bold text-lg transition-all duration-300 hover:bg-slate-800/50"
                  >
                    Sign In
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Learning Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight"
            >
              Sanctuary of Learning
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Everything you need to master exams, crack placements and become industry ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-none px-4 mx-auto"
            >
              <button
                onClick={() => router.push("/auth")}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
              >
                Start Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="px-8 py-4 rounded-xl border-2 border-slate-600 hover:border-blue-500/50 text-white font-bold text-lg transition-all duration-300 hover:bg-slate-800/50"
              >
                Explore Features
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
