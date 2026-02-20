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
import DocumentActions from "./DocumentActions";

export const metadata = {
  title: "Документы страниц — Академия ГФФ",
};

const PAGE_LABELS: Record<string, string> = {
  about: "Основные сведения",
  structure: "Структура",
  material: "Матер.-техн. обеспечение",
  scholarships: "Стипендии",
  "paid-services": "Платные услуги",
  finance: "Финансы",
  standards: "Стандарты",
  vacancies: "Вакантные места",
  international: "Международное сотр.",
  food: "Питание",
};

export default async function AdminDocumentsPage() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Документы страниц</h1>
          <p className="text-slate-500 text-sm mt-1">
            Файлы, прикреплённые к страницам «О нас» — {docs.length} шт.
          </p>
        </div>
        <DocumentActions mode="add" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Страница</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-24">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                  Документов пока нет
                </TableCell>
              </TableRow>
            )}
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-slate-400 text-xs">{doc.id}</TableCell>
                <TableCell>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-900 hover:text-red-800 transition-colors">
                    {doc.title}
                  </a>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{doc.category}</TableCell>
                <TableCell>
                  {doc.page ? (
                    <Badge variant="outline" className="text-xs">
                      {PAGE_LABELS[doc.page] || doc.page}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-400">
                  {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>
                  <DocumentActions mode="delete" docId={doc.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
