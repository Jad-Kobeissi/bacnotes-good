import { prisma } from "@/app/api/init";
import { verify } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * 5;
    const reports = await prisma.userReport.findMany({
      where: {},
      include: {
        reporter: true,
        user: true,
      },
      skip,
      take: 5,
    });

    if (reports.length === 0)
      return new Response("No reports found", { status: 404 });

    return Response.json(reports);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
