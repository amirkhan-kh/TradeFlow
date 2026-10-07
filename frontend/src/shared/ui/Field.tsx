import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

export function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`input ${props.className ?? ""}`} />;
}

export function Select({ children, className = "", ...props }: ComponentProps<"select">) {
  return (
    <span className={`relative block ${className}`}>
      <select {...props} className="input appearance-none pr-9">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-400" />
    </span>
  );
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`input h-auto min-h-20 py-2 ${props.className ?? ""}`} />;
}
