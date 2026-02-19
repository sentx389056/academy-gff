import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { published: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка загрузки событий" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, slug, date, location, description, image, published, modules } = body;

    if (!title || !slug || !date) {
      return NextResponse.json(
        { error: "Название, slug и дата обязательны" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        date: new Date(date),
        location,
        description,
        image,
        published: published ?? false,
        modules: modules ?? [],
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания события" }, { status: 500 });
  }
}
