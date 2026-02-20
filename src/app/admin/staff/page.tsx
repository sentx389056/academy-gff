export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Сотрудники — Панель управления" };

export default async function AdminStaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: [{ isManagement: "desc" }, { order: "asc" }, { name: "asc" }],
  });

  const management = staff.filter((s) => s.isManagement);
  const teachers = staff.filter((s) => !s.isManagement);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Сотрудники</h1>
          <p className="text-sm text-gray-500">{staff.length} человек</p>
        </div>
        <Link
          href="/admin/staff/new"
          className="flex items-center gap-2 bg-red-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-900 transition-colors"
        >
          + Добавить сотрудника
        </Link>
      </div>

      {management.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Руководство ({management.length})
          </h2>
          <StaffTable people={management} />
        </section>
      )}

      {teachers.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Педагогический состав ({teachers.length})
          </h2>
          <StaffTable people={teachers} />
        </section>
      )}

      {staff.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-gray-500 mb-4">Нет сотрудников</p>
          <Link href="/admin/staff/new" className="inline-flex items-center gap-2 bg-red-800 text-white text-sm px-4 py-2 rounded-lg">
            + Добавить
          </Link>
        </div>
      )}
    </div>
  );
}

type Person = {
  id: number;
  name: string;
  position: string;
  department: string | null;
  isManagement: boolean;
  order: number;
};

function StaffTable({ people }: { people: Person[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Имя</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Должность</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Кафедра</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-700">Порядок</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{person.name}</td>
              <td className="px-4 py-3 text-gray-600">{person.position}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{person.department || "—"}</td>
              <td className="px-4 py-3 text-center text-gray-400">{person.order}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/staff/${person.id}`} className="text-red-800 hover:underline text-xs font-medium">
                  Изменить
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
