import Link from "next/link";

export const metadata = {
  title: "Основные сведения — Академия Госфильмофонда России",
};

const aboutSections = [
  { label: "Структура и органы управления", href: "/about/structure" },
  { label: "Документы", href: "/about/documents" },
  { label: "Образование", href: "/education" },
  { label: "Образовательные стандарты и требования", href: "/about/standards" },
  { label: "Руководство", href: "/management" },
  { label: "Педагогический состав", href: "/staff" },
  { label: "Материально-техническое обеспечение", href: "/about/material" },
  { label: "Стипендии и меры поддержки", href: "/about/scholarships" },
  { label: "Платные образовательные услуги", href: "/about/paid-services" },
  { label: "Финансово-хозяйственная деятельность", href: "/about/finance" },
  { label: "Вакантные места для приёма", href: "/about/vacancies" },
  { label: "Международное сотрудничество", href: "/about/international" },
  { label: "Организация питания", href: "/about/food" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <span>Сведения об организации</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Основные сведения</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1">
            <div className="bg-[#f8fafc] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#1d1d1d] mb-3 uppercase tracking-wide">
                Разделы
              </h3>
              <ul className="flex flex-col gap-1">
                {aboutSections.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-white hover:text-[#8f1a1c] hover:shadow-sm transition-all"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">
                Об организации
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <strong>Полное наименование:</strong> Образовательное подразделение
                  Федерального государственного бюджетного учреждения «Государственный
                  фонд кинофильмов Российской Федерации» — Академия Госфильмофонда России.
                </p>
                <p>
                  <strong>Сокращённое наименование:</strong> Академия ГФФ России
                </p>
                <p>
                  <strong>Тип:</strong> Образовательное подразделение федерального
                  государственного бюджетного учреждения
                </p>
                <p>
                  <strong>Учредитель:</strong> Министерство культуры Российской Федерации
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">
                Контактные данные
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Адрес:</strong> 143050, Московская область, г. Красногорск,
                  ул. Госфильмофонда, д. 1
                </p>
                <p>
                  <strong>Телефон:</strong>{" "}
                  <a href="tel:+74951234567" className="text-[#8f1a1c] hover:underline">
                    +7 (495) 123-45-67
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:info@academy-gff.ru" className="text-[#8f1a1c] hover:underline">
                    info@academy-gff.ru
                  </a>
                </p>
                <p>
                  <strong>Режим работы:</strong> Понедельник–пятница: 09:00–18:00
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1d1d1d] mb-4">
                Миссия и цели
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Академия Госфильмофонда России осуществляет профессиональную подготовку
                специалистов в области кинематографии, сохранения и популяризации
                отечественного кинематографического наследия. Наша цель — подготовить
                высококвалифицированных специалистов, способных сохранять и развивать
                богатые традиции российского кино.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
