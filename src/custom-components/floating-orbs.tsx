"use client"

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[128px]" />
      <div className="absolute -right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[128px]" />
    </div>
  )
}

