"use client";

import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { api } from "@/shared/lib/api";
import { Button } from "@/shared/ui/Button";
import { Alert } from "@/shared/ui/States";

export function LoginForm({ next }: { next?: string }) {
  const t = useT();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);
    setError(undefined);
    try {
      await api("/auth/login", { method: "POST", json: data });
      window.location.href = next?.startsWith("/dashboard") ? next : "/dashboard";
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form method="post" onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="label">{t("Login")}</span>
        <span className="relative block">
          <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
          <input name="username" required autoComplete="username" autoFocus placeholder="admin" className="input h-12 pl-10" />
        </span>
      </label>
      <label className="block">
        <span className="label">{t("Parol")}</span>
        <span className="relative block">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
          <input
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="input h-12 pr-11 pl-10"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-700"
            aria-label={show ? t("Parolni yashirish") : t("Parolni ko'rsatish")}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? t("Kirilmoqda…") : t("Tizimga kirish")}
      </Button>
    </form>
  );
}
