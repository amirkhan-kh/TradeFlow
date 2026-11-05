"use client";

import { CalendarDays, Check, CheckCircle2, Clock, KeyRound, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { api, ME_CHANGED } from "@/shared/lib/api";
import { fmtDate } from "@/shared/lib/format";
import { initials, PERMISSIONS, ROLES, type Role } from "@/shared/lib/roles";
import { useApi } from "@/shared/lib/useApi";
import { Button } from "@/shared/ui/Button";
import { Field, Input } from "@/shared/ui/Field";
import { PasswordInput } from "@/shared/ui/PasswordInput";
import { Alert, ErrorState, Loading } from "@/shared/ui/States";
import { ActivityFeed, type ActivityItem } from "../activity/ActivityFeed";

export interface Me {
  id: number;
  username: string;
  full_name: string;
  role: Role;
  phone: string | null;
  email: string | null;
  region: string | null;
  last_login_at: string | null;
  password_changed_at: string | null;
  created_at: string;
}

function Saved({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <p role="status" className="inline-flex animate-rise items-center gap-1.5 text-sm font-medium text-brand-700">
      <CheckCircle2 className="size-4" /> {children}
    </p>
  );
}

function ProfileForm({ me, onSaved }: { me: Me; onSaved: () => void }) {
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(undefined);
    setSaved(false);
    try {
      await api("/auth/me", { method: "PUT", json: Object.fromEntries(new FormData(e.currentTarget)) });
      setSaved(true);
      onSaved();
      window.dispatchEvent(new Event(ME_CHANGED));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="To'liq ism" className="sm:col-span-2">
        <Input name="full_name" required minLength={2} maxLength={80} defaultValue={me.full_name} />
      </Field>
      <Field label="Telefon">
        <Input name="phone" type="tel" placeholder="+998 …" defaultValue={me.phone ?? ""} />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" placeholder="ism@kompaniya.uz" defaultValue={me.email ?? ""} />
      </Field>
      {error && (
        <div className="sm:col-span-2">
          <Alert>{error}</Alert>
        </div>
      )}
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={saving}>
          <Check className="size-4" /> Saqlash
        </Button>
        <Saved show={saved}>Saqlandi</Saved>
      </div>
    </form>
  );
}

function PasswordForm({ onSaved }: { onSaved: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const mismatch = repeat.length > 0 && next !== repeat;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mismatch) return;
    setSaving(true);
    setError(undefined);
    setSaved(false);
    try {
      await api("/auth/me/password", { method: "POST", json: { current_password: current, new_password: next } });
      setCurrent("");
      setNext("");
      setRepeat("");
      setSaved(true);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Joriy parol">
        <PasswordInput name="current_password" value={current} onChange={setCurrent} autoComplete="current-password" showStrength={false} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yangi parol">
          <PasswordInput name="new_password" value={next} onChange={setNext} generator />
        </Field>
        <Field label="Yangi parolni takrorlang">
          <PasswordInput name="repeat_password" value={repeat} onChange={setRepeat} showStrength={false} />
          {mismatch && <span className="mt-1 block text-xs text-red-600">Parollar mos emas</span>}
        </Field>
      </div>
      <p className="text-xs text-ink-500">Kamida 8 belgi, harf va raqam. Parol o&apos;zgarganda boshqa qurilmalardagi sessiyalar yopiladi.</p>
      {error && <Alert>{error}</Alert>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving || mismatch}>
          <KeyRound className="size-4" /> Parolni o&apos;zgartirish
        </Button>
        <Saved show={saved}>Parol yangilandi</Saved>
      </div>
    </form>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-2.5 ring-1 ring-white/15">
      <Icon className="size-4 text-white/70" aria-hidden />
      <div>
        <p className="text-[11px] text-white/65">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

export function ProfileView() {
  const me = useApi<{ user: Me }>("/auth/me");
  const activity = useApi<{ items: ActivityItem[] }>("/auth/me/activity");

  if (me.error) return <ErrorState message={me.error} onRetry={me.reload} />;
  if (!me.data) return <Loading />;
  const u = me.data.user;
  const role = ROLES[u.role];
  const allowed = PERMISSIONS.flatMap((g) => g.items.filter(([, roles]) => roles.includes(u.role)).map(([label]) => label));
  const refresh = () => {
    me.reload();
    activity.reload();
  };

  return (
    <div className="animate-rise space-y-6">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-navy-900 p-6 sm:p-8">
        <span className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-brand-400/25 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <span
            className="grid size-20 shrink-0 place-items-center rounded-3xl text-2xl font-extrabold text-white shadow-lift ring-4 ring-white/20"
            style={{ background: `linear-gradient(135deg, ${role.color}, ${role.color}aa)` }}
          >
            {initials(u.full_name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
              <ShieldCheck className="size-3.5" aria-hidden /> {role.label}
            </p>
            <h1 className="mt-2 truncate text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{u.full_name}</h1>
            <p className="mt-1 text-sm text-white/70">
              @{u.username}
              {u.region && ` · ${u.region}`}
            </p>
          </div>
        </div>
        <div className="relative mt-6 grid gap-2 sm:grid-cols-3">
          <Fact icon={Clock} label="Oxirgi kirish" value={u.last_login_at ? fmtDate(u.last_login_at, true) : "—"} />
          <Fact icon={LockKeyhole} label="Parol o'zgargan" value={u.password_changed_at ? fmtDate(u.password_changed_at) : "Hech qachon"} />
          <Fact icon={CalendarDays} label="Jamoada" value={`${fmtDate(u.created_at)} dan`} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-6" aria-labelledby="personal">
            <h2 id="personal" className="mb-1 flex items-center gap-2 font-bold text-ink-900">
              <UserRound className="size-4 text-brand-600" aria-hidden /> Shaxsiy ma&apos;lumotlar
            </h2>
            <p className="mb-5 text-sm text-ink-500">Ism, telefon va email hamkasblaringizga ko&apos;rinadi.</p>
            <ProfileForm me={u} onSaved={refresh} />
          </section>
          <section className="card p-6" aria-labelledby="security">
            <h2 id="security" className="mb-1 flex items-center gap-2 font-bold text-ink-900">
              <LockKeyhole className="size-4 text-brand-600" aria-hidden /> Xavfsizlik
            </h2>
            <p className="mb-5 text-sm text-ink-500">Parolni muntazam yangilang va uni hech kimga bermang.</p>
            <PasswordForm onSaved={refresh} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="contacts">
            <h2 id="contacts" className="mb-4 font-bold text-ink-900">
              Aloqa
            </h2>
            <ul className="space-y-3 text-sm text-ink-700">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-ink-400" aria-hidden /> {u.phone ?? "—"}
              </li>
              <li className="flex items-center gap-2 break-all">
                <Mail className="size-4 shrink-0 text-ink-400" aria-hidden /> {u.email ?? "—"}
              </li>
            </ul>
          </section>
          <section className="card p-6" aria-labelledby="rights">
            <h2 id="rights" className="font-bold text-ink-900">
              Mening huquqlarim
            </h2>
            <p className="mb-4 text-sm text-ink-500">{role.description}</p>
            <ul className="space-y-2">
              {allowed.map((label) => (
                <li key={label} className="flex items-start gap-2 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden /> {label}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6" aria-labelledby="my-activity">
            <h2 id="my-activity" className="mb-3 font-bold text-ink-900">
              So&apos;nggi faoliyat
            </h2>
            {activity.error ? <ErrorState message={activity.error} onRetry={activity.reload} /> : !activity.data ? <Loading /> : <ActivityFeed items={activity.data.items.slice(0, 10)} />}
          </section>
        </div>
      </div>
    </div>
  );
}
