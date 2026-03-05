import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    BriefcaseBusiness,
    Calendar,
    File,
    FileText,
    Lightbulb,
    Menu,
    Newspaper, SquareArrowOutUpRight,
    UserRound
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">АГФ</span>
            </div>
            <div>
              <div className="text-sm font-semibold">Панель управления</div>
              <div className="text-xs text-gray-400">{session.name}</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 py-2">
            Контент
          </p>
          {[
            {
              label: "Курсы",
              href: "/admin/courses",
              icon: <BookOpen size={16} />,
            },
            {
              label: "События",
              href: "/admin/events",
              icon: <Calendar size={16} />
            },
            {
              label: "Сотрудники",
              href: "/admin/staff",
              icon: <UserRound size={16} />
            },
            {
              label: "Заявки",
              href: "/admin/applications",
              icon: <FileText size={16} />,
            },
            {
              label: "Новости",
              href: "/admin/news",
              icon: <Newspaper size={16} />
            },
            {
              label: "Практика",
              href: "/admin/practice",
              icon: <BriefcaseBusiness size={16} />,
            },
            {
              label: "Проекты",
              href: "/admin/projects",
              icon: <Lightbulb size={16} />,
            },
            {
              label: "Документы",
              href: "/admin/documents",
              icon: <File size={16} />,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 py-2 mt-4">
            Настройки
          </p>
          <Link
            href="/admin/references"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Menu size={16} />
            Справочники
          </Link>

          <p className="text-xs uppercase tracking-wider text-gray-500 px-3 py-2 mt-4">
            Сайт
          </p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <SquareArrowOutUpRight size={16} />
            Перейти на сайт
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors justify-start"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
