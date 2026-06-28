"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, Sparkles, Terminal, Activity, Code, Cpu, ChevronRight } from "lucide-react";

const codeSnippets = [
  `const cognivex = new AIOS();\nawait cognivex.optimizeLearning();`,
  `// System status: Operational\n[DSA, OS, DBMS, CN] -> Synced.`,
  `AI.predictScore(userHistory)\n  .then(rec => study(rec));`,
  `while(exam_prep.in_progress) {\n  accuracy += AI.getFeedback();\n}`
];

export default function Hero() {
  const [showSplash, setShowSplash] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowButtons(true);
    }, 1500);

    const heroTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  // Simple terminal typing effect
  useEffect(() => {
    if (showSplash) return;
    let snippet = `[system] initializing cognivex-ai-engine...\n[status] optimal learning vectors loaded.\n[ready] type code to begin.\n> `;
    let i = 0;
    const interval = setInterval(() => {
      if (i < snippet.length) {
        setTerminalText((prev) => prev + snippet.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [showSplash]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg grid-bg pt-20">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none glow-blue" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none glow-purple" />

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white z-40 bg-[#09090b]"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
                <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" />
                  <path d="M18 8l-4 4 4 4" className="text-purple-500" />
                  <line x1="8" y1="15" x2="12" y2="15" strokeWidth="3" />
                  <circle cx="14" cy="12" r="1.5" className="fill-purple-500" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                Cognivex
              </h1>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-zinc-400 mb-8 text-center px-4 font-mono max-w-xl"
            >
              Initializing Learning Operating System...
            </motion.p>
            
            <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center gap-12"
          >
            {/* Left side: Heading and CTAs */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Developer Sanctuary</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Cognivex <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Your AI-Powered Learning Operating System.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                Master semester exams, DSA, placement assessments, and AI engineering vectors inside one unified, intelligent platform built for software developers.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start w-full max-w-md mx-auto lg:mx-0 pt-4">
                <button
                  onClick={() => router.push("/auth")}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 group border border-blue-500/30"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 text-zinc-200 font-semibold text-sm transition-all duration-300 hover:bg-zinc-800/40"
                >
                  Create Account
                </button>
                <button
                  onClick={() => router.push("/auth")}
                  className="px-6 py-3 rounded-xl border border-zinc-800 bg-[#0c0c0e]/50 hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 font-semibold text-sm transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Right side: Interactive Mockup Terminal & Dashboard */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none relative flex flex-col gap-4">
              {/* Animated Floating Snippets */}
              <div className="absolute -top-6 -right-6 hidden sm:block">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-emerald-400 shadow-md backdrop-blur-sm"
                >
                  <Code size={12} className="inline mr-1" />
                  <span>Cognitive Stats: 98% optimal</span>
                </motion.div>
              </div>

              {/* Futuristic Interactive Terminal */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md overflow-hidden shadow-2xl">
                {/* Window header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/70 border-b border-zinc-800/80">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <Terminal size={10} />
                    <span>ai-os-shell</span>
                  </div>
                  <div className="w-12" />
                </div>
                
                {/* Terminal body */}
                <div className="p-4 font-mono text-xs text-zinc-300 min-h-[140px] whitespace-pre-wrap leading-relaxed">
                  {terminalText}
                  <span className="animate-pulse">_</span>
                </div>
              </div>

              {/* Mockup Dashboard Card */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="text-blue-500" size={16} />
                    <span className="text-xs font-bold text-zinc-200">Intelligence Engine</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">DSA Accuracy</span>
                    <span className="text-xl font-bold text-white tracking-tight">88.5%</span>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-full w-[88%]" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Cognitive Rating</span>
                    <span className="text-xl font-bold text-white tracking-tight">Level 4</span>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-500 h-full w-[75%]" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-zinc-800/40 bg-zinc-900/10 flex items-center gap-3">
                  <Cpu className="text-purple-500 shrink-0" size={16} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block leading-none mb-1">AI Recommendation</span>
                    <p className="text-[11px] text-zinc-300 font-medium truncate">Revise "Memory Management in OS" due to low accuracy patterns.</p>
                  </div>
                  <ChevronRight size={14} className="text-zinc-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
