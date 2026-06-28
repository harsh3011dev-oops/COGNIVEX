"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { submitOnboarding } from "@/lib/api"
import { useRouter } from "next/navigation"

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  
  const [goal, setGoal] = React.useState("Both")
  const [semester, setSemester] = React.useState("5th")
  const [timelineMonths, setTimelineMonths] = React.useState(6)
  const [placementTarget, setPlacementTarget] = React.useState("Not decided")
  const [domain, setDomain] = React.useState("DSA")
  const [level, setLevel] = React.useState("intermediate")
  const [confidence, setConfidence] = React.useState(50)

  const handleNextStep = async () => {
    if (step < 6) {
      setStep(s => s + 1)
    } else {
      setLoading(true)
      try {
        await submitOnboarding({
          goal,
          semester,
          target_timeline_months: timelineMonths,
          placement_target: placementTarget,
          domain,
          level,
          confidence
        });
        // Save to localStorage as a fallback for offline/mock client usage
        localStorage.setItem("cognivex_onboarding", JSON.stringify({
          goal,
          semester,
          target_timeline_months: timelineMonths,
          placement_target: placementTarget,
          domain,
          level,
          confidence,
          completed: true
        }));
        router.push("/dashboard");
      } catch (err) {
        console.error("Submission failed, using localStorage fallback...", err);
        localStorage.setItem("cognivex_onboarding", JSON.stringify({
          goal,
          semester,
          target_timeline_months: timelineMonths,
          placement_target: placementTarget,
          domain,
          level,
          confidence,
          completed: true
        }));
        router.push("/dashboard");
      } finally {
        setLoading(false)
      }
    }
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-none mt-4 sm:mt-6 md:mt-8 lg:mt-10 bg-card">
      <CardContent className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <span className="text-orange-600 font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center text-primary text-xs font-bold">C</div>
            Cognivex
          </span>
          <span className="text-sm font-medium text-gray-400">{step} / 6</span>
        </div>
        
        <div className="h-1 w-full bg-gray-100 rounded-full mb-8">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <div className="min-h-[300px]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-2">Welcome to Cognivex.</h2>
              <p className="text-gray-500 mb-6">What is your primary academic and career goal right now?</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setGoal("Crack Placements")}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${goal === "Crack Placements" ? "border-primary bg-orange-50/50" : "border-gray-200 hover:border-primary hover:bg-orange-50/20"}`}
                >
                  <div className="font-semibold text-gray-900 mb-1">🚀 Crack Placements</div>
                  <div className="text-sm text-gray-500">Focus on interview roadmap milestones, coding skills, and soft skills.</div>
                </button>
                <button 
                  onClick={() => setGoal("Ace Semester Exams")}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${goal === "Ace Semester Exams" ? "border-primary bg-orange-50/50" : "border-gray-200 hover:border-primary hover:bg-orange-50/20"}`}
                >
                  <div className="font-semibold text-gray-900 mb-1">📚 Ace Semester Exams</div>
                  <div className="text-sm text-gray-500">Master core engineering subjects like DSA, OS, DBMS, CN with weightage tips.</div>
                </button>
                <button 
                  onClick={() => setGoal("Both")}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${goal === "Both" ? "border-primary bg-orange-50/50" : "border-gray-200 hover:border-primary hover:bg-orange-50/20"}`}
                >
                  <div className="font-semibold text-gray-900 mb-1">🎯 Both Goals</div>
                  <div className="text-sm text-gray-500">Balance subject clarity for semesters while preparing for placement loops.</div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-2">What is your current semester?</h2>
              <p className="text-gray-500 mb-6">Select your ongoing engineering semester.</p>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
                  <button 
                    key={sem}
                    type="button"
                    onClick={() => setSemester(sem)}
                    className={`p-4 rounded-xl border-2 font-bold transition-all text-center ${semester === sem ? "border-primary bg-orange-50/50 text-primary" : "border-gray-200 text-gray-700 hover:border-primary hover:bg-orange-50/20"}`}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-2">What is your target timeline?</h2>
              <p className="text-gray-500 mb-6">Enter the number of months left to achieve your goals.</p>
              <Input 
                type="number" 
                placeholder="e.g. 6 months" 
                className="h-12 text-lg" 
                value={timelineMonths}
                onChange={e => setTimelineMonths(Math.max(1, parseInt(e.target.value) || 0))}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-2">Select your placement target</h2>
              <p className="text-gray-500 mb-6">Which sector are you aiming to clear?</p>
              
              <div className="space-y-4">
                {[
                  { key: "Product company", label: "🏢 Product-based Company", desc: "FAANG, startups, core development, algorithmic roles." },
                  { key: "Service company", label: "⚙️ Service-based Company", desc: "Mass recruiters, consultancy services, IT services." },
                  { key: "Not decided", label: "🤷 Not decided yet", desc: "Explore options first and build comprehensive CS skills." }
                ].map((target) => (
                  <button 
                    key={target.key}
                    onClick={() => setPlacementTarget(target.key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${placementTarget === target.key ? "border-primary bg-orange-50/50" : "border-gray-200 hover:border-primary hover:bg-orange-50/20"}`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{target.label}</div>
                    <div className="text-sm text-gray-500">{target.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-2">Assess your expertise & focus</h2>
              <p className="text-gray-500 mb-6">Specify your initial focus topic and level.</p>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Focus Subject Domain</label>
                  <Input 
                    type="text" 
                    value={domain} 
                    onChange={e => setDomain(e.target.value)} 
                    className="h-10 mt-1" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Proficiency Level</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    {["beginner", "intermediate", "advanced"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`flex-1 p-2 rounded-lg border-2 capitalize font-semibold text-sm transition-colors text-center ${level === lvl ? "border-primary bg-orange-50/50 text-primary" : "border-gray-200 text-gray-600 hover:border-primary hover:bg-orange-50/20"}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-2">Rate your current confidence</h2>
              <p className="text-gray-500 mb-6">On a scale of 0 to 100, how confident do you feel about your targets?</p>
              
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-extrabold text-primary">{confidence}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={e => setConfidence(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase">
                  <span>Anxious</span>
                  <span>Neutral</span>
                  <span>Unstoppable</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1 || loading}>
            Back
          </Button>
          <Button onClick={handleNextStep} disabled={loading} className="px-8 rounded-full">
            {loading ? "Initializing..." : (step === 6 ? "Start Learning" : "Continue")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

