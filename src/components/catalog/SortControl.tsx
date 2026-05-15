"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

const OPTIONS = [
  { value: "new",        label: "Сначала новые" },
  { value: "price_asc",  label: "Цена: по возрастанию" },
  { value: "price_desc", label: "Цена: по убыванию" },
] as const;

export function SortControl({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm text-muted">
      <span className="hidden sm:inline">Сортировка:</span>
      <select
        value={current}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "new") next.delete("sort");
          else next.set("sort", e.target.value);
          const qs = next.toString();
          startTransition(() => {
            router.push(qs ? `${pathname}?${qs}` : pathname);
          });
        }}
        className="min-w-0 max-w-[60vw] truncate rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600/40"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
