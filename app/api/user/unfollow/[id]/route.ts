import { TJWT } from "@/app/types";
import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../../init";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const idToUnfollow = (await params).id;
    const { id } = (await decode(authHeader)) as TJWT;

    const userToUnfollow = await prisma.user.findUnique({
      where: {
        id: idToUnfollow,
      },
      select: {
        followers: true,
      },
    });

    if (!userToUnfollow) {
      return new Response("User not found", { status: 404 });
    }
    if (!userToUnfollow.followers.some((f) => f.id === id)) {
      return new Response("You are not following this user", { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        following: {
          disconnect: {
            id: idToUnfollow,
          },
        },
      },
    });
    await prisma.user.update({
      where: {
        id: idToUnfollow,
      },
      data: {
        followers: {
          disconnect: {
            id: id,
          },
        },
      },
    });

    return Response.json(user);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
