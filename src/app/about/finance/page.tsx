import SimpleInfoPage from "@/components/SimpleInfoPage";

export const metadata = {
  title: "Финансово-хозяйственная деятельность — Академия Госфильмофонда России",
};

export default function FinancePage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Финансово-хозяйственная деятельность" },
      ]}
      title="Финансово-хозяйственная деятельность"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          Информация о финансово-хозяйственной деятельности Академии в соответствии
          с требованиями законодательства об образовании.
        </p>
        <section>
          <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">
            Объём финансирования
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Источник финансирования</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Год</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { source: "Субсидия на выполнение государственного задания", year: "2024", sum: "Информация будет размещена" },
                  { source: "Платные образовательные услуги", year: "2024", sum: "Информация будет размещена" },
                  { source: "Иные источники", year: "2024", sum: "Информация будет размещена" },
                ].map((row) => (
                  <tr key={row.source} className="hover:bg-[#f8fafc]">
                    <td className="p-3 border border-gray-200">{row.source}</td>
                    <td className="p-3 border border-gray-200">{row.year}</td>
                    <td className="p-3 border border-gray-200 text-gray-500 italic">{row.sum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </SimpleInfoPage>
  );
}
