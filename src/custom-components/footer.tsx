"use client"

import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-6 w-full">
      <div className="mx-auto max-w-screen-xl px-6">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between">
          {/* Left Section */}
          <p className="text-sm text-gray-400">Made with ❤️ by Yash</p>

          {/* Social Media Links */}
          <div className="flex space-x-6 items-center">
            <a href="https://github.com/yourusername" target="_blank" className="text-gray-400 hover:text-white transition">
              <Github className="h-6 w-6" />
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" className="text-gray-400 hover:text-white transition">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" className="text-gray-400 hover:text-white transition">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>

          {/* GitHub Button */}
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-gray-900/30"
            onClick={() => window.open("https://github.com/yourusername/docschat", "_blank")}
          >
            <Github className="mr-2 h-4 w-4" />
            Contribute on GitHub
          </Button>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">&copy; {currentYear} DocsChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
