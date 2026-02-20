export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import EventsCarousel from "@/components/EventsCarousel";
import NewsletterBlock from "@/components/NewsletterBlock";
import ContactForm from "@/components/ContactForm";

const partners = [
  { name: "ГИТИС", logo: "/partners/gitis.png" },
  { name: "ГИТИС 2", logo: "/partners/gitis_2.png" },
  { name: "МГИК", logo: "/partners/mgik.png" },
  { name: "МПГУ", logo: "/partners/mpgu.png" },
  { name: "РАН", logo: "/partners/ran.png" },
  { name: "ВГИК", logo: "/partners/vgik.png" },
];

export default async function HomePage() {
  const [courses, events, staff] = await Promise.all([
    prisma.course.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      where: { published: true },
      take: 3,
      orderBy: { date: "desc" },
    }),
    prisma.staff.findMany({
      take: 3,
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-[1170px] px-4 py-20 md:py-28">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Академия<br />Госфильмофонда России
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Ведущее образовательное учреждение в сфере кинематографа.<br />
              Авторы истории и синема.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded transition-colors text-sm"
              >
                Подробнее о нас
              </Link>
              <Link
                href="/education"
                className="inline-flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white font-semibold px-6 py-3 rounded transition-colors text-sm"
              >
                Программы обучения
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── МИССИЯ + СТАТИСТИКА ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="bg-slate-800 h-64 lg:h-auto min-h-[320px] flex items-center justify-center overflow-hidden">
              <svg className="w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-red-800 mb-3">
                Наша миссия
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                Сохраняем традиции и создаём будущее кино
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Академия Госфильмофонда России — ведущее учреждение профессиональной подготовки
                в области сохранения, изучения и популяризации отечественного кинематографического
                наследия. Воспитываем специалистов мирового уровня.
              </p>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                {[
                  { value: "80+", label: "Лет опыта" },
                  { value: "500+", label: "Выпускников" },
                  { value: "80+", label: "Преподавателей" },
                  { value: "80+", label: "Программ" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ПРОГРАММЫ ── */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-5 bg-red-800 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-800">Программы</span>
          </div>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Наши программы</h2>
          </div>

          {courses.length > 0 ? (
            <div className="flex flex-col gap-4">
              {courses.map((course) => (
                <Link key={course.id} href={`/education/${course.slug}`}>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row group">
                    {/* Image */}
                    <div className="sm:w-48 md:w-56 flex-shrink-0">
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
                        <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-red-800 transition-colors">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
                        )}
                      </div>
                      {/* Course meta: format, startDate, duration */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {course.format && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                            </svg>
                            {course.format}
                          </span>
                        )}
                        {course.startDate && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(course.startDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        )}
                        {course.duration && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 border border-red-800/30 px-3 py-1 rounded ml-auto">
                          Подробнее
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Курсы скоро появятся</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/education"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-red-800 text-slate-700 hover:text-red-800 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
            >
              Все программы
            </Link>
          </div>
        </div>
      </section>

      {/* ── ПРЕПОДАВАТЕЛИ ── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-5 bg-red-800 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-800">Преподаватели</span>
          </div>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Преподаватели и эксперты</h2>
          </div>

          {staff.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((person) => (
                <div key={person.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                  {person.image ? (
                    <img src={person.image} alt={person.name} className="w-full h-48 object-cover object-top" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-800/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm">{person.name}</h3>
                    <p className="text-xs text-red-800 mt-0.5">{person.position}</p>
                    {person.bio && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{person.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              <p>Информация о преподавателях скоро появится</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/staff"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-red-800 text-slate-700 hover:text-red-800 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
            >
              Все преподаватели
            </Link>
          </div>
        </div>
      </section>

      {/* ── СОБЫТИЯ (КАРУСЕЛЬ) ── */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-5 bg-red-800 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-800">События</span>
          </div>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ближайшие события</h2>
            <Link href="/events" className="hidden sm:inline-flex items-center gap-1 text-sm text-red-800 font-medium hover:underline">
              Расписание событий →
            </Link>
          </div>

          <div className="relative px-8">
            <EventsCarousel events={events} />
          </div>

          <div className="text-center mt-8">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-red-800 text-slate-700 hover:text-red-800 font-semibold px-6 py-2.5 rounded transition-colors text-sm"
            >
              Все события
            </Link>
          </div>
        </div>
      </section>

      {/* ── ПАРТНЁРЫ ── */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-red-800">Партнёры</span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Наши партнёры</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center">
            {partners.map((p) => (
              <div key={p.name} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={120}
                  height={60}
                  className="max-h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── РАССЫЛКА ── */}
      <NewsletterBlock />

      {/* ── КОНТАКТЫ ── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: contact info */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Остались вопросы?</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Есть вопросы об обучении, курсах или событиях? Свяжитесь с нами — мы ответим в ближайшее время.
              </p>
              <div className="space-y-4">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Контактная информация</p>
                <div className="flex items-start gap-3 text-sm text-slate-300">
                  <svg className="w-4 h-4 mt-0.5 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>143050, Московская обл., г. Красногорск, ул. Госфильмофонда, д. 1</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@gosfilmofond.academy" className="hover:text-white transition-colors">info@gosfilmofond.academy</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+74951234567" className="hover:text-white transition-colors">+7 (495) 123-45-67</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+74951234568" className="hover:text-white transition-colors">+7 (495) 123-45-68 (факс)</a>
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
