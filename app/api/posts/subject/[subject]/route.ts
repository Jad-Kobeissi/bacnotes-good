import { prisma } from "@/app/api/init";
import { TJWT } from "@/app/types";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { subject } = await params;

    if (
      subject !== "ENGLISH" &&
      subject !== "ARABIC" &&
      subject !== "MATH" &&
      subject !== "FRENCH" &&
      subject !== "BIOLOGY" &&
      subject !== "PHYSICS" &&
      subject !== "CHEMISTRY" &&
      subject !== "GEOGRAPHY" &&
      subject !== "CIVICS" &&
      subject !== "HISTORY"
    ) {
      return new Response("Invalid subject", { status: 400 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * 5;
    const decoded = decode(authHeader) as TJWT;
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        subject,
      },
      include: {
        author: true,
        likedUsers: true,
        viewedUsers: true,
      },
      take: 5,
      skip,
    });

    if (posts.length == 0)
      return new Response("Posts not found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
