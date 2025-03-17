"use client";

import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/80 py-6">
      <div className="mx-auto max-w-screen-xl px-8 flex flex-wrap items-center justify-between gap-6">
        <p className="text-sm text-gray-400">
          Made with ❤️ by
          <a
            href="https://github.com/altairyash"
            className="ml-1 font-bold text-white underline"
          >
            Yash
          </a>
        </p>
        <p className="text-xs font-bold text-gray-500">
          &copy; {new Date().getFullYear()} LexiAI Open-Source.
        </p>
        <div className="flex items-center gap-6">
          {[
            { href: "https://github.com/altairyash", icon: Github },
            { href: "https://x.com/atomicphoenix14", icon: Twitter },
            {
              href: "https://www.linkedin.com/in/yash-yadav14/",
              icon: Linkedin,
            },
          ].map(({ href, icon: Icon }, index) => (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
