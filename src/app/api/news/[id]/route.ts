import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id: parseInt(id) } });
  if (!news) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(news);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const { title, slug, summary, image, published, modules, date } = body;

  const news = await prisma.news.update({
    where: { id: parseInt(id) },
    data: {
      title,
      slug,
      summary,
      image,
      published,
      modules,
      date: date ? new Date(date) : undefined,
    },
  });
  return NextResponse.json(news);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN")
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });

  const { id } = await params;
  await prisma.news.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
