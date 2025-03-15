"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NamespaceSelector from "../custom-components/namespace-selector";
import QuestionInput from "../custom-components/query-input";
import ThemeToggle from "../custom-components/theme-toggle";
import Answer from "../custom-components/answer";
import { fetchNamespaces, handleQuery } from "../utils/fetchNamespaces"

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
    fetchNamespaces(setNamespaces, setIsNamespacesLoading, toast);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col md:flex-row p-6 font-sans transition-all duration-500">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={`transition-all duration-500 ease-in-out ${answer ? "md:w-1/3" : "md:w-full"} md:pr-6 flex flex-col justify-center items-center max-h-screen max-w-[500px]`}>
        <ThemeToggle theme={theme} setTheme={setTheme} />

        <div className="relative w-full max-w-2xl mx-auto text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">AI-Powered Document Analysis</h1>
          <p className="text-gray-300 mt-3">Instantly query documentation using AI.</p>
        </div>

        <div className="w-full bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4">
          <NamespaceSelector namespaces={namespaces} isLoading={isNamespacesLoading} onSelect={setSelectedNamespace} />
          <QuestionInput question={question} setQuestion={setQuestion} disabled={!selectedNamespace} />

          <button
            onClick={() => handleQuery({ selectedNamespace, question, cache, setCache, setAnswer, setIsLoading, toast })}
            disabled={!selectedNamespace || isLoading || !question.trim()}
            className="w-full py-3 rounded-md bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2"
          >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <span>Get Answer</span>}
          </button>
        </div>
      </div>

      {answer && <Answer answer={answer} toast={toast} />}
    </div>
  );
}
