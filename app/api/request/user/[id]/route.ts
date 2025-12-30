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

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        requests: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")!) | 1;
    const skip = (page - 1) * 5;
    const requests = await prisma.request.findMany({
      where: {
        authorId: id,
      },
      include: {
        author: true,
      },
      take: 5,
      skip,
    });
    if (requests.length == 0)
      return new Response("No Requests Found", { status: 404 });
    return Response.json(requests);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
