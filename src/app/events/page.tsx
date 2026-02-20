export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "События — Академия Госфильмофонда России",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
  });

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span>События</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">События и мероприятия</h1>
          <p className="text-slate-400 mt-2 text-sm">Конференции, кинопоказы и мастер-классы</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-8">
        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Предстоящие события</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-5">Прошедшие события</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-70">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-600 mb-1">События скоро появятся</h2>
            <p className="text-slate-400 text-sm">Следите за обновлениями</p>
          </div>
        )}
      </div>
    </>
  );
}

type EventType = {
  id: number;
  title: string;
  slug: string;
  date: Date;
  location: string | null;
  description: string | null;
  image: string | null;
};

function EventCard({ event }: { event: EventType }) {
  return (
    <Link href={`/events/${event.slug}`}>
      <article className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow group h-full flex flex-col">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="bg-red-800 text-white text-center rounded px-2 py-1 min-w-[40px] flex-shrink-0">
              <div className="text-sm font-bold leading-none">
                {new Date(event.date).getDate()}
              </div>
              <div className="text-xs mt-0.5">
                {new Date(event.date).toLocaleDateString("ru-RU", { month: "short" })}
              </div>
            </div>
            {event.location && (
              <span className="text-xs text-slate-400 truncate">{event.location}</span>
            )}
          </div>
          <h2 className="font-semibold text-slate-900 group-hover:text-red-800 transition-colors text-sm flex-1 leading-snug">
            {event.title}
          </h2>
          {event.description && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.description}</p>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-red-800">Подробнее →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
