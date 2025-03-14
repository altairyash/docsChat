import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeDocs(url: string): Promise<string | null> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data as string);

    let textContent = "";
    $("p, h1, h2, h3, h4, h5, h6, li").each((_, element) => {
      textContent += $(element).text() + "\n";
    });

    return textContent;
  } catch (error) {
    console.error("Error scraping:", error);
    return null;
  }
}
