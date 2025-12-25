import { verify, decode } from "jsonwebtoken";
import { prisma } from "../../init";
import { TJWT } from "@/app/types";
import { isEmpty } from "../../isEmpty";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        followers: true,
        following: true,
        viewedPosts: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    return Response.json(user);
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

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded = (await decode(authHeader)) as TJWT;
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });
    if (decoded.id !== id) return new Response("Unauthorized", { status: 401 });

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return Response.json(user);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function UPDATE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded = (await decode(authHeader)) as TJWT;

    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return new Response("User not found", { status: 404 });

    if (decoded.id !== user.id)
      return new Response("Unauthorized", { status: 401 });
    const { username, email } = await req.json();

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        username: username || username !== "" ? username : user.username,
        email: email || email !== "" ? email : user.email,
      },
    });

    return new Response("User updated");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
