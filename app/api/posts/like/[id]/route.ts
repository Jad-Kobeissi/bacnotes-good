import { prisma } from "@/app/api/init";
import { TJWT } from "@/app/types";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const postToLike = (await params).id;
    const { id } = (await decode(authHeader)) as TJWT;

    const post = await prisma.post.findUnique({
      where: {
        id: postToLike,
      },
      include: {
        likedUsers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        likedPosts: true,
        followers: true,
        following: true,
        posts: true,
        viewedPosts: true,
      },
    });
    if (!user) return new Response("User not found", { status: 404 });

    if (post.likedUsers.some((u) => u.id === user.id)) {
      return new Response("Post already liked", { status: 400 });
    }

    await prisma.post.update({
      where: {
        id: postToLike,
      },
      data: {
        likedUsers: {
          connect: { id: user.id },
        },
        likes: post.likes + 1,
      },
    });

    return Response.json(user);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
