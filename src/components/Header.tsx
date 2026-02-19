"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  {
    label: "Сведения об организации",
    href: "/about",
    children: [
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
    ],
  },
  { label: "Курсы", href: "/education" },
  { label: "События", href: "/events" },
  { label: "Педагоги", href: "/staff" },
  { label: "Руководство", href: "/management" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-[1170px] px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8f1a1c] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">АГФ</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[#1d1d1d] text-sm leading-tight">
                Академия
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                Госфильмофонда России
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="text-sm font-medium text-[#1d1d1d] hover:text-[#8f1a1c] transition-colors flex items-center gap-1">
                    {item.label}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-[#1d1d1d] hover:bg-gray-50 hover:text-[#8f1a1c] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[#1d1d1d] hover:text-[#8f1a1c] transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-white bg-[#8f1a1c] hover:bg-[#7a1518] px-3 py-1.5 rounded transition-colors"
              >
                Админ
              </Link>
            )}
            {user ? (
              <span className="text-sm text-gray-600 hidden sm:block">{user.name}</span>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-[#8f1a1c] hover:underline"
              >
                Войти
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <div className="w-5 h-0.5 bg-gray-700 mb-1" />
              <div className="w-5 h-0.5 bg-gray-700 mb-1" />
              <div className="w-5 h-0.5 bg-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-[1170px] px-4 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block text-sm font-medium text-[#1d1d1d] hover:text-[#8f1a1c] py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block text-xs text-gray-600 hover:text-[#8f1a1c] py-0.5"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
