import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../../init";
import { TJWT } from "@/app/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    const { id } = await params;

    if (!decoded.admin) return new Response("Forbidden", { status: 403 });
    const request = await prisma.request.findUnique({ where: { id } });

    if (!request) return new Response("Request not found", { status: 404 });

    const reportExists = await prisma.requestReport.findFirst({
      where: {
        requestId: id,
        reporterId: decoded.id,
      },
    });

    if (reportExists)
      return new Response("You have already reported this request", {
        status: 400,
      });
    await prisma.requestReport.create({
      data: {
        requestId: id,
        reporterId: decoded.id,
      },
    });

    return new Response("Request reported successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    if (!decoded.admin) return new Response("Forbidden", { status: 403 });
    const { id } = await params;

    const report = await prisma.requestReport.findFirst({
      where: { id: id },
      include: { reporter: true, request: true },
    });

    if (!report) return new Response("No reports found", { status: 404 });

    return Response.json(report);
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
    if (!decoded.admin) return new Response("Forbidden", { status: 403 });
    const { id } = await params;

    const report = await prisma.requestReport.findFirst({
      where: { id: id },
    });
    if (!report) return new Response("No reports found", { status: 404 });

    await prisma.requestReport.deleteMany({ where: { id } });

    return new Response("Report deleted successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
