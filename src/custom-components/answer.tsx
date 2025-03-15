import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
interface AnswerProps {
    answer: string;
    toast: any; // You can replace 'any' with the specific type of 'toast' if known
}
const copyToClipboard = (text: string, toast: { success: (arg0: string) => void; }) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
const Answer: React.FC<AnswerProps> = ({ answer}) => {
    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
    };

    return (
        <div className="mt-8 md:mt-0 md:w-2/3 transition-all duration-500">
            <div className="markdown w-full max-w-4xl bg-gray-900/60 backdrop-blur-md rounded-xl p-6 shadow-xl text-white text-lg">
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
    );
};

export default Answer;