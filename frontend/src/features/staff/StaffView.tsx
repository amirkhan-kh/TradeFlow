"use client";

import { Ban, KeyRound, LogOut, Mail, Pencil, Phone, ShieldCheck, UserCheck, UserPlus, Users, UserX, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { api, qs } from "@/shared/lib/api";
import { fmtDate } from "@/shared/lib/format";
import { initials, ROLE_KEYS, ROLES } from "@/shared/lib/roles";
import { useApi } from "@/shared/lib/useApi";
import { Button } from "@/shared/ui/Button";
import { Select } from "@/shared/ui/Field";
import { Modal } from "@/shared/ui/Modal";
import { Chips, KpiCard, PageHeader, SearchInput } from "@/shared/ui/Page";
import { Empty, ErrorState, Loading } from "@/shared/ui/States";
import { ActivityFeed, type ActivityItem } from "../activity/ActivityFeed";
import { RolesMatrix } from "./RolesMatrix";
import { ResetPassword, StaffForm } from "./StaffForm";
import type { RoleStat, Staff } from "./types";

type Dialog = { kind: "create" } | { kind: "edit" | "reset" | "detail"; user: Staff } | null;

function Avatar({ user, size = "size-10" }: { user: Staff; size?: string }) {
  const color = ROLES[user.role].color;
  return (
    <span className={`relative grid shrink-0 place-items-center rounded-2xl text-sm font-extrabold text-white ${size} ${user.active ? "" : "grayscale"}`} style={{ background: `linear-gradient(135deg, ${color}, ${color}b3)` }}>
      {initials(user.full_name)}
    </span>
  );
}

function RoleTag({ role }: { role: Staff["role"] }) {
  const r = ROLES[role];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap" style={{ background: `${r.color}14`, color: r.color }}>
      <span className="size-1.5 rounded-full" style={{ background: r.color }} aria-hidden />
      {r.label}
    </span>
  );
}

function Detail({ user }: { user: Staff }) {
  const d = useApi<Staff & { activity: ActivityItem[] }>(`/users/${user.id}`);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl bg-ink-50 p-4">
        <Avatar user={user} size="size-14" />
        <div className="min-w-0 text-sm">
          <p className="font-mono text-ink-500">@{user.username}</p>
          <RoleTag role={user.role} />
        </div>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {[
          ["Telefon", user.phone ?? "—"],
          ["Email", user.email ?? "—"],
          ["Hudud", user.region ?? "—"],
          ["Holat", user.active ? "Faol" : "Bloklangan"],
          ["Oxirgi kirish", user.last_login_at ? fmtDate(user.last_login_at, true) : "Hali kirmagan"],
          ["Parol o'zgargan", user.password_changed_at ? fmtDate(user.password_changed_at, true) : "—"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-3 py-2 ring-1 ring-ink-200/70">
            <dt className="text-xs text-ink-500">{k}</dt>
            <dd className="font-semibold break-all text-ink-900">{v}</dd>
          </div>
        ))}
      </dl>
      <section>
        <h3 className="mb-2 text-sm font-bold text-ink-900">Faoliyat tarixi</h3>
        {d.error ? <ErrorState message={d.error} onRetry={d.reload} /> : !d.data ? <Loading /> : <ActivityFeed items={d.data.activity} />}
      </section>
    </div>
  );
}

