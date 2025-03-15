"use client"

export function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-black">
      <div
        className="absolute h-full w-full"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)),
            linear-gradient(to right, #000B1F 1px, transparent 1px),
            linear-gradient(to bottom, #000B1F 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        }}
      />
    </div>
  )
}

