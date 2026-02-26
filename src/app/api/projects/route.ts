import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const take = parseInt(searchParams.get("take") || "20");
  const skip = parseInt(searchParams.get("skip") || "0");

  const items = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take,
    skip,
    include: { category: true },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, summary, image, categoryId, year, published, modules } = body;

  const item = await prisma.project.create({
    data: {
      title, slug, summary, image,
      categoryId: categoryId || null,
      year: year || null,
      published: published ?? false,
      modules: modules ?? [],
    },
    include: { category: true },
  });
  return NextResponse.json(item, { status: 201 });
}
