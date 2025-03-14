import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Initialize Pinecone and OpenAI clients using environment variables
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Use the index name from env or fallback to "quickstart"
const indexName = process.env.PINECONE_INDEX_NAME || "quickstart";

/**
 * Attempts to create the index with the correct dimensions.
 * If the index already exists, logs a message and returns the existing index.
 */
async function createOrGetIndex(): Promise<any> {
  try {
    console.log(`Attempting to create index: ${indexName}`);
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // Dimension must match the output of text-embedding-ada-002
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: process.env.PINECONE_ENVIRONMENT || "us-east-1",
        },
      },
    });
    console.log(`Index "${indexName}" created successfully.`);
  } catch (error: any) {
    if (error.message && error.message.includes("ALREADY_EXISTS")) {
      console.log(`Index "${indexName}" already exists. Using existing index.`);
    } else {
      console.error("Error creating index:", error);
      throw error;
    }
  }
  return pinecone.Index(indexName);
}

/**
 * Splits the provided text into chunks, generates embeddings via OpenAI, 
 * and upserts each vector into the Pinecone index.
 */
export async function storeDocs(url: string, text: string): Promise<{ success: boolean; message: string }> {
  // Ensure the index exists or get the existing one
  const index = await createOrGetIndex();

  // Split text into manageable chunks (adjust regex as needed)
  const chunks = text.match(/.{1,500}/g) || [];
  
  for (const chunk of chunks) {
    try {
      // Generate embedding for the chunk
      const embeddingResponse = await openai.embeddings.create({
        input: chunk,
        model: "text-embedding-ada-002",
      });
      const embedding = embeddingResponse.data[0].embedding;
      
      // Generate a unique vector ID
      const vectorId = `${url}-${Math.random().toString(36).substring(2, 10)}`;
      console.log(`Upserting vector with ID: ${vectorId}`);
      
      // Upsert the vector (pass an array of records directly)
      await index.upsert([
        {
          id: vectorId,
          values: embedding,
          metadata: { url, text: chunk },
        },
      ]);
      console.log(`Upserted vector with ID: ${vectorId}`);
    } catch (upsertError) {
      console.error("Error upserting vector for chunk:", upsertError);
    }
  }

  return { success: true, message: "Docs stored successfully." };
}
