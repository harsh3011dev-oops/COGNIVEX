"use client"

import { Bell, Search } from "lucide-react"
import { useEffect, useState } from "react"

export function Header({ title }: { title: string }) {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("cognivex_user_name")
    if (stored) setUserName(stored)
  }, [])

  const initials = userName
    ? userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <header className="flex h-20 shrink-0 items-center justify-between bg-background px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
        {userName && (
          <p className="text-sm text-foreground/50 mt-0.5">
            Welcome back, <span className="text-primary font-semibold">{userName}</span> 👋
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative">
          <Search className="absolute left-4 top-3 h-4 w-4 text-foreground/40" />
          <input
            type="search"
            placeholder="Search resources..."
            className="h-10 w-64 rounded-full border-none bg-secondary/30 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-foreground/40 focus:bg-secondary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <button className="relative rounded-full p-2.5 text-foreground/60 hover:bg-secondary/50 hover:text-foreground transition-colors">
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-accent"></span>
          <Bell className="h-5 w-5" />
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-md cursor-pointer">
          {initials}
        </div>
      </div>
    </header>
  )
}
