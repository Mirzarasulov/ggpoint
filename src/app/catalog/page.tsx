import {
  CatalogView,
  parseCatalogSearchParams,
} from "@/components/catalog/CatalogView";

export const metadata = { title: "Каталог" };

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCatalogSearchParams(params);
  return <CatalogView filters={filters} title="Каталог" />;
}
