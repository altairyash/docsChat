"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [namespaces, setNamespaces] = useState<{ value: string; label: string }[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNamespacesLoading, setIsNamespacesLoading] = useState(true);
  const [cache, setCache] = useState<{ [key: string]: string }>({});
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    async function fetchNamespaces() {
      try {
        const res = await fetch("/api/namespaces");
        const data = await res.json();
        setNamespaces(
          data.namespaces.filter((ns: string) => ns !== "").map((ns: string) => ({ value: ns, label: ns }))
        );
      } catch (error) {
        toast.error("Error fetching namespaces");
        console.error(error);
      } finally {
        setIsNamespacesLoading(false);
      }
    }
    fetchNamespaces();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleQuery = async () => {
    if (!selectedNamespace) {
      toast.error("Please select a namespace first.");
      return;
    }
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    const cacheKey = `${selectedNamespace}-${question}`;
    if (cache[cacheKey]) {
      setAnswer(cache[cacheKey]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, namespace: selectedNamespace }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setCache((prevCache) => ({ ...prevCache, [cacheKey]: data.answer }));
    } catch (error) {
      toast.error("Failed to fetch answer.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col md:flex-row p-6 font-sans transition-all duration-500">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sidebar (Moves left when answer appears) */}
      <div className={`transition-all duration-500 ease-in-out ${answer ? "md:w-1/3" : "md:w-full"} md:pr-6`}>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="relative w-full max-w-2xl mx-auto text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">AI-Powered Document Analysis</h1>
          <p className="text-gray-300 mt-3">Instantly query documentation using AI.</p>
        </div>

        <div className="w-full bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4">
          {/* Namespace Selection */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Select a Namespace</label>
            <Select
              options={namespaces}
              isSearchable
              className="text-black"
              placeholder="Search namespace..."
              isLoading={isNamespacesLoading}
              onChange={(e) => setSelectedNamespace(e?.value || null)}
            />
          </div>

          {/* Input for Question */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Question</label>
            <input
              className="w-full rounded-md border-none p-3 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Ask a question about the document"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={!selectedNamespace}
            />
          </div>

          {/* Get Answer Button */}
          <button
            onClick={handleQuery}
            disabled={!selectedNamespace || isLoading || !question.trim()}
            className="w-full py-3 rounded-md bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2"
          >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <span>Get Answer</span>}
          </button>
        </div>
      </div>

      {/* Response Section (Appears on the right) */}
      {answer && (
        <div className="mt-8 md:mt-0 md:w-2/3 transition-all duration-500">
          <div className="markdown w-full max-w-4xl bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-xl text-white text-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).trim();
                  return match ? (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(codeString)}
                        className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                      >
                        📋 Copy
                      </button>
                      <SyntaxHighlighter
                        style={atomDark as any}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers
                        wrapLongLines
                        {...(props as any)}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-gray-700 text-sm p-1 rounded break-words w-full" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {answer}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
