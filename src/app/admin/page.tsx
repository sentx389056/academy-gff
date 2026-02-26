export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Панель управления — Академия ГФФ",
};

export default async function AdminDashboard() {
  const [coursesCount, eventsCount, staffCount, applicationsCount] = await Promise.all([
    prisma.course.count(),
    prisma.event.count(),
    prisma.staff.count(),
    prisma.application.count(),
  ]);

  const recentCourses = await prisma.course.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const recentEvents = await prisma.event.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Панель управления</h1>
        <p className="text-gray-500 text-sm mt-1">
          Академия Госфильмофонда России
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Курсов", value: coursesCount, href: "/admin/courses", color: "bg-blue-500" },
          { label: "События", value: eventsCount, href: "/admin/events", color: "bg-green-500" },
          { label: "Сотрудников", value: staffCount, href: "/admin/staff", color: "bg-red-800" },
          { label: "Заявки", value: applicationsCount, href: "/admin/applications", color: "bg-purple-600" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white text-lg font-bold">{stat.value}</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Быстрые действия</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-red-800 hover:bg-red-900">
            <Link href="/admin/courses/new">+ Новый курс</Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/events/new">+ Новое событие</Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/staff/new">+ Новый сотрудник</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Последние курсы</h2>
            <Link href="/admin/courses" className="text-xs text-red-800 hover:underline">
              Все →
            </Link>
          </div>
          {recentCourses.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentCourses.map((course) => (
                <li key={course.id} className="flex items-center justify-between">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-sm text-gray-700 hover:text-red-800 transition-colors truncate"
                  >
                    {course.title}
                  </Link>
                  <Badge className={course.published ? "bg-green-100 text-green-700 border-0 hover:bg-green-100" : "bg-gray-100 text-gray-500 border-0 hover:bg-gray-100"}>
                    {course.published ? "Опубликован" : "Черновик"}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Нет курсов</p>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Последние события</h2>
            <Link href="/admin/events" className="text-xs text-red-800 hover:underline">
              Все →
            </Link>
          </div>
          {recentEvents.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentEvents.map((event) => (
                <li key={event.id} className="flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-sm text-gray-700 hover:text-red-800 transition-colors truncate"
                  >
                    {event.title}
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString("ru-RU")}
                    </span>
                    <Badge className={event.published ? "bg-green-100 text-green-700 border-0 hover:bg-green-100" : "bg-gray-100 text-gray-500 border-0 hover:bg-gray-100"}>
                      {event.published ? "Опубликовано" : "Черновик"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Нет событий</p>
          )}
        </div>
      </div>
    </div>
  );
}
