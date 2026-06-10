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

interface SidebarProps {
  onNavigate?: () => void
  onClose?: () => void
}

export function Sidebar({ onNavigate, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-card px-4 py-6 drop-shadow-sm sm:px-5 sm:py-8">
      <div className="mb-8 flex items-center justify-between gap-3 px-2 sm:mb-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-md shadow-primary/20">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Cognivex</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-secondary/50 hover:text-foreground lg:hidden"
        >
          <X size={20} />
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
                "group flex min-h-11 items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-foreground/70 hover:bg-secondary/40 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto flex items-center space-x-3 px-2 pt-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary shadow-sm">
          <span className="text-sm font-semibold text-secondary-foreground">ST</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-foreground">Student</span>
          <span className="text-xs text-foreground/50">Free Tier</span>
        </div>
      </div>
    </div>
  )
}
