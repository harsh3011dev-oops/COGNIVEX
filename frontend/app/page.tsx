"use client";

import ParticleBackground from "@/components/landing/ParticleBackground";
import Hero from "@/components/landing/Hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import FeatureGrid from "@/components/landing/FeatureGrid";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <ParticleBackground />
      <Hero />
      <ProductShowcase />
      <FeatureGrid />
      <CTASection />
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cognivex
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            AI-Powered Learning Platform © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
