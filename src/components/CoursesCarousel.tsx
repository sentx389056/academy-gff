"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  duration: string | null;
  price: string | null;
  startDate: Date | string | null;
  programType: { name: string } | null;
  format: { name: string } | null;
}

interface Props {
  courses: Course[];
}

export default function CoursesCarousel({ courses }: Props) {
  const [active, setActive] = useState(0);
  const total = courses.length;

  const next = useCallback(() => setActive((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setActive((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, total]);

  if (total === 0) return null;

  const course = courses[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* ── Sidebar tabs ── */}
      {total > 1 && (
        <div className="order-2 lg:order-1 flex flex-col gap-3">
          {courses.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`text-left rounded-2xl px-5 py-4 transition-all duration-200 border ${
                i === active
                  ? "bg-slate-900 border-slate-900 shadow-lg"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                i === active ? "text-red-400" : "text-slate-400"
              }`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className={`text-sm font-semibold leading-snug line-clamp-2 ${
                i === active ? "text-white" : "text-slate-700"
              }`}>
                {c.title}
              </p>
              {c.programType && (
                <p className={`text-xs mt-2 ${
                  i === active ? "text-slate-400" : "text-slate-400"
                }`}>
                  {c.programType.name}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Main card ── */}
      <div className={`order-1 lg:order-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col ${total > 1 ? "lg:col-span-2" : "lg:col-span-3"}`}>
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 260 }}>
          {course.image ? (
            <img
              key={course.id}
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center">
              <svg className="w-20 h-20 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
            {course.programType && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-red-800 px-3 py-1.5 rounded">
                {course.programType.name}
              </span>
            )}
            {total > 1 && (
              <span className="text-xs font-bold text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full ml-auto">
                {String(active + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
            {course.title}
          </h3>
          {course.description && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
              {course.description}
            </p>
          )}

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {course.startDate && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3 text-red-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(course.startDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
            {course.duration && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3 text-red-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration}
              </span>
            )}
            {course.format && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                {course.format.name}
              </span>
            )}
            {course.price && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                {course.price}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
            <Link
              href={`/education/${course.slug}`}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Подробнее
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {total > 1 && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex gap-1.5">
                  {courses.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Курс ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === active ? "w-5 h-1.5 bg-slate-900" : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                <button onClick={prev} aria-label="Предыдущий" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={next} aria-label="Следующий" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 flex items-center justify-center text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
