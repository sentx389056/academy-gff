export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";
import CourseDetailTabs from "./CourseDetailTabs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  return {
    title: course
      ? `${course.title} — Академия Госфильмофонда России`
      : "Курс не найден",
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const modules = Array.isArray(course.modules) ? (course.modules as Module[]) : [];

  return (
    <>
      {/* ── Back link ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1170px] px-4 py-3">
          <Link
            href="/education"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Вернуться назад
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1170px] px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Image */}
            <div className="w-full lg:w-2/5 flex-shrink-0 rounded-xl overflow-hidden">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-60 lg:h-72 object-cover"
                />
              ) : (
                <div className="w-full h-60 lg:h-72 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-semibold">
                Программа повышения квалификации
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-4">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-slate-500 text-sm leading-relaxed mb-5">
                  {course.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Уровень обучения: Средний
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-800/10 text-red-800 border border-red-800/20 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  1 июня, 2026 — 24 июля, 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs + Content ── */}
      <div className="mx-auto max-w-[1170px] px-4 py-8">
        <CourseDetailTabs course={course} modules={modules} />
      </div>
    </>
  );
}

// Type for Module
type Module = {
  id: string;
  type: string;
  content: Record<string, unknown>;
};
