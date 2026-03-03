"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import SearchDialog from "@/components/SearchDialog";
import {Eye, Menu, SearchIcon, SquareArrowOutUpRight, UserRound, X} from "lucide-react";

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

const mainNavItems = [
  { label: "Обучение", href: "/education" },
  { label: "Практика и стажировки", href: "/practice" },
  { label: "Проекты", href: "/projects" },
  {
    label: "Вестник Госфильмофонда России",
    href: "https://vestnik-gosfilmofond.ru",
    external: true,
  },
  { label: "Новости", href: "/news" }
];

type FontSize = "normal" | "large" | "xlarge";
type ColorScheme = "normal" | "bw" | "wb";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accessBar, setAccessBar] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("normal");
  const { user } = useAuth();

  /* Restore settings from localStorage on mount */
  useEffect(() => {
    const fs = localStorage.getItem("a11y-font") as FontSize | null;
    const cs = localStorage.getItem("a11y-color") as ColorScheme | null;
    if (fs) setFontSize(fs);
    if (cs) setColorScheme(cs);
    const bar = localStorage.getItem("a11y-bar");
    if (bar === "1") setAccessBar(true);
  }, []);

  /* Apply font-size class to <html> */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("a11y-font-large", "a11y-font-xlarge");
    if (fontSize === "large") html.classList.add("a11y-font-large");
    if (fontSize === "xlarge") html.classList.add("a11y-font-xlarge");
    localStorage.setItem("a11y-font", fontSize);
  }, [fontSize]);

  /* Apply color-scheme data attribute */
  useEffect(() => {
    const html = document.documentElement;
    html.removeAttribute("data-a11y");
    if (colorScheme !== "normal") html.setAttribute("data-a11y", colorScheme);
    localStorage.setItem("a11y-color", colorScheme);
  }, [colorScheme]);

  function toggleAccessBar() {
    const next = !accessBar;
    setAccessBar(next);
    localStorage.setItem("a11y-bar", next ? "1" : "0");
    if (!next) {
      setFontSize("normal");
      setColorScheme("normal");
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      {/* ── ACCESSIBILITY BAR ── */}
      {accessBar && (
        <div className="bg-slate-800 text-white text-xs border-b border-white/10">
          <div className="mx-auto max-w-[1170px] px-4 py-2 flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-300">Версия для слабовидящих:</span>

            {/* Font size */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1">Шрифт:</span>
              {(["normal", "large", "xlarge"] as FontSize[]).map((fs, i) => (
                <Button
                  key={fs}
                  onClick={() => setFontSize(fs)}
                  className={`w-7 h-7 rounded font-semibold transition-colors ${
                    fontSize === fs
                      ? "bg-red-800 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  style={{ fontSize: 12 + i * 2 }}
                  aria-label={`Размер шрифта ${["обычный", "большой", "очень большой"][i]}`}
                  title={["Обычный", "Большой", "Очень большой"][i]}
                >
                  A
                </Button>
              ))}
            </div>

            {/* Color scheme */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1">Цвета:</span>
              <Button
                onClick={() => setColorScheme("normal")}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  colorScheme === "normal"
                    ? "border-red-800 bg-red-800 text-white"
                    : "border-white/20 hover:border-white/40"
                }`}
                aria-label="Обычная цветовая схема"
              >
                Ц
              </Button>
              <Button
                onClick={() => setColorScheme("bw")}
                className={`px-2.5 py-1 rounded border transition-colors bg-white text-black ${
                  colorScheme === "bw" ? "border-red-800 ring-1 ring-red-800" : "border-slate-300"
                }`}
                aria-label="Чёрный на белом"
                title="Чёрный на белом"
              >
                Ч
              </Button>
              <Button
                onClick={() => setColorScheme("wb")}
                className={`px-2.5 py-1 rounded border transition-colors bg-black text-white ${
                  colorScheme === "wb" ? "border-red-800 ring-1 ring-red-800" : "border-slate-600"
                }`}
                aria-label="Белый на чёрном"
                title="Белый на чёрном"
              >
                Ч
              </Button>
            </div>

            <Button
              onClick={() => {
                setFontSize("normal");
                setColorScheme("normal");
              }}
              variant="secondary"
              className="ml-auto "
            >
              Сбросить
            </Button>
          </div>
        </div>
      )}
        {/* ── TOP ROW ── */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-[1170px] px-4">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <svg
                  className="w-7 h-7 text-white shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
                <span className="font-semibold text-sm leading-tight hidden sm:block">
                  Академия Госфильмофонда России
                </span>
              </Link>

              {/* Right actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex text-sm font-medium border-b text-white bg-red-600 "
                  >
                    Администрирование
                  </Link>
                )}

                {/* Accessibility toggle */}
                <Button
                  onClick={toggleAccessBar}
                  className={`hidden sm:inline-flex items-center rounded ${
                    accessBar
                      ? "bg-white/20 border-white/40 text-white"
                      : "border-white/20  "
                  }`}
                  aria-label="Версия для слабовидящих"
                >
                    <Eye/>
                  <span>Версия для слабовидящих</span>
                </Button>

                {/* Personal account */}
                {user ? (
                  <span className="hidden sm:inline-flex text-xs font-semibold text-red-400 px-3 py-1.5 max-w-[140px] truncate">
                    {user.name}
                  </span>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 transition-colors"
                  >
                      <UserRound size={14}/>
                    Личный кабинет
                  </Link>
                )}

                {/* Search button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded hover:bg-white/10 transition-colors text-white cursor-pointer"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Поиск"
                >
                    <SearchIcon />
                </Button>

                {/* Mobile hamburger */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden p-2 rounded hover:bg-white/10 transition-colors text-white"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Открыть меню"
                >
                  {mobileOpen ? (
                    <X size={20}/>
                  ) : (
                    <Menu size={20}/>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── NAV ROW (desktop) ── */}
        <div className="hidden lg:block bg-slate-800">
          <div className="mx-auto max-w-[1170px] px-4">
            <div className="flex items-center h-10 gap-0">
              {/* О нас dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-white text-xs font-semibold uppercase tracking-wider h-10 px-4 rounded-none">
                      О нас
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-72 py-2 bg-white rounded-lg shadow-xl border border-slate-100">
                        {aboutItems.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-800 transition-colors leading-snug"
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

              {/* Other nav items */}
              {mainNavItems.map((item) =>
                item.external ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 h-10 px-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{item.label}</span>
                      <SquareArrowOutUpRight className={`opacity-60 shrink-0`} size={12} />
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center h-10 px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-slate-800">
            <div className="mx-auto max-w-[1170px] px-4 py-4 flex flex-col gap-1">
              {/* Accessibility in mobile */}
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white py-2 justify-start px-0"
                onClick={() => { toggleAccessBar(); setMobileOpen(false); }}
              >
                <Eye size={16}/>
                Версия для слабовидящих
              </Button>

              <div className="border-t border-white/10 pt-3 mt-1">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">О нас</p>
                <div className="flex flex-col gap-0.5 pl-2">
                  {aboutItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm text-slate-300 hover:text-white py-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-0.5">
                {mainNavItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-slate-300 py-1.5 flex items-center gap-1.5"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                        <SquareArrowOutUpRight className={`opacity-60 shrink-0`} size={12} />
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-semibold text-white hover:text-slate-300 py-1.5"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>

              <div className="border-t border-white/10 pt-3 mt-1">
                {user ? (
                  <span className="text-sm font-semibold text-red-400 py-1">{user.name}</span>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-red-400 hover:text-red-300 py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Личный кабинет
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search dialog (outside header so it overlays everything) */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
