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

    const userId = (await params).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: true,
        following: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    if (user.followers.length == 0)
      return new Response("No followers", { status: 404 });
    return Response.json(user.followers);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const userIdToFollow = (await params).id;

    const { id } = decode(authHeader) as TJWT;

    if (id === userIdToFollow)
      return new Response("You cannot follow yourself", { status: 400 });

    const userToFollow = await prisma.user.findUnique({
      where: { id: userIdToFollow },
    });
    if (!userToFollow)
      return new Response("User to follow not found", { status: 404 });

    const followingUser = await prisma.user.findUnique({
      where: { id },
      include: { following: true },
    });
    if (!followingUser)
      return new Response("There was an error", { status: 500 });

    if (followingUser.following.some((user) => user.id === userIdToFollow))
      return new Response("You are already following this user", {
        status: 400,
      });

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        following: {
          connect: {
            id: userIdToFollow,
          },
        },
      },
      include: {
        followers: true,
        following: true,
      },
    });
    await prisma.user.update({
      where: {
        id: userIdToFollow,
      },
      data: {
        followers: {
          connect: {
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
