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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type LookupItem = { id: number; name: string };
type StaffItem = { id: number; name: string; position: string };
type Lesson = { id: number; title: string; slug: string; order: number };

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  published: boolean;
  modules: Module[];
  lessons: Lesson[];
  programTypeId: number | null;
  levelId: number | null;
  formatId: number | null;
  duration: string | null;
  price: string | null;
  startDate: string | null;
  endDate: string | null;
  teachers: { id: number; name: string; position: string }[];
  advantages: string[];
  requirements: string[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",
        м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",
        ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const form = useForm();

  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [programTypeId, setProgramTypeId] = useState<string>("");
  const [levelId, setLevelId] = useState<string>("");
  const [formatId, setFormatId] = useState<string>("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [modules, setModules] = useState<Module[]>([]);
  const [teacherIds, setTeacherIds] = useState<number[]>([]);
  const [advantages, setAdvantages] = useState("");
  const [requirements, setRequirements] = useState("");

  const [programTypes, setProgramTypes] = useState<LookupItem[]>([]);
  const [learningLevels, setLearningLevels] = useState<LookupItem[]>([]);
  const [learningFormats, setLearningFormats] = useState<LookupItem[]>([]);
  const [allStaff, setAllStaff] = useState<StaffItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/lookup").then((r) => r.json()),
      fetch("/api/staff").then((r) => r.json()),
    ]).then(([lookup, staff]) => {
      setProgramTypes(lookup.programTypes ?? []);
      setLearningLevels(lookup.learningLevels ?? []);
      setLearningFormats(lookup.learningFormats ?? []);
      setAllStaff(staff ?? []);
    });
  }, []);

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
      setProgramTypeId(data.programTypeId ? String(data.programTypeId) : "");
      setLevelId(data.levelId ? String(data.levelId) : "");
      setFormatId(data.formatId ? String(data.formatId) : "");
      setDuration(data.duration || "");
      setPrice(data.price || "");
      setStartDate(data.startDate ? new Date(data.startDate) : undefined);
      setEndDate(data.endDate ? new Date(data.endDate) : undefined);
      setModules(Array.isArray(data.modules) ? data.modules : []);
      setTeacherIds(data.teachers?.map((t) => t.id) ?? []);
      setAdvantages(Array.isArray(data.advantages) ? data.advantages.join("\n") : "");
      setRequirements(Array.isArray(data.requirements) ? data.requirements.join("\n") : "");
    } catch {
      setError("Не удалось загрузить курс");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { loadCourse(); }, [loadCourse]);

  const toggleTeacher = (id: number) => {
    setTeacherIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, description, image, published, modules,
          programTypeId: programTypeId ? parseInt(programTypeId) : null,
          levelId: levelId ? parseInt(levelId) : null,
          formatId: formatId ? parseInt(formatId) : null,
          duration: duration || null,
          price: price || null,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
          teacherIds,
          advantages: advantages.split("\n").map((s) => s.trim()).filter(Boolean),
          requirements: requirements.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
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
        <Link href="/admin/courses" className="text-sm text-red-800 hover:underline mt-2 block">← Назад</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/courses" className="flex gap-2 items-center text-sm text-gray-500 hover:text-red-800"><MoveLeft size={12}/> Назад к курсам</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать курс</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/education/${slug}`} target="_blank">Просмотр <MoveRight size={12}/></Link>
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
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

          {/* Основные данные */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Основные данные</h2>

            <div className="space-y-1.5">
              <Label>Название</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label>URL (slug)</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-400 flex-shrink-0">/education/</span>
                <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Описание</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="resize-none" />
            </div>

            <div className="space-y-1.5">
              <Label>URL обложки</Label>
              <Input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
            </div>

            <div className="flex items-center gap-3">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published" className="cursor-pointer font-normal">
                {published ? "Опубликован" : "Черновик"}
              </Label>
            </div>
          </div>

          {/* Параметры курса */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Параметры курса</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Тип программы</Label>
                <Select value={programTypeId} onValueChange={setProgramTypeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— не указан —" />
                  </SelectTrigger>
                  <SelectContent>
                    {programTypes.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Уровень обучения</Label>
                <Select value={levelId} onValueChange={setLevelId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— не указан —" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningLevels.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Формат обучения</Label>
                <Select value={formatId} onValueChange={setFormatId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— не указан —" />
                  </SelectTrigger>
                  <SelectContent>
                    {learningFormats.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Продолжительность</Label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="36 ак.ч, 3 дня, 72 ч" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Дата начала</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {startDate ? fmtDate(startDate, "d MMMM yyyy", { locale: ru }) : <span className="text-muted-foreground">Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label>Дата окончания</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {endDate ? fmtDate(endDate, "d MMMM yyyy", { locale: ru }) : <span className="text-muted-foreground">Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Стоимость</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="17 500 ₽/год, Бесплатно" />
            </div>

            <div className="space-y-1.5">
              <Label>Преимущества программы</Label>
              <p className="text-xs text-gray-400">Каждое преимущество — с новой строки</p>
              <Textarea
                value={advantages}
                onChange={(e) => setAdvantages(e.target.value)}
                rows={4}
                className="resize-none"
                placeholder={"Доступ к архивным фондам Госфильмофонда\nПрактические занятия с профессионалами"}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Требования к поступающим</Label>
              <p className="text-xs text-gray-400">Каждое требование — с новой строки</p>
              <Textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                className="resize-none"
                placeholder={"Высшее образование\nОпыт работы от 1 года"}
              />
            </div>
          </div>

          {/* Преподаватели */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Преподаватели</h2>
            <p className="text-xs text-gray-500 mb-4">Выберите сотрудников, ведущих этот курс</p>
            {allStaff.length === 0 ? (
              <p className="text-sm text-gray-400">Нет сотрудников. Сначала добавьте их в разделе «Сотрудники».</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {allStaff.map((person) => (
                  <label
                    key={person.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      teacherIds.includes(person.id)
                        ? "border-red-300 bg-red-50"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={teacherIds.includes(person.id)}
                      onChange={() => toggleTeacher(person.id)}
                      className="accent-red-800"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{person.name}</p>
                      <p className="text-xs text-gray-500 truncate">{person.position}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Module Builder */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Содержание курса</h2>
            <p className="text-xs text-gray-500 mb-4">Добавляйте блоки — текст, изображения, видео, файлы</p>
            <ModuleBuilder value={modules} onChange={setModules} />
          </div>

          {/* Lessons */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">
                Уроки <span className="ml-2 text-sm font-normal text-gray-400">({course?.lessons.length || 0})</span>
              </h2>
              <Button asChild size="sm">
                <Link href={`/admin/courses/${courseId}/lessons/new`}>+ Добавить урок</Link>
              </Button>
            </div>

            {course && course.lessons.length > 0 ? (
              <ol className="flex flex-col gap-2">
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                    <span className="w-6 h-6 bg-gray-100 rounded-full text-xs flex items-center justify-center text-gray-500">{i + 1}</span>
                    <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
                    <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`} className="text-xs text-red-800 hover:underline">
                      Изменить
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-400">Нет уроков. Добавьте первый урок к курсу.</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className=""
            >
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
