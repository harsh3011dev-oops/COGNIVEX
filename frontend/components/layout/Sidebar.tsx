"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Compass, Map, Dumbbell, BookOpen, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Semester Exam Prep", href: "/exam-prep", icon: BookOpen },
  { name: "Placement Roadmap", href: "/placement/roadmap", icon: Map },
  { name: "Placement Practice", href: "/placement/practice", icon: Dumbbell },
  { name: "AI Mentor", href: "/ai-mentor", icon: Compass },
  { name: "Mock Test", href: "/practice", icon: ClipboardList },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card px-5 py-8 drop-shadow-sm z-10">
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md shadow-primary/20">
          C
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">Cognivex</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-foreground/70 hover:bg-secondary/40 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-10 px-2 flex items-center space-x-3">
        {/* Placeholder user short profile */}
        <div className="w-10 h-10 rounded-full bg-secondary border-2 border-background shadow-sm overflow-hidden flex items-center justify-center">
            <span className="text-sm font-semibold text-secondary-foreground">ST</span>
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Student</span>
            <span className="text-xs text-foreground/50">Free Tier</span>
        </div>
      </div>
    </div>
  )
}
