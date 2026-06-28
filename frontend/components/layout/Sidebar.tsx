"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Compass, Map, Dumbbell, BookOpen, ClipboardList, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Semester Exam Prep", href: "/exam-prep", icon: BookOpen },
  { name: "Placement Roadmap", href: "/placement/roadmap", icon: Map },
  { name: "Placement Practice", href: "/placement/practice", icon: Dumbbell },
  { name: "AI Mentor", href: "/ai-mentor", icon: Compass },
  { name: "Mock Test", href: "/practice", icon: ClipboardList },
]

export function LogoIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Code bracket left `<` and cursor `_` combining into a C shape */}
      <path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6" className="text-blue-500" />
      <path d="M18 8l-4 4 4 4" className="text-purple-500" />
      <line x1="8" y1="15" x2="12" y2="15" className="text-blue-400" strokeWidth="3" />
      <circle cx="14" cy="12" r="1.5" className="fill-purple-500 text-purple-500" />
    </svg>
  );
}

interface SidebarProps {
  onNavigate?: () => void
  onClose?: () => void
}

export function Sidebar({ onNavigate, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-[#0c0c0e] border-r border-[#1f1f23] px-4 py-6 sm:px-5 sm:py-8">
      <div className="mb-8 flex items-center justify-between gap-3 px-2 sm:mb-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#18181b] border border-[#27272a] shadow-inner">
            <LogoIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">Cognivex</span>
            <span className="text-[10px] text-blue-500 font-mono mt-1 uppercase tracking-widest font-semibold">AI OS v1.0</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white lg:hidden border border-zinc-800/40"
        >
          <X size={18} />
        </button>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex min-h-11 items-center rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 border",
                isActive 
                  ? "bg-gradient-to-r from-blue-500/10 to-purple-500/5 text-white border-blue-500/20 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 border-transparent"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto flex items-center space-x-3 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
          <span className="text-xs font-bold text-white">ST</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-bold text-zinc-200">Developer Account</span>
          <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider font-semibold">Tier: Elite</span>
        </div>
      </div>
    </div>
  )
}
