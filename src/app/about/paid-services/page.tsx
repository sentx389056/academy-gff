import SimpleInfoPage from "@/components/SimpleInfoPage";

export const metadata = {
  title: "Платные образовательные услуги — Академия Госфильмофонда России",
};

export default function PaidServicesPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Платные образовательные услуги" },
      ]}
      title="Платные образовательные услуги"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          Академия оказывает платные образовательные услуги в соответствии с лицензией
          на осуществление образовательной деятельности.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f1f5f9]">
                <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Программа</th>
                <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Форма обучения</th>
                <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Срок</th>
                <th className="text-left p-3 border border-gray-200 font-semibold text-[#1d1d1d]">Стоимость (год)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Режиссура кино и телевидения", form: "Очная", duration: "4 года", price: "280 000 руб." },
                { name: "Операторское мастерство", form: "Очная", duration: "4 года", price: "260 000 руб." },
                { name: "Звукорежиссура", form: "Очная", duration: "4 года", price: "240 000 руб." },
                { name: "Кинодокументалистика", form: "Очная/Заочная", duration: "2 года", price: "180 000 руб." },
              ].map((row) => (
                <tr key={row.name} className="hover:bg-[#f8fafc]">
                  <td className="p-3 border border-gray-200">{row.name}</td>
                  <td className="p-3 border border-gray-200">{row.form}</td>
                  <td className="p-3 border border-gray-200">{row.duration}</td>
                  <td className="p-3 border border-gray-200 font-medium text-[#8f1a1c]">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          * Стоимость обучения может быть изменена. Для получения актуальной информации
          свяжитесь с приёмной комиссией.
        </p>
      </div>
    </SimpleInfoPage>
  );
}
