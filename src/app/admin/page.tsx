export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Панель управления — Академия ГФФ",
};

export default async function AdminDashboard() {
  const [coursesCount, eventsCount, staffCount] = await Promise.all([
    prisma.course.count(),
    prisma.event.count(),
    prisma.staff.count(),
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
        <h1 className="text-2xl font-bold text-[#1d1d1d]">Панель управления</h1>
        <p className="text-gray-500 text-sm mt-1">
          Академия Госфильмофонда России
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Курсов", value: coursesCount, href: "/admin/courses", color: "bg-blue-500" },
          { label: "События", value: eventsCount, href: "/admin/events", color: "bg-green-500" },
          { label: "Сотрудников", value: staffCount, href: "/admin/staff", color: "bg-[#8f1a1c]" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white text-lg font-bold">{stat.value}</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1d1d1d]">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-[#1d1d1d] mb-4">Быстрые действия</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 bg-[#8f1a1c] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#7a1518] transition-colors"
          >
            + Новый курс
          </Link>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Новое событие
          </Link>
          <Link
            href="/admin/staff/new"
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Новый сотрудник
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1d1d1d]">Последние курсы</h2>
            <Link href="/admin/courses" className="text-xs text-[#8f1a1c] hover:underline">
              Все →
            </Link>
          </div>
          {recentCourses.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentCourses.map((course) => (
                <li key={course.id} className="flex items-center justify-between">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-sm text-gray-700 hover:text-[#8f1a1c] transition-colors truncate"
                  >
                    {course.title}
                  </Link>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      course.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {course.published ? "Опубликован" : "Черновик"}
                  </span>
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
            <h2 className="font-semibold text-[#1d1d1d]">Последние события</h2>
            <Link href="/admin/events" className="text-xs text-[#8f1a1c] hover:underline">
              Все →
            </Link>
          </div>
          {recentEvents.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentEvents.map((event) => (
                <li key={event.id} className="flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="text-sm text-gray-700 hover:text-[#8f1a1c] transition-colors truncate"
                  >
                    {event.title}
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString("ru-RU")}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        event.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {event.published ? "Опубликовано" : "Черновик"}
                    </span>
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
