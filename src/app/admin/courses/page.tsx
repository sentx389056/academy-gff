export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Курсы — Панель управления" };

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { lessons: true },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Курсы</h1>
          <p className="text-sm text-gray-500">{courses.length} курсов всего</p>
        </div>
        <Button asChild className="bg-red-800 hover:bg-red-900">
          <Link href="/admin/courses/new">+ Новый курс</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {courses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Название</TableHead>
                <TableHead className="px-4 py-3">Уроков</TableHead>
                <TableHead className="px-4 py-3">Статус</TableHead>
                <TableHead className="px-4 py-3">Создан</TableHead>
                <TableHead className="px-4 py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={course.title}>{course.title}</div>
                    <div className="text-xs text-gray-400 truncate">/education/{course.slug}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{course.lessons.length}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge className={course.published ? "bg-green-100 text-green-700 border-0 hover:bg-green-100" : "bg-gray-100 text-gray-500 border-0 hover:bg-gray-100"}>
                      {course.published ? "Опубликован" : "Черновик"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(course.createdAt).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Link href={`/admin/courses/${course.id}`} className="text-red-800 hover:underline text-xs font-medium">
                      Редактировать
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500 mb-4">Нет курсов. Создайте первый!</p>
            <Button asChild className="bg-red-800 hover:bg-red-900">
              <Link href="/admin/courses/new">+ Создать курс</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
