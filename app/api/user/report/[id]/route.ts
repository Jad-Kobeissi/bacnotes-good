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

    const decoded = decode(authHeader) as TJWT;

    if (!decoded.admin) return new Response("Forbidden", { status: 403 });
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return new Response("User not found", { status: 404 });

    const reportExists = await prisma.userReport.findFirst({
      where: {
        reporterId: decoded.id,
        userId: id,
      },
    });

    if (reportExists)
      return new Response("You have already reported this user", {
        status: 400,
      });
    const userReport = await prisma.userReport.create({
      data: {
        reporterId: decoded.id,
        userId: id,
      },
    });

    return Response.json(userReport);
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

    const report = await prisma.userReport.findUnique({ where: { id } });

    if (!report) return new Response("Report not found", { status: 404 });

    await prisma.userReport.delete({ where: { id } });

    return new Response("Report deleted successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
