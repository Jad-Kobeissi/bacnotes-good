import { prisma } from "@/app/api/init";
import { verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const id = (await params).id;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        following: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });
    if (user.following.length == 0)
      return new Response("No following", { status: 404 });

    return Response.json(user.following);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