export function StaffView() {
  const me = useApi<{ user: { id: number } }>("/auth/me");
  const stats = useApi<{ items: RoleStat[] }>("/users/stats");
  const [tab, setTab] = useState<"staff" | "roles">("staff");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);
  const list = useApi<{ items: Staff[] }>(`/users${qs({ role, status, q: debounced })}`);

  const s = stats.data?.items ?? [];
  const sum = (k: keyof Omit<RoleStat, "role">) => s.reduce((a, r) => a + r[k], 0);
  const counts = Object.fromEntries([["", sum("total")], ...s.map((r) => [r.role, r.total])]);
  const selfId = me.data?.user.id;

  function reload() {
    list.reload();
    stats.reload();
  }

  async function act(u: Staff, path: string, json?: unknown, question?: string) {
    if (question && !confirm(question)) return;
    setBusy(u.id);
    setError(undefined);
    try {
      await api(`/users/${u.id}/${path}`, { method: "POST", json });
      reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const close = () => {
    setDialog(null);
    reload();
  };
  const title = !dialog ? "" : dialog.kind === "create" ? "Yangi xodim kabineti" : dialog.kind === "edit" ? `${dialog.user.full_name} — tahrirlash` : dialog.kind === "reset" ? `${dialog.user.full_name} — parolni tiklash` : dialog.user.full_name;

  return (
    <div className="animate-rise">
      <PageHeader
        title="Xodimlar va rollar"
        description="Kabinet yarating, rol bering, parolni tiklang va kirishlarni nazorat qiling"
        actions={
          <Button onClick={() => setDialog({ kind: "create" })}>
            <UserPlus className="size-4" /> Yangi xodim
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Jami xodimlar" value={stats.data ? sum("total") : "…"} icon={Users} />
        <KpiCard label="Faol" value={stats.data ? sum("active") : "…"} icon={UserCheck} tone="navy" />
        <KpiCard label="Bloklangan" value={stats.data ? sum("total") - sum("active") : "…"} icon={UserX} tone="red" />
        <KpiCard label="24 soatda kirgan" value={stats.data ? sum("online") : "…"} icon={Wifi} tone="amber" />
      </div>

      <div className="mb-4 inline-flex rounded-2xl bg-ink-100/70 p-1" role="tablist" aria-label="Bo'limlar">
        {(
          [
            ["staff", "Xodimlar", Users],
            ["roles", "Rollar va huquqlar", ShieldCheck],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === key ? "bg-white text-brand-700 shadow-soft" : "text-ink-600 hover:text-ink-900"}`}
          >
            <Icon className="size-4" aria-hidden /> {label}
          </button>
        ))}
      </div>

      {tab === "roles" ? (
        <RolesMatrix stats={s} />
      ) : (
        <div className="card">
          <div className="flex flex-col gap-3 border-b border-ink-100 p-4 xl:flex-row xl:items-center xl:justify-between">
            <Chips options={[{ value: "", label: "Barchasi" }, ...ROLE_KEYS.map((r) => ({ value: r, label: ROLES[r].label }))]} value={role} onChange={setRole} counts={counts} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select aria-label="Holat" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
                <option value="">Har qanday holat</option>
                <option value="active">Faol</option>
                <option value="inactive">Bloklangan</option>
              </Select>
              <SearchInput value={q} onChange={setQ} placeholder="Ism, login, telefon…" />
            </div>
          </div>
          {error && (
            <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}
          {list.error ? (
            <ErrorState message={list.error} onRetry={list.reload} />
          ) : !list.data ? (
            <Loading />
          ) : !list.data.items.length ? (
            <Empty title="Xodim topilmadi" hint="Filtrni o'zgartiring yoki yangi xodim qo'shing" />
          ) : (
            <ul className="divide-y divide-ink-100">
              {list.data.items.map((u) => {
                const self = u.id === selfId;
                return (
                  <li key={u.id} className={`flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-brand-50/30 lg:flex-row lg:items-center ${u.active ? "" : "bg-ink-50/60"}`}>
                    <button type="button" onClick={() => setDialog({ kind: "detail", user: u })} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <Avatar user={u} />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2 font-semibold text-ink-900">
                          {u.full_name}
                          {self && <span className="rounded-md bg-ink-900 px-1.5 py-0.5 text-[10px] font-bold text-white">SIZ</span>}
                          {!u.active && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-red-700">
                              <Ban className="size-3" aria-hidden /> Bloklangan
                            </span>
                          )}
                        </span>
                        <span className="block font-mono text-xs text-ink-500">@{u.username}</span>
                      </span>
                    </button>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-600 lg:w-[46%]">
                      <RoleTag role={u.role} />
                      <span className="inline-flex min-w-28 items-center gap-1">
                        <Phone className="size-3.5 text-ink-400" aria-hidden /> {u.phone ?? "—"}
                      </span>
                      {u.email && (
                        <span className="hidden items-center gap-1 xl:inline-flex">
                          <Mail className="size-3.5 text-ink-400" aria-hidden /> {u.email}
                        </span>
                      )}
                      <span className="text-ink-500">{u.last_login_at ? `Kirgan: ${fmtDate(u.last_login_at, true)}` : "Hali kirmagan"}</span>
                    </div>
                    <div className="flex items-center gap-0.5 lg:justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setDialog({ kind: "edit", user: u })} aria-label={`${u.full_name} — tahrirlash`} title="Tahrirlash">
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDialog({ kind: "reset", user: u })} aria-label={`${u.full_name} — parolni tiklash`} title="Parolni tiklash">
                        <KeyRound className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy === u.id}
                        onClick={() => act(u, "sessions/revoke", undefined, `${u.full_name}: barcha qurilmalardagi sessiyalar yopilsinmi?`)}
                        aria-label={`${u.full_name} — sessiyalarni yopish`}
                        title="Barcha sessiyalarni yopish"
                      >
                        <LogOut className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy === u.id || self}
                        onClick={() => act(u, "status", { active: !u.active }, u.active ? `${u.full_name} bloklansinmi? U tizimga kira olmaydi.` : undefined)}
                        aria-label={`${u.full_name} — ${u.active ? "bloklash" : "faollashtirish"}`}
                        title={self ? "O'zingizni bloklay olmaysiz" : u.active ? "Bloklash" : "Faollashtirish"}
                      >
                        {u.active ? <UserX className="size-4 text-red-600" /> : <UserCheck className="size-4 text-brand-600" />}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <Modal open={dialog !== null} onClose={close} title={title} wide={dialog?.kind === "create" || dialog?.kind === "edit" || dialog?.kind === "detail"}>
        {dialog?.kind === "create" && <StaffForm onDone={close} />}
        {dialog?.kind === "edit" && <StaffForm initial={dialog.user} isSelf={dialog.user.id === selfId} onDone={close} />}
        {dialog?.kind === "reset" && <ResetPassword user={dialog.user} onDone={close} />}
        {dialog?.kind === "detail" && <Detail user={dialog.user} />}
      </Modal>
    </div>
  );
}
