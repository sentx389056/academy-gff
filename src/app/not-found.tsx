import Link from "next/link";

export default function NotFound() {
  return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center mx-auto max-w-xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-4">
              Ошибка — страница не найдена
          </p>
          <span className="text-[clamp(80px,18vw,200px)] font-black text-white leading-none tracking-tighter select-none">
          404
        </span>
        <p className="text-sm text-slate-400 text-center mb-8 max-w-xs leading-relaxed">
          Такой страницы не существует — возможно, она была удалена или адрес введён неверно.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-900 border border-slate-200 rounded-xl px-5 py-2.5 hover:border-red-800 hover:text-red-800 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          На главную
        </Link>
      </div>
  );
}
