import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    const person = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        position: body.position,
        department: body.department,
        bio: body.bio,
        image: body.image,
        staffTypeId: body.staffTypeId || null,
        order: body.order ?? 0,
      },
      include: { staffType: true },
    });
    return NextResponse.json(person);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
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
  await prisma.staff.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
