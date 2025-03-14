"use client";
import "./globals.css";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async () => {
    setIsScraping(true);
    await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setIsScraping(false);
    alert("Docs scraped successfully.");
  };

  const handleQuery = async () => {
    setIsLoading(true);
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white p-6 relative overflow-hidden">
      {/* Glassmorphism Blur Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-white opacity-20 blur-3xl rounded-full"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight drop-shadow-md">
          AI-Powered Document Analysis
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Extract insights and get answers instantly from your documents.
        </p>
      </div>
      
      <div className="mt-10 w-full max-w-lg bg-white bg-opacity-30 backdrop-blur-xl shadow-xl rounded-2xl p-8 flex flex-col gap-5 relative z-10">
        <input
          className="border-none p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-50 backdrop-blur-md text-gray-800 placeholder-gray-500"
          placeholder="Enter document URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center shadow-lg"
          onClick={handleScrape}
          disabled={isScraping}
        >
          {isScraping ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Scrape Document"
          )}
        </button>
        <input
          className="border-none p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white bg-opacity-50 backdrop-blur-md text-gray-800 placeholder-gray-500"
          placeholder="Ask a question about the document"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center shadow-lg"
          onClick={handleQuery}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Get Answer"
          )}
        </button>
      </div>

      {answer && (
        <div className="mt-8 bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-xl shadow-lg text-gray-800 text-lg max-w-lg text-center relative z-10">
          {answer}
        </div>
      )}
    </div>
  );
}