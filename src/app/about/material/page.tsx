import SimpleInfoPage from "@/components/SimpleInfoPage";

export const metadata = {
  title: "Материально-техническое обеспечение — Академия Госфильмофонда России",
};

export default function MaterialPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Материально-техническое обеспечение" },
      ]}
      title="Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <section>
          <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">
            Учебные помещения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Съёмочный павильон", desc: "Оборудован профессиональным светотехническим оборудованием площадью 400 м²" },
              { name: "Монтажные аппаратные", desc: "8 рабочих мест с профессиональным ПО для монтажа" },
              { name: "Звукозаписывающая студия", desc: "Профессиональная студия звукозаписи класса А" },
              { name: "Кинозал", desc: "Оборудован проектором 4K и системой объёмного звука на 120 мест" },
              { name: "Лекционные аудитории", desc: "5 аудиторий вместимостью от 30 до 100 мест" },
              { name: "Медиатека", desc: "Доступ к архиву Госфильмофонда и специализированным базам данных" },
            ].map((item) => (
              <div key={item.name} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-[#1d1d1d] mb-1">{item.name}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">
            Доступная среда
          </h2>
          <p>
            Академия обеспечивает условия доступности для инвалидов и лиц с
            ограниченными возможностями здоровья: пандусы, лифты, тактильная навигация,
            специализированные рабочие места и санитарные узлы.
          </p>
        </section>
      </div>
    </SimpleInfoPage>
  );
}
