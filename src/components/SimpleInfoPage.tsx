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
      <section className="bg-[#0f172a] py-12 text-white">
        <div className="mx-auto max-w-[1170px] px-4">
          <nav className="text-xs text-gray-400 mb-3 flex flex-wrap gap-1">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-[1170px] px-4 py-10">
        {children}
      </div>
    </>
  );
}
