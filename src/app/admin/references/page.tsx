"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LookupItem = { id: number; name: string; order: number };

const SECTIONS = [
  { key: "staffTypes",        label: "Типы сотрудников" },
  { key: "programTypes",      label: "Типы программ (курсы)" },
  { key: "learningLevels",    label: "Уровни обучения" },
  { key: "learningFormats",   label: "Форматы обучения" },
  { key: "practiceCategories",label: "Категории практики" },
  { key: "projectCategories", label: "Категории проектов" },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

export default function ReferencesPage() {
  const [data, setData] = useState<Record<SectionKey, LookupItem[]>>({
    staffTypes: [],
    programTypes: [],
    learningLevels: [],
    learningFormats: [],
    practiceCategories: [],
    projectCategories: [],
  });
  const [newNames, setNewNames] = useState<Record<SectionKey, string>>({
    staffTypes: "",
    programTypes: "",
    learningLevels: "",
    learningFormats: "",
    practiceCategories: "",
    projectCategories: "",
  });
  const [editValues, setEditValues] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    fetch("/api/lookup")
      .then((r) => r.json())
      .then((d) => setData(d));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (key: SectionKey) => {
    const name = newNames[key].trim();
    if (!name) return;
    setError(""); setSuccess("");
    const res = await fetch(`/api/lookup/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Ошибка добавления");
      return;
    }
    setNewNames((prev) => ({ ...prev, [key]: "" }));
    setSuccess("Добавлено!");
    load();
  };

  const handleRename = async (key: SectionKey, id: number) => {
    const name = (editValues[id] ?? "").trim();
    if (!name) return;
    setError(""); setSuccess("");
    const res = await fetch(`/api/lookup/${key}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Ошибка сохранения");
      return;
    }
    setEditValues((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setSuccess("Сохранено!");
    load();
  };

  const handleDelete = async (key: SectionKey, id: number, name: string) => {
    if (!confirm(`Удалить «${name}»? Связанные записи потеряют это значение.`)) return;
    setError(""); setSuccess("");
    const res = await fetch(`/api/lookup/${key}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Ошибка удаления");
      return;
    }
    setSuccess("Удалено!");
    load();
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-bold text-slate-900 mb-6">Справочники</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-700 mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {SECTIONS.map(({ key, label }) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">{label}</h2>

            <div className="space-y-2 mb-4">
              {data[key].length === 0 && (
                <p className="text-sm text-gray-400">Нет записей</p>
              )}
              {data[key].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  {item.id in editValues ? (
                    <>
                      <Input
                        value={editValues[item.id]}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        className="h-8 text-sm flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleRename(key, item.id)}
                      />
                      <Button size="sm" className="h-8 bg-red-800 hover:bg-red-900 text-white" onClick={() => handleRename(key, item.id)}>
                        Сохранить
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8" onClick={() =>
                        setEditValues((prev) => { const n = { ...prev }; delete n[item.id]; return n; })
                      }>
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-800">{item.name}</span>
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() =>
                        setEditValues((prev) => ({ ...prev, [item.id]: item.name }))
                      }>
                        Изменить
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() =>
                        handleDelete(key, item.id, item.name)
                      }>
                        Удалить
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newNames[key]}
                onChange={(e) => setNewNames((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder="Новое значение..."
                className="h-8 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAdd(key)}
              />
              <Button size="sm" className="h-8 bg-red-800 hover:bg-red-900 text-white" onClick={() => handleAdd(key)}>
                Добавить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
