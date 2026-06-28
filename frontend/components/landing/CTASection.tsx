"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { LogoIcon } from "../layout/Sidebar";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#09090b]">
      {/* Dynamic glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Core CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#0c0c0e] border border-blue-500/10 shadow-2xl overflow-hidden glow-blue"
        >
          {/* Animated decorative sparks */}
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

          <div className="relative z-10 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deploy Your Potential</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Upgrade Your <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Learning Velocity?
              </span>
            </h2>

            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Step into a workspace mapped to your parameters. Connect with our AI Mentor and begin practicing exam questions today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto pt-4">
              <button
                onClick={() => router.push("/auth")}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 group border border-blue-500/30"
              >
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="px-6 py-3 rounded-xl border border-zinc-800 bg-[#0c0c0e]/50 hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 font-semibold text-sm transition-all duration-300"
              >
                Login
              </button>
            </div>

            <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest font-semibold pt-4">
              Zero configuration required • Open access practice sandbox
            </p>
          </div>
        </motion.div>

        {/* Developer Footer */}
        <footer className="border-t border-zinc-900 pt-16 pb-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding Column */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181b] border border-zinc-800">
                  <LogoIcon className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">Cognivex</span>
              </div>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Futuristic AI-powered exam preparation and placement mastery platform built for ambitious software engineering students.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors text-zinc-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors text-zinc-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors text-zinc-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Workspace</h5>
              <div className="flex flex-col gap-2.5 text-xs font-semibold">
                <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">Dashboard</Link>
                <Link href="/exam-prep" className="text-zinc-500 hover:text-zinc-300 transition-colors">Semester Prep</Link>
                <Link href="/placement/practice" className="text-zinc-500 hover:text-zinc-300 transition-colors">Placement Practice</Link>
                <Link href="/ai-mentor" className="text-zinc-500 hover:text-zinc-300 transition-colors">AI Mentor Hub</Link>
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">System</h5>
              <div className="flex flex-col gap-2.5 text-xs font-semibold">
                <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</Link>
                <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">Terms of Service</Link>
                <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">Contact Support</Link>
              </div>
            </div>
          </div>

          {/* Copyright notice */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-zinc-950 pt-8 text-[11px] font-mono text-zinc-600">
            <span>COGNIVEX INC © 2026. ALL RIGHTS RESERVED.</span>
            <span className="flex items-center gap-1.5 mt-2 sm:mt-0 font-semibold text-blue-500/80">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              ALL SYSTEM VECTORS OPERATIONAL
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
