import { CircleAlert, Inbox, LoaderCircle } from "lucide-react";
import { useT } from "@/shared/i18n/I18nProvider";

export function Loading({ label }: { label?: string }) {
  const t = useT();
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
      <LoaderCircle className="size-4 animate-spin text-brand-600" />
      {label ?? t("Yuklanmoqda…")}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-ink-100 ${className}`} />;
}

export function Empty({ title, hint }: { title?: string; hint?: string }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Inbox className="size-6" />
      </div>
      <p className="font-semibold text-ink-800">{title ?? t("Ma'lumot yo'q")}</p>
      {hint && <p className="max-w-sm text-sm text-ink-500">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const t = useT();
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-600">
        <CircleAlert className="size-6" />
      </div>
      <p className="text-sm text-ink-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-semibold text-brand-700 hover:underline">
          {t("Qayta urinish")}
        </button>
      )}
    </div>
  );
}

export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
