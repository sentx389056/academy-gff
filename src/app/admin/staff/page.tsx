import {UserRound} from "lucide-react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Сотрудники — Панель управления" };

export default async function AdminStaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { staffType: true },
  });

  // Group by staffType name (or "Без типа" if null)
  const groups = staff.reduce<Record<string, typeof staff>>((acc, person) => {
    const key = person.staffType?.name ?? "Без типа";
    if (!acc[key]) acc[key] = [];
    acc[key].push(person);
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Сотрудники</h1>
          <p className="text-sm text-gray-500">{staff.length} человек</p>
        </div>
        <Button asChild className="">
          <Link href="/admin/staff/new">+ Добавить сотрудника</Link>
        </Button>
      </div>

      {staff.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl border border-gray-200">
                <UserRound className="text-gray-500" size={48} />
          <p className="text-gray-500 mb-4">Нет сотрудников</p>
          <Button asChild className="">
            <Link href="/admin/staff/new">+ Добавить</Link>
          </Button>
        </div>
      ) : (
        Object.entries(groups).map(([typeName, people]) => (
          <section key={typeName} className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              {typeName} ({people.length})
            </h2>
            <StaffTable people={people} />
          </section>
        ))
      )}
    </div>
  );
}

type Person = {
  id: number;
  name: string;
  position: string;
  department: string | null;
  order: number;
};

function StaffTable({ people }: { people: Person[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-3">Имя</TableHead>
            <TableHead className="px-4 py-3">Должность</TableHead>
            <TableHead className="px-4 py-3">Кафедра</TableHead>
            <TableHead className="px-4 py-3 text-center">Порядок</TableHead>
            <TableHead className="px-4 py-3"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="px-4 py-3 font-medium text-gray-900">{person.name}</TableCell>
              <TableCell className="px-4 py-3 text-gray-600">{person.position}</TableCell>
              <TableCell className="px-4 py-3 text-gray-400 text-xs">{person.department || "—"}</TableCell>
              <TableCell className="px-4 py-3 text-center text-gray-400">{person.order}</TableCell>
              <TableCell className="px-4 py-3">
                <Link href={`/admin/staff/${person.id}`} className="text-red-800 hover:underline text-xs font-medium">
                  Изменить
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
