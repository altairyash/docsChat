import { Pinecone } from "@pinecone-database/pinecone";

export async function GET() {
  try {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

    const index = pinecone.Index("quickstart");
    const stats = await index.describeIndexStats();
    
    // Extract namespace names
    const namespaces = Object.keys(stats.namespaces || {}).filter(ns => ns.trim() !== "");
console.log(namespaces)
    return Response.json({ namespaces });
  } catch (error) {
    console.error("Error fetching namespaces:", error);
    return Response.json({ error: "Failed to fetch namespaces" }, { status: 500 });
  }
}
