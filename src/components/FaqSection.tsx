"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Что такое Академия Госфильмофонда России?",
    a: "Академия Госфильмофонда России — ведущее образовательное учреждение дополнительного профессионального образования, специализирующееся на подготовке и повышении квалификации специалистов в области сохранения, реставрации и популяризации кинематографического наследия.",
  },
  {
    q: "Кто может поступить на образовательные программы?",
    a: "К обучению допускаются лица, имеющие среднее профессиональное или высшее образование. Для программ повышения квалификации необходимо наличие диплома и опыта работы по соответствующему направлению.",
  },
  {
    q: "Какие документы необходимы для поступления?",
    a: "Для поступления потребуются: заявление установленного образца, копия паспорта, копия диплома об образовании, СНИЛС, а также фотография 3×4 см. Полный перечень документов указан в разделе «Документы» на сайте.",
  },
  {
    q: "Какие форматы обучения доступны?",
    a: "Программы реализуются в трёх форматах: очном, очно-заочном и дистанционном. Формат зависит от конкретной программы и указан в её описании. Часть занятий возможно пройти в режиме онлайн-трансляции.",
  },
  {
    q: "Выдаётся ли документ государственного образца по окончании?",
    a: "Да. По итогам успешного прохождения программы повышения квалификации выдаётся удостоверение о повышении квалификации установленного образца. По программам профессиональной переподготовки — диплом о профессиональной переподготовке.",
  },
  {
    q: "Как записаться на программу?",
    a: "Для записи на программу заполните форму заявки на странице выбранного курса или обратитесь в приёмную комиссию по телефону +7 (495) 123-45-67 либо по электронной почте info@gosfilmofond.academy. Наши специалисты ответят в течение одного рабочего дня.",
  },
  {
    q: "Предусмотрена ли оплата в рассрочку?",
    a: "Да, для ряда программ предусмотрена возможность оплаты в рассрочку. Подробности уточняйте при подаче заявки или у менеджера приёмной комиссии.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-292.5 px-4">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1 h-5 bg-red-800 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-800">FAQ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
              Часто задаваемые вопросы
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Не нашли ответ? Напишите нам через форму обратной связи или позвоните в приёмную комиссию.
            </p>
            <a
              href="tel:+74951234567"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-800 hover:text-red-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +7 (495) 123-45-67
            </a>
          </div>

          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-slate-200 rounded-xl px-5 data-[state=open]:border-red-800/30 data-[state=open]:bg-red-50/30 transition-colors"
                >
                  <AccordionTrigger className="text-sm font-semibold text-slate-900 text-left py-4 hover:no-underline hover:text-red-800 transition-colors data-[state=open]:text-red-800">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
