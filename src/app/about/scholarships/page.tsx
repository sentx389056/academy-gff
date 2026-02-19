import SimpleInfoPage from "@/components/SimpleInfoPage";

export const metadata = {
  title: "Стипендии и меры поддержки — Академия Госфильмофонда России",
};

export default function ScholarshipsPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Стипендии и меры поддержки" },
      ]}
      title="Стипендии и меры поддержки обучающихся"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          Академия реализует комплекс мер социальной поддержки обучающихся в соответствии
          с действующим законодательством Российской Федерации.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Академическая стипендия", desc: "Выплачивается обучающимся на бюджетной основе по очной форме обучения при отсутствии академической задолженности" },
            { title: "Социальная стипендия", desc: "Назначается обучающимся из числа детей-сирот, инвалидов и других социально незащищённых категорий" },
            { title: "Материальная помощь", desc: "Единовременная выплата в трудных жизненных ситуациях из стипендиального фонда" },
            { title: "Льготное питание", desc: "Дотации на питание для льготных категорий обучающихся" },
          ].map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-[#8f1a1c] mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SimpleInfoPage>
  );
}
