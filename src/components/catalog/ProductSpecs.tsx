import { formatNumber } from "@/lib/format";

type SpecValue = string | number | boolean | null;

type Attr = {
  slug: string;
  name: string;
  type: string;
  unit: string | null;
};

export function ProductSpecs({
  specs,
  attributes,
}: {
  specs: Record<string, SpecValue>;
  attributes: Attr[];
}) {
  // Показываем только те значения, что описаны в category_attributes (контролируемый список).
  const rows = attributes
    .map((a) => ({ attr: a, value: specs[a.slug] }))
    .filter((r) => r.value !== null && r.value !== undefined);

  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface/40">
      <div className="border-b border-border px-5 py-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Характеристики
      </div>
      <dl className="divide-y divide-border">
        {rows.map(({ attr, value }) => (
          <div
            key={attr.slug}
            className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <dt className="text-sm text-muted">{attr.name}</dt>
            <dd className="text-sm font-medium text-foreground">
              {formatSpec(attr, value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatSpec(attr: Attr, value: SpecValue): string {
  if (attr.type === "BOOLEAN") return value ? "Да" : "Нет";
  if (attr.type === "NUMBER" && typeof value === "number") {
    return `${formatNumber(value)}${attr.unit ? ` ${attr.unit}` : ""}`;
  }
  return String(value);
}
