"use client";

import {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import ModuleRenderer from "@/components/ModuleRenderer";
import Link from "next/link";
import {BadgeCheck, BadgeRussianRuble, Calendar, Check, CheckCircle, Clipboard, Clock, LaptopMinimal} from "lucide-react";

type Module = { id: string; type: string; content: Record<string, unknown> };
type Lesson = { id: number; title: string; slug: string; order: number };
type Course = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    lessons: Lesson[];
    format?: { name: string } | null;
    duration?: string | null;
    price?: string | null;
    startDate?: Date | string | null;
    advantages?: unknown;
    requirements?: unknown;
};

interface Props {
    course: Course;
    modules: Module[];
}

function ApplyForm({courseId}: { courseId: number }) {
    const [form, setForm] = useState({name: "", email: "", phone: "", workplace: "", jobTitle: ""});
    const [agreed, setAgreed] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({...f, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...form, type: "course", courseId}),
            });
            if (res.ok) {
                setStatus("success");
                setForm({name: "", email: "", phone: "", workplace: "", jobTitle: ""});
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
                <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Ваше
                        ФИО *</label>
                    <Input name="name" required placeholder="Иван Иванов" value={form.name} onChange={handleChange}
                           className="focus-visible:ring-red-800 focus-visible:border-red-800"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email
                            *</label>
                        <Input name="email" type="email" required placeholder="example@gmail.com" value={form.email}
                               onChange={handleChange}
                               className="focus-visible:ring-red-800 focus-visible:border-red-800"/>
                    </div>
                    <div>
                        <label
                            className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Телефон</label>
                        <Input name="phone" type="tel" placeholder="+7 (000) 000-00-00" value={form.phone}
                               onChange={handleChange}
                               className="focus-visible:ring-red-800 focus-visible:border-red-800"/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Место
                            работы</label>
                        <Input name="workplace" placeholder="Название компании" value={form.workplace}
                               onChange={handleChange}
                               className="focus-visible:ring-red-800 focus-visible:border-red-800"/>
                    </div>
                    <div>
                        <label
                            className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Должность</label>
                        <Input name="jobTitle" placeholder="Ваша должность" value={form.jobTitle}
                               onChange={handleChange}
                               className="focus-visible:ring-red-800 focus-visible:border-red-800"/>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <Checkbox
                        id="apply-consent"
                        checked={agreed}
                        onCheckedChange={(v) => setAgreed(!!v)}
                        className="mt-0.5 data-[state=checked]:bg-red-800 data-[state=checked]:border-red-800"
                    />
                    <Label htmlFor="apply-consent"
                           className="flex flex-wrap text-xs text-slate-500 leading-relaxed cursor-pointer">
                            <span> Даю согласие Госфильмофонду России на обработку своих персональных данных в соответствии с{" "}
                                <Link href="#" className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors whitespace-nowrap">
                                    информацией об обработке персональных данных
                                </Link>
                            </span>
                    </Label>
                </div>
                {status === "error" && <p className="text-xs text-red-600">Ошибка при отправке. Попробуйте ещё раз.</p>}
                <Button
                    type="submit"
                    disabled={!agreed || status === "loading"}
                >
                    {status === "loading" ? "Отправка..." : "Отправить"}
                </Button>
            </form>
        </div>
    );
}

export default function CourseDetailTabs({course, modules}: Props) {
    return (
        <Tabs defaultValue="overview">
            <TabsList
                className="border-b border-slate-200 bg-transparent rounded-none h-auto p-0 w-full justify-start gap-0 mb-8">
                {[
                    {value: "overview", label: "Обзор"},
                    {value: "program", label: "Программа"},
                    {value: "teachers", label: "Преподаватели"},
                    {value: "apply", label: "Подать заявку"},
                ].map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-none border-2 active:border-b-red-800"
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
                                <ModuleRenderer modules={modules}/>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400">Описание программы будет добавлено позже.</div>
                        )}

                        {Array.isArray(course.advantages) && (course.advantages as string[]).length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <BadgeCheck className="text-red-800" size={16}/>
                                    Преимущества программы
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    {(course.advantages as string[]).map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="text-red-800" size={16}/>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(course.requirements) && (course.requirements as string[]).length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Clipboard className="text-red-800" size={16}/>
                                    Требования к поступающим
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    {(course.requirements as string[]).map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="text-red-800" size={16}/>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
                      <span
                          className="w-8 h-8 flex-shrink-0 rounded-full bg-red-800 text-white text-xs flex items-center justify-center font-semibold">
                        {i + 1}
                      </span>
                                            <span
                                                className="text-sm text-slate-700 group-hover:text-red-800 transition-colors font-medium">
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
                        <ApplyForm courseId={course.id}/>
                    </TabsContent>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-24">
                        <h3 className="font-bold text-slate-900 mb-5 text-sm">Информация о курсе</h3>
                        <div className="space-y-4">
                            {course.startDate && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="text-slate-400" size={16}/>
                                    <div>
                                        <p className="text-xs text-slate-400">Дата начала</p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {new Date(course.startDate).toLocaleDateString("ru-RU", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {course.format && (
                                <div className="flex items-start gap-3">
                                    <LaptopMinimal className="text-slate-400" size={16}/>
                                    <div>
                                        <p className="text-xs text-slate-400">Формат обучения</p>
                                        <p className="text-sm font-medium text-slate-900">{course.format.name}</p>
                                    </div>
                                </div>
                            )}
                            {course.duration && (
                                <div className="flex items-start gap-3">
                                    <Clock className="text-slate-400" size={16}/>
                                    <div>
                                        <p className="text-xs text-slate-400">Продолжительность</p>
                                        <p className="text-sm font-medium text-slate-900">{course.duration}</p>
                                    </div>
                                </div>
                            )}
                            {course.price && (
                                <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                                    <BadgeRussianRuble className="text-slate-400" size={16}/>
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
