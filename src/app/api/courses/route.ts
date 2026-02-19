import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка загрузки курсов" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, image, published, modules } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Название и slug обязательны" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: { title, slug, description, image, published: published ?? false, modules: modules ?? [] },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания курса" }, { status: 500 });
  }
}
