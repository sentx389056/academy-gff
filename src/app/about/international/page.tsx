export const dynamic = "force-dynamic";
import SimpleInfoPage from "@/components/SimpleInfoPage";
import PageDocuments from "@/components/PageDocuments";

export const metadata = {
  title: "Международное сотрудничество — Академия Госфильмофонда России",
};

export default function InternationalPage() {
  return (
    <SimpleInfoPage
      breadcrumbs={[
        { label: "Главная", href: "/" },
        { label: "Сведения об организации", href: "/about" },
        { label: "Международное сотрудничество" },
      ]}
      title="Международное сотрудничество"
    >
      <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl">
        <p>
          Академия Госфильмофонда России развивает международное сотрудничество
          с ведущими мировыми кинематографическими школами и архивами.
        </p>
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Партнёры</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { org: "FIAF (Международная федерация киноархивов)", country: "Международная" },
              { org: "CILECT (Международная ассоциация кинематографических школ)", country: "Международная" },
              { org: "Польская киношкола в Лодзи", country: "Польша" },
              { org: "Венская киноакадемия", country: "Австрия" },
            ].map((partner) => (
              <div key={partner.org} className="border border-gray-200 rounded-sm p-4">
                <div className="font-medium text-slate-900 text-sm">{partner.org}</div>
                <div className="text-xs text-gray-400 mt-1">{partner.country}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Направления сотрудничества
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Обмен студентами и преподавателями</li>
            <li>Совместные кинопроекты и co-productions</li>
            <li>Участие в международных кинофестивалях</li>
            <li>Обмен архивными материалами и исследованиями</li>
            <li>Совместные программы повышения квалификации</li>
          </ul>
        </section>
      </div>
      <PageDocuments page="international" title="Прикреплённые файлы" />
    </SimpleInfoPage>
  );
}
