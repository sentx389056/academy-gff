"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Calendar, ChevronDown, ChevronRight, Newspaper} from "lucide-react";

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
                    <Newspaper className="text-white/20" size={48} />
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Date */}
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="text-red-800" size={12} />
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
                    <ChevronRight size={14} />
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
              <ChevronDown size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
