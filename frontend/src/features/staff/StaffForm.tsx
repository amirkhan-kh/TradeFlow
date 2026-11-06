"use client";

import { Check, Copy, KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { api } from "@/shared/lib/api";
import { currency } from "@/shared/lib/format";
import { ROLE_KEYS, ROLES, type Role } from "@/shared/lib/roles";
import { Button } from "@/shared/ui/Button";
import { Field, Input } from "@/shared/ui/Field";
import { PasswordInput } from "@/shared/ui/PasswordInput";
import { Alert } from "@/shared/ui/States";
import type { Staff } from "./types";

/** "G'ayrat O'lmasov" → "gayrat.olmasov" */
export function suggestLogin(name: string) {
  return name
    .toLowerCase()
    .replace(/['ʻ‘’`]/g, "")
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(".")
    .slice(0, 40);
}

export function Credentials({ login, password, onDone }: { login: string; password: string; onDone: () => void }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const text = `TradeFlow\n${t("Manzil")}: ${window.location.origin}/login\n${t("Login")}: ${login}\n${t("Parol")}: ${password}`;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-200">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <p className="text-sm text-brand-900">{t("Kirish ma'lumotlari tayyor. Parol faqat hozir ko'rinadi — xodimga xavfsiz kanal orqali yuboring.")}</p>
      </div>
      <dl className="grid gap-2 rounded-2xl bg-ink-900 p-5 font-mono text-sm text-white">
        <div className="flex justify-between gap-4">
          <dt className="text-white/60">{t("Login")}</dt>
          <dd className="font-semibold">{login}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white/60">{t("Parol")}</dt>
          <dd className="font-semibold">{password}</dd>
        </div>
      </dl>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
          }}
        >
          {copied ? <Check className="size-4 text-brand-600" /> : <Copy className="size-4" />} {copied ? t("Nusxalandi") : t("Hammasini nusxalash")}
        </Button>
        <Button onClick={onDone}>{t("Tayyor")}</Button>
      </div>
    </div>
  );
}

function RolePicker({ value, onChange, disabled }: { value: Role; onChange: (r: Role) => void; disabled?: boolean }) {
  const t = useT();
  return (
    <fieldset disabled={disabled} className="sm:col-span-2">
      <legend className="label">
        {t("Rol")} {disabled && `— ${t("o'z rolingizni o'zgartira olmaysiz")}`}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ROLE_KEYS.map((r) => (
          <label
            key={r}
            className={`relative flex cursor-pointer flex-col rounded-2xl border p-3 transition has-focus-visible:ring-4 has-focus-visible:ring-brand-100 ${
              value === r ? "border-transparent bg-white shadow-soft ring-2" : "border-ink-200 hover:border-ink-300"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            style={value === r ? ({ "--tw-ring-color": ROLES[r].color } as React.CSSProperties) : undefined}
          >
            <input type="radio" name="role" value={r} checked={value === r} onChange={() => onChange(r)} className="sr-only" />
            <span className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <span className="size-2.5 rounded-full" style={{ background: ROLES[r].color }} aria-hidden />
              {t(ROLES[r].label)}
              {value === r && <Check className="ml-auto size-4" style={{ color: ROLES[r].color }} aria-hidden />}
            </span>
            <span className="mt-1 text-xs leading-snug text-ink-500">{t(ROLES[r].description)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function StaffForm({ initial, isSelf, onDone }: { initial?: Staff; isSelf?: boolean; onDone: () => void }) {
  const t = useT();
  const [role, setRole] = useState<Role>(initial?.role ?? "agent");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<{ login: string; password: string }>();

  if (created) return <Credentials {...created} onDone={onDone} />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = { ...f, role, monthly_plan: role === "agent" ? Number(f.monthly_plan || 0) : 0 };
    setSaving(true);
    setError(undefined);
    try {
      if (initial) {
        await api(`/users/${initial.id}`, { method: "PUT", json: body });
        onDone();
      } else {
        const u = await api<Staff>("/users", { method: "POST", json: { ...body, username, password } });
        setCreated({ login: u.username, password });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label={t("To'liq ism")} className="sm:col-span-2">
        <Input
          name="full_name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={initial?.full_name}
          placeholder={t("Masalan: Aziza Usmonova")}
          onChange={(e) => !initial && !touched && setUsername(suggestLogin(e.target.value))}
        />
      </Field>
      {!initial && (
        <>
          <Field label={t("Login")}>
            <Input
              name="username"
              required
              pattern="[a-z0-9._\-]{3,40}"
              title={t("3–40 ta kichik lotin harf, raqam, . _ -")}
              value={username}
              onChange={(e) => {
                setTouched(true);
                setUsername(e.target.value.toLowerCase());
              }}
              autoComplete="off"
              className="font-mono"
            />
          </Field>
          <Field label={t("Parol")}>
            <PasswordInput name="password" value={password} onChange={setPassword} generator />
          </Field>
        </>
      )}
      <RolePicker value={role} onChange={setRole} disabled={isSelf} />
      <Field label={t("Telefon")}>
        <Input name="phone" type="tel" placeholder="+998 …" defaultValue={initial?.phone ?? ""} />
      </Field>
      <Field label={t("Email")}>
        <Input name="email" type="email" placeholder={t("ism@kompaniya.uz")} defaultValue={initial?.email ?? ""} />
      </Field>
      <Field label={t("Hudud")}>
        <Input name="region" placeholder={t("Toshkent")} defaultValue={initial?.region ?? ""} />
      </Field>
      {role === "agent" && (
        <Field label={t("Oylik savdo rejasi, {cur}", { cur: currency() })}>
          <Input name="monthly_plan" type="number" min={0} step={1000000} defaultValue={initial?.monthly_plan ?? 50000000} />
        </Field>
      )}
      {error && (
        <div className="sm:col-span-2">
          <Alert>{error}</Alert>
        </div>
      )}
      <Button type="submit" className="sm:col-span-2" disabled={saving}>
        {initial ? t("Saqlash") : t("Xodim kabinetini yaratish")}
      </Button>
    </form>
  );
}

export function ResetPassword({ user, onDone }: { user: Staff; onDone: () => void }) {
  const t = useT();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <Credentials login={user.username} password={password} onDone={onDone} />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(undefined);
    try {
      await api(`/users/${user.id}/password`, { method: "POST", json: { password } });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <p className="text-sm text-ink-600">{t("Yangi parol o'rnatilgach, xodimning barcha qurilmalardagi sessiyalari yopiladi.")}</p>
      <Field label={t("Yangi parol")}>
        <PasswordInput name="password" value={password} onChange={setPassword} generator />
      </Field>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" disabled={saving}>
        <KeyRound className="size-4" /> {t("Parolni tiklash")}
      </Button>
    </form>
  );
}
