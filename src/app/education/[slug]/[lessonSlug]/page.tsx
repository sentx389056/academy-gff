export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";

type Module = { id: string; type: string; content: Record<string, unknown> };

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) notFound();

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = course.lessons[currentIndex - 1];
  const nextLesson = course.lessons[currentIndex + 1];
  const modules = Array.isArray(lesson.modules) ? (lesson.modules as Module[]) : [];

  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <Link href="/education" className="hover:text-white">Образование</Link>
            {" / "}
            <Link href={`/education/${course.slug}`} className="hover:text-white">{course.title}</Link>
            {" / "}
            <span>{lesson.title}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">{lesson.title}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-slate-50 rounded-xl p-4 sticky top-24">
              <h3 className="font-semibold text-sm text-slate-900 mb-3">
                {course.title}
              </h3>
              <ol className="flex flex-col gap-1">
                {course.lessons.map((l, i) => (
                  <li key={l.id}>
                    <Link
                      href={`/education/${course.slug}/${l.slug}`}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        l.id === lesson.id
                          ? "bg-red-800 text-white"
                          : "hover:bg-white text-gray-600 hover:text-red-800"
                      }`}
                    >
                      <span className="w-5 h-5 flex-shrink-0 rounded-full border border-current text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="line-clamp-2">{l.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {modules.length > 0 ? (
              <div className="module-content">
                <ModuleRenderer modules={modules} />
              </div>
            ) : (
              <p className="text-gray-500">Содержание урока будет добавлено позже.</p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
              {prevLesson ? (
                <Link
                  href={`/education/${course.slug}/${prevLesson.slug}`}
                  className="flex items-center gap-2 text-sm text-red-800 hover:underline"
                >
                  ← {prevLesson.title}
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/education/${course.slug}/${nextLesson.slug}`}
                  className="flex items-center gap-2 text-sm text-red-800 hover:underline"
                >
                  {nextLesson.title} →
                </Link>
              ) : (
                <Link
                  href={`/education/${course.slug}`}
                  className="text-sm text-gray-500 hover:text-red-800"
                >
                  Вернуться к курсу →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
