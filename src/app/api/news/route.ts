import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const take = parseInt(req.nextUrl.searchParams.get("take") || "100");
    const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0");
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      take,
      skip,
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка загрузки новостей" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, slug, summary, image, published, modules, date } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Название и slug обязательны" }, { status: 400 });
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        summary,
        image,
        published: published ?? false,
        modules: modules ?? [],
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка создания новости" }, { status: 500 });
  }
}
