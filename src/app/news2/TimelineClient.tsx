"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  image: string | null;
  date: string;
};

type YearGroup = {
  year: number;
  items: NewsItem[];
};

export default function TimelineClient({ groups }: { groups: YearGroup[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll("[data-animate]");
    if (!elements) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative py-14 mx-auto max-w-[860px] px-4">
      {/* Vertical line */}
      <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />

      <div className="space-y-16">
        {groups.map((group) => (
          <div key={group.year}>
            {/* Year */}
            <div
              data-animate
              data-delay="0"
              className="timeline-item relative flex items-center gap-5 mb-10"
            >
              <div className="w-14 h-14 rounded-full bg-red-800 flex items-center justify-center flex-shrink-0 z-10 shadow-lg shadow-red-800/30">
                <span className="text-white text-xs font-bold tracking-widest">
                  {group.year}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
            </div>

            {/* Cards */}
            <div className="space-y-5 pl-[72px]">
              {group.items.map((n, i) => {
                const date = new Date(n.date);
                const day = date.toLocaleString("ru-RU", { day: "2-digit" });
                const month = date.toLocaleString("ru-RU", { month: "short" }).replace(".", "");

                return (
                  <div
                    key={n.id}
                    data-animate
                    data-delay={String(i * 80)}
                    className="timeline-item relative"
                  >
                    {/* Connector */}
                    <div className="absolute -left-[44px] top-6 flex items-center gap-0">
                      <div className="w-3 h-3 rounded-full border-2 border-red-800 bg-white z-10 transition-all duration-300 group-hover:bg-red-800" />
                      <div className="w-7 h-px bg-slate-200" />
                    </div>

                    <Link href={`/news/${n.slug}`} className="group block">
                      <article className="relative bg-white rounded-md overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-slate-200 group-hover:border-slate-200 flex flex-col sm:flex-row min-h-[140px]">
                        {/* Image */}
                        <div className="relative sm:w-52 flex-shrink-0 overflow-hidden bg-slate-900">
                          {n.image ? (
                            <>
                              <img
                                src={n.image}
                                alt={n.title}
                                className="w-full h-44 sm:h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/10" />
                            </>
                          ) : (
                            <div className="w-full h-44 sm:h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                          {/* Date badge over image */}
                          <div className="absolute bottom-3 left-3 flex flex-col items-center bg-red-800 text-white rounded-sm px-2.5 py-1.5 leading-none shadow-md">
                            <span className="text-xl font-bold">{day}</span>
                            <span className="text-[10px] uppercase tracking-widest opacity-80">{month}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center px-6 py-5 flex-1 min-w-0 gap-2">
                          <h2 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-red-800 transition-colors duration-200 line-clamp-2">
                            {n.title}
                          </h2>
                          {n.summary && (
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                              {n.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 text-xs font-medium text-red-800 mt-1">
                            <span>Читать</span>
                            <svg
                              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>

                        {/* Left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-800 scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100 rounded-r" />
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
