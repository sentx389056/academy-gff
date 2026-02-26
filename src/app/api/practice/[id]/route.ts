import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const practiceInclude = { category: true, format: true };

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.practice.findUnique({
    where: { id: parseInt(id) },
    include: practiceInclude,
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { title, slug, summary, image, categoryId, company, formatId, deadline, published, modules } = body;

  const item = await prisma.practice.update({
    where: { id: parseInt(id) },
    data: {
      title, slug, summary, image, company,
      categoryId: categoryId || null,
      formatId: formatId || null,
      deadline: deadline ? new Date(deadline) : null,
      published,
      modules,
    },
    include: practiceInclude,
  });
  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.practice.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
