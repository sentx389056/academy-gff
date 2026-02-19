import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) {
    return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
  }

  return NextResponse.json(course);
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
  const body = await request.json();
  const { title, slug, description, image, published, modules } = body;

  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, slug, description, image, published, modules },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка обновления курса" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.course.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
