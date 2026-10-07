import * as repo from "./repository.js";

type Severity = "high" | "medium" | "low";
interface Finding {
  severity: Severity;
  title: string;
  detail: string;
  href: string;
}
interface Agent {
  key: "stock" | "finance" | "audit" | "sales" | "logistics";
  name: string;
  role: string;
  findings: Finding[];
}

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
const days = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);

/** Linear trend over closed months → next month estimate. */
function forecast(values: number[]): number {
  const n = values.length;
  if (n < 2) return values[0] ?? 0;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  values.forEach((y, x) => {
    num += (x - xMean) * (y - yMean);
    den += (x - xMean) ** 2;
  });
  return Math.max(0, yMean + (num / den) * (n - xMean));
}

export async function run() {
  const [cover, expiring, overlimit, collection, stale, variance, dormant, pace, monthly, late] = await Promise.all([
    repo.stockCover(),
    repo.expiring(),
    repo.overlimit(),
    repo.collection(),
    repo.staleWarehouses(),
    repo.auditVariance(),
    repo.dormantClients(),
    repo.agentPace(),
    repo.monthlyRevenue(),
    repo.lateDeliveries(),
  ]);

  const stock: Finding[] = cover
    .map((c) => ({ ...c, left: c.available / c.daily }))
    .filter((c) => c.left < 10)
    .sort((a, b) => a.left - b.left)
    .slice(0, 5)
    .map((c) => ({
      severity: c.left < 4 ? "high" : "medium",
      title: c.left < 1 ? `${c.name} — zaxira 1 kunga ham yetmaydi` : `${c.name} — ${Math.floor(c.left)} kunlik zaxira`,
      detail: `${c.warehouse_name}: ${c.available} dona qoldi, kuniga ~${c.daily.toFixed(1)} sotiladi. Tavsiya: ${fmt(
        Math.max(0, c.daily * 21 - c.available),
      )} dona buyurtma bering.`,
      href: "/dashboard/stock?low=true",
    }));
  for (const e of expiring) {
    stock.push({
      severity: "medium",
      title: `${e.name}: muddati ${days(e.expires_at) >= 0 ? "o'tgan" : `${-days(e.expires_at)} kunda tugaydi`}`,
      detail: `${e.units} dona omborda. Aksiya yoki qaytarishni rejalashtiring.`,
      href: "/dashboard/products",
    });
  }

  const rate = collection.sold > 0 ? (collection.collected / collection.sold) * 100 : 100;
  const finance: Finding[] = overlimit.map((c) => ({
    severity: "high",
    title: `${c.name} kredit limitidan oshdi`,
    detail: `Qarz ${fmt(c.balance)} so'm, limit ${fmt(c.credit_limit)} so'm. Yangi yuklashni to'xtating va undiruvchi yuboring.`,
    href: `/dashboard/clients?status=overlimit`,
  }));
  finance.push({
    severity: rate < 70 ? "high" : rate < 90 ? "medium" : "low",
    title: `30 kunlik undirish darajasi: ${rate.toFixed(0)}%`,
    detail: `Sotildi ${fmt(collection.sold)} so'm, undirildi ${fmt(collection.collected)} so'm.`,
    href: "/dashboard/finance",
  });

  const audit: Finding[] = [
    ...stale.map((w) => ({
      severity: (w.last_audit ? "medium" : "high") as Severity,
      title: `${w.name}: audit kerak`,
      detail: w.last_audit ? `Oxirgi audit ${days(w.last_audit)} kun oldin o'tkazilgan.` : "Bu omborda hali audit o'tkazilmagan.",
      href: "/dashboard/audits",
    })),
    ...variance.map((v) => ({
      severity: (Math.abs(v.variance) > 1_000_000 ? "high" : "medium") as Severity,
      title: `${v.number} (${v.warehouse_name}) farq: ${fmt(v.variance)} so'm`,
      detail: v.variance < 0 ? "Kamomad aniqlangan — mas'ul shaxs bilan tushuntirish xati oling." : "Ortiqcha tovar — kirim hujjatlarini tekshiring.",
      href: `/dashboard/audits/${v.id}`,
    })),
  ];

  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const expectedShare = dayOfMonth / daysInMonth;
  const sales: Finding[] = [
    ...pace
      .filter((a) => a.revenue / a.plan < expectedShare * 0.85)
      .map((a) => ({
        severity: "medium" as Severity,
        title: `${a.full_name} rejadan ortda`,
        detail: `Reja ${fmt(a.plan)} so'm, bajarildi ${((a.revenue / a.plan) * 100).toFixed(0)}% (kutilgan ${(expectedShare * 100).toFixed(0)}%).`,
        href: "/dashboard/agents",
      })),
    ...dormant.map((c) => ({
      severity: "low" as Severity,
      title: `${c.name} ${days(c.last_order)} kundan beri buyurtma bermadi`,
      detail: `${c.agent_name ?? "Agent biriktirilmagan"} — tashrif rejalashtiring yoki aksiya taklif qiling.`,
      href: "/dashboard/clients",
    })),
  ];
  const next = forecast(monthly.map((m) => m.revenue));
  sales.unshift({
    severity: "low",
    title: `Keyingi oy prognozi: ${fmt(next)} so'm`,
    detail: "So'nggi 6 oylik sotuv trendi asosida hisoblandi.",
    href: "/dashboard",
  });

  const logistics: Finding[] = [];
  if (late[0].count > 0) {
    logistics.push({
      severity: "high",
      title: `${late[0].count} ta yetkazish kechikmoqda`,
      detail: "Rejalashtirilgan sanadan o'tib ketgan. Kuryerlarni qayta taqsimlang.",
      href: "/dashboard/deliveries?status=pending",
    });
  }
  if (late[0].failed > 0) {
    logistics.push({
      severity: "medium",
      title: `${late[0].failed} ta yetkazish muvaffaqiyatsiz`,
      detail: "Sabablarni aniqlang va qayta yetkazishni rejalashtiring.",
      href: "/dashboard/deliveries?status=failed",
    });
  }

  const agents: Agent[] = [
    { key: "stock", name: "Ombor agenti", role: "Zaxira, tugash prognozi va yaroqlilik muddati", findings: stock },
    { key: "finance", name: "Moliya agenti", role: "Debitorlik, kredit limiti va undirish", findings: finance },
    { key: "audit", name: "Audit agenti", role: "Inventarizatsiya jadvali va kamomadlar", findings: audit },
    { key: "sales", name: "Sotuv agenti", role: "Reja bajarilishi, faol bo'lmagan mijozlar, prognoz", findings: sales },
    { key: "logistics", name: "Logistika agenti", role: "Yetkazish muddatlari va kuryerlar", findings: logistics },
  ];
  return { generated_at: new Date().toISOString(), forecast_next_month: next, agents };
}
