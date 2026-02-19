import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: parseInt(lessonId) } });
  if (!lesson) return NextResponse.json({ error: "Урок не найден" }, { status: 404 });
  return NextResponse.json(lesson);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { lessonId } = await params;
  const body = await request.json();

  try {
    const lesson = await prisma.lesson.update({
      where: { id: parseInt(lessonId) },
      data: {
        title: body.title,
        slug: body.slug,
        order: body.order ?? 0,
        modules: body.modules ?? [],
      },
    });
    return NextResponse.json(lesson);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка обновления урока" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { lessonId } = await params;
  await prisma.lesson.delete({ where: { id: parseInt(lessonId) } });
  return NextResponse.json({ success: true });
}
