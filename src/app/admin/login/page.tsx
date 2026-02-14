"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка авторизации");
        setLoading(false);
        return;
      }
      router.push("/admin");
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 opacity-20" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src="/Familylogo.png" alt="THE FAMILY" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            THE FAMILY
          </h1>
          <p className="text-text-muted text-sm mt-1">Панель управления</p>
        </div>

        <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}
            <div>
              <label className="mono-label text-[10px] mb-2 block">ЛОГИН</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mono-label text-[10px] mb-2 block">ПАРОЛЬ</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 btn-gradient rounded-xl font-semibold text-sm tracking-wide disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? "ВХОД..." : "ВОЙТИ"}</span>
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          Логин: admin / Пароль: family2026
        </p>
      </div>
    </div>
  );
}
