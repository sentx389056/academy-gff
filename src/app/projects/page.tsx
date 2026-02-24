export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Проекты — Академия Госфильмофонда" };

const categoryColors: Record<string, string> = {
  Исследовательский: "bg-violet-100 text-violet-700",
  Прикладной: "bg-emerald-100 text-emerald-700",
  Студенческий: "bg-amber-100 text-amber-700",
};

export default async function ProjectsPage() {
  const items = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-14">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span className="text-white">Проекты</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Проекты</h1>
          <p className="text-slate-400 max-w-2xl">
            Исследовательские, прикладные и студенческие проекты в области кино и сохранения кинематографического наследия.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">Проекты скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/projects/${item.slug}`} className="group">
                <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {item.category && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category] || "bg-slate-100 text-slate-600"}`}>
                          {item.category}
                        </span>
                      )}
                      {item.year && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{item.year}</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-red-800 transition-colors line-clamp-3 mb-3">
                      {item.title}
                    </h3>

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
