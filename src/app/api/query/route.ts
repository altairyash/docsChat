import { queryDocs } from "@/lib/query";

export async function POST(req: Request) {
  const { question, namespace }: { question: string, namespace: string  } = await req.json();
  const answer = await queryDocs(question,namespace);

  return Response.json({ success: true, answer });
}
