"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Nav } from "@/custom-components/nav";
import { Features } from "@/custom-components/features";
import { Footer } from "@/custom-components/footer";
import { motion } from "framer-motion";
import LoaderSVG from "@/custom-components/ui/loader-svg";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  if (isPageLoading || isNavigating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <LoaderSVG />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden bg-cover bg-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#ffffff]/90 backdrop-blur-md"></div>
      <Nav />

      <main className="pt-26 md:pt-40 relative flex flex-col items-center justify-center text-center px-6 w-full">
        {/* Hero Section */}
        <div className="min-h-full py-10 max-w-[700px]">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl playfair-display sm:text-5xl md:text-6xl font-bold max-w-4xl leading-tight text-gray-800"
          >
            Query any{" "}
            <p className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Documentation
            </p>{" "}
            using AI
          </motion.h1>

          <p className="text-gray-900 font-medium text-center w-full mt-4 text-xs sm:text-lg block">
            Open-Source AI-powered search for{" "}
            <span className="bg-gray-800 pl-2 text-white font-semibold">
              <Typewriter
                words={[" React.js", " Next.js", " Github", " Express"]}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={100}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>{" "}
            docs—get answers instantly.
          </p>

          <Button
            size="lg"
            onClick={handleGetStarted}
            className="mt-6 cursor-pointer bg-gradient-to-r bg-gray-500 hover:scale-105 transition-transform shadow-lg"
          >
            Get Started
          </Button>
        </div>
        {/* Features Section */}
        <section id="features" className="mt-8 w-full">
          <Features />
        </section>
      </main>

      <Footer />
    </div>
  );
}
