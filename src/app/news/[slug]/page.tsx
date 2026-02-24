export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({ where: { slug, published: true } });
  if (!news) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules = (Array.isArray(news.modules) ? news.modules : []) as any[];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-white transition-colors">Новости</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{news.title}</span>
          </div>
          <p className="text-slate-400 text-sm mb-3">
            {new Date(news.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold max-w-3xl leading-tight break-words">{news.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {news.image && (
              <img src={news.image} alt={news.title} className="w-full rounded-xl object-cover max-h-96 mb-8" />
            )}
            {news.summary && (
              <p className="text-base text-slate-700 leading-relaxed mb-8 font-medium border-l-4 border-red-800 pl-5 break-words">
                {news.summary}
              </p>
            )}
            {modules.length > 0 && <ModuleRenderer modules={modules} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Дата публикации</h3>
              <p className="text-sm text-slate-600">
                {new Date(news.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-2 text-sm text-red-800 hover:text-red-900 font-medium transition-colors"
            >
              ← Все новости
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
