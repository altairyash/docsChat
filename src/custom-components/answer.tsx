"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import LoaderSVG from "../custom-components/ui/loader-svg";

interface AnswerProps {
  answer: string;
  isLoading: boolean;
}

const Answer: React.FC<AnswerProps> = ({ answer, isLoading }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="pt-0 flex flex-col max-w-screen markdown min-h-full max-h-screen overflow-y-scroll no-scrollbar w-full p-6 shadow-xl text-white rounded-lg mr-4 ml-0 rounded-b-lg border-gray-700 bg-gray-900/40 backdrop-blur-2xl ">
      {isLoading ? (
        <div className="flex items-center min-h-full justify-center h-full min-w-full">
          <LoaderSVG />
        </div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ children }) =>
              children && (!Array.isArray(children) || children.length > 0) ? (
                <pre>{children}</pre>
              ) : null,
            code: ({
              inline = false,
              className,
              children,
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            }) => {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).trim();

              if (!codeString) return null;

              return !inline && match ? (
                <div className="relative !  bg-black/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => copyToClipboard(codeString)}
                    className="absolute top-2 right-2 px-3 py-1 text-sm text-white bg-[#212121] rounded-md border border-black flex hover:bg-gray-700 transition"
                  >
                    {copiedCode === codeString ? "Copied" : "📄"}
                  </button>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers
                    wrapLongLines
                    customStyle={{
                      padding: "1rem",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      margin: "0px",
                      borderRadius: "8px",
                      backgroundColor: "#282c34",
                      color: "#abb2bf",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-gray-800 text-sm px-1 py-0.5 rounded-md text-red-400">
                  {children}
                </code>
              );
            },
          }}
        >
          {answer || "No answer available."}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default Answer;
