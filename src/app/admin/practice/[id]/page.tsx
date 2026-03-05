"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format as fmtDate } from "date-fns";
import { ru } from "date-fns/locale";
import {CalendarIcon, MoveLeft, MoveRight} from "lucide-react";
import { useForm } from "react-hook-form";
import ModuleBuilder, { Module } from "@/components/admin/ModuleBuilder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LookupItem = { id: number; name: string };

type PracticeData = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  image: string | null;
  categoryId: number | null;
  company: string | null;
  formatId: number | null;
  deadline: string | null;
  published: boolean;
  modules: Module[];
};

export default function EditPracticePage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const form = useForm();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [company, setCompany] = useState("");
  const [formatId, setFormatId] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [practiceCategories, setPracticeCategories] = useState<LookupItem[]>([]);
  const [learningFormats, setLearningFormats] = useState<LookupItem[]>([]);
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
      .then((d) => {
        setPracticeCategories(d.practiceCategories ?? []);
        setLearningFormats(d.learningFormats ?? []);
      });
  }, []);

  const loadItem = useCallback(async () => {
    try {
      const res = await fetch(`/api/practice/${itemId}`);
      if (!res.ok) throw new Error();
      const data: PracticeData = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      setSummary(data.summary || "");
      setImage(data.image || "");
      setCategoryId(data.categoryId ? String(data.categoryId) : "");
      setCompany(data.company || "");
      setFormatId(data.formatId ? String(data.formatId) : "");
      setDeadline(data.deadline ? new Date(data.deadline) : undefined);
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
          title, slug, summary, image, company,
          categoryId: categoryId ? parseInt(categoryId) : null,
          formatId: formatId ? parseInt(formatId) : null,
          deadline: deadline ? deadline.toISOString() : null,
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
            <Link href={`/admin/practice`} className="flex gap-2 items-center text-sm text-gray-500 hover:text-red-800">
                <MoveLeft size={12}/>
                Назад к практике
            </Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать запись</h1>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/practice/${slug}`} target="_blank">Просмотр <MoveRight size={12}/></Link>
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
                <span className="text-sm text-gray-400">/practice/</span>
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
                    {practiceCategories.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Формат</Label>
                <Select value={formatId} onValueChange={setFormatId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— выберите —" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningFormats.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Организация-партнёр</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Дедлайн</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {deadline
                        ? fmtDate(deadline, "d MMMM yyyy", { locale: ru })
                        : <span className="text-muted-foreground">Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                  </PopoverContent>
                </Popover>
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
            <h2 className="font-semibold text-gray-800 mb-1">Подробное описание</h2>
            <p className="text-xs text-gray-500 mb-4">Требования, условия, как подать заявку</p>
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
