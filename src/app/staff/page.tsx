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
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <span>Педагогический состав</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Педагогический состав</h1>
          <p className="text-gray-400 mt-2">Наша команда преподавателей и экспертов</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((person) => (
              <StaffCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👩‍🏫</div>
            <h2 className="text-xl font-semibold text-gray-700">
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

function StaffCard({ person }: { person: StaffMember }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      {person.image ? (
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-56 object-cover object-top"
        />
      ) : (
        <div className="w-full h-56 bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#8f1a1c]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#8f1a1c]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-[#1d1d1d] text-base">{person.name}</h3>
        <p className="text-sm text-[#8f1a1c] mt-1">{person.position}</p>
        {person.department && (
          <p className="text-xs text-gray-400 mt-0.5">{person.department}</p>
        )}
        {person.bio && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-3">{person.bio}</p>
        )}
      </div>
    </div>
  );
}
