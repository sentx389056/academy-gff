export const dynamic = "force-dynamic";
import SimpleInfoPage from "@/components/SimpleInfoPage";
import PageDocuments from "@/components/PageDocuments";

export const metadata = {
  title: "Вакантные места — Академия Госфильмофонда России",
};

export default function VacanciesPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Вакантные места для приёма" },
      ]}
      title="Вакантные места для приёма (перевода) обучающихся"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          Информация о количестве вакантных мест для приёма (перевода) обучающихся
          по каждой специальности с указанием форм обучения.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 border border-gray-200 font-semibold text-slate-900">Специальность</th>
                <th className="text-center p-3 border border-gray-200 font-semibold text-slate-900">Бюджетные места</th>
                <th className="text-center p-3 border border-gray-200 font-semibold text-slate-900">Платные места</th>
                <th className="text-left p-3 border border-gray-200 font-semibold text-slate-900">Форма</th>
              </tr>
            </thead>
            <tbody>
              {[
                { spec: "Режиссура кино и телевидения", budget: "5", paid: "10", form: "Очная" },
                { spec: "Операторское мастерство", budget: "5", paid: "8", form: "Очная" },
                { spec: "Звукорежиссура", budget: "3", paid: "7", form: "Очная" },
              ].map((row) => (
                <tr key={row.spec} className="hover:bg-slate-50">
                  <td className="p-3 border border-gray-200">{row.spec}</td>
                  <td className="p-3 border border-gray-200 text-center font-medium text-green-600">{row.budget}</td>
                  <td className="p-3 border border-gray-200 text-center font-medium text-red-800">{row.paid}</td>
                  <td className="p-3 border border-gray-200">{row.form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          Данные актуальны на дату обновления страницы. Для уточнения информации
          обратитесь в приёмную комиссию.
        </p>
      </div>
      <PageDocuments page="vacancies" title="Прикреплённые файлы" />
    </SimpleInfoPage>
  );
}
