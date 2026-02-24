export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ModuleRenderer from "@/components/ModuleRenderer";
import EventRegistrationForm from "@/components/EventRegistrationForm";

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
      {/* ── Back link ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1170px] px-4 py-3">
          <Link
            href="/events"
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
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-60 lg:h-64 object-cover" />
              ) : (
                <div className="w-full h-60 lg:h-64 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-4 break-words">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-800/10 text-red-800 border border-red-800/20 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {event.location && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full max-w-full break-words">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="break-words">{event.location}</span>
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-slate-500 text-sm leading-relaxed break-words">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content + Sidebar ── */}
      <div className="mx-auto max-w-[1170px] px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {modules.length > 0 ? (
              <div className="module-content">
                <ModuleRenderer modules={modules} />
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Подробная информация о событии будет добавлена позже.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration form */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Регистрация</h3>
              <EventRegistrationForm eventId={event.id} />
            </div>

            {/* Organizer */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Организатор</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Академия Госфильмофонд
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:events@gosfilmofond-academy.ru" className="text-red-800 hover:underline break-all">
                    events@gosfilmofond-academy.ru
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +7 (495) 123-45-69
                </div>
                {event.location && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="break-words">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
