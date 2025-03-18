interface QuestionInputProps {
  question: string;
  setQuestion: (value: string) => void;
  disabled: boolean;
}

export default function QuestionInput({ question, setQuestion, disabled }: QuestionInputProps) {
  return (
    <div className="w-full">
      <label className="block text-gray-400 text-sm mb-2 font-menlo pt-2">Question</label>
      <textarea
        className="w-full min-h-[128px] max-h-[200px] resize-y rounded-md border border-gray-600 bg-gray-900 p-3 text-gray-300 placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition custom-scrollbar font-menlo"
        placeholder="Ask a question about the document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={disabled}
        style={{
          fontSize: "0.9rem",
          lineHeight: "1.5",
        }}
      />
    </div>
  );
}
