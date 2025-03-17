"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Docs", href: "#docs" },
    { name: "About", href: "#about" },
  ];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-5xl">
      <div className="absolute -top-6 scale-75  w-full h-full bg-[#0a0e17]/30 rounded-lg backdrop-blur-md border border-gray-800/50" />
      <div className="absolute -top-3 scale-90 w-full h-full bg-[#0a0e17]/50 rounded-lg backdrop-blur-md border border-gray-800/30" />
      <nav className="relative z-10 bg-[#0a0e17]/85 backdrop-blur-md border border-gray-800/80 rounded-lg">
        <div className="mx-auto flex h-14 items-center justify-between px-3">
          <div className="flex items-center">
            <div className="relative w-10 h-10">
              <div
                className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-800"
                style={{
                  WebkitMaskImage: "url('/logo.png')",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "center",
                  maskImage: "url('/logo.png')",
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                  maskPosition: "center",
                }}
              />
            </div>
            <span className="ml-2 text-3xl font-bold text-white playfair-display">
              Lexi AI
            </span>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer ml-4 border !border-gray-600 text-gray-300  hover:text-white !bg-gray-900 hidden md:flex"
              onClick={() =>
                window.open("https://github.com/altairyash/lexiAI", "_blank")
              }
            >
              <Github className="mr-1 h-4 w-4" />
              Contribute
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-[#0a0e17] border-t border-gray-800 rounded-b-lg"
            >
              <div className="space-y-2 px-4 pb-3 pt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#1a1f2e] hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="mt-3 px-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer border !border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white !bg-blue-300/30 "
                    onClick={() =>
                      window.open(
                        "https://github.com/altairyash/lexiAI",
                        "_blank"
                      )
                    }
                  >
                    <Github className="mr-1 h-4 w-4" />
                    Contribute on GitHub
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
