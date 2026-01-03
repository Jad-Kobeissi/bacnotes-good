import { prisma } from "@/app/api/init";
import { TJWT } from "@/app/types";
import { decode, verify } from "jsonwebtoken";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.postReport.findUnique({ where: { id } });

    if (!post) return new Response("Post not found", { status: 404 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const postReports = await prisma.postReport.findMany({
      where: {
        postId: id,
      },
      take: 5,
      skip,

      include: {
        post: {
          include: {
            author: true,
            reports: true,
          },
        },
        reporter: true,
      },
    });

    if (postReports.length === 0)
      return new Response("No reports found", { status: 404 });

    return Response.json(postReports);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = (await decode(authHeader)) as TJWT;

    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });
    const reports = await prisma.postReport.findMany({
      where: {
        postId: id,
        reporterId: decoded.id,
      },
    });

    if (reports.length > 0)
      return new Response("You have already reported this post", {
        status: 409,
      });
    const report = await prisma.postReport.create({
      data: {
        postId: id,
        reporterId: decoded.id,
      },
    });

    return Response.json(report);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
