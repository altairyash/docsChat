import { queryDocs } from "@/lib/query";

export async function POST(req: Request) {
  const { question }: { question: string } = await req.json();
  const answer = await queryDocs(question);

  return Response.json({ success: true, answer });
}
