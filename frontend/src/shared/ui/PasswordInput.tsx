"use client";

import { Eye, EyeOff, Wand2 } from "lucide-react";
import { useState } from "react";

const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** 12 chars without look-alikes (0/O, 1/l); always has a letter and a digit. */
export function generatePassword(): string {
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  const out = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return /\d/.test(out) && /[a-z]/i.test(out) ? out : generatePassword();
}

export function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}
const LEVELS = [
  ["Juda kuchsiz", "bg-red-500"],
  ["Kuchsiz", "bg-red-400"],
  ["O'rtacha", "bg-amber-400"],
  ["Yaxshi", "bg-brand-400"],
  ["Kuchli", "bg-brand-600"],
] as const;

export function PasswordInput({
  name,
  value,
  onChange,
  generator = false,
  autoComplete = "new-password",
  required = true,
  showStrength = true,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  generator?: boolean;
  autoComplete?: string;
  required?: boolean;
  showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const level = strength(value);
  return (
    <div>
      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={autoComplete === "current-password" ? undefined : 8}
          maxLength={72}
          autoComplete={autoComplete}
          className={`input font-mono ${generator ? "pr-20" : "pr-10"}`}
        />
        <div className="absolute inset-y-0 right-1 flex items-center">
          {generator && (
            <button
              type="button"
              onClick={() => {
                onChange(generatePassword());
                setVisible(true);
              }}
              className="rounded-lg p-2 text-ink-500 hover:bg-brand-50 hover:text-brand-700"
              aria-label="Parol yaratish"
              title="Kuchli parol yaratish"
            >
              <Wand2 className="size-4" />
            </button>
          )}
          <button type="button" onClick={() => setVisible((v) => !v)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100" aria-label={visible ? "Parolni yashirish" : "Parolni ko'rsatish"}>
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      {showStrength && value && (
        <div className="mt-2 flex items-center gap-2" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${i < level ? LEVELS[level][1] : "bg-ink-100"}`} />
            ))}
          </div>
          <span className="w-24 text-right text-xs font-medium text-ink-600">{LEVELS[level][0]}</span>
        </div>
      )}
    </div>
  );
}
