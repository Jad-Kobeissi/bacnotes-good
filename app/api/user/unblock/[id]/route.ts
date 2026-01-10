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

    const userToUnblock = await prisma.user.findUnique({
      where: { id },
      include: { blockedBy: true },
    });

    if (!userToUnblock) return new Response("User not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (!userToUnblock.blockedBy.some((u) => u.id === decoded.id))
      return new Response("User is not blocked", { status: 400 });

    await prisma.user.update({
      where: { id: userToUnblock.id },
      data: {
        blockedBy: {
          disconnect: { id: decoded.id },
        },
      },
    });

    await prisma.user.update({
      where: { id: decoded.id as string },
      data: {
        blockedUsers: {
          disconnect: {
            id: userToUnblock.id,
          },
        },
      },
    });
    return new Response("User unblocked successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
