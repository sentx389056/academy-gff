export const dynamic = "force-dynamic";
import SimpleInfoPage from "@/components/SimpleInfoPage";
import PageDocuments from "@/components/PageDocuments";

export const metadata = {
  title: "Организация питания — Академия Госфильмофонда России",
};

export default function FoodPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Организация питания" },
      ]}
      title="Организация питания в образовательной организации"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          На территории Академии организовано питание обучающихся и сотрудников
          в соответствии с санитарно-эпидемиологическими требованиями.
        </p>
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Столовая</h2>
          <div className="border border-gray-200 rounded-sm p-5 space-y-3">
            <div className="flex gap-4 text-sm">
              <div className="font-semibold text-slate-900 w-32 flex-shrink-0">Расположение:</div>
              <div>Главный корпус, 1 этаж</div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="font-semibold text-slate-900 w-32 flex-shrink-0">Режим работы:</div>
              <div>Пн–Пт: 08:00–19:00</div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="font-semibold text-slate-900 w-32 flex-shrink-0">Вместимость:</div>
              <div>80 посадочных мест</div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Льготное питание
          </h2>
          <p className="text-sm">
            Отдельные категории обучающихся имеют право на получение льготного питания
            за счёт средств федерального и регионального бюджетов. Для получения
            информации обратитесь в социальный отдел Академии.
          </p>
        </section>
      </div>
      <PageDocuments page="food" title="Прикреплённые файлы" />
    </SimpleInfoPage>
  );
}
