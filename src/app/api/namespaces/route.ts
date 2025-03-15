import { Pinecone } from "@pinecone-database/pinecone";

export async function GET(): Promise<Response> {
  try {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

    const index = pinecone.Index("quickstart");
    const stats = await index.describeIndexStats();

    // Extract namespace names
    const namespaces: string[] = Object.keys(stats.namespaces || {}).filter(ns => ns.trim() !== "");

    console.log(namespaces);

    return new Response(JSON.stringify({ namespaces }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching namespaces:", error);
    
    return new Response(JSON.stringify({ error: "Failed to fetch namespaces" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
