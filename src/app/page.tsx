import {prisma} from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import EventsSlider from "@/components/EventsSlider";
import NewsletterBlock from "@/components/NewsletterBlock";
import ContactForm from "@/components/ContactForm";
import FaqSection from "@/components/FaqSection";
import NewsGrid from "@/components/NewsGrid";

const partners = [
  { name: "ГИТИС", logo: "/partners/gitis_2.png" },
  { name: "МГИК", logo: "/partners/mgik.png" },
  { name: "МПГУ", logo: "/partners/mpgu.png" },
  { name: "РАН", logo: "/partners/ran.png" },
  { name: "ВГИК", logo: "/partners/vgik.png" },
];

const staticCourses = [
  {
    id: "c1",
    title:
      "Современные технологии и методы сохранения кинематографического наследия: изучение, хранение, реставрация",
    type: "Программа повышения квалификации",
    startDate: "01.06.2026",
    hours: "36 ак.ч.",
    format: "Очно-заочно",
    formatIcon: "hybrid", // hybrid | online
    price: "17 500 ₽",
    href: "/education",
  },
  {
    id: "c2",
    title:
      "Организационно-правовое регулирование приёма киноматериалов на государственное хранение",
    type: "Программа повышения квалификации",
    startDate: "01.07.2026",
    hours: "18 ак.ч.",
    format: "Онлайн",
    formatIcon: "online",
    price: "5 500 ₽",
    href: "/education",
  },
];

