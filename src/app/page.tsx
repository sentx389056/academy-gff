import {Button} from "@/components/ui/button";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [courses, events] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      where: { published: true, date: { gte: new Date() } },
      take: 3,
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e2a3a] to-[#0f172a]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8f1a1c] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[1170px] px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#8f1a1c] mb-4 bg-[#8f1a1c]/10 px-3 py-1 rounded-full border border-[#8f1a1c]/20">
              Киноискусство и наследие
            </span>
              <Button>Как дела</Button>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Сохраняем традиции и создаём будущее кино
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Академия Госфильмофонда России — профессиональное образование в области
              сохранения, изучения и популяризации отечественного кинематографического
              наследия.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/education"
                className="inline-flex items-center gap-2 bg-[#8f1a1c] hover:bg-[#7a1518] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Наши курсы
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                События
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#8f1a1c]">
        <div className="mx-auto max-w-[1170px] px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: "30+", label: "Лет опыта" },
              { value: "500+", label: "Выпускников" },
              { value: "50+", label: "Преподавателей" },
              { value: "20+", label: "Программ" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-red-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1d]">
                Образовательные программы
              </h2>
              <p className="text-gray-500 mt-1">Профессиональные курсы и обучение</p>
            </div>
            <Link
              href="/education"
              className="hidden sm:inline-flex items-center gap-1 text-[#8f1a1c] font-medium hover:underline text-sm"
            >
              Все курсы →
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/education/${course.slug}`}>
                  <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-[#8f1a1c] to-[#0f172a] flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-[#1d1d1d] mb-2 group-hover:text-[#8f1a1c] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      <span className="inline-block mt-3 text-xs font-medium text-[#8f1a1c]">
                        Подробнее →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Курсы скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8f1a1c] mb-3 block">
                Наша миссия
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1d] mb-4">
                Хранители кинематографического наследия
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Академия Госфильмофонда России является образовательным подразделением
                Государственного фонда кинофильмов Российской Федерации — крупнейшего
                в мире архива аудиовизуальных документов.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Мы готовим специалистов в области режиссуры кино и телевидения,
                кинооператорского мастерства, звукорежиссуры и других кинематографических
                профессий.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[#8f1a1c] font-semibold hover:underline"
              >
                Узнать больше об академии →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🎬",
                  title: "Режиссура",
                  desc: "Кино и телевидения",
                },
                {
                  icon: "📽️",
                  title: "Архивное дело",
                  desc: "Сохранение наследия",
                },
                {
                  icon: "🎥",
                  title: "Операторское дело",
                  desc: "Съёмка и монтаж",
                },
                {
                  icon: "🎵",
                  title: "Звукорежиссура",
                  desc: "Звук в кино",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-[#1d1d1d] text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1d]">
                События и мероприятия
              </h2>
              <p className="text-gray-500 mt-1">Предстоящие события академии</p>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-1 text-[#8f1a1c] font-medium hover:underline text-sm"
            >
              Все события →
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-[#8f1a1c] text-white text-center rounded-lg p-2 min-w-[48px]">
                        <div className="text-lg font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs mt-0.5">
                          {new Date(event.date).toLocaleDateString("ru-RU", { month: "short" })}
                        </div>
                      </div>
                      {event.location && (
                        <span className="text-xs text-gray-500">{event.location}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#1d1d1d] group-hover:text-[#8f1a1c] transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>События скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#0f172a]">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Связаться с нами</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Есть вопросы об обучении, курсах или событиях? Напишите нам и мы ответим
                в ближайшее время.
              </p>
              <ul className="flex flex-col gap-3 text-sm text-gray-300">
                <li>📍 Московская обл., Красногорск, ул. Госфильмофонда, 1</li>
                <li>📧 info@academy-gff.ru</li>
                <li>📞 +7 (495) 123-45-67</li>
              </ul>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-[#1d1d1d] mb-4">Отправить сообщение</h3>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] focus:ring-1 focus:ring-[#8f1a1c]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] focus:ring-1 focus:ring-[#8f1a1c]"
                />
                <textarea
                  rows={4}
                  placeholder="Ваше сообщение"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] focus:ring-1 focus:ring-[#8f1a1c] resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#8f1a1c] hover:bg-[#7a1518] text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Отправить
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
