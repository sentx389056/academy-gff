"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ModuleRenderer from "@/components/ModuleRenderer";
import Link from "next/link";

type Module = { id: string; type: string; content: Record<string, unknown> };
type Lesson = { id: number; title: string; slug: string; order: number };
type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  lessons: Lesson[];
  format?: string | null;
  duration?: string | null;
  price?: string | null;
  startDate?: Date | string | null;
};

interface Props {
  course: Course;
  modules: Module[];
}

function ApplyForm({ courseId }: { courseId: number }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", workplace: "", jobTitle: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "course", courseId }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", workplace: "", jobTitle: "" });
        setAgreed(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-lg text-center py-10">
        <svg className="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-slate-900 text-lg">Заявка отправлена!</p>
        <p className="text-slate-500 text-sm mt-1">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Быстрая заявка</h2>
      <p className="text-sm text-slate-400 mb-6">Оставьте контакты, и мы свяжемся с вами для консультации!</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Ваше ФИО *</label>
          <Input name="name" required placeholder="Иван Иванов" value={form.name} onChange={handleChange} className="focus-visible:ring-red-800 focus-visible:border-red-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email *</label>
            <Input name="email" type="email" required placeholder="example@gmail.com" value={form.email} onChange={handleChange} className="focus-visible:ring-red-800 focus-visible:border-red-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Телефон</label>
            <Input name="phone" type="tel" placeholder="+7 (000) 000-00-00" value={form.phone} onChange={handleChange} className="focus-visible:ring-red-800 focus-visible:border-red-800" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Место работы</label>
            <Input name="workplace" placeholder="Название компании" value={form.workplace} onChange={handleChange} className="focus-visible:ring-red-800 focus-visible:border-red-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Должность</label>
            <Input name="jobTitle" placeholder="Ваша должность" value={form.jobTitle} onChange={handleChange} className="focus-visible:ring-red-800 focus-visible:border-red-800" />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="apply-consent"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(!!v)}
            className="mt-0.5 data-[state=checked]:bg-red-800 data-[state=checked]:border-red-800"
          />
          <Label htmlFor="apply-consent" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
            Даю согласие <strong className="text-slate-700">Академии Госфильмофонда России</strong> на обработку своих персональных данных в соответствии с{" "}
            <a href="#" className="text-red-800 hover:underline">информацией об обработке персональных данных</a>
          </Label>
        </div>
        {status === "error" && <p className="text-xs text-red-600">Ошибка при отправке. Попробуйте ещё раз.</p>}
        <Button
          type="submit"
          disabled={!agreed || status === "loading"}
          className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-3 h-auto mt-1"
        >
          {status === "loading" ? "Отправка..." : "Отправить"}
        </Button>
      </form>
    </div>
  );
}

export default function CourseDetailTabs({ course, modules }: Props) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="border-b border-slate-200 bg-transparent rounded-none h-auto p-0 w-full justify-start gap-0 mb-8">
        {[
          { value: "overview", label: "Обзор" },
          { value: "program", label: "Программа" },
          { value: "teachers", label: "Преподаватели" },
          { value: "apply", label: "Подать заявку" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-800 data-[state=active]:text-red-800 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Overview tab */}
          <TabsContent value="overview" className="mt-0">
            <h2 className="text-lg font-bold text-slate-900 mb-4">О программе</h2>
            <p className="text-sm text-slate-500 mb-6">Заголовок</p>

            {modules.length > 0 ? (
              <div className="module-content">
                <ModuleRenderer modules={modules} />
              </div>
            ) : (
              <div className="text-sm text-slate-400">Описание программы будет добавлено позже.</div>
            )}

            <div className="mt-8">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Преимущества программы
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  Преимущества программы заполнитель
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Требования к поступающим
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  Требования программы заполнитель
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* Program tab */}
          <TabsContent value="program" className="mt-0">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Программа курса</h2>
            {course.lessons.length > 0 ? (
              <ol className="space-y-3">
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/education/${course.slug}/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-red-800/30 transition-all group"
                    >
                      <span className="w-8 h-8 flex-shrink-0 rounded-full bg-red-800 text-white text-xs flex items-center justify-center font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 group-hover:text-red-800 transition-colors font-medium">
                        {lesson.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-400">Программа курса будет добавлена позже.</p>
            )}
          </TabsContent>

          {/* Teachers tab */}
          <TabsContent value="teachers" className="mt-0">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Преподаватели</h2>
            <p className="text-sm text-slate-400">Информация о преподавателях будет добавлена позже.</p>
          </TabsContent>

          {/* Apply tab */}
          <TabsContent value="apply" className="mt-0">
            <ApplyForm courseId={course.id} />
          </TabsContent>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-5 text-sm">Информация о курсе</h3>
            <div className="space-y-4">
              {course.startDate && (
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Дата начала</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(course.startDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              )}
              {course.format && (
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Формат обучения</p>
                    <p className="text-sm font-medium text-slate-900">{course.format}</p>
                  </div>
                </div>
              )}
              {course.duration && (
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Продолжительность</p>
                    <p className="text-sm font-medium text-slate-900">{course.duration}</p>
                  </div>
                </div>
              )}
              {course.price && (
                <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">Стоимость</p>
                    <p className="text-sm font-bold text-red-800">{course.price}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
