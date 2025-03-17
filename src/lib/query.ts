import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const index = pinecone.Index("quickstart");

export async function queryDocs(
  question: string,
  namespace: string
): Promise<string> {
  console.log(`🔍 Querying vector DB for namespace: ${namespace}`);
  console.log(`📝 User question: ${question}`);

  // Generate embedding for the question
  const embedding = await openai.embeddings.create({
    input: question,
    model: "text-embedding-3-small",
  });

  console.log(`✅ Embedding generated successfully`);

  // Query Pinecone
  const space = index.namespace(namespace);
  const results = await space.query({
    vector: embedding.data[0].embedding,
    topK: 10, // Adjusted for relevance
    includeMetadata: true,
  });

  console.log(`🔎 Pinecone returned ${results.matches.length} results`);

  if (results.matches.length === 0) {
    console.warn(`⚠️ No relevant matches found in Pinecone.`);
    return "I couldn't find relevant documentation for your query.";
  }

  const context = results.matches
    .map((match) => match.metadata?.text)
    .join("\n");
  console.log(`📄 Retrieved context:\n${context.slice(0, 500)}...`); // Truncated to prevent console spam

  // Generate response with OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `# AI Assistant Instructions
    
    You are an **AI assistant** that provides **precise, well-structured answers** to developer questions based on documentation. Your responses must be **clear, professional, and formatted **.  
    VERY IMPORTANT ----- PAY CLOSE ATTENTION TO USER'S QUESTION AND TRY TO ANSWER THAT **.  
    
    ## **📌 Formatting Guidelines**
    - Use **GitHub-flavored Markdown** with:
      - Proper **headings (\`#\`, \`##\`, \`###\`)**  
      - **Double newlines** after each heading for correct spacing  
      - **Bullet points (\`-\`)** for lists  
      - **Numbered steps (\`1.\`, \`2.\`)** for ordered instructions  
      - **Inline code (\`\`useState\`\`)** for technical terms  
      - **Syntax-highlighted code blocks** for examples  
    
    ## **📖 Response Structure**
    Your response should follow this **structured format**:
    
    ### ** Explanation**
    - Break down **complex ideas** into **short paragraphs**  
    - Use **bold** for important terms and **italic** for emphasis  
    
    ### ** Code Examples**
    - Include **real-world, optimized** code snippets  
    - Ensure code is **properly indented & syntax-highlighted**  
    - Provide **inline comments** explaining critical parts  
    - If applicable, show:
      - **Common pitfalls**
      - **Alternative approaches**
      - **Performance optimizations**  
    
    ### **Performance Tips**
    - Provide **performance considerations** if relevant  
    
    ---
    
    ## **🔹 Example Output**
    Here’s an example of how your response should be structured:  
    
    
     Ensure clarity, precision, and professional formatting.
     ## 🚀 **Answer in Markdown**  
    Provide a well-structured, professional response using **GitHub-style formatting**, including:
    
    - **Clear explanations** with proper headings and spacing  
    - **Detailed steps** covering key concepts and common pitfalls  
    - **Code examples** with inline comments and best practices  
    - **Performance considerations** and best practices summary  
    
    **Ensure formatting meets the highest professional standards.**
    `,
      },

      {
        role: "user",
        content: `**Question:**\n${question}\n\n**Relevant Documentation:**\n\`\`\`\n${context}\n\`\`\``,
      },
    ],
    temperature: 0.3, // Lowered for accuracy
  });

  console.log(`💬 OpenAI response received`);

  return response.choices[0].message.content ?? "";
}
