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
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-white">Главная</Link>
            {" / "}
            <span>Руководство</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">Руководство</h1>
          <p className="text-gray-400 mt-2">
            Руководящий состав Академии Госфильмофонда России
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1170px] px-4 py-10">
        {management.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {management.map((person) => (
              <div
                key={person.id}
                className="flex gap-5 border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
              >
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-24 h-24 rounded-xl object-cover object-top flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-[#f1f5f9] flex items-center justify-center flex-shrink-0">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[#1d1d1d] text-lg">{person.name}</h3>
                  <p className="text-[#8f1a1c] text-sm font-medium mt-0.5">
                    {person.position}
                  </p>
                  {person.department && (
                    <p className="text-xs text-gray-400 mt-0.5">{person.department}</p>
                  )}
                  {person.bio && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      {person.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700">
              Информация о руководстве скоро появится
            </h2>
          </div>
        )}
      </div>
    </>
  );
}
