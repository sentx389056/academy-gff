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
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <span>События</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">События и мероприятия</h1>
          <p className="text-gray-400 mt-2">Конференции, кинопоказы и мастер-классы</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        {upcoming.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-[#1d1d1d] mb-6">
              Предстоящие события
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1d] mb-6">
              Прошедшие события
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              События скоро появятся
            </h2>
            <p className="text-gray-500 text-sm">
              Следите за обновлениями
            </p>
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
      <article className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-[#0f172a] to-[#1e2a3a] flex items-center justify-center">
            <span className="text-5xl">🎬</span>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#8f1a1c] text-white text-center rounded-lg px-2 py-1">
              <div className="text-sm font-bold leading-none">
                {new Date(event.date).getDate()}
              </div>
              <div className="text-xs">
                {new Date(event.date).toLocaleDateString("ru-RU", { month: "short" })}
              </div>
            </div>
            {event.location && (
              <span className="text-xs text-gray-500">{event.location}</span>
            )}
          </div>
          <h2 className="font-semibold text-[#1d1d1d] group-hover:text-[#8f1a1c] transition-colors flex-1">
            {event.title}
          </h2>
          {event.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
