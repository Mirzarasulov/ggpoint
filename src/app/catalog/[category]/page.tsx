import { notFound } from "next/navigation";
import {
  CatalogView,
  parseCatalogSearchParams,
} from "@/components/catalog/CatalogView";
import { getCategoryBySlug } from "@/server/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Категория не найдена" };
  return { title: cat.name };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const sp = await searchParams;
  const baseFilters = parseCatalogSearchParams(sp);

  return (
    <CatalogView
      filters={{ ...baseFilters, categorySlug: cat.slug }}
      title={cat.name}
    />
  );
}
