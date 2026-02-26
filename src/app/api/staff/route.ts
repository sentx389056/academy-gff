import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const staff = await prisma.staff.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { staffType: true },
  });
  return NextResponse.json(staff);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const body = await request.json();
  const { name, position, department, bio, image, staffTypeId, order } = body;

  if (!name || !position) {
    return NextResponse.json({ error: "Имя и должность обязательны" }, { status: 400 });
  }

  const person = await prisma.staff.create({
    data: {
      name, position, department, bio, image,
      staffTypeId: staffTypeId || null,
      order: order ?? 0,
    },
    include: { staffType: true },
  });

  return NextResponse.json(person, { status: 201 });
}
