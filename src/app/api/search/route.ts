import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchStaticPages } from "@/lib/static-pages";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ courses: [], events: [], staff: [], news: [], practice: [], projects: [], pages: [] });
  }

  const search = { contains: q, mode: "insensitive" as const };

  const [courses, events, staff, news, practice, projects] = await Promise.all([
    prisma.course.findMany({
      where: { published: true, OR: [{ title: search }, { description: search }] },
      take: 5,
      select: { id: true, title: true, slug: true, description: true },
    }),
    prisma.event.findMany({
      where: { published: true, OR: [{ title: search }, { description: search }] },
      take: 5,
      select: { id: true, title: true, slug: true, date: true },
    }),
    prisma.staff.findMany({
      where: { OR: [{ name: search }, { position: search }, { department: search }] },
      take: 5,
      select: { id: true, name: true, position: true },
    }),
    prisma.news.findMany({
      where: { published: true, OR: [{ title: search }, { summary: search }] },
      take: 5,
      select: { id: true, title: true, slug: true, summary: true },
    }),
    prisma.practice.findMany({
      where: { published: true, OR: [{ title: search }, { summary: search }, { company: search }] },
      take: 5,
      select: { id: true, title: true, slug: true, category: true, company: true },
    }),
    prisma.project.findMany({
      where: { published: true, OR: [{ title: search }, { summary: search }] },
      take: 5,
      select: { id: true, title: true, slug: true, category: true, year: true },
    }),
  ]);

  const pages = searchStaticPages(q);

  return NextResponse.json({ courses, events, staff, news, practice, projects, pages });
}
