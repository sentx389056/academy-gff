import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");

  const docs = await prisma.document.findMany({
    where: page ? { page } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, category, page, fileUrl } = body;

  if (!title || !fileUrl) {
    return NextResponse.json({ error: "title и fileUrl обязательны" }, { status: 400 });
  }

  const doc = await prisma.document.create({
    data: { title, category: category || "Документы", page: page || null, fileUrl },
  });

  return NextResponse.json(doc, { status: 201 });
}
