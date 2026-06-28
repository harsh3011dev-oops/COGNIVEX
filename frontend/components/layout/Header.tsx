"use client"

import { Bell, Search, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { LogoIcon } from "./Sidebar"

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
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md px-4 sm:h-20 sm:gap-4 sm:px-6 md:px-8 z-30">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-colors lg:hidden border border-zinc-800"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18181b] border border-zinc-800">
            <LogoIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="min-w-0 ml-1">
          <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg md:text-xl">{title}</h1>
          {userName && (
            <p className="mt-0.5 hidden truncate text-xs text-zinc-400 sm:block">
              Welcome back, <span className="font-semibold text-blue-500 font-mono">{userName}</span> 👋
            </p>
          )}
        </div>
      </div>
      
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            placeholder="Search system resources..."
            className="h-10 w-44 rounded-xl border border-zinc-800 bg-[#141416] pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 lg:w-56"
          />
        </div>
        
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 border border-zinc-800/60 bg-[#141416] hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <span className="absolute right-2 top-2 flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white shadow-md border border-blue-400/20">
          {initials}
        </div>
      </div>
    </header>
  )
}
