"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function SignupPage() {
  const router = useRouter()
  const { signup, googleSignIn } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signup(name, email, password)
      if (name.trim()) {
        localStorage.setItem("cognivex_user_name", name.trim())
      }
      router.push("/onboarding")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account"
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
      router.push("/onboarding")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign in failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <CardContent className="p-8 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Create Account</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Begin your journey today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 block">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="h-12 bg-gray-50/50"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 block">Email Address</label>
              <Input
                type="email"
                placeholder="scholar@library.edu"
                className="h-12 bg-gray-50/50"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 bg-gray-50/50"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold shadow-md mt-6 rounded-xl"
              size="lg"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-gray-400 font-semibold tracking-widest">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 text-base font-semibold rounded-xl"
          >
            Continue with Google
          </Button>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">Already have an account?</span>
            <Link href="/login" className="text-sm text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
