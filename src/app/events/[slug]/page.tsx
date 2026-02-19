export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";

type Module = { id: string; type: string; content: Record<string, unknown> };

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  return {
    title: event
      ? `${event.title} — Академия Госфильмофонда России`
      : "Событие не найдено",
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, published: true },
  });

  if (!event) notFound();

  const modules = Array.isArray(event.modules) ? (event.modules as Module[]) : [];

  return (
    <>
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <Link href="/events" className="hover:text-white">События</Link>
            {" / "}
            <span>{event.title}</span>
          </nav>
          <div className="flex items-start gap-6">
            <div className="bg-[#8f1a1c] text-white text-center rounded-xl p-3 flex-shrink-0">
              <div className="text-3xl font-bold leading-none">
                {new Date(event.date).getDate()}
              </div>
              <div className="text-sm mt-1">
                {new Date(event.date).toLocaleDateString("ru-RU", { month: "long" })}
              </div>
              <div className="text-xs text-red-200">
                {new Date(event.date).getFullYear()}
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
              {event.location && (
                <p className="text-gray-400 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {event.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="max-w-3xl">
          {event.description && (
            <p className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
              {event.description}
            </p>
          )}

          {modules.length > 0 ? (
            <div className="module-content">
              <ModuleRenderer modules={modules} />
            </div>
          ) : (
            <p className="text-gray-500">Подробная информация о событии будет добавлена позже.</p>
          )}
        </div>
      </div>
    </>
  );
}
