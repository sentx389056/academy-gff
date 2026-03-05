import {Calendar, Download, FileText, Info} from "lucide-react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {Button} from "@/components/ui/button";

export const metadata = {
  title: "Документы — Академия Госфильмофонда России",
};

const CATEGORIES = [
  "Устав",
  "Учредительные документы",
  "Правила внутреннего распорядка",
  "Коллективный договор",
  "Локальные нормативные акты",
  "Отчётность",
  "Лицензии",
  "Аккредитация",
  "Образовательные программы",
  "Расписание",
];

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    docs: documents.filter((d) => d.category === cat),
  })).filter(({ docs }) => docs.length > 0);

  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white transition-colors">Сведения об организации</Link>
            <span>/</span>
            <span>Документы</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Документы</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-8">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-sm px-5 py-4 mb-8">
            <Info className={`text-blue-500 mt-0.5`} size={30} />
          <p className="text-sm text-blue-700 leading-relaxed">
            Все документы представлены в актуальных редакциях и соответствуют требованиям действующего законодательства Российской Федерации. Документы подписаны усиленной квалифицированной электронной подписью.
          </p>
        </div>

        {grouped.length > 0 ? (
          <div className="space-y-8">
            {grouped.map(({ category, docs }) => (
              <section key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-red-800/10 flex items-center justify-center flex-shrink-0">
                      <FileText className={`text-red-800`} size={14} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{category}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {docs.map((doc) => (
                    <div key={doc.id} className="border border-slate-200 rounded-sm p-4 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">{doc.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                              Дата: {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                            <span>Формат: PDF</span>
                          </div>
                        </div>
                          <Button asChild>
                              <Link
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer">
                                  <Download size={14} />
                                  Скачать
                              </Link>
                          </Button>

                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORIES.map((category) => (
              <section key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-red-800/10 flex items-center justify-center flex-shrink-0">
                      <FileText className={`text-red-800`} size={14} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{category}</h2>
                </div>
                <p className="text-sm text-slate-400 italic pl-8">
                  Документы в данном разделе появятся в ближайшее время
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Additional info */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Дополнительная информация</p>
          <ul className="space-y-1.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="bg-red-800 rounded-full p-1"></span>
              Все документы доступны для ознакомления в рабочее время с 9:00 до 17:00 в приёмной ректора
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-red-800 rounded-full p-1"></span>
              По вопросам получения документов обращаться по телефону: +7 (495) 123-45-67
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-red-800 rounded-full p-1"></span>
              Документы обновляются в соответствии с изменениями в законодательстве
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
