"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto w-[calc(100%-2rem)] ${wide ? "max-w-3xl" : "max-w-lg"} rounded-2xl bg-white p-0 shadow-lift backdrop:bg-ink-900/40 backdrop:backdrop-blur-sm`}
    >
      {open && (
        <div className="animate-rise p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">{title}</h2>
              {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Yopish">
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
