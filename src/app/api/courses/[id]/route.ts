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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: courseInclude,
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
  const {
    title, slug, description, image, published, modules,
    duration, price, startDate, endDate,
    programTypeId, levelId, formatId, teacherIds,
    advantages, requirements,
  } = body;

  try {
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title, slug, description, image, published, modules,
        advantages: advantages ?? [],
        requirements: requirements ?? [],
        duration: duration || null,
        price: price || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        programTypeId: programTypeId || null,
        levelId: levelId || null,
        formatId: formatId || null,
        teachers: teacherIds !== undefined
          ? { set: (teacherIds as number[]).map((tid) => ({ id: tid })) }
          : undefined,
      },
      include: courseInclude,
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
