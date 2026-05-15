"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";

export function MobileFiltersSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sheet = (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Закрыть фильтры"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="absolute left-0 top-0 bottom-0 flex w-[90%] max-w-sm flex-col bg-background shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-base font-semibold">Фильтры</span>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-11 w-full items-center justify-center rounded-lg gradient-bg px-4 py-2 text-sm font-semibold text-white"
          >
            Показать результаты
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground lg:hidden"
      >
        <Filter className="h-4 w-4" /> Фильтры
      </button>
      {open && mounted && createPortal(sheet, document.body)}
    </>
  );
}
