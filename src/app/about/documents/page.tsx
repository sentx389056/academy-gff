export const dynamic = "force-dynamic";
import Link from "next/link";
import SimpleInfoPage from "@/components/SimpleInfoPage";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Документы — Академия Госфильмофонда России",
};

const CATEGORIES = [
  "Устав",
  "Лицензии",
  "Аккредитация",
  "Образовательные программы",
  "Расписание",
  "Локальные нормативные акты",
  "Отчёты",
];

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    docs: documents.filter((d) => d.category === cat),
  }));

  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Документы" },
      ]}
      title="Документы"
      subtitle="Официальные документы и нормативные акты"
    >
      <div className="space-y-8">
        {grouped.map(({ category, docs }) => (
          <section key={category}>
            <h2 className="text-lg font-semibold text-[#1d1d1d] mb-4 pb-2 border-b border-gray-200">
              {category}
            </h2>
            {docs.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {docs.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#8f1a1c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#8f1a1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-[#8f1a1c] transition-colors flex-1">
                        {doc.title}
                      </span>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Документы в данном разделе появятся в ближайшее время
              </p>
            )}
          </section>
        ))}
      </div>
    </SimpleInfoPage>
  );
}
