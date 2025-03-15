import { scrapeDocs } from "@/lib/scraper";
import { storeDocs } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { url, namespace }: { url: string, namespace:string } = await req.json();
    const text = await scrapeDocs(url);
    if (text) {
      await storeDocs(url, text, namespace);
      return Response.json({ success: true, message: "Docs scraped and stored." });
    }
    return Response.json({ success: false, message: "Failed to scrape." }, { status: 500 });
    } catch (error: unknown) {
    console.error("API POST Error:", error);
    const errorMessage = (error instanceof Error) ? error.message : "Internal server error";
    return Response.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
