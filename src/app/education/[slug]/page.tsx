import {Calendar, ChartNoAxesColumnIncreasing, ChevronLeft, Film} from "lucide-react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format as fmtDate } from "date-fns";
import { ru } from "date-fns/locale";
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
    include: { lessons: { orderBy: { order: "asc" } }, programType: true, level: true, format: true, teachers: true },
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
              <ChevronLeft size={16} />
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
                  <Film size={64} className="text-white/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {course.programType && (
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-semibold">
                  {course.programType.name}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-4 break-words">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-slate-500 text-sm leading-relaxed mb-5 text-wrap break-words">
                  {course.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {course.level && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full">
                      <ChartNoAxesColumnIncreasing strokeWidth={4} size={12}/>
                    Уровень обучения: {course.level.name}
                  </span>
                )}
                {course.startDate && course.endDate && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-800/10 text-red-800 border border-red-800/20 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    {fmtDate(course.startDate, "d MMMM yyyy", { locale: ru })} — {fmtDate(course.endDate, "d MMMM yyyy", { locale: ru })}
                  </span>
                )}
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
