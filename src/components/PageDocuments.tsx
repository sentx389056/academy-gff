import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  page: string;
  title?: string;
}

export default async function PageDocuments({ page, title = "Документы" }: Props) {
  const docs = await prisma.document.findMany({
    where: { page },
    orderBy: { createdAt: "desc" },
  });

  if (docs.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-5 bg-red-800 rounded-full" />
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium text-sm text-slate-900">{doc.title}</TableCell>
                <TableCell className="text-xs text-slate-500">{doc.category}</TableCell>
                <TableCell className="text-xs text-slate-400">
                  {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="default">
                    <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      Скачать
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
