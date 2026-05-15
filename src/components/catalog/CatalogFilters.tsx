"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { slug: string; name: string };

type Attribute = {
  slug: string;
  name: string;
  type: string;
  unit: string | null;
  options: string[];
};

export function CatalogFilters({
  categories,
  brands,
  attributes,
}: {
  categories: Option[];
  brands: Option[];
  attributes: Attribute[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  // Текущий выбор по фильтрам (мульти-значения через comma).
  const selectedCategory = params.get("category");
  const selectedBrands = params.get("brand")?.split(",").filter(Boolean) ?? [];

  const specsParams: Record<string, string[]> = {};
  for (const a of attributes) {
    const v = params.get(a.slug);
    if (v) specsParams[a.slug] = v.split(",").filter(Boolean);
  }

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (!value) next.delete(key);
      else next.set(key, value);
      // При смене категории сбрасываем все динамические фильтры (они другие).
      if (key === "category") {
        for (const a of attributes) next.delete(a.slug);
      }
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [params, pathname, router, attributes]
  );

  const toggleInList = useCallback(
    (key: string, value: string) => {
      const current = params.get(key)?.split(",").filter(Boolean) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateParam(key, next.length ? next.join(",") : null);
    },
    [params, updateParam]
  );

  const hasAnyFilter =
    selectedCategory || selectedBrands.length > 0 ||
    Object.values(specsParams).some((v) => v.length > 0);

  const clearAll = () => {
    startTransition(() => router.push(pathname));
  };

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" /> Сбросить
          </button>
        )}
      </div>

      {/* Категория */}
      <FilterSection title="Категория">
        <div className="flex flex-col gap-1">
          <FilterRadio
            label="Все категории"
            checked={!selectedCategory}
            onChange={() => updateParam("category", null)}
          />
          {categories.map((c) => (
            <FilterRadio
              key={c.slug}
              label={c.name}
              checked={selectedCategory === c.slug}
              onChange={() => updateParam("category", c.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Бренд */}
      <FilterSection title="Бренд">
        <div className="flex flex-col gap-1">
          {brands.map((b) => (
            <FilterCheckbox
              key={b.slug}
              label={b.name}
              checked={selectedBrands.includes(b.slug)}
              onChange={() => toggleInList("brand", b.slug)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Динамические атрибуты (только если выбрана категория) */}
      {selectedCategory && attributes.length > 0 && (
        <>
          {attributes.map((attr) => (
            <FilterSection
              key={attr.slug}
              title={attr.unit ? `${attr.name}, ${attr.unit}` : attr.name}
            >
              {attr.type === "BOOLEAN" ? (
                <div className="flex flex-col gap-1">
                  <FilterCheckbox
                    label="Только с этим"
                    checked={specsParams[attr.slug]?.includes("true")}
                    onChange={() =>
                      toggleInList(attr.slug, "true")
                    }
                  />
                </div>
              ) : attr.type === "ENUM" ? (
                <div className="flex flex-col gap-1">
                  {attr.options.map((opt) => (
                    <FilterCheckbox
                      key={opt}
                      label={opt}
                      checked={specsParams[attr.slug]?.includes(opt)}
                      onChange={() => toggleInList(attr.slug, opt)}
                    />
                  ))}
                </div>
              ) : null}
            </FilterSection>
          ))}
        </>
      )}
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-4 first:border-0 first:pt-0">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean | undefined;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-9 cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-surface",
        checked ? "text-foreground" : "text-muted"
      )}
    >
      <input
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-blue-600"
      />
      <span className="select-none">{label}</span>
    </label>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-9 cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-surface",
        checked ? "text-foreground" : "text-muted"
      )}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-blue-600"
      />
      <span className="select-none">{label}</span>
    </label>
  );
}
