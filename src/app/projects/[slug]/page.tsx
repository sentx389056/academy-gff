export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.project.findUnique({ where: { slug, published: true } });
  if (!item) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules = (Array.isArray(item.modules) ? item.modules : []) as any[];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-white transition-colors">Проекты</Link>
            <span>/</span>
            <span className="text-white line-clamp-1">{item.title}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {item.category && (
              <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-full">{item.category}</span>
            )}
            {item.year && (
              <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-full">{item.year}</span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold max-w-3xl leading-tight break-words">{item.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full rounded-xl object-cover max-h-96 mb-8" />
            )}
            {item.summary && (
              <p className="text-base text-slate-700 leading-relaxed mb-8 font-medium border-l-4 border-red-800 pl-5 break-words">
                {item.summary}
              </p>
            )}
            {modules.length > 0 && <ModuleRenderer modules={modules} />}
          </div>

          <div className="space-y-4">
            {item.category && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Категория</h3>
                <p className="text-sm font-medium text-slate-900">{item.category}</p>
              </div>
            )}
            {item.year && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Год</h3>
                <p className="text-sm font-medium text-slate-900">{item.year}</p>
              </div>
            )}
            <Link
              href="/projects"
              className="flex items-center gap-2 text-sm text-red-800 hover:text-red-900 font-medium transition-colors"
            >
              ← Все проекты
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
