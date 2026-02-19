"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewStaffPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [isManagement, setIsManagement] = useState(false);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, position, department, bio, image, isManagement, order }),
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
        <Link href="/admin/staff" className="text-sm text-gray-500 hover:text-[#8f1a1c]">← Назад</Link>
        <h1 className="text-xl font-bold text-[#1d1d1d] mt-2">Добавить сотрудника</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" placeholder="Иванов Иван Иванович" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Должность <span className="text-red-500">*</span></label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" placeholder="Профессор, доктор наук" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Кафедра / Отдел</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" placeholder="Кафедра режиссуры" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Биография</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] resize-none" placeholder="Краткая биография..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL фотографии</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Порядок отображения</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-32 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c]" min={0} />
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isManagement} onChange={(e) => setIsManagement(e.target.checked)} className="sr-only" />
              <div className={`w-11 h-6 rounded-full transition-colors ${isManagement ? "bg-[#8f1a1c]" : "bg-gray-300"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform m-0.5 ${isManagement ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
            <span className="text-sm text-gray-700">
              {isManagement ? "Руководство" : "Педагогический состав"}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-[#8f1a1c] hover:bg-[#7a1518] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm">
            {loading ? "Сохранение..." : "Добавить"}
          </button>
          <Link href="/admin/staff" className="border border-gray-200 text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 text-sm">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
