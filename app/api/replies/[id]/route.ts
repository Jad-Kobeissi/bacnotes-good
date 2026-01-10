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
      return new Response("Unauuthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    const { id } = await params;

    const request = await prisma.request.findUnique({ where: { id } });

    if (!request) return new Response("Request not found", { status: 404 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const replies = await prisma.reply.findMany({
      where: {
        requestId: id,
        author: {
          NOT: {
            OR: [
              {
                blockedBy: {
                  some: {
                    id: decoded.id as string,
                  },
                },
              },
              {
                blockedUsers: {
                  some: {
                    id: decoded.id as string,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        author: true,
        likedUsers: true,
      },
      take: 5,
      skip,
    });

    if (replies.length == 0)
      return new Response("No replies found", { status: 404 });

    return Response.json(replies);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
