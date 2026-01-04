import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";
import { TJWT } from "@/app/types";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    if (!decoded.admin) return new Response("Forbidden", { status: 403 });
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * 5;

    const reports = await prisma.replyReport.findMany({
      skip,
      take: 5,
      include: { reply: true, reporter: true },
    });

    if (reports.length === 0)
      return new Response("No reports found", { status: 404 });

    return Response.json(reports);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
