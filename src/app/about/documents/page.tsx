export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-8">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
                    <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{category}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {docs.map((doc) => (
                    <div key={doc.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">{doc.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Дата: {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                            <span>Формат: PDF</span>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Скачать
                        </a>
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
                    <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
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
            <li className="flex items-start gap-2">
              <span className="text-red-800 mt-1">•</span>
              Все документы доступны для ознакомления в рабочее время с 9:00 до 17:00 в приёмной ректора
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-800 mt-1">•</span>
              По вопросам получения документов обращаться по телефону: +7 (495) 123-45-67
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-800 mt-1">•</span>
              Документы обновляются в соответствии с изменениями в законодательстве
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
