"use client";

import Link from "next/link";

const aboutLinks = [
  { label: "Основные сведения", href: "/about" },
  { label: "Структура и органы управления", href: "/about/structure" },
  { label: "Руководство", href: "/management" },
  { label: "Педагогический состав", href: "/staff" },
  { label: "Документы", href: "/about/documents" },
  { label: "Вакантные места", href: "/about/vacancies" },
];

const mainLinks = [
  { label: "Обучение", href: "/education" },
  { label: "Практика и стажировки", href: "/practice" },
  { label: "Проекты", href: "/projects" },
  { label: "Вестник Госфильмофонда России", href: "https://vestnik-gocfilmofond.ru", external: true },
  { label: "Новости", href: "/news" },
  { label: "События", href: "/events" },
];

const legalLinks = [
  { label: "Политика конфиденциальности", href: "/about/documents" },
  { label: "Правовая информация", href: "/about/documents" },
  { label: "Карта сайта", href: "/" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-[1170px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* ── Col 1: Logo + about ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <svg className="w-8 h-8 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span className="font-semibold text-sm leading-tight">
                Академия<br />Госфильмофонда России
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-5">
              Профессиональное образование в области киноискусства и кинематографического наследия.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Telegram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="#" aria-label="ВКонтакте" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-.857-1.49.287v1.575c0 .447-.137.712-1.341.712-2.204 0-4.645-1.334-6.364-3.82C4.185 11.18 3.679 8.912 3.679 8.912s-.109-.287.286-.287h1.744c.446 0 .617.219.794.733 1.056 3.26 2.841 6.111 3.57 6.111.275 0 .401-.13.401-.85V11.77c-.08-1.514-.882-1.64-.882-2.178 0-.262.212-.524.55-.524h2.735c.37 0 .504.207.504.65v4.022c0 .37.165.5.265.5.274 0 .506-.13 1.013-.637 1.566-1.757 2.68-4.462 2.68-4.462s.137-.287.583-.287h1.744c.524 0 .637.275.524.65-.219.985-2.32 3.968-2.32 3.968-.183.3-.247.437 0 .77.183.261 1.32 1.262 1.32 1.262.733.733 1.32 1.36 1.47 1.787.137.435-.093.655-.48.655z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: О нас ── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">О нас</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Разделы ── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Разделы</h3>
            <ul className="space-y-2.5">
              {mainLinks.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {l.label}
                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Правовая информация + доступность ── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Правовая информация</h3>
            <ul className="space-y-2.5 mb-6">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-white/10 pt-5">
              <p className="text-xs text-slate-500 mb-2">Специальные возможности</p>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const btn = document.querySelector("[aria-label='Версия для слабовидящих']") as HTMLButtonElement;
                  btn?.click();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 rounded"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Версия для слабовидящих
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1170px] px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {year} Академия Госфильмофонда России. Все права защищены.
          </p>
          <p className="text-xs text-slate-600">
            142050, Московская обл., г.о. Домодедово, мкр. Белые Столбы, тер. Госфильмофонд, стр.8
          </p>
        </div>
      </div>
    </footer>
  );
}
