"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useT } from "@/shared/i18n/I18nProvider";
import { dayLabel, fmtCompact, fmtMoney, fmtNum, monthLabel } from "@/shared/lib/format";

export const PALETTE = ["#137852", "#18324d", "#3dae7f", "#d4a24c", "#6fc8a1", "#2a4a6b", "#a7dfc4", "#8a9b95"];

const axis = { fontSize: 11, fill: "#8a9b95" };
const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: "1px solid #d8e1de", boxShadow: "0 8px 24px -8px rgb(16 40 32 / .2)", fontSize: 12 },
  labelStyle: { fontWeight: 700, color: "#13201c" },
};

export function FlowChart({ data }: { data: { month: string; inbound: number; outbound: number }[] }) {
  const t = useT();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3dae7f" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3dae7f" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18324d" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#18324d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaf0ee" vertical={false} />
        <XAxis dataKey="month" tickFormatter={monthLabel} tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtCompact} />
        <Tooltip {...tooltipStyle} labelFormatter={(l) => monthLabel(String(l))} formatter={(v) => t("{n} dona", { n: fmtNum(Number(v)) })} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="inbound" name={t("Kirim")} stroke="#137852" strokeWidth={2.5} fill="url(#gIn)" />
        <Area type="monotone" dataKey="outbound" name={t("Chiqim")} stroke="#18324d" strokeWidth={2.5} fill="url(#gOut)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SalesChart({ data }: { data: { month: string; revenue: number; collected: number }[] }) {
  const t = useT();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaf0ee" vertical={false} />
        <XAxis dataKey="month" tickFormatter={monthLabel} tick={axis} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtCompact} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "#ecf8f2" }} labelFormatter={(l) => monthLabel(String(l))} formatter={(v) => fmtMoney(Number(v))} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="revenue" name={t("Sotuv")} fill="#18324d" radius={[6, 6, 0, 0]} maxBarSize={22} />
        <Bar dataKey="collected" name={t("Undirilgan")} fill="#3dae7f" radius={[6, 6, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DailyChart({ data }: { data: { day: string; revenue: number; orders: number }[] }) {
  const t = useT();
  return (
    <ResponsiveContainer width="100%" height={230}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#137852" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#137852" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaf0ee" vertical={false} />
        <XAxis dataKey="day" tickFormatter={dayLabel} tick={axis} axisLine={false} tickLine={false} interval={4} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtCompact} />
        <Tooltip {...tooltipStyle} labelFormatter={(l) => dayLabel(String(l))} formatter={(v, _n, item) => (item.dataKey === "revenue" ? fmtMoney(Number(v)) : v)} />
        <Area type="monotone" dataKey="revenue" name={t("Tushum")} stroke="#137852" strokeWidth={2.5} fill="url(#gDay)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Donut({
  data,
  nameKey,
  valueKey,
  money = false,
}: {
  data: Record<string, string | number>[];
  nameKey: string;
  valueKey: string;
  money?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius={58} outerRadius={88} paddingAngle={2} stroke="none">
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v) => (money ? fmtMoney(Number(v)) : fmtNum(Number(v)))} />
      </PieChart>
    </ResponsiveContainer>
  );
}
