import { Check, Minus } from "lucide-react";
import { useT } from "@/shared/i18n/I18nProvider";
import { PERMISSIONS, ROLE_KEYS, ROLES } from "@/shared/lib/roles";
import type { RoleStat } from "./types";

export function RolesMatrix({ stats }: { stats: RoleStat[] }) {
  const t = useT();
  const count = (r: string) => stats.find((s) => s.role === r)?.active ?? 0;
  return (
    <div className="card overflow-hidden">
      <div className="grid gap-3 border-b border-ink-100 p-5 sm:grid-cols-2 lg:grid-cols-5">
        {ROLE_KEYS.map((r) => (
          <div key={r} className="rounded-2xl p-4 ring-1 ring-ink-200/70" style={{ background: `${ROLES[r].color}0d` }}>
            <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
              <span className="size-2.5 rounded-full" style={{ background: ROLES[r].color }} aria-hidden />
              {t(ROLES[r].label)}
            </p>
            <p className="mt-1 text-xs leading-snug text-ink-600">{t(ROLES[r].description)}</p>
            <p className="mt-3 text-xs font-semibold text-ink-500">
              <b className="text-lg text-ink-900 tabular-nums">{count(r)}</b> {t("faol xodim")}
            </p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">{t("Rollar bo'yicha huquqlar jadvali")}</caption>
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-semibold text-ink-500">
              <th scope="col" className="px-5 py-3 text-left">
                {t("Huquq")}
              </th>
              {ROLE_KEYS.map((r) => (
                <th key={r} scope="col" className="px-3 py-3 text-center whitespace-nowrap">
                  {t(ROLES[r].label)}
                </th>
              ))}
            </tr>
          </thead>
          {PERMISSIONS.map((g) => (
            <tbody key={g.area} className="divide-y divide-ink-100">
              <tr>
                <th colSpan={ROLE_KEYS.length + 1} scope="colgroup" className="bg-white px-5 pt-5 pb-2 text-left text-[11px] font-bold tracking-wider text-ink-500 uppercase">
                  {t(g.area)}
                </th>
              </tr>
              {g.items.map(([label, roles]) => (
                <tr key={label} className="transition-colors hover:bg-brand-50/40">
                  <th scope="row" className="px-5 py-3 text-left font-medium text-ink-800">
                    {t(label)}
                  </th>
                  {ROLE_KEYS.map((r) => (
                    <td key={r} className="px-3 py-3 text-center">
                      {roles.includes(r) ? (
                        <span className="inline-grid size-6 place-items-center rounded-full text-white" style={{ background: ROLES[r].color }}>
                          <Check className="size-3.5" aria-label={t("ruxsat bor")} />
                        </span>
                      ) : (
                        <Minus className="mx-auto size-4 text-ink-300" aria-label={t("ruxsat yo'q")} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <p className="border-t border-ink-100 px-5 py-3 text-xs text-ink-500">{t("Huquqlar server tomonida tekshiriladi. Rol o'zgarishi darhol kuchga kiradi — xodim qaytadan tizimga kiradi.")}</p>
    </div>
  );
}
