"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface StaticPage {
  title: string;
  description: string;
  url: string;
  section: string;
}

interface SearchResult {
  courses: Array<{ id: number; title: string; slug: string; description: string | null }>;
  events: Array<{ id: number; title: string; slug: string; date: string }>;
  staff: Array<{ id: number; name: string; position: string | null }>;
  news: Array<{ id: number; title: string; slug: string; summary: string | null }>;
  practice: Array<{ id: number; title: string; slug: string; category: string | null; company: string | null }>;
  projects: Array<{ id: number; title: string; slug: string; category: string | null; year: number | null }>;
  pages: StaticPage[];
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) { setQuery(""); setResults(null); }
  }, [open]);

  const hasResults = results && (
    results.courses.length > 0 ||
    results.events.length > 0 ||
    results.staff.length > 0 ||
    results.news.length > 0 ||
    results.practice.length > 0 ||
    results.projects.length > 0 ||
    results.pages.length > 0
  );

  function highlight(text: string) {
    if (!query || query.length < 2) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-slate-900 rounded px-0.5">{part}</mark>
      ) : part
    );
  }

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl top-[8%] translate-y-0 p-0 overflow-hidden gap-0"
      >
        <DialogTitle className="sr-only">Поиск по сайту</DialogTitle>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по сайту..."
            className="flex-1 text-sm outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
          />
          {loading ? (
            <span className="text-xs text-slate-400 animate-pulse">поиск...</span>
          ) : query ? (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Очистить">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Results */}
        <div className="max-h-[65vh] overflow-y-auto">
          {query.length < 2 && (
            <div className="py-10 text-center text-sm text-slate-400">
              Введите не менее 2 символов для поиска
            </div>
          )}

          {query.length >= 2 && !loading && !hasResults && (
            <div className="py-10 text-center text-sm text-slate-400">
              По запросу <span className="font-medium text-slate-600">«{query}»</span> ничего не найдено
            </div>
          )}

          {hasResults && (
            <div className="py-2">

              {/* Страницы сайта */}
              {results!.pages.length > 0 && (
                <section>
                  <SectionHeader label="Страницы сайта" first />
                  {results!.pages.map((p) => (
                    <ResultLink
                      key={p.url + p.title}
                      href={p.url}
                      external={p.url.startsWith("http")}
                      onClick={close}
                      title={highlight(p.title)}
                      subtitle={highlight(p.description)}
                      badge={p.section}
                    />
                  ))}
                </section>
              )}

              {/* Программы обучения */}
              {results!.courses.length > 0 && (
                <section>
                  <SectionHeader label="Программы обучения" />
                  {results!.courses.map((c) => (
                    <ResultLink
                      key={c.id}
                      href={`/education/${c.slug}`}
                      onClick={close}
                      title={highlight(c.title)}
                      subtitle={c.description ? highlight(c.description) : undefined}
                    />
                  ))}
                </section>
              )}

              {/* Новости */}
              {results!.news.length > 0 && (
                <section>
                  <SectionHeader label="Новости" />
                  {results!.news.map((n) => (
                    <ResultLink
                      key={n.id}
                      href={`/news/${n.slug}`}
                      onClick={close}
                      title={highlight(n.title)}
                      subtitle={n.summary ? highlight(n.summary) : undefined}
                    />
                  ))}
                </section>
              )}

              {/* События */}
              {results!.events.length > 0 && (
                <section>
                  <SectionHeader label="События" />
                  {results!.events.map((e) => (
                    <ResultLink
                      key={e.id}
                      href={`/events/${e.slug}`}
                      onClick={close}
                      title={highlight(e.title)}
                      subtitle={new Date(e.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    />
                  ))}
                </section>
              )}

              {/* Практика */}
              {results!.practice.length > 0 && (
                <section>
                  <SectionHeader label="Практика и стажировки" />
                  {results!.practice.map((p) => (
                    <ResultLink
                      key={p.id}
                      href={`/practice/${p.slug}`}
                      onClick={close}
                      title={highlight(p.title)}
                      subtitle={[p.category, p.company].filter(Boolean).join(" · ")}
                    />
                  ))}
                </section>
              )}

              {/* Проекты */}
              {results!.projects.length > 0 && (
                <section>
                  <SectionHeader label="Проекты" />
                  {results!.projects.map((p) => (
                    <ResultLink
                      key={p.id}
                      href={`/projects/${p.slug}`}
                      onClick={close}
                      title={highlight(p.title)}
                      subtitle={[p.category, p.year ? String(p.year) : ""].filter(Boolean).join(" · ")}
                    />
                  ))}
                </section>
              )}

              {/* Преподаватели */}
              {results!.staff.length > 0 && (
                <section>
                  <SectionHeader label="Преподаватели" />
                  {results!.staff.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="w-6 h-6 rounded-full bg-red-800/10 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-red-800/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{highlight(s.name)}</div>
                        {s.position && <div className="text-xs text-slate-400">{s.position}</div>}
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-4 text-[10px] text-slate-400">
          <span><kbd className="font-mono bg-slate-100 px-1 rounded">↵</kbd> перейти</span>
          <span><kbd className="font-mono bg-slate-100 px-1 rounded">Esc</kbd> закрыть</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeader({ label, first = false }: { label: string; first?: boolean }) {
  return (
    <div className={`px-4 py-1.5 ${first ? "" : "border-t border-slate-50"}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

function ResultLink({
  href,
  external = false,
  onClick,
  title,
  subtitle,
  badge,
}: {
  href: string;
  external?: boolean;
  onClick: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: string;
}) {
  const content = (
    <span className="flex flex-col px-4 py-2.5 hover:bg-slate-50 transition-colors group cursor-pointer w-full">
      <span className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-900 group-hover:text-red-800 transition-colors flex-1 line-clamp-1">{title}</span>
        {badge && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{badge}</span>}
        {external && (
          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </span>
      {subtitle && (
        <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">{subtitle}</span>
      )}
    </span>
  );

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className="block">{content}</a>;
  }
  return <Link href={href} onClick={onClick} className="block">{content}</Link>;
}
