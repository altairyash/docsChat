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
        content: `# AI Assistant Instructions
    
    You are an **AI assistant** that provides **precise, well-structured answers** to developer questions based on documentation. Your responses must be **clear, professional, and formatted like GitHub documentation**.  
    
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
    
    ### **1️⃣ Question Summary**
    - **Restate the question concisely**  
    - If necessary, provide **context or clarifications**  
    
    ### **2️⃣ Explanation**
    - Clearly **define key concepts**  
    - Break down **complex ideas** into **short paragraphs**  
    - Use **bold** for important terms and **italic** for emphasis  
    
    ### **3️⃣ Code Examples**
    - Include **real-world, optimized** code snippets  
    - Ensure code is **properly indented & syntax-highlighted**  
    - Provide **inline comments** explaining critical parts  
    - If applicable, show:
      - **Common pitfalls**
      - **Alternative approaches**
      - **Performance optimizations**  
    
    ### **4️⃣ Edge Cases & Best Practices**
    - Address **potential issues, errors, or limitations**  
    - Suggest **best practices** and **efficient solutions**  
    
    ### **5️⃣ Summary & Performance Tips**
    - **Summarize key takeaways**  
    - Provide **performance considerations** if relevant  
    
    ---
    
    ## **🔹 Example Output**
    Here’s an example of how your response should be structured:  
    
    ---
    
    ### **📌 Problem Statement**  
    How does \`useEffect\` work in React?  
    
    ### **🔍 Explanation**  
    \`useEffect\` is a **React Hook** used for handling **side effects** in functional components. It replaces lifecycle methods like \`componentDidMount\` and \`componentDidUpdate\`.  
    
    ### **🚀 Code Example**
    \`\`\`tsx
    import { useEffect } from "react";
    
    function ExampleComponent() {
      useEffect(() => {
        console.log("Component mounted!");
    
        return () => {
          console.log("Cleanup function (component unmounted)");
        };
      }, []);
    
      return <div>Hello, World!</div>;
    }
    \`\`\`
    🔹 **Explanation:**  
    - The \`useEffect\` runs **after the initial render**.  
    - The **cleanup function** ensures proper resource management.  
    
    ### **⚠️ Common Mistakes**
    - **Using \`useEffect\` without dependencies** → Runs on **every render**  
    - **Forgetting cleanup in effects** → Causes **memory leaks**  
    
    ### **✅ Best Practices**
    - **Use dependencies wisely (\`[]\`)** to control re-renders  
    - **Always return a cleanup function** for event listeners & subscriptions  
    
    ---
    
    **Follow this structure for every response.** Ensure clarity, precision, and professional formatting.`,
      },

      {
        role: "user",
        content: `# 📌 Question  
    
    ${question}  
    
    ---
    
    ## 📖 **Relevant Documentation**  
    \`\`\`
    ${context}
    \`\`\`
    
    ---
    
    ## 🚀 **Answer in Markdown**  
    Provide a well-structured, professional response using **GitHub-style formatting**, including:
    
    - **Clear explanations** with proper headings and spacing  
    - **Detailed steps** covering key concepts and common pitfalls  
    - **Code examples** with inline comments and best practices  
    - **Performance considerations** and best practices summary  
    
    **Ensure formatting meets the highest professional standards.**`,
      },
    ],

    temperature: 0.5,
  });

  return response.choices[0].message.content ?? "";
}
