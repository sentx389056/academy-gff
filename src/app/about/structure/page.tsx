export const dynamic = "force-dynamic";
import SimpleInfoPage from "@/components/SimpleInfoPage";
import PageDocuments from "@/components/PageDocuments";

export const metadata = {
  title: "Структура и органы управления — Академия Госфильмофонда России",
};

const faculties = [
  {
    name: "Факультет режиссуры кино и телевидения",
    head: "Иванов Пётр Сергеевич",
    headTitle: "Декан, Доктор искусствоведения, Профессор",
    address: "г. Москва, ул. Кинематографическая, д. 12, корп. 1",
    email: "film.director@academy.ru",
  },
  {
    name: "Факультет операторского искусства",
    head: "Петров Алексей Николаевич",
    headTitle: "Декан, Кандидат искусствоведения, Доцент",
    address: "г. Москва, ул. Кинематографическая, д. 12, корп. 1",
    email: "camera.dept@academy.ru",
  },
  {
    name: "Факультет звукорежиссуры",
    head: "Сидорова Ольга Ивановна",
    headTitle: "Декан, Кандидат педагогических наук, Доцент",
    address: "г. Москва, ул. Кинематографическая, д. 12, корп. 2",
    email: "sound.dept@academy.ru",
  },
  {
    name: "Факультет архивоведения и документоведения",
    head: "Кузнецов Владимир Петрович",
    headTitle: "Декан, Доктор исторических наук, Профессор",
    address: "г. Москва, ул. Кинематографическая, д. 12, корп. 2",
    email: "archive.dept@academy.ru",
  },
];

function FacultyCard({ faculty }: { faculty: typeof faculties[0] }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="w-7 h-7 rounded-full bg-red-800/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-900 text-sm">{faculty.name}</h3>
      </div>
      <div className="px-5 py-3">
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
          <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Руководитель</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{faculty.head}</p>
              <p className="text-xs text-slate-500">{faculty.headTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
          <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Место нахождения</span>
            <span className="text-sm text-slate-700">{faculty.address}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
          <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Электронная почта</span>
            <a href={`mailto:${faculty.email}`} className="text-sm font-medium text-red-800 hover:underline">
              {faculty.email}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2.5">
          <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Положение о структурном подразделении</span>
            <a href="#" className="text-sm font-medium text-red-800 hover:underline">Скачать положение (PDF)</a>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="space-y-4">
        {faculties.map((faculty) => (
          <FacultyCard key={faculty.name} faculty={faculty} />
        ))}
      </div>
      <PageDocuments page="structure" title="Прикреплённые файлы" />
    </SimpleInfoPage>
  );
}
