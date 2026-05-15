import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductSpecs } from "@/components/catalog/ProductSpecs";
import { ProductCard } from "@/components/catalog/ProductCard";
import { formatUzs } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/server/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Товар не найден" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isActive) notFound();
  // Защита от подмены: товар обязан принадлежать категории из URL.
  if (product.category.slug !== category) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);

  const discount =
    product.oldPriceUzs && product.oldPriceUzs > product.priceUzs
      ? Math.round((1 - product.priceUzs / product.oldPriceUzs) * 100)
      : null;

  const categoryAttributes = product.category.categoryAttributes.map(
    (ca) => ca.attribute
  );

  const specs = (product.specs ?? {}) as Record<
    string,
    string | number | boolean | null
  >;

  return (
    <Container className="py-8 sm:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/catalog" className="hover:text-foreground transition-colors">Каталог</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/catalog/${product.category.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-5">
          {product.brand && (
            <Link
              href={`/catalog?brand=${product.brand.slug}`}
              className="self-start text-xs uppercase tracking-wide text-muted hover:text-foreground transition-colors"
            >
              {product.brand.name}
            </Link>
          )}

          <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground">
              {formatUzs(product.priceUzs)}
            </span>
            {product.oldPriceUzs && product.oldPriceUzs > product.priceUzs && (
              <>
                <span className="text-base text-muted line-through">
                  {formatUzs(product.oldPriceUzs)}
                </span>
                {discount !== null && (
                  <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    −{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                <span className="text-foreground">
                  В наличии
                  {product.stock <= 3 && (
                    <span className="text-muted"> · осталось {product.stock} шт.</span>
                  )}
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                <span className="text-muted">Нет в наличии</span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={product.stock <= 0}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg gradient-bg px-6 py-3 text-base font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" />
              В корзину
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-start gap-2 rounded-lg border border-border bg-surface/40 p-3 text-sm">
              <Truck className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <div className="font-medium text-foreground">Доставка</div>
                <div className="text-xs text-muted">по Ташкенту 1–2 дня</div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-border bg-surface/40 p-3 text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <div className="font-medium text-foreground">Оригинал</div>
                <div className="text-xs text-muted">с гарантией производителя</div>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="text-sm leading-relaxed text-muted">
              {product.description}
            </div>
          )}
        </div>
      </div>

      <section className="mt-12">
        <ProductSpecs specs={specs} attributes={categoryAttributes} />
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold sm:text-2xl">
            Похожие <span className="gradient-text">товары</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
