"use client";

import {
  Bot,
  Boxes,
  ClipboardCheck,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Wallet,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/shared/lib/api";
import { statusOf } from "@/shared/lib/status";
import { useApi } from "@/shared/lib/useApi";
import { Logo } from "@/shared/ui/Logo";

const NAV = [
  {
    title: "Asosiy",
    items: [
      ["/dashboard", "Dashboard", LayoutDashboard],
      ["/dashboard/insights", "Aqlli agentlar", Bot],
    ],
  },
  {
    title: "Savdo",
    items: [
      ["/dashboard/orders", "Buyurtmalar", ShoppingCart],
      ["/dashboard/clients", "Mijozlar", Store],
      ["/dashboard/agents", "Savdo jamoasi", Users],
      ["/dashboard/leads", "Lidlar", Inbox],
    ],
  },
  {
    title: "Ombor",
    items: [
      ["/dashboard/warehouses", "Omborlar", Warehouse],
      ["/dashboard/products", "Tovarlar", Package],
      ["/dashboard/stock", "Qoldiq va harakat", Boxes],
      ["/dashboard/audits", "Audit", ClipboardCheck],
    ],
  },
  {
    title: "Logistika va moliya",
    items: [
      ["/dashboard/deliveries", "Yetkazib berish", Truck],
      ["/dashboard/finance", "Moliya", Wallet],
    ],
  },
] as const;

interface Me {
  user: { full_name: string; username: string; role: string };
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = useApi<Me>("/auth/me");

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const user = data?.user;

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-200/70 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0 shadow-lift" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo href="/dashboard" />
          <button className="rounded-lg p-1.5 text-ink-500 lg:hidden" onClick={() => setOpen(false)} aria-label="Menyuni yopish">
            <X className="size-5" />
          </button>
        </div>
        <nav aria-label="CRM" className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
          {NAV.map((g) => (
            <div key={g.title}>
              <p className="mb-1.5 px-3 text-[11px] font-bold tracking-wider text-ink-400 uppercase">{g.title}</p>
              <ul className="space-y-0.5">
                {g.items.map(([href, label, Icon]) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                        }`}
                      >
                        <Icon className={`size-[18px] ${active ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"}`} />
                        {label}
                        {active && <span className="ml-auto h-5 w-1 rounded-full bg-brand-500" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="m-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Bot className="size-4" /> Aqlli agentlar faol
          </p>
          <p className="mt-1 text-xs text-brand-100/85">5 ta agent ma&apos;lumotlaringizni kuzatmoqda</p>
          <Link href="/dashboard/insights" className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25">
            Tavsiyalarni ko&apos;rish
          </Link>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
        <button className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Menyuni ochish">
          <Menu className="size-5" />
        </button>
        <p className="hidden text-sm text-ink-500 sm:block" suppressHydrationWarning>
          {new Date().toLocaleDateString("uz-UZ", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <div className="ml-auto flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-ink-900">{user.full_name}</p>
                <p className="text-xs text-ink-500">{statusOf(user.role).label}</p>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-bold text-white">
                {user.full_name.slice(0, 1)}
              </span>
            </div>
          )}
          <button onClick={logout} className="rounded-xl p-2 text-ink-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Chiqish" title="Chiqish">
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
