import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface AnswerProps {
  answer: string;
  isLoading: boolean;
}

const Answer: React.FC<AnswerProps> = ({ answer, isLoading }) => {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="markdown w-full backdrop-blur-md p-6 shadow-xl text-white text-lg rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
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
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers
                  wrapLongLines
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-gray-700 text-sm p-1 rounded-xs break-words w-full" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {isLoading ? "Thinking" : answer}
      </ReactMarkdown>

      {/* Triple-Dot Animation */}
      {isLoading && (
        <div className="mt-4 text-gray-400 flex items-center space-x-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </div>
      )}
    </div>
  );
};

export default Answer;
