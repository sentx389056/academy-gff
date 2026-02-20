"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const aboutItems = [
  { label: "Основные сведения", href: "/about" },
  { label: "Структура и органы управления", href: "/about/structure" },
  { label: "Документы", href: "/about/documents" },
  { label: "Образование", href: "/education" },
  { label: "Образовательные стандарты", href: "/about/standards" },
  { label: "Руководство", href: "/management" },
  { label: "Педагогический состав", href: "/staff" },
  { label: "Материально-техническое обеспечение", href: "/about/material" },
  { label: "Стипендии и меры поддержки", href: "/about/scholarships" },
  { label: "Платные образовательные услуги", href: "/about/paid-services" },
  { label: "Финансово-хозяйственная деятельность", href: "/about/finance" },
  { label: "Вакантные места", href: "/about/vacancies" },
  { label: "Международное сотрудничество", href: "/about/international" },
  { label: "Организация питания", href: "/about/food" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white">
      <div className="mx-auto max-w-[1170px] px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="font-semibold text-sm leading-tight hidden sm:block">
              Академия Госфильмофонда России
            </span>
          </Link>

          {/* Desktop nav — NavigationMenu */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {/* Simple links */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="inline-flex h-9 items-center px-4 text-xs font-semibold uppercase tracking-wider text-white hover:text-slate-300 transition-colors rounded-md"
                    >
                      Главная
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/education"
                      className="inline-flex h-9 items-center px-4 text-xs font-semibold uppercase tracking-wider text-white hover:text-slate-300 transition-colors rounded-md"
                    >
                      Программы обучения
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/events"
                      className="inline-flex h-9 items-center px-4 text-xs font-semibold uppercase tracking-wider text-white hover:text-slate-300 transition-colors rounded-md"
                    >
                      События
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    {user ? (
                      <span className="inline-flex h-9 items-center px-4 text-xs font-semibold uppercase tracking-wider text-red-400 cursor-default rounded-md">
                        {user.name}
                      </span>
                    ) : (
                      <Link
                        href="/login"
                        className="inline-flex h-9 items-center px-4 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors rounded-md"
                      >
                        Личный кабинет
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* О нас — dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-white text-xs font-semibold uppercase tracking-wider h-9 px-4">
                    О нас
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-72 py-2 bg-white rounded-lg shadow-xl border border-slate-100">
                      {aboutItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-800 transition-colors"
                            >
                              {item.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex text-xs font-medium text-white bg-red-800 hover:bg-red-900 px-3 py-1.5 rounded transition-colors"
              >
                Админ
              </Link>
            )}

            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск..."
                    className="bg-white/10 border border-white/20 rounded px-3 py-1 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 w-40"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                      if (e.key === "Enter" && searchQuery.trim()) {
                        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                      }
                    }}
                  />
                  <button
                    className="p-1.5 hover:text-slate-300 transition-colors"
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    aria-label="Закрыть поиск"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="p-2 hover:text-slate-300 transition-colors"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Поиск"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              <div className="w-5 h-0.5 bg-white mb-1.5" />
              <div className="w-5 h-0.5 bg-white mb-1.5" />
              <div className="w-5 h-0.5 bg-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-800">
          <div className="mx-auto max-w-[1170px] px-4 py-4 flex flex-col gap-3">
            <Link href="/" className="text-sm font-semibold uppercase tracking-wide text-white hover:text-slate-300 py-1" onClick={() => setMobileOpen(false)}>Главная</Link>
            <Link href="/education" className="text-sm font-semibold uppercase tracking-wide text-white hover:text-slate-300 py-1" onClick={() => setMobileOpen(false)}>Программы обучения</Link>
            <Link href="/events" className="text-sm font-semibold uppercase tracking-wide text-white hover:text-slate-300 py-1" onClick={() => setMobileOpen(false)}>События</Link>
            {user ? (
              <span className="text-sm font-semibold uppercase tracking-wide text-red-400 py-1">{user.name}</span>
            ) : (
              <Link href="/login" className="text-sm font-semibold uppercase tracking-wide text-red-400 py-1" onClick={() => setMobileOpen(false)}>Личный кабинет</Link>
            )}
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">О нас</p>
              <div className="flex flex-col gap-1 pl-2">
                {aboutItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm text-slate-300 hover:text-white py-0.5" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
