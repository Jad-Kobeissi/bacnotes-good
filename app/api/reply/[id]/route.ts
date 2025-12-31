import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../../init";
import { isEmpty } from "../../isEmpty";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { TJWT } from "@/app/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const reply = await prisma.reply.findUnique({
      where: { id },
      include: {
        author: true,
        likedUsers: true,
        request: true,
      },
    });

    if (!reply) return new Response("Reply not found", { status: 404 });

    return Response.json(reply);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const request = await prisma.request.findUnique({ where: { id } });
    if (!request) return new Response("Request not found", { status: 404 });

    const decoded: any = decode(authHeader);

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    if (!content || isEmpty([content]))
      return new Response("Please fill all fields", { status: 400 });

    let reply = await prisma.reply.create({
      data: {
        content,
        authorId: decoded.id,
        requestId: id,
      },
    });

    if (files.length > 0) {
      let imageUrls: string[] = [];
      imageUrls = await Promise.all(
        files.map(async (file) => {
          const imageRef = ref(
            storage,
            `${process.env.repliesBucket}/${reply.id}-${crypto.randomUUID()}`
          );
          await uploadBytes(imageRef, file);
          return await getDownloadURL(imageRef);
        })
      );

      await prisma.reply.update({
        where: {
          id: reply.id,
        },
        data: {
          imageUrls,
        },
      });
    }
    const replies = await prisma.reply.findMany({
      where: {
        requestId: id,
      },
      include: {
        author: true,
        likedUsers: true,
        request: true,
      },
    });

    return Response.json(replies);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const reply = await prisma.reply.findUnique({
      where: {
        id,
      },
    });

    if (!reply) return new Response("Reply not found", { status: 404 });

    const decoded = decode(authHeader) as TJWT;

    if (reply.authorId !== decoded.id)
      return new Response("Unauthorized", { status: 401 });

    await prisma.reply.delete({
      where: { id },
    });

    if (reply.imageUrls.length > 0) {
      await Promise.all(
        reply.imageUrls.map(async (url) => {
          const imageRef = ref(storage, url);

          await deleteObject(imageRef);
        })
      );
    }

    return new Response("Reply deleted");
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

    const { id } = await params;

    const reply = await prisma.reply.findUnique({ where: { id } });

    if (!reply) return new Response("Reply not found", { status: 404 });

    const formData = await req.formData();

    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    let imageUrls: string[] = [];

    if (files.length > 0) {
      await Promise.all(
        reply.imageUrls.map(async (url) => {
          await deleteObject(ref(storage, url));
        })
      );

      imageUrls = await Promise.all(
        files.map(async (file) => {
          const imageRef = ref(
            storage,
            `${process.env.repliesBucket}/${reply.id}-${crypto.randomUUID()}`
          );

          await uploadBytes(imageRef, file);

          return await getDownloadURL(imageRef);
        })
      );
    }

    const newReply = await prisma.reply.update({
      where: {
        id,
      },
      data: {
        content:
          content && content != "" && content != reply.content
            ? content
            : reply.content,
        imageUrls: imageUrls.length == 0 ? reply.imageUrls : imageUrls,
      },
    });

    return Response.json(newReply);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
