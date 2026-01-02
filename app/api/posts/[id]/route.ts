import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../../init";
import { TJWT } from "@/app/types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { algoliaAdmin } from "@/lib/algolia";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        viewedUsers: true,
        author: true,
        likedUsers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    return Response.json(post);
  } catch (err: any) {
    return new Response(err, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) return new Response("Post not found", { status: 404 });
    if (post.authorId !== decoded.id)
      return new Response("Unauthorized", { status: 401 });
    await prisma.post.delete({
      where: {
        id,
      },
    });

    await algoliaAdmin.deleteBy({
      indexName: process.env.NEXT_PUBLIC_POSTS_INDEX_NAME!,
      deleteByParams: {
        filters: `id:"${post.id}"`,
      },
    });

    await Promise.all(
      post.imagesUrl.map((url) => {
        deleteObject(ref(storage, url));
      })
    );
    return new Response("Post deleted successfully", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded = decode(authHeader) as TJWT;
    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return new Response("Post not found", { status: 404 });

    if (post.authorId !== decoded.id)
      return new Response("Unauthorized", { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const files = formData.getAll("files") as File[];

    let imagesUrl = post.imagesUrl;
    if (files.length > 0) {
      await Promise.all(
        post.imagesUrl.map(async (url) => {
          await deleteObject(ref(storage, url));
        })
      );

      imagesUrl = await Promise.all(
        files.map(async (file) => {
          const imageRef = ref(
            storage,
            `${process.env.postsBucket}/${post.id}-${crypto.randomUUID()}`
          );
          await uploadBytes(imageRef, file);

          return await getDownloadURL(imageRef);
        })
      );
    }

    const newPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title:
          title && title !== "" && title !== post.title ? title : post.title,
        content:
          content && content !== "" && content !== post.content
            ? content
            : post.content,
        imagesUrl,
      },
    });

    return Response.json(newPost);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
