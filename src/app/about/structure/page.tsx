import {Building, FileText, Mail, MapPin, UserRound} from "lucide-react";

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
            <Building className={`text-red-800`} size={14} />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">{faculty.name}</h3>
      </div>
      <div className="px-5 py-3">
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <UserRound className={`text-red-800`} size={14} />
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Руководитель</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{faculty.head}</p>
              <p className="text-xs text-slate-500">{faculty.headTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <MapPin className={`text-red-800`} size={14} />
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Место нахождения</span>
            <span className="text-sm text-slate-700">{faculty.address}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <Mail className={`text-red-800`} size={14} />
          <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
            <span className="text-xs text-slate-400 sm:w-40 flex-shrink-0 pt-0.5">Электронная почта</span>
            <a href={`mailto:${faculty.email}`} className="text-sm font-medium text-red-800 hover:underline">
              {faculty.email}
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2.5">
            <FileText className={`text-red-800`} size={14} />
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
