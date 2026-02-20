export const dynamic = "force-dynamic";
import SimpleInfoPage from "@/components/SimpleInfoPage";
import PageDocuments from "@/components/PageDocuments";

export const metadata = {
  title: "Образовательные стандарты — Академия Госфильмофонда России",
};

export default function StandardsPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Образовательные стандарты и требования" },
      ]}
      title="Образовательные стандарты и требования"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          Академия Госфильмофонда России реализует дополнительные профессиональные
          программы в соответствии с требованиями федерального законодательства в сфере
          образования и профессиональными стандартами.
        </p>
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Реализуемые программы
          </h2>
          <div className="space-y-4">
            {[
              { code: "55.05.01", name: "Режиссура кино и телевидения" },
              { code: "55.05.02", name: "Звукорежиссура аудиовизуальных искусств" },
              { code: "55.05.03", name: "Кинооператорство" },
              { code: "51.03.04", name: "Музеология и охрана объектов культурного и природного наследия" },
            ].map((prog) => (
              <div key={prog.code} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-mono bg-red-800/10 text-red-800 px-2 py-1 rounded">
                    {prog.code}
                  </span>
                  <span className="font-medium text-slate-900">{prog.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <PageDocuments page="standards" title="Прикреплённые файлы" />
    </SimpleInfoPage>
  );
}
