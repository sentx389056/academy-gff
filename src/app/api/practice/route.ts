import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const practiceInclude = { category: true, format: true };

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const take = parseInt(searchParams.get("take") || "20");
  const skip = parseInt(searchParams.get("skip") || "0");

  const items = await prisma.practice.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take,
    skip,
    include: practiceInclude,
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, summary, image, categoryId, company, formatId, deadline, published, modules } = body;

  const item = await prisma.practice.create({
    data: {
      title, slug, summary, image, company,
      categoryId: categoryId || null,
      formatId: formatId || null,
      deadline: deadline ? new Date(deadline) : null,
      published: published ?? false,
      modules: modules ?? [],
    },
    include: practiceInclude,
  });
  return NextResponse.json(item, { status: 201 });
}
