import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { title: true } }, event: { select: { title: true } } },
  });
  return NextResponse.json(applications);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, message, workplace, jobTitle, courseId, eventId, meta } = body;

    if (!name || !email || !type) {
      return NextResponse.json({ error: "Обязательные поля: name, email, type" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        type,
        name,
        email,
        phone: phone || null,
        message: message || null,
        workplace: workplace || null,
        jobTitle: jobTitle || null,
        courseId: courseId ? Number(courseId) : null,
        eventId: eventId ? Number(eventId) : null,
        meta: meta || {},
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка при создании заявки" }, { status: 500 });
  }
}
