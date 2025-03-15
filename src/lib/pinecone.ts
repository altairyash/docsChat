import { Index, Pinecone } from "@pinecone-database/pinecone";
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
async function createOrGetIndex(): Promise<Index> {
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
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("ALREADY_EXISTS")) {
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
export async function storeDocs(
  url: string,
  text: string,
  namespace: string
): Promise<{ success: boolean; message: string }> {
  const index = await createOrGetIndex();
  const space = index.namespace(namespace);

  // Split text into 500-character chunks
  const chunks = text.match(/.{1,500}/g) || [];
  const batchSize = 5; // Adjust batch size based on performance needs

  console.log(`Storing ${chunks.length} chunks in batches of ${batchSize}...`);

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    try {
      // Generate embeddings in parallel for better performance
      const embeddingResponses = await Promise.all(
        batch.map((chunk) =>
          openai.embeddings.create({
            input: chunk,
            model: "text-embedding-3-small",
          })
        )
      );

      // Prepare vectors for upserting
      const vectors = embeddingResponses.map((response, index) => ({
        id: `${url}-${Math.random().toString(36).substring(2, 10)}`,
        values: response.data[0].embedding,
        metadata: { url, text: batch[index] },
      }));

      console.log(`Upserting batch of ${vectors.length} vectors...`);

      // Upsert the entire batch
      await space.upsert(vectors);

      console.log(`Successfully upserted ${vectors.length} vectors.`);
    } catch (error) {
      console.error("Error processing batch:", error);
    }
  }

  return { success: true, message: "Docs stored successfully." };
}
