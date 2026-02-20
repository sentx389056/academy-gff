import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SimpleInfoPage({ breadcrumbs, title, subtitle, children }: Props) {
  return (
    <>
      <section className="bg-slate-900 py-10 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-slate-400 mb-3 flex flex-wrap items-center gap-1">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-slate-600">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-[1170px] px-4 py-8">
        {children}
      </div>
    </>
  );
}
