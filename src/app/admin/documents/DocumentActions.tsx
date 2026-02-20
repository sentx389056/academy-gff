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

const PAGE_OPTIONS = [
  { value: "about", label: "Основные сведения" },
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
    await fetch(`/api/documents/${docId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  if (mode === "delete") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-slate-400 hover:text-red-800"
        onClick={handleDelete}
        disabled={loading}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-800 hover:bg-red-900 text-white h-9 px-4 text-sm">
          + Добавить документ
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
            className="bg-red-800 hover:bg-red-900 text-white w-full"
          >
            {loading ? "Сохранение..." : "Добавить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
