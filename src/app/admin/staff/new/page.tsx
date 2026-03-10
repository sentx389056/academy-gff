"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {MoveLeft} from "lucide-react";

type LookupItem = { id: number; name: string };

export default function NewStaffPage() {
  const router = useRouter();
  const form = useForm();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [hidePhone, setHidePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [achievements, setAchievements] = useState("");
  const [staffTypeId, setStaffTypeId] = useState<string>("");
  const [order, setOrder] = useState(0);
  const [staffTypes, setStaffTypes] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/lookup")
      .then((r) => r.json())
      .then((d) => setStaffTypes(d.staffTypes ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, position, department, bio, image,
          phone, hidePhone, email, achievements,
          staffTypeId: staffTypeId ? parseInt(staffTypeId) : null,
          order,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Ошибка");
      }

      router.push("/admin/staff");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
          <Link href="/admin/staff" className="flex gap-2 items-center text-sm text-gray-500 hover:text-red-800">
              <MoveLeft size={12}/>
              Назад
          </Link>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Добавить сотрудника</h1>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>ФИО <span className="text-red-500">*</span></Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иванов Иван Иванович" required />
            </div>
            <div className="space-y-1.5">
              <Label>Должность <span className="text-red-500">*</span></Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Профессор, доктор наук" required />
            </div>
            <div className="space-y-1.5">
              <Label>Тип сотрудника</Label>
              <Select value={staffTypeId} onValueChange={setStaffTypeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="— выберите —" />
                </SelectTrigger>
                <SelectContent>
                  {staffTypes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Кафедра / Отдел</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Кафедра режиссуры" />
            </div>
            <div className="space-y-1.5">
              <Label>Биография</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="resize-none" placeholder="Краткая биография..." />
            </div>
            <div className="space-y-1.5">
              <Label>Телефон</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="hidePhone"
                checked={hidePhone}
                onCheckedChange={(v) => setHidePhone(!!v)}
              />
              <Label htmlFor="hidePhone" className="font-normal cursor-pointer">Скрыть номер телефона на сайте</Label>
            </div>
            <div className="space-y-1.5">
              <Label>Электронная почта</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@academy.ru" />
            </div>
            <div className="space-y-1.5">
              <Label>Достижения / Результаты</Label>
              <Textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={4} className="resize-none" placeholder="Научные публикации, награды, достижения..." />
            </div>
            <div className="space-y-1.5">
              <Label>URL фотографии</Label>
              <Input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Порядок отображения</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-32" min={0} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : "Добавить"}
            </Button>
            <Button asChild variant="outline" className="text-gray-600">
              <Link href="/admin/staff">Отмена</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
