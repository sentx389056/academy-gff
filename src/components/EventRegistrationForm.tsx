"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  eventId: number;
}

export default function EventRegistrationForm({ eventId }: Props) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "event", eventId }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "" });
        setAgreed(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <svg className="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-slate-900 text-sm">Регистрация принята!</p>
        <p className="text-slate-500 text-xs mt-1">Ожидайте подтверждения на email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="name"
        required
        placeholder="Ваше имя"
        value={form.name}
        onChange={handleChange}
        className="focus-visible:ring-red-800 focus-visible:border-red-800"
      />
      <Input
        name="email"
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="focus-visible:ring-red-800 focus-visible:border-red-800"
      />
      <div className="flex items-start gap-2">
        <Checkbox
          id="event-consent"
          checked={agreed}
          onCheckedChange={(v) => setAgreed(!!v)}
          className="mt-0.5 data-[state=checked]:bg-red-800 data-[state=checked]:border-red-800"
        />
        <Label htmlFor="event-consent" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
          Даю согласие <strong className="text-slate-700">Академии Госфильмофонда России</strong> на обработку своих персональных данных в соответствии с{" "}
          <a href="#" className="text-red-800 hover:underline">информацией об обработке персональных данных</a>
        </Label>
      </div>
      {status === "error" && <p className="text-xs text-red-600">Ошибка при отправке. Попробуйте ещё раз.</p>}
      <Button
        type="submit"
        disabled={!agreed || status === "loading"}
        className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-2.5 h-auto"
      >
        {status === "loading" ? "Отправка..." : "Отправить"}
      </Button>
    </form>
  );
}
