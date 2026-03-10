import Link from "next/link";

export const metadata = { title: "Политика обработки персональных данных" };
export default function ConfidentialityPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-12">
                <div className="mx-auto max-w-[1170px] px-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                        <Link href="/" className="hover:text-white transition-colors">Главная</Link>
                        <span>/</span>
                        <span className="text-white">Политика обработки персональных данных</span>
                    </div>
                    <h1 className="text-3xl font-bold">Политика обработки персональных данных</h1>
                </div>
            </div>
            <div className="mx-auto max-w-[1170px] py-12">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Политика обработки персональных данных</h2>
                    <div className="space-y-3">
                        <p>
                            Настоящая Политика содержит описание принципов и подходов ГосФильмФонда РФ в отношении обработки и обеспечения безопасности персональных данных, обязанности и ответственность ГосФильмФонда РФ при осуществлении такой обработки.
                        </p>
                        <p>
                            ГосФильмФонд РФ полностью обеспечивает соблюдение прав и свобод граждан при обработке персональных данных, в том числе обеспечивает защиту прав на неприкосновенность частной жизни, личной и семейной тайн.
                        </p>
                        <p>
                            Субъектами персональных данных, обработка которых осуществляется Министерством культуры РФ, являются:
                        </p>
                        <ul className="flex flex-col gap-4">
                            <li>кандидаты на трудоустройство;</li>
                            <li>работники;</li>
                            <li>представители контрагентов;</li>
                            <li>клиенты – физические лица;</li>
                            <li>корпоративные клиенты – юридические лица.</li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}