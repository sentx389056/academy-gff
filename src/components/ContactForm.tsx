"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        body: JSON.stringify({ ...form, type: "contact" }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
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
      <div className="bg-white rounded-xl p-8 text-center">
        <svg className="w-12 h-12 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-slate-900 text-lg">Сообщение отправлено!</p>
        <p className="text-slate-500 text-sm mt-1">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-semibold text-slate-900 mb-5">Отправить сообщение</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            name="name"
            required
            placeholder="Ваше имя"
            value={form.name}
            onChange={handleChange}
            className="col-span-2 focus-visible:ring-red-800 focus-visible:border-red-800"
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
          <Input
            name="phone"
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            className="focus-visible:ring-red-800 focus-visible:border-red-800"
          />
        </div>
        <Textarea
          name="message"
          rows={3}
          placeholder="Ваше сообщение"
          value={form.message}
          onChange={handleChange}
          className="resize-none focus-visible:ring-red-800 focus-visible:border-red-800"
        />
        <div className="flex items-start gap-2">
          <Checkbox
            id="contact-consent"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(!!v)}
            className="mt-0.5 data-[state=checked]:bg-red-800 data-[state=checked]:border-red-800"
          />
          <Label htmlFor="contact-consent" className="flex flex-wrap text-xs text-slate-500 leading-relaxed cursor-pointer">
            Даю согласие <strong className="text-slate-700">Академии Госфильмофонда России</strong>
            <br/> на обработку своих персональных данных
          </Label>
        </div>
        {status === "error" && (
          <p className="text-xs text-red-600">Ошибка при отправке. Попробуйте ещё раз.</p>
        )}
        <Button
          type="submit"
          disabled={!agreed || status === "loading"}
          className="w-full bg-red-800 hover:bg-red-900 text-white font-semibold py-3"
        >
          {status === "loading" ? "Отправка..." : "Отправить"}
        </Button>
      </form>
    </div>
  );
}
