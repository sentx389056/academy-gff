export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TimelineClient from "./TimelineClient";

export const metadata = { title: "Новости — Академия Госфильмофонда России" };

export default async function News2Page() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  const byYear = news.reduce<Record<number, typeof news>>((acc, n) => {
    const year = new Date(n.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(n);
    return acc;
  }, {});

  const groups = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      items: byYear[year].map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        summary: n.summary,
        image: n.image,
        date: n.date.toISOString(),
      })),
    }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">Новости</span>
          </div>
          <h1 className="text-3xl font-bold">Новости</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[860px] px-4">
        {news.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">Новости скоро появятся</div>
        ) : (
          <TimelineClient groups={groups} />
        )}
      </div>
    </div>
  );
}
