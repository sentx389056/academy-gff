"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  slug: string;
  date: Date | string;
  image: string | null;
  location: string | null;
}

interface Props {
  events: Event[];
}

export default function EventsSlider({ events }: Props) {
  const [current, setCurrent] = useState(0);
  const total = events.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (total === 0) {
    return (
      <div className="rounded-2xl bg-slate-100 h-64 flex items-center justify-center text-slate-400 text-sm">
        События скоро появятся
      </div>
    );
  }

  const ev = events[current];

  return (
    <div className="space-y-4">
      {/* Main slider panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 rounded-2xl overflow-hidden shadow-xl min-h-[380px] lg:min-h-[440px]">

        {/* ── Featured image + overlay ── */}
        <div className="lg:col-span-2 relative bg-slate-900">
          {/* Image */}
          {ev.image ? (
            <img
              key={ev.id}
              src={ev.image}
              alt={ev.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900">
              {/* Film strip decoration */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute border-2 border-white/40 rounded"
                    style={{
                      width: 80,
                      height: 60,
                      top: 20 + i * 70,
                      left: 40 + (i % 2) * 120,
                      transform: `rotate(${i % 2 === 0 ? -4 : 3}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Slide counter (top right) */}
          <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {String(current + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
          </div>

          {/* Content (bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-red-800 text-white text-xs font-semibold px-3 py-1 rounded">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(ev.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {ev.location && (
                <span className="inline-flex items-center gap-1 text-white/70 text-xs max-w-[200px]">
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{ev.location}</span>
                </span>
              )}
            </div>

            <h3 className="text-white text-lg lg:text-2xl font-bold leading-tight mb-5 max-w-xl line-clamp-2">
              {ev.title}
            </h3>

            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm px-5 py-2.5 rounded transition-colors"
              >
                <Link href={`/events/${ev.slug}`}>
                  Подробнее
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>

              {/* Prev / Next */}
              <Button
                onClick={prev}
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-full border-white/30 text-white bg-transparent hover:bg-white/10 transition-colors"
                aria-label="Предыдущее событие"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                onClick={next}
                size="icon"
                className="w-10 h-10 rounded-full bg-red-800 hover:bg-red-900 text-white transition-colors"
                aria-label="Следующее событие"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Sidebar list ── */}
        <div className="bg-slate-900 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="px-5 py-4 border-b border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ближайшие события
            </span>
          </div>

          <div className="flex-1 divide-y divide-white/5">
            {events.map((event, i) => (
              <Button
                key={event.id}
                onClick={() => setCurrent(i)}
                variant="ghost"
                className={`w-full text-left px-5 py-4 transition-colors group flex items-start gap-3 h-auto rounded-none justify-start ${
                  i === current ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {/* Number dot */}
                <span
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i === current ? "bg-red-800 text-white" : "bg-white/10 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] mb-1 ${i === current ? "text-red-400" : "text-slate-500"}`}>
                    {new Date(event.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    className={`text-sm leading-snug line-clamp-2 ${
                      i === current
                        ? "text-white font-semibold"
                        : "text-slate-400 group-hover:text-slate-200 font-medium"
                    }`}
                  >
                    {event.title}
                  </p>
                </div>
              </Button>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-white/10">
            <Link
              href="/events"
              className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors"
            >
              <span>Все события</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Progress dots ── */}
      <div className="flex justify-center gap-2">
        {events.map((_, i) => (
          <Button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 p-0 min-w-0 ${
              i === current ? "w-8 h-1.5 bg-red-800" : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Событие ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
