import { hash } from "bcrypt";
import { prisma } from "../init";
import { isEmpty } from "../isEmpty";
import { sign } from "jsonwebtoken";
import axios from "axios";
import { algoliaAdmin } from "@/lib/algolia";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (
      !username ||
      !password ||
      !email ||
      isEmpty([username, email, password])
    )
      return new Response("Please Fill All Fields", { status: 400 });

    const userCheck = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (userCheck) return new Response("User Already Exists", { status: 400 });

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      include: {
        posts: true,
        viewedPosts: true,
        followers: true,
        following: true,
        likedPosts: true,
        likedReplies: true,
        requests: true,
      },
    });

    await algoliaAdmin.saveObject({
      indexName: process.env.NEXT_PUBLIC_USERS_INDEX_NAME!,
      body: {
        objectID: user.id,
        ...user,
      },
    });
    const token = await sign(
      { username, id: user.id },
      process.env.JWT_SECRET as string
    );

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
