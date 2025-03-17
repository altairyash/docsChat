"use client";
import "../globals.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NamespaceSelector from "../../custom-components/namespace-selector";
import QuestionInput from "../../custom-components/query-input";
import Answer from "../../custom-components/answer";
import { fetchNamespaces, handleQuery } from "../../utils/fetchNamespaces";
import LoaderSVG from "@/custom-components/ui/loader-svg";

export default function Home() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [namespaces, setNamespaces] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(
    null
  );
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNamespacesLoading, setIsNamespacesLoading] = useState(true);
  const [cache, setCache] = useState<{ [key: string]: string }>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedNamespace = localStorage.getItem("selectedNamespace");
    const storedQuestion = localStorage.getItem("question");
    const storedAnswer = localStorage.getItem("answer");
    const storedSidebarOpen = localStorage.getItem("sidebarOpen");
    const storedShowAnswer = localStorage.getItem("showAnswer");

    if (storedNamespace) setSelectedNamespace(storedNamespace);
    if (storedQuestion) setQuestion(storedQuestion);
    if (storedAnswer) {
      setAnswer(storedAnswer);
      setShowAnswer(true); 
    }
    if (storedSidebarOpen) setSidebarOpen(storedSidebarOpen === "true");
    if (storedShowAnswer) setShowAnswer(storedShowAnswer === "true");

    fetchNamespaces(setNamespaces, setIsNamespacesLoading, toast);
  }, []);

  useEffect(() => {
    if (selectedNamespace !== null) {
      localStorage.setItem("selectedNamespace", selectedNamespace);
    }
    localStorage.setItem("question", question);
    localStorage.setItem("answer", answer);
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
    localStorage.setItem("showAnswer", showAnswer.toString());
  }, [selectedNamespace, question, answer, sidebarOpen, showAnswer]);

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <LoaderSVG />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full bg-black flex overflow-hidden ${
        sidebarOpen ? "md:flex-row" : "md:flex-col justify-center items-center"
      } font-sans transition-all duration-500`}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div
        className={`p-4 transition-all flex flex-col justify-center items-center duration-500 ease-in-out bg-black shadow-md space-y-4 ${
          sidebarOpen
            ? "md:w-1/4 max-w-[400px] border-r border-gray-700 shadow-lg shadow-gray-900/20"
            : "w-full max-w-[600px] flex flex-col justify-center items-center rounded-xl p-6 border border-gray-700 shadow-md"
        }`}
      >
        <NamespaceSelector
          namespaces={namespaces}
          isLoading={isNamespacesLoading}
          onSelect={(ns) => {
            setSelectedNamespace(ns);
            if (ns !== null) {
              localStorage.setItem("selectedNamespace", ns);
            }
          }}
        />

        <QuestionInput
          question={question}
          setQuestion={(q) => {
            setQuestion(q);
            localStorage.setItem("question", q);
          }}
          disabled={!selectedNamespace}
        />

        <button
          onClick={() => {
            setShowAnswer(true);
            setSidebarOpen(true);
            localStorage.setItem("sidebarOpen", "true");
            localStorage.setItem("showAnswer", "true");

            handleQuery({
              selectedNamespace,
              question,
              cache,
              setCache,
              setAnswer: (ans) => {
                setAnswer(ans);
                localStorage.setItem("answer", ans);
              },
              setIsLoading,
              toast,
            });
          }}
          disabled={!selectedNamespace || isLoading || !question.trim()}
          className="w-full h-10 relative border border-gray-600 bg-gray-900 hover:bg-blue-600 cursor-pointer rounded-lg text-white font-menlo transition flex items-center justify-center space-x-2 shadow-md group"
        >
          {isLoading ? <LoaderSVG /> : "Get Answer"}
        </button>
      </div>

      {showAnswer && (
        <div className="flex-1 w-full p-6 bg-[#0D1117] shadow-lg shadow-gray-900/20 overflow-hidden">
          <Answer answer={answer} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
