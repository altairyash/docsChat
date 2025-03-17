"use client";

import { Search, Send, Database } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
  {
    title: "Select Documentation",
    description:
      "Choose from multiple documentation sources including React, Next.js, MongoDB, and Supabase",
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
];

export function Features() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-800 playfair-display">
          How It Works
        </h2>
        <p className="mx-auto max-w-2xl text-gray-800 font-medium">
          Get answers from multiple documentation sources in three simple steps
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 text-center bg-white/20 backdrop-blur-md rounded-md border border-white/70 transition-transform duration-300 hover:scale-105"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900/90">
                <feature.icon
                  className="h-8 w-8 text-gray-200 transition-transform duration-500"
                  style={{ transform: `scale(${index === activeIndex ? 1 : 0})` }}
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 playfair-display">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
