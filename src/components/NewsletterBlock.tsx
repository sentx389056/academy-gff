"use client";

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {CircleCheck} from "lucide-react";

export default function NewsletterBlock() {
    const [email, setEmail] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed || !email) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });
            if (res.ok) {
                setStatus("success");
                setEmail("");
                setAgreed(false);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <section className="py-14 bg-slate-800 text-white">
            <div className="mx-auto max-w-[1170px] px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Подпишитесь на рассылку</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Получайте актуальные новости, анонсы событий и новых программ обучения прямо на почту.
                        </p>
                    </div>
                    <div className="w-full lg:max-w-sm">
                        {status === "success" ? (
                            <div className="bg-white/10 rounded-xl p-6 text-center">
                                <CircleCheck className="text-white mx-auto mb-3" size={48}/>
                                <p className="font-semibold text-lg">Вы подписаны!</p>
                                <p className="text-slate-400 text-sm mt-1">Спасибо, мы будем вас информировать.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="email"
                                        required
                                        placeholder="Ваш email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white focus-visible:border-white flex-1"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!agreed || !email || status === "loading"}
                                        className="bg-red-700 hover:bg-red-800 text-white font-semibold shrink-0"
                                    >
                                        {status === "loading" ? "..." : "Подписаться"}
                                    </Button>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        id="newsletter-consent"
                                        checked={agreed}
                                        onCheckedChange={(v) => setAgreed(!!v)}
                                        className="mt-0.5 border-white/40 "
                                    />
                                    <Label
                                        htmlFor="newsletter-consent"
                                        className="text-xs text-slate-400 leading-relaxed cursor-pointer"
                                    >
                                        <span>
                                          Даю согласие Госфильмофонду России на обработку своих персональных данных в соответствии с{" "}
                                            <Link href="#"
                                                  className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors whitespace-nowrap">
                                            информацией об обработке персональных данных
                                          </Link>
                                        </span>
                                    </Label>
                                </div>
                                {status === "error" && (
                                    <p className="text-xs text-slate-400">Ошибка. Попробуйте ещё раз.</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
