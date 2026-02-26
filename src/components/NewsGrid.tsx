"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  date: Date | string;
  summary: string | null;
  image: string | null;
}

interface Props {
  news: NewsItem[];
  pageSize?: number;
}

export default function NewsGrid({ news, pageSize = 3 }: Props) {
  const [visible, setVisible] = useState(pageSize);

  if (news.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        Новости скоро появятся
      </div>
    );
  }

  const shown = news.slice(0, visible);
  const hasMore = visible < news.length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((n) => (
          <Link key={n.id} href={`/news/${n.slug}`} className="group">
            <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
              {/* Image */}
              {n.image ? (
                <img
                  src={n.image}
                  alt={n.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Date */}
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(n.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-red-800 transition-colors line-clamp-3 mb-2">
                  {n.title}
                </h3>

                {/* Summary */}
                {n.summary && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-auto">{n.summary}</p>
                )}

                {/* Read more */}
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-800 group-hover:gap-2 transition-all">
                  Читать
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={() => setVisible((v) => v + pageSize)}
            variant="outline"
            className="border-slate-300 hover:border-red-800 text-slate-700 hover:text-red-800 font-semibold px-8 py-2.5 rounded transition-colors text-sm"
          >
            Показать ещё
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
