import Link from "next/link";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="78 18 878 900" className={className} aria-hidden="true">
      <path fill="#537a89" d="M88 272 515 25l430 247-83 48-347-198-345 198Z" />
      <path fill="#32536b" d="M88 272l82 48v395l-82-45ZM945 272v398l-83 45V320ZM268 535l229-130v88l-62 35v347l-85-50V580l-82 48Z" />
      <path fill="#8bc474" d="M232 380 515 215l285 165v100L515 315 232 480ZM537 405l228 130v95l-145-82v64l98 56v97l-98-56v150l-83 48Z" />
    </svg>
  );
}

export function Logo({ href = "/", light = false, className = "" }: { href?: string; light?: boolean; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="TradeFlow bosh sahifa">
      {light ? (
        <span className="grid size-10 place-items-center rounded-xl bg-white shadow-sm">
          <LogoMark className="size-7" />
        </span>
      ) : (
        <LogoMark />
      )}
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-[#32536b]"}`}>
        Trade<span className={light ? "text-[#a6d48a]" : "text-[#4d8a3a]"}>Flow</span>
      </span>
    </Link>
  );
}
