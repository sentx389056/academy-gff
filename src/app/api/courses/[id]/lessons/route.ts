import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lessons = await prisma.lesson.findMany({
    where: { courseId: parseInt(id) },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(lessons);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, order, modules } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Название и slug обязательны" }, { status: 400 });
  }

  try {
    const lesson = await prisma.lesson.create({
      data: {
        courseId: parseInt(id),
        title,
        slug,
        order: order ?? 0,
        modules: modules ?? [],
      },
    });
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания урока" }, { status: 500 });
  }
}
