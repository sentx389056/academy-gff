import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const group = await prisma.group.findUnique({
    where: { id: parseInt(id) },
    include: {
      users: { select: { id: true, name: true, email: true, role: true } },
      courses: { select: { id: true, title: true, slug: true } },
    },
  });
  if (!group) return NextResponse.json({ error: "Группа не найдена" }, { status: 404 });
  return NextResponse.json(group);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { id } = await params;
  const { name, userIds } = await request.json();

  try {
    const group = await prisma.group.update({
      where: { id: parseInt(id) },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(userIds !== undefined
          ? { users: { set: (userIds as number[]).map((uid) => ({ id: uid })) } }
          : {}),
      },
      include: {
        users: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return NextResponse.json(group);
  } catch {
    return NextResponse.json({ error: "Ошибка обновления группы" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.group.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
