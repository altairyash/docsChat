interface QuestionInputProps {
    question: string;
    setQuestion: (value: string) => void;
    disabled: boolean;
  }
  
  export default function QuestionInput({ question, setQuestion, disabled }: QuestionInputProps) {
    return (
      <div className="w-full">
        <label className="block text-gray-400 text-sm mb-2">Question</label>
        <input
          className="w-full font-menlo rounded-md border-none p-3 bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          placeholder="Ask a  question about the document"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={disabled}
        />
      </div>
    );
  }
  