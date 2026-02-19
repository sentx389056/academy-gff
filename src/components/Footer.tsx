import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white mt-auto">
      <div className="mx-auto max-w-[1170px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8f1a1c] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">АГФ</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">Академия</div>
                <div className="text-xs text-gray-400">Госфильмофонда России</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Сохраняем традиции и создаём будущее кино. Профессиональное образование
              в области киноискусства и наследия.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Навигация</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Главная", href: "/" },
                { label: "Курсы", href: "/education" },
                { label: "События", href: "/events" },
                { label: "Педагогический состав", href: "/staff" },
                { label: "Руководство", href: "/management" },
                { label: "Документы", href: "/about/documents" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Контакты</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8f1a1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Московская обл., Красногорск,<br />ул. Госфильмофонда, 1</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-[#8f1a1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@academy-gff.ru" className="hover:text-white transition-colors">
                  info@academy-gff.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-[#8f1a1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+74951234567" className="hover:text-white transition-colors">
                  +7 (495) 123-45-67
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Академия Госфильмофонда России. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
