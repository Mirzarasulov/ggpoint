"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Cat = { slug: string; name: string };

export function DesktopNav({ categories }: { categories: Cat[] }) {
  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) =>
          item.hasCategoriesSubmenu ? (
            <CatalogDropdown key={item.href} item={item} categories={categories} />
          ) : (
            <NavLink key={item.href} href={item.href} label={item.label} />
          )
        )}
      </ul>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
          active ? "text-foreground gradient-text" : "text-muted hover:text-foreground"
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function CatalogDropdown({
  item,
  categories,
}: {
  item: (typeof mainNav)[number];
  categories: Cat[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const active = pathname === item.href || pathname.startsWith(item.href + "/");

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors",
          active ? "text-foreground" : "text-muted hover:text-foreground"
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div role="menu" className="absolute left-0 top-full pt-2">
          <div className="w-56 rounded-xl border border-border bg-surface p-2 shadow-2xl">
            <Link
              href="/catalog"
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/catalog"
                  ? "bg-background text-foreground"
                  : "text-foreground hover:bg-background"
              )}
            >
              Все товары
            </Link>
            <div className="my-1 border-t border-border" />
            {categories.map((c) => {
              const href = `/catalog/${c.slug}`;
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={c.slug}
                  href={href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "text-muted hover:bg-background hover:text-foreground"
                  )}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </li>
  );
}
