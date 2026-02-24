export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Педагогический состав — Академия Госфильмофонда России",
};

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    where: { isManagement: false },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <span>/</span>
            <span>Педагогический состав</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Педагогический состав</h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-8">
        {staff.length > 0 ? (
          <div className="flex flex-col gap-4">
            {staff.map((person) => (
              <StaffRow key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-lg font-semibold text-slate-600">
              Информация о педагогах скоро появится
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="w-5 h-5 flex items-center justify-center text-red-800 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-4 flex-1 min-w-0">
        <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">{label}</span>
        <span className="text-sm text-slate-700 font-medium break-words">{value}</span>
      </div>
    </div>
  );
}

function StaffRow({ person }: { person: StaffMember }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      {/* Name header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-200">
        <div className="w-8 h-8 rounded-full bg-red-800/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="font-bold text-slate-900 break-words min-w-0">{person.name}</h3>
      </div>

      <div className="px-5 py-3">
        <InfoRow
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          label="Занимаемая должность"
          value={person.position}
        />
        {person.department && (
          <InfoRow
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="Преподаваемые предметы / курсы"
            value={person.department}
          />
        )}
        {person.bio && (
          <InfoRow
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="Дополнительная информация"
            value={person.bio}
          />
        )}
      </div>
    </div>
  );
}
