"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ModuleBuilder, { Module } from "@/components/admin/ModuleBuilder";

type PracticeData = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  image: string | null;
  category: string | null;
  company: string | null;
  format: string | null;
  deadline: string | null;
  published: boolean;
  modules: Module[];
};

export default function EditPracticePage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [format, setFormat] = useState("");
  const [deadline, setDeadline] = useState("");
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadItem = useCallback(async () => {
    try {
      const res = await fetch(`/api/practice/${itemId}`);
      if (!res.ok) throw new Error();
      const data: PracticeData = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      setSummary(data.summary || "");
      setImage(data.image || "");
      setCategory(data.category || "");
      setCompany(data.company || "");
      setFormat(data.format || "");
      setDeadline(data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : "");
      setPublished(data.published);
      setModules(Array.isArray(data.modules) ? data.modules : []);
    } catch {
      setError("Не удалось загрузить запись");
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => { loadItem(); }, [loadItem]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/practice/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, summary, image, category, company, format,
          deadline: deadline ? new Date(deadline).toISOString() : null,
          published, modules,
        }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setSuccess("Сохранено!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить эту запись?")) return;
    await fetch(`/api/practice/${itemId}`, { method: "DELETE" });
    router.push("/admin/practice");
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/practice" className="text-sm text-gray-500 hover:text-red-800">← Назад к практике</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать запись</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/practice/${slug}`} target="_blank" className="text-sm border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">Просмотр →</Link>
          <button onClick={handleDelete} className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50">Удалить</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">{success}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400">/practice/</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800">
                <option value="">— выберите —</option>
                <option value="Практика">Практика</option>
                <option value="Стажировка">Стажировка</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Формат</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800">
                <option value="">— выберите —</option>
                <option value="Очно">Очно</option>
                <option value="Онлайн">Онлайн</option>
                <option value="Смешанный">Смешанный</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Организация-партнёр</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="sr-only" />
              <div className={`w-11 h-6 rounded-full transition-colors ${published ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform m-0.5 ${published ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
            <span className="text-sm text-gray-700">{published ? "Опубликовано" : "Черновик"}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">Подробное описание</h2>
          <p className="text-xs text-gray-500 mb-4">Требования, условия, как подать заявку</p>
          <ModuleBuilder value={modules} onChange={setModules} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-red-800 hover:bg-red-900 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
