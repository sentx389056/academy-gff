import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true, courses: true } } },
  });
  return NextResponse.json(groups);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { name } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Название группы обязательно" }, { status: 400 });
  }

  try {
    const group = await prisma.group.create({ data: { name: name.trim() } });
    return NextResponse.json(group, { status: 201 });
  } catch (error: unknown) {
    const isUniqueViolation =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";
    return NextResponse.json(
      { error: isUniqueViolation ? "Группа с таким названием уже существует" : "Ошибка создания группы" },
      { status: 400 }
    );
  }
}
