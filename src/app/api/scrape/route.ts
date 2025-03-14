import { scrapeDocs } from "@/lib/scraper";
import { storeDocs } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { url }: { url: string } = await req.json();
    const text = await scrapeDocs(url);
    if (text) {
      await storeDocs(url, text);
      return Response.json({ success: true, message: "Docs scraped and stored." });
    }
    return Response.json({ success: false, message: "Failed to scrape." }, { status: 500 });
  } catch (error: any) {
    console.error("API POST Error:", error);
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
