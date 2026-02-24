export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Новости — Академия Госфильмофонда России" };

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

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

      <div className="mx-auto max-w-[1170px] px-4 py-12">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="group">
                <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  {n.image ? (
                    <img src={n.image} alt={n.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-slate-400 mb-2">
                      {new Date(n.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <h2 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-red-800 transition-colors flex-1">
                      {n.title}
                    </h2>
                    {n.summary && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{n.summary}</p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-sm">Новости скоро появятся</p>
          </div>
        )}
      </div>
    </div>
  );
}
