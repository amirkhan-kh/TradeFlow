"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useT } from "@/shared/i18n/I18nProvider";
import { api, qs, type Page } from "@/shared/lib/api";

interface Props<T extends { id: number }> {
  /** List endpoint with `q` + `limit` support, e.g. `/clients`. */
  path: string;
  params?: Record<string, string | undefined>;
  value: T | null;
  onChange: (value: T | null) => void;
  display: (item: T) => string;
  /** Secondary text in the dropdown row. */
  hint?: (item: T) => React.ReactNode;
  /** Hidden input name so `FormData` forms receive the selected id. */
  name?: string;
  required?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  id?: string;
}

/** Server-side searchable combobox: scales to any list size (only 20 rows are fetched per query). */
export function SearchSelect<T extends { id: number }>({ path, params, value, onChange, display, hint, name, required, placeholder, id, ...aria }: Props<T>) {
  const t = useT();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [active, setActive] = useState(0);
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!open) return;
    let alive = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(undefined);
      api<Page<T>>(`${path}${qs({ ...JSON.parse(paramsKey), q: query.trim(), limit: 20 })}`)
        .then((d) => {
          if (!alive) return;
          setItems(d.items);
          setActive(0);
        })
        .catch((e: Error) => alive && setError(e.message))
        .finally(() => alive && setLoading(false));
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [open, query, path, paramsKey]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(!value && query.trim() ? t("Ro'yxatdan tanlang") : "");
  }, [value, query, t]);

  const choose = (item: T) => {
    onChange(item);
    setQuery("");
    setOpen(false);
  };

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && items[active]) {
      e.preventDefault();
      choose(items[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  const optionId = (i: number) => `${listId}-o${i}`;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && items[active] ? optionId(active) : undefined}
        aria-label={aria["aria-label"]}
        autoComplete="off"
        required={required}
        placeholder={placeholder ?? t("Qidiring va tanlang…")}
        className="input pr-9"
        value={value ? display(value) : query}
        onChange={(e) => {
          if (value) onChange(null);
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {name && <input type="hidden" name={name} value={value?.id ?? ""} />}
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-400">
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ChevronDown className="size-4" aria-hidden />}
      </span>
      {open && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-ink-100 bg-white p-1 shadow-lg">
          {error ? (
            <li className="px-3 py-2 text-sm text-red-600">{error}</li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-500">{loading ? t("Yuklanmoqda…") : t("Hech narsa topilmadi")}</li>
          ) : (
            items.map((item, i) => (
              <li
                key={item.id}
                id={optionId(i)}
                role="option"
                aria-selected={value?.id === item.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  choose(item);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${i === active ? "bg-brand-50 text-ink-900" : "text-ink-700"}`}
              >
                <span className="block truncate font-medium">{display(item)}</span>
                {hint && <span className="block truncate text-xs text-ink-500">{hint(item)}</span>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export interface WarehouseOption {
  id: number;
  name: string;
  code: string;
  city: string;
}

/** Warehouse picker shared by order, stock-move, audit forms and the stock filter. */
export function WarehouseSelect(props: Omit<Props<WarehouseOption>, "path" | "display" | "hint">) {
  const t = useT();
  return <SearchSelect<WarehouseOption> path="/warehouses" placeholder={t("Ombor qidiring…")} {...props} display={(w) => w.name} hint={(w) => `${w.code} · ${w.city}`} />;
}
