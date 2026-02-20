"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STATUSES = [
  { value: "NEW", label: "Новая" },
  { value: "IN_REVIEW", label: "На рассмотрении" },
  { value: "APPROVED", label: "Одобрена" },
  { value: "REJECTED", label: "Отклонена" },
];

interface Props {
  id: number;
  status: string;
}

export default function ApplicationActions({ id, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatus = async (newStatus: string) => {
    setLoading(true);
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Удалить заявку?")) return;
    setLoading(true);
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <Select value={status} onValueChange={handleStatus} disabled={loading}>
        <SelectTrigger className="h-7 text-xs w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value} className="text-xs">
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
    </div>
  );
}
