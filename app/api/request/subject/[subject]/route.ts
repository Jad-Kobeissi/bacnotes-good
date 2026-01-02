import { prisma } from "@/app/api/init";
import { Subject } from "@/app/generated/prisma/enums";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = decode(authHeader);

    const { subject } = await params;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const requests = await prisma.request.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        subject: subject as Subject,
      },
      include: {
        author: true,
        replies: true,
      },
      take: 5,
      skip,
    });

    if (requests.length === 0)
      return new Response("No requests found", { status: 404 });

    return Response.json(requests);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
