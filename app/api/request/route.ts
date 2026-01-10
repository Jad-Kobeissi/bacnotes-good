import { decode, verify } from "jsonwebtoken";
import { prisma } from "../init";
import { isEmpty } from "../isEmpty";
import { TJWT } from "@/app/types";
import { algoliaAdmin } from "@/lib/algolia";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 400 });

    const decoded = decode(authHeader) as TJWT;
    const requests = await prisma.request.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        author: {
          grade: decoded.grade as number,
          NOT: {
            OR: [
              {
                blockedBy: {
                  some: {
                    id: decoded.id as string,
                  },
                },
              },
              {
                blockedUsers: {
                  some: {
                    id: decoded.id as string,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        author: true,
        replies: true,
      },
    });

    if (requests.length == 0)
      return new Response("No Requests Found", { status: 404 });

    return Response.json(requests);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    const { title, content, subject } = await req.json();

    if (!title || !content || !subject || isEmpty([title, content, subject]))
      return new Response("Bad Body", { status: 400 });

    const request = await prisma.request.create({
      data: {
        title,
        content,
        subject,
        authorId: decoded.id,
      },
      include: {
        author: true,
        replies: true,
      },
    });

    algoliaAdmin.saveObject({
      indexName: process.env.NEXT_PUBLIC_REQUESTS_INDEX_NAME as string,
      body: {
        objectID: request.id,
        ...request,
      },
    });

    return new Response("Request Created");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
