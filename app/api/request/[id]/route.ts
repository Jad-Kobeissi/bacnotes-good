import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";
import { TJWT } from "@/app/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const request = await prisma.request.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!request) return new Response("Response Not Found", { status: 404 });

    return Response.json(request);
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

    const decoded = (await decode(authHeader)) as TJWT;
    const { id } = await params;

    const request = await prisma.request.findUnique({
      where: {
        id,
      },
    });

    if (!request) return new Response("Request not found", { status: 404 });

    if (decoded.id !== request.authorId)
      return new Response("Unauthorized", { status: 401 });

    await prisma.request.delete({
      where: {
        id,
      },
    });

    return new Response("Request deleted");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