export default async function HomePage() {
  const [events, news] = await Promise.all([
    prisma.event.findMany({
      where: { published: true },
      take: 6,
      orderBy: { date: "asc" },
      select: { id: true, title: true, slug: true, date: true, image: true, location: true },
    }),
    prisma.news.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      select: { id: true, title: true, slug: true, date: true, image: true, summary: true },
    }),
  ]);

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-292.5 px-4 py-20 md:py-28">
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

      {/* ── ВИДЕОЗАСТАВКА ── */}
      <section className="relative overflow-hidden bg-slate-900" style={{ minHeight: 440 }}>
        {/*
          Замените src="/video/intro.mp4" на путь к вашему видеофайлу.
          Поместите видео в папку /public/video/intro.mp4
        */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-slate-900/30" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-292.5 px-4 py-20 flex flex-col justify-between min-h-110">
          <div className="max-w-lg">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3 block">
              Наша миссия
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Сохраняем традиции<br />и создаём будущее кино
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Академия Госфильмофонда России — ведущее учреждение профессиональной подготовки
              в области сохранения, изучения и популяризации отечественного кинематографического
              наследия. Воспитываем специалистов мирового уровня.
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
            {[
              { value: "80+", label: "Лет опыта" },
              { value: "500+", label: "Выпускников" },
              { value: "80+", label: "Преподавателей" },
              { value: "80+", label: "Программ" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРОГРАММЫ ── */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-292.5 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">
            Наши программы
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staticCourses.map((course) => (
              <Link key={course.id} href={course.href} className="group">
                <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">

                  {/* Image area */}
                  <div className="relative h-52 overflow-hidden">
                    {course.id === "c1" ? (
                      /* Film strip / restoration theme */
                      <div className="absolute inset-0 bg-linear-to-br from-amber-950 via-stone-900 to-zinc-900">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 600 220"
                          preserveAspectRatio="xMidYMid slice"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Film reel circles */}
                          <circle cx="480" cy="110" r="90" stroke="white" strokeOpacity="0.06" strokeWidth="1.5" />
                          <circle cx="480" cy="110" r="60" stroke="white" strokeOpacity="0.08" strokeWidth="1.5" />
                          <circle cx="480" cy="110" r="30" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
                          {/* Spokes */}
                          {[0, 60, 120, 180, 240, 300].map((deg) => (
                            <line
                              key={deg}
                              x1={480 + 30 * Math.cos((deg * Math.PI) / 180)}
                              y1={110 + 30 * Math.sin((deg * Math.PI) / 180)}
                              x2={480 + 88 * Math.cos((deg * Math.PI) / 180)}
                              y2={110 + 88 * Math.sin((deg * Math.PI) / 180)}
                              stroke="white"
                              strokeOpacity="0.07"
                              strokeWidth="1.5"
                            />
                          ))}
                          {/* Film strip holes */}
                          {[40, 100, 160, 220, 280, 340, 400].map((x) => (
                            <g key={x}>
                              <rect x={x} y="10" width="18" height="12" rx="2" fill="white" fillOpacity="0.08" />
                              <rect x={x} y="198" width="18" height="12" rx="2" fill="white" fillOpacity="0.08" />
                              <rect x={x} y="30" width="50" height="38" rx="2" fill="white" fillOpacity="0.04" />
                              <rect x={x} y="152" width="50" height="38" rx="2" fill="white" fillOpacity="0.04" />
                            </g>
                          ))}
                        </svg>
                      </div>
                    ) : (
                      /* Archive / storage theme */
                      <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-zinc-900 to-neutral-900">
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 600 220"
                          preserveAspectRatio="xMidYMid slice"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Shelves */}
                          {[40, 100, 160].map((y) => (
                            <g key={y}>
                              <rect x="60" y={y} width="480" height="2" fill="white" fillOpacity="0.06" />
                              {/* Canister/reel shapes on shelf */}
                              {[80, 150, 220, 290, 360, 430, 500].map((x) => (
                                <g key={x}>
                                  <rect x={x} y={y - 40} width="28" height="38" rx="3" fill="white" fillOpacity="0.06" />
                                  <circle cx={x + 14} cy={y - 21} r="10" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
                                </g>
                              ))}
                            </g>
                          ))}
                          {/* Person silhouette */}
                          <ellipse cx="160" cy="190" rx="18" ry="30" fill="white" fillOpacity="0.05" />
                          <circle cx="160" cy="150" r="12" fill="white" fillOpacity="0.05" />
                        </svg>
                      </div>
                    )}

                    {/* Dark overlay at bottom for text fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Type badge */}
                    <span className="inline-flex w-fit text-[10px] font-bold uppercase tracking-widest text-red-800 bg-red-50 border border-red-100 px-2.5 py-1 rounded mb-3">
                      {course.type}
                    </span>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-4 line-clamp-3 group-hover:text-red-800 transition-colors">
                      {course.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                      {/* Date */}
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                        <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {course.startDate}
                      </span>

                      {/* Hours */}
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                        <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.hours}
                      </span>

                      {/* Format */}
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                        {course.formatIcon === "online" ? (
                          <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                        {course.format}
                      </span>

                      {/* Price */}
                      <span className="ml-auto text-sm font-bold text-slate-900">
                        {course.price}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800 hover:text-red-900 transition-colors">
                        Подробнее
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

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

      {/* ── СОБЫТИЯ (СЛАЙДЕР) ── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-292.5 px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1 h-5 bg-red-800 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-800">События</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ближайшие события</h2>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-red-800 font-medium hover:underline"
            >
              Все события →
            </Link>
          </div>

          <EventsSlider events={events} />
        </div>
      </section>

      {/* ── ПАРТНЁРЫ ── */}
      <section className="py-14 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-292.5 px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-red-800">Партнёры</span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Наши партнёры</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 items-center">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              >
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

      {/* ── НОВОСТИ ── */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-292.5 px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1 h-5 bg-red-800 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-800">Новости</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Последние новости</h2>
            </div>
            <Link href="/news" className="hidden sm:inline-flex items-center gap-1 text-sm text-red-800 font-medium hover:underline">
              Все новости →
            </Link>
          </div>
          <NewsGrid news={news} pageSize={3} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── КОНТАКТНАЯ ИНФОРМАЦИЯ + КАРТА ── */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-292.5 px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-5 bg-red-800 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-800">Контакты</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Контактная информация</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="w-9 h-9 bg-red-800/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Адрес</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  142050, Московская обл., г.о. Домодедово,<br />мкр. Белые Столбы, тер. Госфильмофонд, стр.&nbsp;8
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="w-9 h-9 bg-red-800/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Телефон</p>
                <a href="tel:+74951234567" className="text-sm text-slate-700 hover:text-red-800 transition-colors block">+7 (495) 123-45-67</a>
                <a href="tel:+74951234568" className="text-sm text-slate-500 hover:text-red-800 transition-colors block mt-1">+7 (495) 123-45-68 (факс)</a>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="w-9 h-9 bg-red-800/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Email</p>
                <a href="mailto:academy@gff-rf.ru" className="text-sm text-slate-700 hover:text-red-800 transition-colors break-all">academy@gff-rf.ru</a>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="w-9 h-9 bg-red-800/10 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Режим работы</p>
                <p className="text-sm text-slate-700">Пн–Пт: 9:00 — 18:00</p>
                <p className="text-sm text-slate-500 mt-0.5">Сб–Вс: выходной</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 flex flex-col">
              <div className="flex-1 min-h-65">
                <iframe
                  title="Карта проезда"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=37.83558905124664%2C55.324707119708854%2C37.83872991800309%2C55.32590346653728&amp;layer=mapnik&amp;marker=55.32530529763677%2C37.83715948462486"
                  width="100%"
                  height="100%"
                  style={{ minHeight: 260, border: 0, display: "block" }}
                  loading="lazy"
                />
              </div>
              <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
                <svg className="w-3.5 h-3.5 text-red-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="text-xs text-slate-500 flex-1">Белые Столбы, Госфильмофонд</p>
                <a href="https://yandex.ru/maps/?text=Белые+Столбы+Госфильмофонд" target="_blank" rel="noopener noreferrer" className="text-xs text-red-800 hover:underline shrink-0">
                  Построить маршрут →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ФОРМА ОБРАТНОЙ СВЯЗИ ── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-292.5 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1 h-5 bg-red-800 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Обратная связь</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Остались вопросы?</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Заполните форму, и мы ответим в течение одного рабочего дня.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <svg className="w-4 h-4 text-red-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+74951234567" className="hover:text-white transition-colors">+7 (495) 123-45-67</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <svg className="w-4 h-4 text-red-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:academy@gff-rf.ru" className="hover:text-white transition-colors">academy@gff-rf.ru</a>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── ПОДПИСКА ── */}
      <NewsletterBlock />
    </>
  );
}
