import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });

  if (!event) {
    return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
  }

  return NextResponse.json(event);
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

  try {
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка обновления события" }, { status: 500 });
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
  await prisma.event.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
