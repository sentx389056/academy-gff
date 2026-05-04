import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/generated/prisma";

const VALID_ROLES = new Set<string>(["USER", "STUDENT", "ADMIN"]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { id } = await params;
  const userId = parseInt(id);

  const body = await request.json();
  const { role } = body as { role: string };

  if (!VALID_ROLES.has(role)) {
    return NextResponse.json({ error: "Недопустимая роль" }, { status: 400 });
  }

  // Prevent removing the last admin
  if (role !== "ADMIN") {
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (target?.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Нельзя убрать роль у последнего администратора" }, { status: 400 });
      }
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
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
  const userId = parseInt(id);

  // Prevent deleting self
  if (session.id === userId) {
    return NextResponse.json({ error: "Нельзя удалить свой аккаунт" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}
