export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Новости — Панель управления" };

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Новости</h1>
          <p className="text-sm text-gray-500">{news.length} новостей</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 bg-red-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors"
        >
          + Новая новость
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {news.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Название</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Дата</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Статус</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={n.title}>{n.title}</div>
                    <div className="text-xs text-gray-400 truncate">/news/{n.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(n.date).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${n.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {n.published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/news/${n.id}`} className="text-red-800 hover:underline text-xs font-medium">
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📰</div>
            <p className="text-gray-500 mb-4">Нет новостей</p>
            <Link href="/admin/news/new" className="inline-flex items-center gap-2 bg-red-800 text-white text-sm px-4 py-2 rounded-lg">
              + Создать новость
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
