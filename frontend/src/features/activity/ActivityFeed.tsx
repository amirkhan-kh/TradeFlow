import { Globe, KeyRound, LogIn, ShieldAlert, ShieldCheck, UserCog, UserPlus, UserX, type LucideIcon } from "lucide-react";
import { fmtDate } from "@/shared/lib/format";
import { ACTIONS, ROLES, type Role } from "@/shared/lib/roles";
import { Empty } from "@/shared/ui/States";

export interface ActivityItem {
  id: number;
  action: string;
  details: Record<string, unknown>;
  ip: string | null;
  created_at: string;
  actor_id: number | null;
  actor_name: string | null;
  target_user_id: number | null;
  target_name: string | null;
}

const ICON: Record<string, LucideIcon> = {
  auth: LogIn,
  "auth.login_failed": ShieldAlert,
  "auth.locked": ShieldAlert,
  "profile.password_changed": KeyRound,
  "user.password_reset": KeyRound,
  "user.created": UserPlus,
  "user.deactivated": UserX,
  "user.activated": ShieldCheck,
};
const TONE = {
  green: "bg-brand-50 text-brand-700",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  gray: "bg-ink-100 text-ink-600",
};

const roleLabel = (r: unknown) => ROLES[r as Role]?.label ?? String(r);

export function describe(a: ActivityItem) {
  const d = a.details;
  if (a.action === "user.role_changed") return `${roleLabel(d.from)} → ${roleLabel(d.to)}`;
  if (a.action === "user.created") return `Login: ${d.username} · ${roleLabel(d.role)}`;
  if (a.action === "user.updated" && Array.isArray(d.fields)) return `O'zgargan: ${d.fields.join(", ")}`;
  if (a.action === "auth.login_failed" || a.action === "auth.locked") return `${d.attempt}-urinish`;
  return null;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (!items.length) return <Empty title="Faoliyat yo'q" hint="Kirish, parol va rol o'zgarishlari shu yerda ko'rinadi" />;
  return (
    <ol className="relative space-y-1 before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-px before:bg-ink-200">
      {items.map((a) => {
        const meta = ACTIONS[a.action] ?? { label: a.action, tone: "gray" as const };
        const Icon = ICON[a.action] ?? ICON[a.action.split(".")[0]] ?? UserCog;
        const extra = describe(a);
        return (
          <li key={a.id} className="relative flex gap-3 rounded-xl px-1 py-2">
            <span className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full ring-4 ring-white ${TONE[meta.tone]}`}>
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="text-ink-800">
                <b className="font-semibold">{a.actor_name ?? "Tizim"} </b>
                {meta.label}
                {a.target_name && a.target_user_id !== a.actor_id && <b className="font-semibold"> · {a.target_name}</b>}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-500">
                <span>{fmtDate(a.created_at, true)}</span>
                {extra && <span>· {extra}</span>}
                {a.ip && (
                  <span className="inline-flex items-center gap-1">
                    · <Globe className="size-3" aria-hidden /> {a.ip}
                  </span>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
