export const dynamic = "force-dynamic";
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
import ApplicationActions from "./ApplicationActions";

export const metadata = {
  title: "Заявки — Академия ГФФ",
};

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  NEW: { label: "Новая", variant: "default" },
  IN_REVIEW: { label: "На рассмотрении", variant: "secondary" },
  APPROVED: { label: "Одобрена", variant: "outline" },
  REJECTED: { label: "Отклонена", variant: "destructive" },
};

const TYPE_LABELS: Record<string, string> = {
  course: "Курс",
  event: "Событие",
  contact: "Обратная связь",
};

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true } },
      event: { select: { title: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Заявки</h1>
        <p className="text-slate-500 text-sm mt-1">
          Все заявки с сайта — {applications.length} шт.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Заявитель</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Объект</TableHead>
              <TableHead>Контакты</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-28">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-400 py-12">
                  Заявок пока нет
                </TableCell>
              </TableRow>
            )}
            {applications.map((app) => {
              const statusInfo = STATUS_LABELS[app.status] || STATUS_LABELS.NEW;
              return (
                <TableRow key={app.id}>
                  <TableCell className="text-slate-400 text-xs">{app.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 text-sm">{app.name}</div>
                    {app.workplace && (
                      <div className="text-xs text-slate-400">{app.workplace}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {TYPE_LABELS[app.type] || app.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {app.course?.title || app.event?.title || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-600">{app.email}</div>
                    {app.phone && <div className="text-xs text-slate-400">{app.phone}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant} className="text-xs">
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <ApplicationActions id={app.id} status={app.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
