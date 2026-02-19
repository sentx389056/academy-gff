"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ModuleBuilder, { Module } from "@/components/admin/ModuleBuilder";

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadLesson = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      setOrder(data.order);
      setModules(Array.isArray(data.modules) ? data.modules : []);
    } catch {
      setError("Не удалось загрузить урок");
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => { loadLesson(); }, [loadLesson]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, order, modules }),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");
      setSuccess("Урок сохранён!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить этот урок?")) return;
    await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, { method: "DELETE" });
    router.push(`/admin/courses/${courseId}`);
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href={`/admin/courses/${courseId}`} className="text-sm text-gray-500 hover:text-[#8f1a1c]">
            ← Назад к курсу
          </Link>
          <h1 className="text-xl font-bold text-[#1d1d1d] mt-2">Редактировать урок</h1>
        </div>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50"
        >
          Удалить урок
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">{success}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" min={0} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Содержание урока</h2>
          <p className="text-xs text-gray-500 mb-4">Добавляйте и редактируйте блоки урока</p>
          <ModuleBuilder value={modules} onChange={setModules} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#8f1a1c] hover:bg-[#7a1518] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
