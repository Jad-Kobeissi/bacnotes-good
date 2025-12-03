import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../init";
import { TJWT } from "@/app/types";
import { isEmpty } from "../isEmpty";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: TJWT = decode(authHeader) as TJWT;
    const posts = await prisma.post.findMany({
      where: {
        viewedUsers: {
          none: {
            id: decoded.id as string,
          },
        },
      },
      include: {
        author: {
          include: {
            posts: true,
            viewedPosts: true,
          },
        },
        viewedUsers: {
          include: {
            posts: true,
          },
        },
      },
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    await Promise.all(
      posts.map(async (post) => {
        await prisma.user.update({
          where: {
            id: decoded.id as string,
          },
          data: {
            viewedPosts: {
              connect: {
                id: post.id,
              },
            },
          },
        });
      })
    );

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: TJWT = decode(authHeader) as TJWT;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    if (!title || !content || isEmpty([title, content]))
      return new Response("Please Fill All Fields", { status: 400 });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: decoded.id,
      },
    });

    const filesUrl = await Promise.all(
      files.map(async (file) => {
        const imageRef = ref(
          storage,
          `images/${post.id}--${crypto.randomUUID()}`
        );
        await uploadBytes(imageRef, file);
        return (await getDownloadURL(imageRef)) as string;
      })
    );

    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        imagesUrl: filesUrl,
      },
    });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
