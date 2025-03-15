import { queryDocs } from "@/lib/query";
import { LRUCache } from "lru-cache";

// Set up an in-memory rate limiter using LRU cache
const rateLimit = new LRUCache<string, number>({
  max: 100, // Store up to 100 unique IPs
  ttl: 60 * 1000, // Reset limit every 60 seconds (1 minute)
});

export async function POST(req: Request) {
  try {
    // Extract user IP (fallback for local development)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "local";

    // Rate limiting: Allow only 5 requests per IP per minute
    const currentCount = rateLimit.get(ip) ?? 0;
    if (currentCount >= 5) {
      return Response.json({ success: false, message: "Too many requests. Try again later." }, { status: 429 });
    }
    rateLimit.set(ip, currentCount + 1);

    // Validate input
    const { question, namespace }: { question: string; namespace: string } = await req.json();
    if (!question || typeof question !== "string" || question.length > 500) {
      return Response.json({ success: false, message: "Invalid question." }, { status: 400 });
    }
    if (!namespace || typeof namespace !== "string" || namespace.length > 100) {
      return Response.json({ success: false, message: "Invalid namespace." }, { status: 400 });
    }

    // Process query
    const answer = await queryDocs(question, namespace);
    return Response.json({ success: true, answer });
  } catch (error) {
    console.error("Error in query API:", error);
    return Response.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
