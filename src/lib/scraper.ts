import got from "got";
import * as cheerio from "cheerio";
import PQueue from "p-queue";

const cache = new Map<string, string>();
const queue = new PQueue({ concurrency: 5 }); // Limits 5 requests at a time
const MAX_PAGES = 20; // Limits total pages scraped

export async function scrapeDocs(url: string): Promise<string | null> {
  if (cache.has(url)) return cache.get(url) || null;

  try {
    const { body } = await got(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(body);
    const textContent = $("body").text().replace(/\s+/g, " ").trim();

    cache.set(url, textContent);
    return textContent;
  } catch (error) {
    console.error("Error scraping:", url, error);
    return null;
  }
}

export async function scrapeFullDocs(baseUrl: string): Promise<string | null> {
  try {
    const visited = new Set<string>();
    const pagesToVisit = new Set<string>([baseUrl]);

    while (pagesToVisit.size > 0 && visited.size < MAX_PAGES) {
      const urls = [...pagesToVisit].splice(0, 5); // Scrape 5 pages at a time
      pagesToVisit.clear();

      const results = await Promise.allSettled(urls.map((url) => queue.add(() => scrapeDocs(url))));
      results.forEach((res, i) => {
        if (res.status === "fulfilled" && res.value) {
          visited.add(urls[i]);
        }
      });

      // Extract new links to scrape
      for (const url of visited) {
        const { body } = await got(url);
        const $ = cheerio.load(body);

        $("a[href]").each((_, element) => {
          const href = $(element).attr("href");
          if (href) {
            const fullUrl = new URL(href, baseUrl).href;
            if (!visited.has(fullUrl) && visited.size < MAX_PAGES) {
              pagesToVisit.add(fullUrl);
            }
          }
        });
      }
    }

    return [...visited].map((url) => cache.get(url)).join("\n");
  } catch (error) {
    console.error("Error scraping full docs:", error);
    return null;
  }
}
