import { compare } from "bcrypt";
import { prisma } from "../init";
import { isEmpty } from "../isEmpty";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || isEmpty([email, password]))
      return new Response("Please Fill all Fields", { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
        viewedPosts: true,
        followers: true,
        following: true,
        likedPosts: true,
        likedReplies: true,
        requests: true,
        blockedBy: true,
        blockedUsers: true,
        replies: true,
        reports: true,
        PostReports: true,
        ReplyReports: true,
        RequestReports: true,
        userReports: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    const passCorrect = await compare(password, user.password);
    if (!passCorrect)
      return new Response("Incorrect Password", { status: 400 });

    const token = await sign(
      {
        id: user.id,
        username: user.username,
        email,
        admin: user.admin,
        grade: user.grade,
      },
      process.env.JWT_SECRET as string
    );

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
