// Server Component — общий "вид каталога" для обеих страниц:
// /catalog (без категории) и /catalog/[category] (категория зашита).
//
// Принимает уже распаршенные filters и сам делает все запросы к БД.
import { Container } from "@/components/layout/Container";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { MobileFiltersSheet } from "@/components/catalog/MobileFiltersSheet";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SortControl } from "@/components/catalog/SortControl";
import {
  getAllBrands,
  getAllCategories,
  getFilterAttributesForCategory,
  getProducts,
  type CatalogFilters as Filters,
} from "@/server/catalog";

export async function CatalogView({
  filters,
  title,
}: {
  filters: Filters;
  title: string;
}) {
  const [categories, brands, attributes, products] = await Promise.all([
    getAllCategories(),
    getAllBrands(),
    filters.categorySlug
      ? getFilterAttributesForCategory(filters.categorySlug)
      : Promise.resolve([]),
    getProducts(filters),
  ]);

  return (
    <Container className="py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">
          Найдено товаров:{" "}
          <span className="font-medium text-foreground">{products.length}</span>
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <CatalogFilters
            categories={categories}
            brands={brands}
            attributes={attributes}
          />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <MobileFiltersSheet>
              <CatalogFilters
                categories={categories}
                brands={brands}
                attributes={attributes}
              />
            </MobileFiltersSheet>
            <SortControl current={filters.sort ?? "new"} />
          </div>

          {products.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface/40 p-10 text-center text-muted">
              По выбранным фильтрам ничего не найдено. Попробуй сбросить часть фильтров.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}

// Парсит URL search params в Filters. Используется обеими страницами.
export function parseCatalogSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): Omit<Filters, "categorySlug"> {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const brandRaw = get("brand");
  const brandSlugs = brandRaw ? brandRaw.split(",").filter(Boolean) : undefined;

  const reserved = new Set(["category", "brand", "sort", "page"]);
  const specs: Record<string, string[]> = {};
  for (const [k, raw] of Object.entries(searchParams)) {
    if (reserved.has(k)) continue;
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (!v) continue;
    specs[k] = v.split(",").filter(Boolean);
  }

  const sortRaw = get("sort");
  const sort: Filters["sort"] =
    sortRaw === "price_asc" || sortRaw === "price_desc" || sortRaw === "new"
      ? sortRaw
      : "new";

  return { brandSlugs, specs, sort };
}
