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
  console.log(`📝 Original User Question: ${question}`);

  // Step 1: Ask OpenAI to refine the question
  const refinementResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that helps refine user queries before they are processed by a vector search system. 
        Your task is to make the query **clear, specific, and well-structured** based on the given documentation namespace.
        Also keep in mind that the query will be embedded to vector space for accurate search results so insert keywords relevant to it 
        .
        **Instructions:**
        - If the question is too vague, add **necessary context**.
        - If it’s **ambiguous**, suggest a better phrasing.
        - Maintain the **original intent** but **optimize for better search accuracy**.
        - Keep your response **short and concise** (1-2 sentences).
        
        **Example Inputs & Outputs:**
        ---
        **User Question:** "State management?"
        **Namespace:** "React Docs"
        **Refined Query:** "What are the different state management options in React, including useState, useReducer, and Context API?"
        `,
      },
      {
        role: "user",
        content: `User Question: "${question}"\nDocumentation Namespace: "${namespace}"`,
      },
    ],
    temperature: 0.2, // Keep it accurate and not too creative
  });

  const refinedQuestion =
    refinementResponse.choices[0].message.content?.trim() || question;

  console.log(`🔎 Refined Question: ${refinedQuestion}`);

  // Step 2: Generate embedding for the refined question
  const embedding = await openai.embeddings.create({
    input: refinedQuestion,
    model: "text-embedding-3-small",
  });

  console.log(`✅ Embedding generated successfully`);

  // Step 3: Query Pinecone
  const space = index.namespace(namespace);
  const results = await space.query({
    vector: embedding.data[0].embedding,
    topK: 20, // Adjusted for relevance
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
  console.log(`📄 Retrieved context:\n${context.slice(0, 500)}...`);

  // Step 4: Generate response with OpenAI using the refined question and retrieved context
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `# AI Assistant Instructions
  
  You are an AI assistant that provides **clear, structured, and accurate answers** to developer questions based on documentation.  
  Your response must always be **well-formatted, concise, and relevant** to the query.
  
  ## **📌 Formatting Guidelines**
  Use **GitHub-flavored Markdown**:
  - **Headings** (#, ##, ###) for sections.
  - **Bullet points** (-) for listing key points.
  - **Numbered steps** (1., 2.) for ordered instructions.
  - **Inline code** (\`likeThis\`) for function names, variables, or short commands.
  - **Code blocks** must always be properly enclosed using triple backticks (\`\`\`) and specify the correct language.
  
  ## **📝 Response Structure**
  ### **1. Explanation (If Needed)**
  - Provide **brief but clear** explanations for the concept.
  - Avoid unnecessary repetition or filler text.
  - If the concept is **simple or self-explanatory**, skip this section.
  
  ### **2. Code Examples (Always Preferred)**
  - Always include **properly formatted code snippets** where applicable.
  - Even if the user does not explicitly ask for code, **provide relevant CLI commands, or code snippets whichever fits**.
  - Use triple backticks (\`\`\`) with the correct language:
  
  
  ### **3. Edge Cases & Common Mistakes (Optional)**
  - If relevant, mention **common pitfalls** and how to avoid them.
  - If the feature has **unexpected behavior**, warn the user.
  
  ### **4. Performance Considerations (Only If Relevant)**
  - Include this **only if performance is a key factor**.
  - If the question is about syntax or simple usage, skip this section.
  //NEVER GIVE FURTHER READING LINKS OR REFERENCES
  ## **🚀 Example Response Format**
  ### **Explanation**
  - Briefly explain the concept (if needed).
  
  ### **Code Example**
  \`\`\`javascript
  function example() {
    console.log("Hello, world!"); // Inline comments for clarity
  }
  \`\`\`
  
  ### **Common Mistakes**
  - Example of a common mistake and how to fix it.
  
  Your priority is **providing a high-quality, structured answer**. Avoid unnecessary text and always ensure **consistent Markdown formatting**.
  
  **IMPORTANT:**  
  - Never wrap non-code Markdown elements inside triple backticks.  
  - Always specify the correct language in code blocks.  
  - If a question does not explicitly require code, but it's useful, **provide a relevant code snippet anyway**.`,
      },
      {
        role: "user",
        content: `**Question:**\n${refinedQuestion}\n\n**Relevant Documentation:**\n\`\`\`\n${context}\n\`\`\``,
      },
    ],
    temperature: 0.3, // Keeps responses precise
  });
  
  
  
  console.log(`💬 OpenAI response received`);

  return response.choices[0].message.content ?? "";
}
