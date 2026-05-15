"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown, ShoppingCart, User } from "lucide-react";
import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Cat = { slug: string; name: string };

export function MobileNav({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  const panel = (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="absolute right-0 top-0 bottom-0 flex w-[85%] max-w-sm flex-col bg-surface shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <span className="text-xl font-extrabold tracking-tight gradient-text">
            GGPoint
          </span>
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-background transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => {
              if (item.hasCategoriesSubmenu) {
                return (
                  <MobileCatalogSection
                    key={item.href}
                    item={item}
                    categories={categories}
                    pathname={pathname}
                  />
                );
              }
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      active
                        ? "bg-background text-foreground"
                        : "text-muted hover:bg-background hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
          <Link
            href="/cart"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-background/60 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Корзина
          </Link>
          <Link
            href="/account"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <User className="h-4 w-4" />
            Аккаунт
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Открыть меню"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && mounted && createPortal(panel, document.body)}
    </>
  );
}

function MobileCatalogSection({
  item,
  categories,
  pathname,
}: {
  item: (typeof mainNav)[number];
  categories: Cat[];
  pathname: string;
}) {
  const Icon = item.icon;
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const [open, setOpen] = useState(active);

  return (
    <li>
      <div className="flex items-stretch">
        <Link
          href={item.href}
          className={cn(
            "flex min-h-12 flex-1 items-center gap-3 rounded-l-lg px-3 py-3 text-base font-medium transition-colors",
            active
              ? "bg-background text-foreground"
              : "text-muted hover:bg-background hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Свернуть категории" : "Развернуть категории"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "inline-flex min-h-12 w-11 items-center justify-center rounded-r-lg text-muted transition-colors hover:bg-background",
            active && "bg-background"
          )}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {open && (
        <ul className="mt-1 ml-6 flex flex-col gap-0.5 border-l border-border pl-2">
          {categories.map((c) => {
            const href = `/catalog/${c.slug}`;
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={c.slug}>
                <Link
                  href={href}
                  className={cn(
                    "flex min-h-10 items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "text-muted hover:bg-background hover:text-foreground"
                  )}
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
