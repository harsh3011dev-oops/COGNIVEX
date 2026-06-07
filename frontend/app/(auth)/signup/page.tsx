"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Save the user's name to localStorage so dashboard can read it
    if (name.trim()) {
      localStorage.setItem("cognivex_user_name", name.trim())
    }
    router.push("/onboarding")
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
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md mt-6 rounded-xl" size="lg">
              Sign Up
            </Button>
          </form>

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
