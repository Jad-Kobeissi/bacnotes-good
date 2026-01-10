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

    const userToBlock = await prisma.user.findUnique({
      where: { id },
      include: {
        blockedBy: true,
      },
    });

    if (!userToBlock) return new Response("User not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;
    if (userToBlock.blockedBy.some((u) => u.id == decoded.id))
      return new Response("User already blocked", { status: 400 });
    await prisma.user.update({
      where: { id },
      data: {
        blockedBy: {
          connect: {
            id: decoded.id,
          },
        },
      },
    });
    await prisma.user.update({
      where: { id: decoded.id as string },
      data: {
        blockedUsers: {
          connect: {
            id: userToBlock.id,
          },
        },
      },
    });

    return new Response("User blocked successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
