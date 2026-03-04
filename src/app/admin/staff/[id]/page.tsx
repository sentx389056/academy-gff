"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

type LookupItem = { id: number; name: string };

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  const form = useForm();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [staffTypeId, setStaffTypeId] = useState<string>("");
  const [order, setOrder] = useState(0);
  const [staffTypes, setStaffTypes] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/lookup")
      .then((r) => r.json())
      .then((d) => setStaffTypes(d.staffTypes ?? []));
  }, []);

  const loadPerson = useCallback(async () => {
    try {
      const res = await fetch(`/api/staff`);
      const data = await res.json();
      const person = data.find((p: { id: number }) => p.id === parseInt(staffId));
      if (!person) throw new Error("Не найден");
      setName(person.name);
      setPosition(person.position);
      setDepartment(person.department || "");
      setBio(person.bio || "");
      setImage(person.image || "");
      setStaffTypeId(person.staffTypeId ? String(person.staffTypeId) : "");
      setOrder(person.order);
    } catch {
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => { loadPerson(); }, [loadPerson]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/staff/${staffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, position, department, bio, image,
          staffTypeId: staffTypeId ? parseInt(staffTypeId) : null,
          order,
        }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setSuccess("Данные сохранены!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить этого сотрудника?")) return;
    await fetch(`/api/staff/${staffId}`, { method: "DELETE" });
    router.push("/admin/staff");
  };

  if (loading) return <div className="p-8 text-gray-400">Загрузка...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/staff" className="text-sm text-gray-500 hover:text-red-800">← Назад</Link>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Редактировать сотрудника</h1>
        </div>
        <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
          Удалить
        </Button>
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
              <Label>ФИО</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Должность</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} required />
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
              <Label>Кафедра</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Биография</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="resize-none" />
            </div>
            <div className="space-y-1.5">
              <Label>URL фото</Label>
              <Input type="url" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Порядок</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-32" min={0} />
            </div>
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
