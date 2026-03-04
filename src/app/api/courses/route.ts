import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const courseInclude = {
  lessons: { orderBy: { order: "asc" as const } },
  programType: true,
  level: true,
  format: true,
  teachers: { select: { id: true, name: true, position: true, image: true } },
};

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: courseInclude,
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
    const {
      title, slug, description, image, published, modules,
      duration, price, startDate, endDate,
      programTypeId, levelId, formatId, teacherIds,
      advantages, requirements,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Название и slug обязательны" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title, slug, description, image,
        published: published ?? false,
        modules: modules ?? [],
        advantages: advantages ?? [],
        requirements: requirements ?? [],
        duration: duration || null,
        price: price || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        programTypeId: programTypeId || null,
        levelId: levelId || null,
        formatId: formatId || null,
        teachers: teacherIds?.length
          ? { connect: (teacherIds as number[]).map((id) => ({ id })) }
          : undefined,
      },
      include: courseInclude,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания курса" }, { status: 500 });
  }
}
