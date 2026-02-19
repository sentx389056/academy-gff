import SimpleInfoPage from "@/components/SimpleInfoPage";

export const metadata = {
  title: "Структура и органы управления — Академия Госфильмофонда России",
};

export default function StructurePage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Структура и органы управления" },
      ]}
      title="Структура и органы управления образовательной организацией"
    >
      <div className="space-y-8 text-gray-700 leading-relaxed max-w-4xl">
        <section>
          <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">Органы управления</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-[#1d1d1d] mb-2">Директор Академии</h3>
              <p className="text-sm">
                Осуществляет общее руководство деятельностью Академии, представляет
                интересы в органах государственной власти, учреждениях и организациях.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-[#1d1d1d] mb-2">Педагогический совет</h3>
              <p className="text-sm">
                Коллегиальный орган управления, рассматривающий и решающий вопросы
                содержания, методов и форм образовательного процесса.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-[#1d1d1d] mb-2">Учебный отдел</h3>
              <p className="text-sm">
                Организует и координирует учебный процесс, разрабатывает учебные планы
                и программы, осуществляет контроль успеваемости обучающихся.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-[#1d1d1d] mb-2">Методический отдел</h3>
              <p className="text-sm">
                Осуществляет методическое обеспечение образовательного процесса,
                разрабатывает учебно-методические материалы.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">Структурные подразделения</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Кафедра режиссуры кино и телевидения</li>
            <li>Кафедра операторского мастерства</li>
            <li>Кафедра звукорежиссуры</li>
            <li>Кафедра теории и истории кино</li>
            <li>Кафедра архивного дела и документоведения</li>
            <li>Административно-хозяйственная служба</li>
            <li>Библиотека и медиатека</li>
          </ul>
        </section>
      </div>
    </SimpleInfoPage>
  );
}
