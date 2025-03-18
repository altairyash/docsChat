"use client";
import "../globals.css";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu, X } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cache, setCache] = useState<{ [key: string]: string }>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const sidebarRef = useRef(null);

  // Load data from localStorage on mount
  useEffect(() => {
    setTimeout(() => setIsPageLoading(false), 1500);

    const storedCache = localStorage.getItem("cache");
    const storedNamespace = localStorage.getItem("selectedNamespace");
    const storedQuery = localStorage.getItem("query");
    const storedAnswer = localStorage.getItem("answer");

    if (storedCache) setCache(JSON.parse(storedCache));
    if (storedNamespace) setSelectedNamespace(storedNamespace);
    if (storedQuery) setQuestion(storedQuery);
    if (storedAnswer) {
      setAnswer(storedAnswer);
      setShowAnswer(true); // Ensure answer section is shown
      setIsFirstTime(false);
    }
  }, []);

  // Store cache, selected namespace, query, and answer in localStorage whenever they update
  useEffect(() => {
    localStorage.setItem("cache", JSON.stringify(cache));
  }, [cache]);

  useEffect(() => {
    if (selectedNamespace)
      localStorage.setItem("selectedNamespace", selectedNamespace);
  }, [selectedNamespace]);

  useEffect(() => {
    if (question) localStorage.setItem("query", question);
  }, [question]);

  useEffect(() => {
    if (answer) localStorage.setItem("answer", answer);
  }, [answer]);

  useEffect(() => {
    fetchNamespaces(setNamespaces, setIsLoading, toast);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setSidebarOpen((prev) => !prev);
        setIsFirstTime(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <LoaderSVG />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden fixed inset-0">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Hamburger Button */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-lg"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        {sidebarOpen ? (
          <X size={24} color="white" />
        ) : (
          <Menu size={24} color="white" />
        )}
      </button>

      {/* Sidebar / Initial Card */}
      <div
        ref={sidebarRef}
        className={`relative flex flex-col items-center p-6 border-gray-700 bg-gray-900/80 backdrop-blur-lg transition-all duration-500
          ${sidebarOpen ? "pt-16" : ""}
          ${
            isFirstTime
              ? "!h-auto md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 shadow-xl rounded-xl border"
              : "md:relative md:border-r md:h-screen"
          }
          ${!sidebarOpen && "hidden"}
          ${sidebarOpen ? "md:!w-[320px] !w-full h-full md:h-screen" : ""}
        `}
      >
        <NamespaceSelector
          namespaces={namespaces}
          isLoading={isLoading}
          onSelect={(value) => setSelectedNamespace(value)}
          currentSelected={selectedNamespace}
        />
        <QuestionInput
          question={question}
          setQuestion={setQuestion}
          disabled={!selectedNamespace}
        />

        <button
          onClick={() => {
            setShowAnswer(true);
            setIsFirstTime(false);
            handleQuery({
              selectedNamespace,
              question,
              cache,
              setCache,
              setAnswer,
              setIsLoading,
              toast,
            });
          }}
          disabled={!selectedNamespace || isLoading || !question.trim()}
          className="w-full mt-4 h-10 border border-gray-600 bg-gray-800 hover:bg-blue-500 rounded-lg text-white transition cursor-pointer flex items-center justify-center"
        >
          {isLoading ? (
            <LoaderSVG />
          ) : !selectedNamespace ? (
            "Select Docs"
          ) : !question.trim() ? (
            "Enter Query"
          ) : (
            "Get Answer"
          )}
        </button>

        {/* Shortcut Label (Only on Desktop & Sidebar Mode) */}
        {!isFirstTime && (
          <div className="hidden md:block mt-4 text-gray-400 text-sm">
            Press <span className="font-bold">Alt + B</span> to collapse
          </div>
        )}
      </div>

      {/* Answer Section (Hidden when Sidebar is Open on Mobile) */}
      {showAnswer && (
        <div
          className={`flex-1 w-full bg-gray-900/70 backdrop-blur-sm p-6 transition-all duration-500 ${
            sidebarOpen ? "hidden md:block" : "block"
          }`}
        >
          <Answer answer={answer} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
