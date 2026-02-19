export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Образование — Академия Госфильмофонда России",
};

export default async function EducationPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  return (
    <>
      {/* Page Header */}
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <span>Образование</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Образовательные программы</h1>
          <p className="text-gray-400 mt-2">
            Профессиональные курсы в области киноискусства и наследия
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-[1170px] px-4">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/education/${course.slug}`}>
                  <article className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-[#8f1a1c] to-[#0f172a] flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="font-semibold text-[#1d1d1d] mb-2 group-hover:text-[#8f1a1c] transition-colors">
                        {course.title}
                      </h2>
                      {course.description && (
                        <p className="text-sm text-gray-500 line-clamp-3 flex-1">
                          {course.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {course.lessons.length} {course.lessons.length === 1 ? "урок" : "уроков"}
                        </span>
                        <span className="text-xs font-medium text-[#8f1a1c]">
                          Подробнее →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Курсы скоро появятся
              </h2>
              <p className="text-gray-500 text-sm">
                Мы работаем над подготовкой образовательных программ
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
