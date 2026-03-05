"use client";

import { useState, useEffect, useCallback } from "react";
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

type EventData = {
  id: number;
  title: string;
  slug: string;
  date: string;
  location: string | null;
  description: string | null;
  image: string | null;
  published: boolean;
  modules: Module[];
};

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const form = useForm();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("12:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEvent = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) throw new Error();
      const data: EventData = await res.json();
      setTitle(data.title);
      setSlug(data.slug);
      const d = new Date(data.date);
      setDate(d);
      setTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
      setLocation(data.location || "");
      setDescription(data.description || "");
      setImage(data.image || "");
      setPublished(data.published);
      setModules(Array.isArray(data.modules) ? data.modules : []);
    } catch {
      setError("Не удалось загрузить событие");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { loadEvent(); }, [loadEvent]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const dateStr = date
        ? `${fmtDate(date, "yyyy-MM-dd")}T${time}:00`
        : "";

      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, date: dateStr, location, description, image, published, modules }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setSuccess("Событие сохранено!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить это событие?")) return;
    await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    router.push("/admin/events");
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
            <Link href={`/admin/events`} className="flex gap-2 items-center text-sm text-gray-500 hover:text-red-800">
                <MoveLeft size={12}/>
                Назад к событиям
            </Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать событие</h1>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/events/${slug}`} target="_blank">Просмотр <MoveRight size={12}/></Link>
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
                <span className="text-sm text-gray-400">/events/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Дата</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {date
                        ? fmtDate(date, "d MMMM yyyy", { locale: ru })
                        : <span className="text-muted-foreground">Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label>Время</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Место</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Описание</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="resize-none" />
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
            <h2 className="font-semibold text-gray-800 mb-1">Содержание события</h2>
            <p className="text-xs text-gray-500 mb-4">Программа, спикеры, материалы</p>
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
