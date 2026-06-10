"use client"

import { Bell, Search, Menu } from "lucide-react"
import { useEffect, useState } from "react"

interface HeaderProps {
  title: string
  onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("cognivex_user_name")
    if (stored) setUserName(stored)
  }, [])

  const initials = userName
    ? userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-secondary/30 bg-background px-4 sm:h-20 sm:gap-4 sm:px-6 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-secondary/50 hover:text-foreground lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">{title}</h1>
          {userName && (
            <p className="mt-0.5 hidden truncate text-sm text-foreground/50 sm:block">
              Welcome back, <span className="font-semibold text-primary">{userName}</span> 👋
            </p>
          )}
        </div>
      </div>
      
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="search"
            placeholder="Search resources..."
            className="h-11 w-48 rounded-full border-none bg-secondary/30 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-foreground/40 focus:bg-secondary/60 focus:ring-2 focus:ring-primary/20 lg:w-64"
          />
        </div>
        
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-accent"></span>
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md">
          {initials}
        </div>
      </div>
    </header>
  )
}
