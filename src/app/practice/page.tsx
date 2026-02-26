export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Практика и стажировки — Академия Госфильмофонда" };

const categoryColors: Record<string, string> = {
  Практика: "bg-blue-100 text-blue-700",
  Стажировка: "bg-amber-100 text-amber-700",
};

export default async function PracticePage() {
  const items = await prisma.practice.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { category: true, format: true },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-14">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">Практика и стажировки</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Практика и стажировки</h1>
          <p className="text-slate-400 max-w-2xl">
            Возможности для профессионального развития: практика в ведущих кинематографических организациях и стажировки у опытных специалистов.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">Записи о практике скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/practice/${item.slug}`} className="group">
                <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {item.category && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category.name] || "bg-slate-100 text-slate-600"}`}>
                          {item.category.name}
                        </span>
                      )}
                      {item.format && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{item.format.name}</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-red-800 transition-colors line-clamp-3 mb-3">
                      {item.title}
                    </h3>

                    {item.company && (
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1 min-w-0">
                        <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="truncate">{item.company}</span>
                      </p>
                    )}

                    {item.deadline && (
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Дедлайн: {new Date(item.deadline).toLocaleDateString("ru-RU")}
                      </p>
                    )}

                    {item.summary && (
                      <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-red-800 group-hover:gap-2 transition-all">
                      Подробнее
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
