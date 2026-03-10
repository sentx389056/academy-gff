import {BookOpen, BriefcaseBusiness, FileText, Mail, Phone, UserRound} from "lucide-react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Педагогический состав — Академия Госфильмофонда России",
};

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    where: { staffType: { name: "Педагогический состав" } },
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  phone: string | null;
  hidePhone: boolean;
  email: string | null;
  achievements: string | null;
};

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="w-5 h-5 flex items-center justify-center text-red-800 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-4 flex-1 min-w-0">
        <span className="text-xs text-slate-400 sm:w-52 flex-shrink-0 pt-0.5">{label}</span>
        <span className="text-sm text-slate-700 font-medium break-words">{children}</span>
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
            <UserRound className="text-red-800" size={16} />
        </div>
        <h3 className="font-bold text-slate-900 break-words min-w-0">{person.name}</h3>
      </div>
      <div className="px-5 py-3">
        <InfoRow icon={<BriefcaseBusiness className="text-red-800" size={16} />} label="Занимаемая должность">
          {person.position}
        </InfoRow>
        {person.department && (
          <InfoRow icon={<BookOpen className="text-red-800" size={16} />} label="Преподаваемые предметы / курсы">
            {person.department}
          </InfoRow>
        )}
        {person.phone && !person.hidePhone && (
          <InfoRow icon={<Phone className="text-red-800" size={16} />} label="Контактный телефон">
            <a href={`tel:${person.phone}`} className="text-red-800 hover:underline">{person.phone}</a>
          </InfoRow>
        )}
        {person.email && (
          <InfoRow icon={<Mail className="text-red-800" size={16} />} label="Электронная почта">
            <a href={`mailto:${person.email}`} className="text-red-800 hover:underline">{person.email}</a>
          </InfoRow>
        )}
        {person.bio && (
          <InfoRow icon={<FileText className="text-red-800" size={16} />} label="Биография">
            {person.bio}
          </InfoRow>
        )}
        {person.achievements && (
          <InfoRow icon={<FileText className="text-red-800" size={16} />} label="Достижения и результаты">
            {person.achievements}
          </InfoRow>
        )}
      </div>
    </div>
  );
}
