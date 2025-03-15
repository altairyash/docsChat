"use client"

import { Search, Send, Database } from "lucide-react"
import { AnimatedBorder } from "./ui/animated-border"
const features = [
  {
    title: "Select Documentation",
    description: "Choose from multiple documentation sources including React, Next.js, MongoDB, and Supabase",
    icon: Database,
  },
  {
    title: "Enter Query",
    description: "Ask your question in natural language - no need for complex syntax",
    icon: Search,
  },
  {
    title: "Submit",
    description: "Get instant, relevant answers from all selected documentation sources",
    icon: Send,
  },
]

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Get answers from multiple documentation sources in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedBorder key={index} containerClassName="h-full">
              <div className="flex h-full flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                  <feature.icon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </AnimatedBorder>
          ))}
        </div>
      </div>
    </section>
  )
}

