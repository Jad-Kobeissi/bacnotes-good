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

    const postReport = await prisma.postReport.findUnique({
      where: { id },
      include: {
        post: {
          include: {
            reports: true,
          },
        },
        reporter: true,
      },
    });

    if (!postReport) return new Response("Not Found", { status: 404 });

    return Response.json(postReport);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;

    if (!decoded.admin) return new Response("forbidden", { status: 403 });
    const { id } = await params;

    const report = await prisma.postReport.findUnique({ where: { id } });

    if (!report) return new Response("Report not found", { status: 404 });

    await prisma.postReport.delete({
      where: { id },
    });

    return new Response("Report deleted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
