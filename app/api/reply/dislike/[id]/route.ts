import { prisma } from "@/app/api/init";
import { TJWT } from "@/app/types";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const reply = await prisma.reply.findUnique({
      where: { id },
      include: {
        author: true,
        likedUsers: true,
        request: true,
      },
    });

    if (!reply) return new Response("Reply not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (!reply.likedUsers.some((u) => u.id == decoded.id))
      return new Response("Reply not liked", { status: 409 });

    await prisma.reply.update({
      where: {
        id,
      },
      data: {
        likes: reply.likes - 1,
        likedUsers: {
          disconnect: {
            id: decoded.id,
          },
        },
      },
    });

    return new Response("Reply like");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
