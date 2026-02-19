"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#8f1a1c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">АГФ</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1d1d1d]">Вход в систему</h1>
            <p className="text-gray-500 text-sm mt-1">
              Академия Госфильмофонда России
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] focus:ring-1 focus:ring-[#8f1a1c]"
                placeholder="admin@academy-gff.ru"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#8f1a1c] focus:ring-1 focus:ring-[#8f1a1c]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8f1a1c] hover:bg-[#7a1518] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-[#8f1a1c]">
              ← На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
