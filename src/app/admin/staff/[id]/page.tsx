"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [isManagement, setIsManagement] = useState(false);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setIsManagement(person.isManagement);
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
        body: JSON.stringify({ name, position, department, bio, image, isManagement, order }),
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
          <Link href="/admin/staff" className="text-sm text-gray-500 hover:text-[#8f1a1c]">← Назад</Link>
          <h1 className="text-xl font-bold text-[#1d1d1d] mt-2">Редактировать сотрудника</h1>
        </div>
        <button onClick={handleDelete} className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50">
          Удалить
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">{success}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Кафедра</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Биография</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL фото</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" min={0} />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isManagement} onChange={(e) => setIsManagement(e.target.checked)} className="sr-only" />
              <div className={`w-11 h-6 rounded-full transition-colors ${isManagement ? "bg-[#8f1a1c]" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform m-0.5 ${isManagement ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
            <span className="text-sm text-gray-700">{isManagement ? "Руководство" : "Педагогический состав"}</span>
          </div>
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
