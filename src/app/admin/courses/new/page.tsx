"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModuleBuilder, { Module } from "@/components/admin/ModuleBuilder";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManual) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, description, image, published, modules }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка создания курса");
      }

      const course = await res.json();
      router.push(`/admin/courses/${course.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/courses" className="text-sm text-gray-500 hover:text-[#8f1a1c]">
          ← Назад к курсам
        </Link>
        <h1 className="text-xl font-bold text-[#1d1d1d] mt-2">Создать новый курс</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Основные данные</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название курса <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
              placeholder="Например: Режиссура кино и телевидения"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (slug) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400 flex-shrink-0">/education/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManual(true);
                }}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
                placeholder="rezhissura-kino"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Краткое описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] resize-none"
              placeholder="Краткое описание курса для превью..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL изображения обложки
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  published ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform m-0.5 ${
                    published ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
            <span className="text-sm text-gray-700">
              {published ? "Опубликован" : "Черновик"}
            </span>
          </div>
        </div>

        {/* Module Builder */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Содержание курса</h2>
          <p className="text-xs text-gray-500 mb-4">
            Добавляйте любые блоки — текст, изображения, видео, файлы и другие элементы
          </p>
          <ModuleBuilder value={modules} onChange={setModules} />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#8f1a1c] hover:bg-[#7a1518] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? "Сохранение..." : "Создать курс"}
          </button>
          <Link
            href="/admin/courses"
            className="border border-gray-200 text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
