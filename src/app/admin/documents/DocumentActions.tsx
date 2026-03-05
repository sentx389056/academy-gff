"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Plus, Trash2, X} from "lucide-react";

const PAGE_OPTIONS = [
  { value: "about", label: "Документы" },
  { value: "structure", label: "Структура" },
  { value: "material", label: "Матер.-техн. обеспечение" },
  { value: "scholarships", label: "Стипендии" },
  { value: "paid-services", label: "Платные услуги" },
  { value: "finance", label: "Финансы" },
  { value: "standards", label: "Стандарты" },
  { value: "vacancies", label: "Вакантные места" },
  { value: "international", label: "Международное сотрудничество" },
  { value: "food", label: "Организация питания" },
];

interface Props {
  mode: "add" | "delete";
  docId?: number;
}

export default function DocumentActions({ mode, docId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Документы", page: "", fileUrl: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setOpen(false);
    setForm({ title: "", category: "Документы", page: "", fileUrl: "" });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Удалить документ?")) return;
    setLoading(true);
    const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || `Ошибка удаления (${res.status})`);
      return;
    }
    router.refresh();
  };

  if (mode === "delete") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
          <Trash2 size={14} />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">
            <Plus size={14} /> Добавить документ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить документ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAdd} className="flex flex-col gap-4 mt-2">
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Название *</Label>
            <Input
              required
              placeholder="Название документа"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Категория</Label>
            <Input
              placeholder="Документы"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">Страница</Label>
            <Select value={form.page} onValueChange={(v) => setForm((f) => ({ ...f, page: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите страницу" />
              </SelectTrigger>
              <SelectContent>
                {PAGE_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600 mb-1.5 block">URL файла *</Label>
            <Input
              required
              type="url"
              placeholder="https://example.com/file.pdf"
              value={form.fileUrl}
              onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Добавить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
