"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

type Lesson = {
  id: number;
  title: string;
  slug: string;
  order: number;
};

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  published: boolean;
  modules: Module[];
  lessons: Lesson[];
};

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCourse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Курс не найден");
      const data: Course = await res.json();
      setCourse(data);
      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description || "");
      setImage(data.image || "");
      setPublished(data.published);
      setModules(Array.isArray(data.modules) ? data.modules : []);
    } catch (err) {
      setError("Не удалось загрузить курс");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, description, image, published, modules }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка сохранения");
      }

      setSuccess("Курс сохранён!");
      loadCourse();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить этот курс и все его уроки? Это действие нельзя отменить.")) return;

    try {
      await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      router.push("/admin/courses");
    } catch {
      setError("Ошибка удаления");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error || "Курс не найден"}</p>
        <Link href="/admin/courses" className="text-sm text-[#8f1a1c] hover:underline mt-2 block">
          ← Назад
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/courses" className="text-sm text-gray-500 hover:text-[#8f1a1c]">
            ← Назад к курсам
          </Link>
          <h1 className="text-xl font-bold text-[#1d1d1d] mt-2">
            Редактировать курс
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/education/${slug}`}
            target="_blank"
            className="text-sm border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Просмотр →
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Основные данные</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL (slug)</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400">/education/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL обложки</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]"
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
              <div className={`w-11 h-6 rounded-full transition-colors ${published ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform m-0.5 ${published ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
            <span className="text-sm text-gray-700">{published ? "Опубликован" : "Черновик"}</span>
          </div>
        </div>

        {/* Module Builder */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Содержание курса</h2>
          <p className="text-xs text-gray-500 mb-4">
            Добавляйте блоки — текст, изображения, видео, файлы
          </p>
          <ModuleBuilder value={modules} onChange={setModules} />
        </div>

        {/* Lessons */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">
              Уроки
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({course?.lessons.length || 0})
              </span>
            </h2>
            <Link
              href={`/admin/courses/${courseId}/lessons/new`}
              className="text-xs bg-[#8f1a1c] text-white px-3 py-1.5 rounded-lg hover:bg-[#7a1518] transition-colors"
            >
              + Добавить урок
            </Link>
          </div>

          {course && course.lessons.length > 0 ? (
            <ol className="flex flex-col gap-2">
              {course.lessons.map((lesson, i) => (
                <li
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg"
                >
                  <span className="w-6 h-6 bg-gray-100 rounded-full text-xs flex items-center justify-center text-gray-500">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
                  <Link
                    href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                    className="text-xs text-[#8f1a1c] hover:underline"
                  >
                    Изменить
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-400">
              Нет уроков. Добавьте первый урок к курсу.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#8f1a1c] hover:bg-[#7a1518] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
