"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Compass, BrainCircuit, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login, googleSignIn } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      const displayName = name.trim() || email.split("@")[0] || "Scholar"
      localStorage.setItem("cognivex_user_name", displayName)
      router.push("/dashboard")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)
    try {
      await googleSignIn()
      router.push("/dashboard")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign in failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Column - Brand & Monologue - Hidden on mobile */}
      <div className="hidden lg:flex flex-col flex-1 bg-primary relative overflow-hidden justify-between p-12 text-primary-foreground">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] animate-pulse duration-10000" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse duration-7000" delay-1000 />
          <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            C
          </div>
          <span className="text-3xl font-bold tracking-tight">Cognivex</span>
        </div>

        {/* Monologue */}
        <div className="relative z-10 max-w-lg mt-10">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
            Master your mind.<br/>Shape your future.
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed mb-12">
            Cognivex isn&apos;t just a learning platform—it&apos;s your intellectual engine. We blend cognitive strategy with intelligent guidance to help you master complex subjects faster, build unshakeable confidence, and track true growth.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 shadow-lg">
                <Compass size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-white">Smart Roadmaps</h4>
                <p className="text-sm text-primary-foreground/60">Dynamic paths tailored to your speed.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 shadow-lg">
                <BrainCircuit size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-white">AI Mentorship</h4>
                <p className="text-sm text-primary-foreground/60">Unlock insights when you are stuck.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-sm text-primary-foreground/50 font-medium">
          &copy; {new Date().getFullYear()} Cognivex Platform
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand header (only shown on small screens) */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-6 shadow-sm">
              C
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Cognivex</h1>
            <p className="text-xs text-foreground/50 font-semibold uppercase tracking-widest">Enter your digital sanctuary</p>
          </div>

          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-foreground/60">Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 block">Your Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="h-14 bg-secondary/20 border border-input/50 focus:border-primary focus:bg-card rounded-xl text-base px-5 shadow-sm transition-all"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 block">Email Address</label>
              <Input 
                type="email" 
                placeholder="scholar@library.edu" 
                className="h-14 bg-secondary/20 border border-input/50 focus:border-primary focus:bg-card rounded-xl text-base px-5 shadow-sm transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground/80 block">Password</label>
                <Link href="#" className="text-sm text-primary font-semibold hover:underline">Forgot password?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="h-14 bg-secondary/20 border border-input/50 focus:border-primary focus:bg-card rounded-xl text-base px-5 shadow-sm transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold shadow-md shadow-primary/20 hover:shadow-lg mt-8 rounded-xl transition-all duration-300" 
              size="lg"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign In to Dashboard"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-foreground/50 font-semibold tracking-widest">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full h-14 text-base font-semibold rounded-xl border-input/50 bg-secondary/20 hover:bg-secondary/30"
          >
            Continue with Google
          </Button>

          <div className="mt-10 text-center">
            <span className="text-foreground/60 font-medium">New to Cognivex? </span>
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
