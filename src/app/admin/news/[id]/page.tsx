"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ModuleBuilder, { Module } from "@/components/admin/ModuleBuilder";

type NewsData = {
  id: number;
  title: string;
  slug: string;
  date: string;
  summary: string | null;
  image: string | null;
  published: boolean;
  modules: Module[];
};

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/${newsId}`);
      if (!res.ok) throw new Error();
      const data: NewsData = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      setDate(new Date(data.date).toISOString().slice(0, 10));
      setSummary(data.summary || "");
      setImage(data.image || "");
      setPublished(data.published);
      setModules(Array.isArray(data.modules) ? data.modules : []);
    } catch {
      setError("Не удалось загрузить новость");
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, date, summary, image, published, modules }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setSuccess("Новость сохранена!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить эту новость?")) return;
    await fetch(`/api/news/${newsId}`, { method: "DELETE" });
    router.push("/admin/news");
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/news" className="text-sm text-gray-500 hover:text-red-800">← Назад к новостям</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать новость</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/news/${slug}`} target="_blank" className="text-sm border border-gray-200 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">Просмотр →</Link>
          <button onClick={handleDelete} className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50">Удалить</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">{success}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400">/news/</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата публикации</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-800" />
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
          <h2 className="font-semibold text-gray-800 mb-1">Содержание новости</h2>
          <p className="text-xs text-gray-500 mb-4">Текст, изображения и другие материалы</p>
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
