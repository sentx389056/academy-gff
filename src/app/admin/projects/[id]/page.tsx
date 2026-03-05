"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ModuleBuilder, { Module } from "@/components/admin/ModuleBuilder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {MoveLeft, MoveRight} from "lucide-react";

type LookupItem = { id: number; name: string };

type ProjectData = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  image: string | null;
  categoryId: number | null;
  year: number | null;
  published: boolean;
  modules: Module[];
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const form = useForm();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [year, setYear] = useState("");
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [projectCategories, setProjectCategories] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const lookupLoaded = useRef(false);

  useEffect(() => {
    if (lookupLoaded.current) return;
    lookupLoaded.current = true;
    fetch("/api/lookup")
      .then((r) => r.json())
      .then((d) => setProjectCategories(d.projectCategories ?? []));
  }, []);

  const loadItem = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${itemId}`);
      if (!res.ok) throw new Error();
      const data: ProjectData = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      setSummary(data.summary || "");
      setImage(data.image || "");
      setCategoryId(data.categoryId ? String(data.categoryId) : "");
      setYear(data.year ? String(data.year) : "");
      setPublished(data.published);
      setModules(Array.isArray(data.modules) ? data.modules : []);
    } catch {
      setError("Не удалось загрузить проект");
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
      const res = await fetch(`/api/projects/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, summary, image,
          categoryId: categoryId ? parseInt(categoryId) : null,
          year: year ? parseInt(year) : null,
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
    if (!confirm("Удалить этот проект?")) return;
    await fetch(`/api/projects/${itemId}`, { method: "DELETE" });
    router.push("/admin/projects");
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
            <Link href={`/admin/projects`} className="flex gap-2 items-center text-sm text-gray-500 hover:text-red-800">
                <MoveLeft size={12}/>
                Назад  к проектам
            </Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать проект</h1>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${slug}`} target="_blank">Просмотр <MoveRight size={12}/></Link>
            </Button>
            <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
            >
                Удалить
            </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Название</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-400">/projects/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Категория</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— выберите —" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Год</Label>
                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} min="2000" max="2100" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Краткое описание</Label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label>URL изображения</Label>
              <Input type="url" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published" className="cursor-pointer font-normal">
                {published ? "Опубликовано" : "Черновик"}
              </Label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Описание проекта</h2>
            <p className="text-xs text-gray-500 mb-4">Цели, результаты, участники</p>
            <ModuleBuilder value={modules} onChange={setModules} />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
