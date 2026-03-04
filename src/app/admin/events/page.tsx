import {Clapperboard, Plus} from "lucide-react";

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

export const metadata = { title: "События — Панель управления" };

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">События</h1>
          <p className="text-sm text-gray-500">{events.length} событий</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new"><Plus size={14} /> Новое событие</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {events.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">Название</TableHead>
                <TableHead className="px-4 py-3">Дата</TableHead>
                <TableHead className="px-4 py-3">Место</TableHead>
                <TableHead className="px-4 py-3">Статус</TableHead>
                <TableHead className="px-4 py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-900 truncate" title={event.title}>{event.title}</div>
                    <div className="text-xs text-gray-400 truncate">/events/{event.slug}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {new Date(event.date).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate" title={event.location || ""}>{event.location || "—"}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge className={event.published ? "bg-green-100 text-green-700 border-0 hover:bg-green-100" : "bg-gray-100 text-gray-500 border-0 hover:bg-gray-100"}>
                      {event.published ? "Опубликовано" : "Черновик"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Link href={`/admin/events/${event.id}`} className="text-red-800 hover:underline text-xs font-medium">
                      Редактировать
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="w-full flex flex-col justify-center items-center py-16">
              <Clapperboard className="text-gray-500" size={48} />
            <p className="text-gray-500 mb-4">Нет событий</p>
            <Button asChild>
              <Link href="/admin/events/new"><Plus size={14} /> Создать событие</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
