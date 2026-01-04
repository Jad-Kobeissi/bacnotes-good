import { prisma } from "@/app/api/init";
import { TJWT } from "@/app/types";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const reply = await prisma.reply.findUnique({
      where: {
        id,
      },
    });

    if (!reply) return new Response("Reply not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;
    const reportExists = await prisma.replyReport.findFirst({
      where: {
        replyId: id,
        reporterId: decoded.id,
      },
    });
    if (reportExists)
      return new Response("You have already reported this reply", {
        status: 409,
      });
    const report = await prisma.replyReport.create({
      data: {
        replyId: id,
        reporterId: decoded.id,
      },
    });

    return new Response("Reply reported successfully", { status: 200 });
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

    const { id } = await params;

    const decoded = decode(authHeader) as TJWT;
    if (!decoded.admin) return new Response("Forbidden", { status: 403 });
    const report = await prisma.replyReport.findUnique({ where: { id } });

    if (!report) return new Response("Report not found", { status: 404 });

    await prisma.replyReport.delete({ where: { id } });

    return new Response("Reply deleted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
