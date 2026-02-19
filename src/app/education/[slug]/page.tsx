export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";

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

  const modules = Array.isArray(course.modules) ? course.modules : [];

  return (
    <>
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <Link href="/education" className="hover:text-white">Образование</Link>
            {" / "}
            <span>{course.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
          {course.description && (
            <p className="text-gray-400 mt-2 max-w-2xl">{course.description}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {modules.length > 0 ? (
              <div className="module-content">
                <ModuleRenderer modules={modules as Module[]} />
              </div>
            ) : (
              <div className="prose max-w-none">
                <p className="text-gray-500">Содержание курса будет добавлено позже.</p>
              </div>
            )}
          </div>

          {/* Sidebar — Lessons */}
          <div>
            <div className="bg-[#f8fafc] rounded-xl p-5 sticky top-24">
              <h3 className="font-semibold text-[#1d1d1d] mb-4">
                Уроки курса
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  ({course.lessons.length})
                </span>
              </h3>
              {course.lessons.length > 0 ? (
                <ol className="flex flex-col gap-2">
                  {course.lessons.map((lesson, i) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/education/${course.slug}/${lesson.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group"
                      >
                        <span className="w-7 h-7 flex-shrink-0 rounded-full bg-[#8f1a1c] text-white text-xs flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700 group-hover:text-[#8f1a1c] transition-colors">
                          {lesson.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-400">Уроки скоро появятся</p>
              )}
            </div>
          </div>
        </div>
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
