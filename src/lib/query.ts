import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const index = pinecone.Index("quickstart");

export async function queryDocs(
  question: string,
  namespace: string
): Promise<string> {
  const embedding = await openai.embeddings.create({
    input: question,
    model: "text-embedding-3-small",
  });
  const space = index.namespace(namespace);
  const results = await space.query({
    vector: embedding.data[0].embedding,
    topK: 20,
    includeMetadata: true,
  });
  const context = results.matches
    .map((match) => match.metadata?.text)
    .join("\n");

  console.log(context);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that provides precise, well-structured answers to developer questions based on documentation. Follow these detailed instructions:
    
    - **Markdown Formatting:**  
      - Format responses in GitHub-style Markdown with clear headings, bullet points, and code blocks.
      - Ensure every heading (e.g., \`#\`, \`##\`, \`###\`) is followed by a **double newline** for clarity.
      - Use inline code formatting (backticks) for technical terms (e.g., \`useState\`, \`useEffect\`).
    
    - **Clarity and Conciseness:**  
      - Provide concise yet complete explanations.
      - Use short paragraphs and break down complex ideas into bullet points or numbered steps.
      - Bold key terms where necessary to emphasize important concepts.
    
    - **Code Examples:**  
      - Always include optimized, real-world code examples that follow best practices.
      - Ensure code examples are properly indented, syntax-highlighted, and annotated.
      - If relevant, include edge cases, common mistakes, or alternative approaches in the code examples.
    
    - **Edge Cases and Pitfalls:**  
      - Address potential pitfalls, performance issues, or common errors.
      - Include alternative solutions or additional tips if the documentation is ambiguous or incomplete.
      - If no sufficient documentation is provided, state any assumptions you are making.
    
    - **Robustness:**  
      - Consider both common scenarios and edge cases in your explanation.
      - If necessary, suggest best practices and ways to avoid errors.
      - Summarize the key points and, if applicable, list performance tips.
    
    Follow these guidelines step by step to ensure your answer is as useful and robust as possible.`,
      },
      {
        role: "user",
        content: `## 📌 Question  
    
    ${question}  
    
    ## 📖 Relevant Documentation  
    
    \`\`\`
    ${context}
    \`\`\`
    
    ## 🚀 Answer in Markdown  
    
    Provide a concise, well-structured answer using the given documentation. Your answer should include:
      
    - Clear explanations using headings, bullet points, and code blocks.
    - Detailed steps including potential edge cases and common pitfalls.
    - Well-formatted, real-world code examples that follow best practices.
    - A summary of key points and any performance tips.
    
    Remember to use a double newline after each heading to ensure proper spacing in Markdown.`
      },
    ],    
    temperature: 0.5,
  });

  return response.choices[0].message.content ?? "";
}
