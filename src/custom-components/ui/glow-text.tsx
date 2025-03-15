"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface GlowTextProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export function GlowText({ children, className, color = "text-blue-500" }: GlowTextProps) {
  return (
    <span className={cn("relative", color, className)}>
      <span className="relative z-10">{children}</span>
      <span
        className={cn("absolute -inset-1 z-0 block blur-md opacity-50", color.replace("text", "bg"))}
        aria-hidden="true"
      />
    </span>
  )
}

