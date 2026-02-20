export const dynamic = "force-dynamic";
import Link from "next/link";
import PageDocuments from "@/components/PageDocuments";

export const metadata = {
  title: "Основные сведения — Академия Госфильмофонда России",
};

function InfoBlock({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden mb-4">
      {/* Block header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="w-7 h-7 rounded-full bg-red-800/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
      </div>
      <div className="px-5 py-1">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col sm:flex-row py-2.5 border-b border-slate-100 last:border-0 gap-1 sm:gap-4">
            <span className="text-xs text-slate-400 sm:w-56 flex-shrink-0 font-medium">{row.label}</span>
            <span className="text-sm text-slate-700">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span>Сведения об организации</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Основные сведения</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-8">
        <InfoBlock
          title="Наименование организации"
          rows={[
            {
              label: "Полное наименование",
              value: 'Федеральное государственное бюджетное учреждение высшего образования "Академия Госфильмофонда России"',
            },
            {
              label: "Сокращённое наименование",
              value: 'ФГБО ВО "Академия Госфильмофонда России"',
            },
          ]}
        />

        <InfoBlock
          title="Дата создания образовательной организации"
          rows={[
            { label: "Дата создания", value: "15 октября 1946 года" },
          ]}
        />

        <InfoBlock
          title="Учредитель образовательной организации"
          rows={[
            { label: "Наименование учредителя", value: "Министерство культуры Российской Федерации" },
            { label: "Адрес учредителя", value: "125993, г. Москва, ул. Малая Молчановка, д. 7" },
            {
              label: "Официальный сайт учредителя",
              value: (
                <a href="https://culture.gov.ru" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:underline">
                  culture.gov.ru
                </a>
              ),
            },
          ]}
        />

        <InfoBlock
          title="Место нахождения образовательной организации"
          rows={[
            {
              label: "Адрес",
              value: "142297, г. Москва, ул. Кинематографическая, д. 12",
            },
          ]}
        />

        <InfoBlock
          title="Режим и график работы"
          rows={[
            {
              label: "График работы",
              value: "Понедельник — пятница: 9:00 — 18:00, суббота: 10:00 — 15:00, воскресенье: выходной",
            },
          ]}
        />

        <InfoBlock
          title="Контактные телефоны и адреса электронной почты"
          rows={[
            {
              label: "Телефон",
              value: (
                <a href="tel:+74951234567" className="text-red-800 hover:underline">+7 (495) 123-45-67</a>
              ),
            },
            {
              label: "Факс",
              value: (
                <a href="tel:+74951234547" className="text-red-800 hover:underline">+7 (495) 123-45-47</a>
              ),
            },
            {
              label: "Электронная почта",
              value: (
                <a href="mailto:info@academy.ru" className="text-red-800 hover:underline">info@academy.ru</a>
              ),
            },
          ]}
        />

        <InfoBlock
          title="Места осуществления образовательной деятельности"
          rows={[
            { label: "Адрес 1", value: "г. Москва, ул. Кинематографическая, д. 12, корп. 1 (учебный корпус)" },
            { label: "Адрес 2", value: "г. Москва, ул. Кинематографическая, д. 12, корп. 2 (административный корпус)" },
            { label: "Адрес 3", value: "г. Москва, ул. Студийная, д. 5 (кино-студия и павильоны)" },
          ]}
        />

        <InfoBlock
          title="Лицензия на осуществление образовательной деятельности"
          rows={[
            { label: "Номер лицензии", value: "№ 1234" },
            { label: "Дата выдачи", value: "15 марта 2013 года" },
            { label: "Орган, выдавший лицензию", value: "Федеральная служба по надзору в сфере образования и науки" },
            { label: "Срок действия", value: "Бессрочно" },
            {
              label: "Выписка из реестра лицензий",
              value: (
                <a href="#" className="text-red-800 hover:underline">Скачать выписку (PDF)</a>
              ),
            },
          ]}
        />

        {/* Navigation to other sections */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-5" id="structure">
            Структура и органы управления образовательной организацией
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Структура и органы управления", href: "/about/structure" },
              { label: "Документы", href: "/about/documents" },
              { label: "Образование", href: "/education" },
              { label: "Образовательные стандарты", href: "/about/standards" },
              { label: "Руководство", href: "/management" },
              { label: "Педагогический состав", href: "/staff" },
              { label: "Материально-техническое обеспечение", href: "/about/material" },
              { label: "Стипендии и меры поддержки", href: "/about/scholarships" },
              { label: "Платные образовательные услуги", href: "/about/paid-services" },
              { label: "Финансово-хозяйственная деятельность", href: "/about/finance" },
              { label: "Вакантные места для приёма", href: "/about/vacancies" },
              { label: "Международное сотрудничество", href: "/about/international" },
              { label: "Организация питания", href: "/about/food" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-red-800/30 hover:text-red-800 transition-all group text-sm font-medium text-slate-700"
              >
                <svg className="w-4 h-4 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1170px] px-4 pb-10">
        <PageDocuments page="about" title="Прикреплённые файлы" />
      </div>
    </>
  );
}
