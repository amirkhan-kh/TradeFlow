import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-700",
  secondary: "border border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:bg-brand-50",
  ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
