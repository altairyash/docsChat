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
        content: `You are an AI assistant that provides precise, well-structured answers to developer questions based on documentation.  
          
        - Format responses in **GitHub-style Markdown** with clear **headings, bullet points, and code blocks, use double new line after headings**.  
        - Ensure explanations are **concise yet complete**, avoiding unnecessary verbosity.  
        - Always provide **optimized, real-world** code examples that follow best practices.  
        - Use **short paragraphs** for readability and **bold key terms** where necessary.  
        - When listing multiple items, use **bullet points or numbered lists** for clarity.  
        - If relevant, include **common mistakes, performance tips, or alternative approaches**.`  
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
    Provide a **concise, well-structured answer** using the given documentation.  
    - Include **clear explanations**.  
    - Format with **headings, bullet points, and code blocks**.  
    - Use **best practices in code examples**.`  
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content ?? "";
}
