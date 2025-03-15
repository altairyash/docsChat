import { Button } from "@/components/ui/button";
import { Nav } from "@/custom-components/nav";
import { Features } from "@/custom-components/features";
import { GridBackground } from "@/custom-components/grid-background";
import { FloatingOrbs } from "@/custom-components/floating-orbs";
import { Footer } from "@/custom-components/footer";
export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <GridBackground />
      <FloatingOrbs />
      <Nav />

      <main className="pt-30 relative flex flex-col items-center justify-center text-center px-6 w-full">
        {/* Hero Section */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl leading-tight">
          Instantly Search Your
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {" "}
            Documentation
          </span>
        </h1>
        <p className="text-gray-400 mt-4 max-w-lg text-sm sm:text-lg">
          Open-Source AI-powered search for React, Next.js, MongoDB, Supabase,
          and more—get answers instantly.
        </p>
        <Button
          size="lg"
          className="mt-6 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <a href="/dashboard">Get Started</a>
        </Button>

        {/* Feature Section - Small Cards */}
        <Features />
      </main>
      <Footer />
    </div>
  );
}
