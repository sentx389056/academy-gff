"use client";

import {useState} from "react";
import {useRouter, useParams} from "next/navigation";
import Link from "next/link";
import ModuleBuilder, {Module} from "@/components/admin/ModuleBuilder";
import {MoveLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[а-яё]/g, (char) => {
            const map: Record<string, string> = {
                а: "a",
                б: "b",
                в: "v",
                г: "g",
                д: "d",
                е: "e",
                ё: "yo",
                ж: "zh",
                з: "z",
                и: "i",
                й: "y",
                к: "k",
                л: "l",
                м: "m",
                н: "n",
                о: "o",
                п: "p",
                р: "r",
                с: "s",
                т: "t",
                у: "u",
                ф: "f",
                х: "kh",
                ц: "ts",
                ч: "ch",
                ш: "sh",
                щ: "shch",
                ъ: "",
                ы: "y",
                ь: "",
                э: "e",
                ю: "yu",
                я: "ya"
            };
            return map[char] || char;
        })
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export default function NewLessonPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManual, setSlugManual] = useState(false);
    const [order, setOrder] = useState(0);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!slugManual) setSlug(slugify(val));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`/api/courses/${courseId}/lessons`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, slug, order, modules}),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Ошибка создания урока");
            }

            router.push(`/admin/courses/${courseId}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Ошибка");
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="mb-6">
                <Link href={`/admin/courses/${courseId}`}
                      className="flex gap-2 items-center text-sm text-gray-500 hover:text-red-800">
                    <MoveLeft size={12}/> Назад к курсу
                </Link>
                <h1 className="text-xl font-bold text-slate-900 mt-2">Создать урок</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800">Данные урока</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название урока <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800"
                            placeholder="Например: Введение в режиссуру"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL (slug) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => {
                                setSlug(e.target.value);
                                setSlugManual(true);
                            }}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800"
                            placeholder="vvedenie-v-rezhissuru"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Порядковый номер
                        </label>
                        <input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                            className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800"
                            min={0}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-800 mb-1">Содержание урока</h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Выбирайте и добавляйте любые модули — точно как в конструкторе
                    </p>
                    <ModuleBuilder value={modules} onChange={setModules}/>
                </div>

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={loading}
                        className=""
                    >
                        {loading ? "Сохранение..." : "Создать урок"}
                    </Button>
                    <Button asChild variant="secondary" className="border">
                        <Link
                            href={`/admin/courses/${courseId}`}
                            className=""
                        >
                            Отмена
                        </Link>
                    </Button>

                </div>
            </form>
        </div>
    );
}
