export const dynamic = "force-dynamic";
import { Clipboard } from 'lucide-react';
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

export const metadata = { title: "Практика и стажировки — Панель управления" };

export default async function AdminPracticePage() {
  const items = await prisma.practice.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Практика и стажировки</h1>
          <p className="text-sm text-gray-500">{items.length} записей</p>
        </div>
        <Button asChild>
          <Link href="/admin/practice/new">+ Новая запись</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Название</TableHead>
                <TableHead className="px-4 py-3">Категория</TableHead>
                <TableHead className="px-4 py-3">Организация</TableHead>
                <TableHead className="px-4 py-3">Статус</TableHead>
                <TableHead className="px-4 py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={item.title}>{item.title}</div>
                    <div className="text-xs text-gray-400 truncate">/practice/{item.slug}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{item.category?.name || "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate" title={item.company || ""}>{item.company || "—"}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge className={item.published ? "bg-green-100 text-green-700 border-0 hover:bg-green-100" : "bg-gray-100 text-gray-500 border-0 hover:bg-gray-100"}>
                      {item.published ? "Опубликовано" : "Черновик"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Link href={`/admin/practice/${item.id}`} className="text-red-800 hover:underline text-xs font-medium">
                      Редактировать
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col justify-center items-center py-16">
              <Clipboard className="text-gray-500" size={48} />
            <p className="text-gray-500 mb-4">Нет записей о практике</p>
            <Button asChild>
              <Link href="/admin/practice/new">+ Создать запись</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
