"use client";
import "../globals.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NamespaceSelector from "../../custom-components/namespace-selector";
import QuestionInput from "../../custom-components/query-input";
import Answer from "../../custom-components/answer";
import { fetchNamespaces, handleQuery } from "../../utils/fetchNamespaces";

export default function Home() {
  const [namespaces, setNamespaces] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(
    null
  );
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); // Answer will be empty at first
  const [isLoading, setIsLoading] = useState(false);
  const [isNamespacesLoading, setIsNamespacesLoading] = useState(true);
  const [cache, setCache] = useState<{ [key: string]: string }>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false); // Controls when the answer section appears

  useEffect(() => {
    fetchNamespaces(setNamespaces, setIsNamespacesLoading, toast);
  }, []);

  return (
    <div
      className={`min-h-screen w-full bg-black flex ${
        sidebarOpen ? "md:flex-row" : "md:flex-col justify-center items-center"
      } font-sans transition-all duration-500`}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar (Initially Centered, Then Becomes Sidebar) */}
      <div
        className={`p-4 transition-all duration-500 ease-in-out bg-[#0D1117] shadow-md space-y-4 
  ${
    sidebarOpen
      ? "md:w-1/4 md:max-w-[350px] border-r border-gray-700 shadow-lg shadow-gray-900/20"
      : "min-w-[650px] flex flex-col justify-center items-center rounded-xl p-6 border border-gray-700 shadow-md"
  }`}
      >
        {/* Namespace Selector */}
        <NamespaceSelector
          namespaces={namespaces}
          isLoading={isNamespacesLoading}
          onSelect={setSelectedNamespace}
        />

        {/* Question Input */}
        <QuestionInput
          question={question}
          setQuestion={setQuestion}
          disabled={!selectedNamespace}
        />

        {/* Submit Button */}
        <button
          onClick={() => {
            setShowAnswer(true); // Show answer section immediately
            setSidebarOpen(true);
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
          className="w-full cursor-pointer bg-gray-800 py-3 rounded-lg hover:bg-[#2EA043] text-white font-semibold transition flex items-center justify-center space-x-2 shadow-md"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <span>Get Answer</span>
          )}
        </button>
      </div>

      {/* Answer Section (Now Appears Immediately) */}
      {showAnswer && (
        <div
          className={`transition-all duration-500 ease-in-out ${
            sidebarOpen ? "flex-1" : "w-full"
          } p-6 bg-[#0D1117] shadow-lg shadow-gray-900/20`}
        >
          <Answer answer={answer} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
