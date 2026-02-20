export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Руководство — Академия Госфильмофонда России",
};

export default async function ManagementPage() {
  const management = await prisma.staff.findMany({
    where: { isManagement: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span>Руководство</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Руководство</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-8">
        {management.length > 0 ? (
          <div className="flex flex-col gap-5">
            {management.map((person) => (
              <ManagementCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-lg font-semibold text-slate-600">
              Информация о руководстве скоро появится
            </h2>
          </div>
        )}
      </div>
    </>
  );
}

type StaffMember = {
  id: number;
  name: string;
  position: string;
  department: string | null;
  bio: string | null;
  image: string | null;
};

function ManagementCard({ person }: { person: StaffMember }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      {/* Role title header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200">
        <div className="w-8 h-8 rounded-full bg-red-800/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-900">{person.position}</h3>
      </div>

      <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
        <div>
          {/* Name */}
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
              <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">Фамилия, имя, отчество</span>
              <span className="text-sm font-semibold text-slate-900">{person.name}</span>
            </div>
          </div>

          {/* Position */}
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
              <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">Должность</span>
              <span className="text-sm font-medium text-slate-700">{person.position}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
              <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">Контактный телефон</span>
              <a href="tel:+74951234567" className="text-sm font-medium text-red-800 hover:underline">+7 (495) 123-45-67</a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
            <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
              <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">Адрес электронной почты</span>
              <a href="mailto:rector@academy.ru" className="text-sm font-medium text-red-800 hover:underline">rector@academy.ru</a>
            </div>
          </div>
        </div>

        <div>
          {/* Qualifications */}
          {person.department && (
            <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
              <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
                <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">Образование и квалификация</span>
                <span className="text-sm font-medium text-slate-700">{person.department}</span>
              </div>
            </div>
          )}

          {/* Bio / Achievements */}
          {person.bio && (
            <div className="flex items-start gap-3 py-2.5 border-b border-slate-100">
              <svg className="w-4 h-4 text-red-800 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <div className="flex flex-col sm:flex-row sm:gap-4 flex-1">
                <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">Достижения и награды</span>
                <span className="text-sm font-medium text-slate-700 whitespace-pre-line">{person.bio}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
