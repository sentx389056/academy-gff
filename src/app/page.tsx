import {prisma} from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import EventsSlider from "@/components/EventsSlider";
import CoursesCarousel from "@/components/CoursesCarousel";
import NewsletterBlock from "@/components/NewsletterBlock";
import ContactForm from "@/components/ContactForm";
import FaqSection from "@/components/FaqSection";
import NewsGrid from "@/components/NewsGrid";
import {Button} from "@/components/ui/button";

const partners = [
    {name: "ГИТИС", logo: "/partners/gitis_2.png"},
    {name: "МГИК", logo: "/partners/mgik.png"},
    {name: "МПГУ", logo: "/partners/mpgu.png"},
    {name: "РАН", logo: "/partners/ran.png"},
    {name: "ВГИК", logo: "/partners/vgik.png"},
];


export default async function HomePage() {
    const [events, news, courses] = await Promise.all([
        prisma.event.findMany({
            where: {published: true},
            take: 6,
            orderBy: {date: "asc"},
            select: {id: true, title: true, slug: true, date: true, image: true, location: true},
        }),
        prisma.news.findMany({
            where: {published: true},
            orderBy: {date: "desc"},
            select: {id: true, title: true, slug: true, date: true, image: true, summary: true},
        }),
        prisma.course.findMany({
            where: {published: true},
            take: 3,
            orderBy: {createdAt: "desc"},
            include: {programType: true, format: true},
        }),
    ]);

    return (
        <>
            {/* ── HERO ── */}
            <section
                className="relative bg-slate-900 text-white min-h-screen flex flex-col justify-center overflow-hidden"
                style={{background: "linear-gradient(135deg, #0f172a 0%, #1e1b2e 40%, #1a0a0a 100%)"}}
            >
                {/* Subtle red glow top-left */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{background: "radial-gradient(ellipse 70% 55% at 10% 45%, rgba(153,27,27,0.22) 0%, transparent 65%)"}}
                />
                {/* Faint dot grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10 mx-auto max-w-292.5 w-full px-4 py-28 md:py-36">
                    <div className="max-w-2xl space-x-12">
                        <h2 className="inline-block text-2xl font-bold uppercase tracking-widest text-red-400 mb-6">
                            Академия Госфильмофонда России
                        </h2>
                        <h3 className="text-7xl sm:text-8xl md:text-9xl font-extrabold leading-[0.95] mb-7 tracking-tight">
                            Сохраняем кинонаследие страны
                        </h3>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                            Профессиональное образование в сфере кинематографа — <br className="hidden md:block"/>
                            от реставрации плёнки до управления архивами.
                        </p>
                        <div className="flex flex-wrap gap-3 mb-20">
                            <Button variant="default" size="lg" asChild>
                                <Link href="/education">
                                    Программы обучения
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </Link>
                            </Button>

                            <Button variant="secondary" size="lg" asChild>
                                <Link href="/about">
                                    О нас
                                </Link>
                            </Button>

                        </div>
                    </div>

                    {/* Stats bar */}
                    <div className="pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl">
                        {[
                            {value: "80+", label: "Лет опыта"},
                            {value: "500+", label: "Выпускников"},
                            {value: "80+", label: "Преподавателей"},
                            {value: "80+", label: "Программ"},
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="text-3xl md:text-4xl font-bold text-white">{s.value}</div>
                                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ВИДЕОЗАСТАВКА ── */}
            <section className="hidden relative overflow-hidden bg-slate-900" style={{minHeight: 440}}>
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
                    <source src="/videos/intro.mp4" type="video/mp4"/>
                </video>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-slate-900/30"/>

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-292.5 px-4 py-20 flex flex-col justify-between min-h-110">
                    <div className="max-w-lg">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3 block">
              Наша миссия
            </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                            Сохраняем традиции<br/>и создаём будущее кино
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
                            {value: "80+", label: "Лет опыта"},
                            {value: "500+", label: "Выпускников"},
                            {value: "80+", label: "Преподавателей"},
                            {value: "80+", label: "Программ"},
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
            {courses.length > 0 && (
                <section className="py-16 bg-slate-50">
                    <div className="mx-auto max-w-292.5 px-4">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-1 h-5 bg-red-800 rounded-full"/>
                                    <span
                                        className="text-xs font-bold uppercase tracking-widest text-red-800">Образование</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Наши программы</h2>
                            </div>
                            <Link
                                href="/education"
                                className="hidden sm:inline-flex items-center gap-1 text-sm text-red-800 font-medium hover:underline"
                            >
                                Все программы →
                            </Link>
                        </div>

                        <CoursesCarousel courses={courses}/>
                    </div>
                </section>
            )}

            {/* ── СОБЫТИЯ (СЛАЙДЕР) ── */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-292.5 px-4">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-1 h-5 bg-red-800 rounded-full"/>
                                <span
                                    className="text-xs font-bold uppercase tracking-widest text-red-800">События</span>
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

                    <EventsSlider events={events}/>
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
                                <span className="w-1 h-5 bg-red-800 rounded-full"/>
                                <span
                                    className="text-xs font-bold uppercase tracking-widest text-red-800">Новости</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Последние новости</h2>
                        </div>
                        <Link href="/news"
                              className="hidden sm:inline-flex items-center gap-1 text-sm text-red-800 font-medium hover:underline">
                            Все новости →
                        </Link>
                    </div>
                    <NewsGrid news={news} pageSize={3}/>
                </div>
            </section>

            {/* ── FAQ ── */}
            <FaqSection/>

            {/* ── КОНТАКТНАЯ ИНФОРМАЦИЯ + КАРТА ── */}
            <section className="bg-slate-900 text-white">
                <div className="mx-auto max-w-292.5 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
                        {/* Left: contacts */}
                        <div className="py-16 pr-0 lg:pr-16 flex flex-col justify-center">
                            <span
                                className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4 block">Контакты</span>
                            <h2 className="text-2xl md:text-3xl font-bold mb-10">Контактная информация</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Адрес</p>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            142050, Московская обл., г.о. Домодедово,<br/>мкр. Белые Столбы, тер.
                                            Госфильмофонд, стр.&nbsp;8
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Телефон</p>
                                        <a href="tel:+74951234567"
                                           className="text-sm text-slate-300 hover:text-white transition-colors block">+7
                                            (495) 123-45-67</a>
                                        <a href="tel:+74951234568"
                                           className="text-sm text-slate-500 hover:text-slate-300 transition-colors block mt-0.5">+7
                                            (495) 123-45-68 (факс)</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Email</p>
                                        <a href="mailto:academy@gff-rf.ru"
                                           className="text-sm text-slate-300 hover:text-white transition-colors">academy@gff-rf.ru</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Режим
                                            работы</p>
                                        <p className="text-sm text-slate-300">Пн–Пт: 9:00 — 18:00</p>
                                        <p className="text-sm text-slate-500 mt-0.5">Сб–Вс: выходной</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: map flush to edge */}
                        <div
                            className="relative min-h-72 lg:min-h-0 border-t lg:border-t-0 lg:border-l border-white/10">
                            <iframe
                                title="Карта проезда"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=37.83558905124664%2C55.324707119708854%2C37.83872991800309%2C55.32590346653728&amp;layer=mapnik&amp;marker=55.32530529763677%2C37.83715948462486"
                                className="absolute inset-0 w-full h-full"
                                style={{border: 0}}
                                loading="lazy"
                            />
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm px-5 py-3 flex items-center gap-3">
                                <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                </svg>
                                <p className="text-xs text-slate-400 flex-1">Белые Столбы, Госфильмофонд</p>
                                <a href="https://yandex.ru/maps/?text=Белые+Столбы+Госфильмофонд" target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-xs text-red-400 hover:text-red-300 transition-colors shrink-0">
                                    Построить маршрут →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ФОРМА ОБРАТНОЙ СВЯЗИ ── */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-292.5 px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-red-800 mb-3 block">Обратная связь</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Остались вопросы?</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                Заполните форму, и мы свяжемся с вами в течение одного рабочего дня.
                            </p>
                            <div className="space-y-3">
                                <div
                                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div
                                        className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-red-800" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Телефон</p>
                                        <a href="tel:+74951234567"
                                           className="text-sm font-medium text-slate-900 hover:text-red-800 transition-colors">+7
                                            (495) 123-45-67</a>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div
                                        className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-red-800" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
                                        <a href="mailto:academy@gff-rf.ru"
                                           className="text-sm font-medium text-slate-900 hover:text-red-800 transition-colors">academy@gff-rf.ru</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <ContactForm/>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ПОДПИСКА ── */}
            <NewsletterBlock/>
        </>
    );
}
