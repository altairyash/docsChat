import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const index = pinecone.Index("quickstart");

export async function queryDocs(question: string): Promise<string> {
  const embedding = await openai.embeddings.create({
    input: question,
    model: "text-embedding-ada-002",
  });

  const results = await index.query({
    vector: embedding.data[0].embedding,
    topK: 5,
    includeMetadata: true,
  });

  const context = results.matches.map((match) => match.metadata?.text).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an AI assistant that answers questions based on documentation." },
      { role: "user", content: `Based on this documentation, answer: ${question}\n\n${context}` },
    ],
  });

  return response.choices[0].message.content ?? "";
}
