const num = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];

export const fmtNum = (n: number | string | null | undefined) => num.format(Number(n ?? 0));
export const fmtMoney = (n: number | string | null | undefined) => `${fmtNum(n)} so'm`;

export function fmtCompact(n: number | string | null | undefined) {
  const v = Number(n ?? 0);
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)} mlrd`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)} mln`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(0)} ming`;
  return fmtNum(v);
}

export function fmtDate(d: string | Date | null | undefined, withTime = false) {
  if (!d) return "—";
  const date = new Date(d);
  const s = `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  return withTime ? `${s}, ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}` : s;
}

export const monthLabel = (ym: string) => MONTHS[Number(ym.slice(5, 7)) - 1];
export const dayLabel = (ymd: string) => `${Number(ymd.slice(8, 10))} ${MONTHS[Number(ymd.slice(5, 7)) - 1]}`;

export function pctChange(curr: number, prev: number) {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}
