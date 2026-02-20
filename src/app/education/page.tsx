export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Программы обучения — Академия Госфильмофонда России",
};

export default async function EducationPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span>Программы обучения</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Программы обучения</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Профессиональные курсы в области киноискусства и наследия
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-8">
        {courses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {courses.map((course) => (
              <Link key={course.id} href={`/education/${course.slug}`}>
                <article className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col sm:flex-row group">
                  {/* Image */}
                  <div className="sm:w-52 md:w-60 flex-shrink-0">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-36 sm:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 sm:h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                        Программа повышения квалификации
                      </p>
                      <h2 className="font-bold text-slate-900 mb-2 group-hover:text-red-800 transition-colors text-base">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        {course.lessons.length}{" "}
                        {course.lessons.length === 1 ? "урок" : course.lessons.length < 5 ? "урока" : "уроков"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 border border-red-800/30 px-3 py-1 rounded ml-auto">
                        Подробнее
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-600 mb-1">Курсы скоро появятся</h2>
            <p className="text-slate-400 text-sm">Мы работаем над подготовкой образовательных программ</p>
          </div>
        )}
      </div>
    </>
  );
}
