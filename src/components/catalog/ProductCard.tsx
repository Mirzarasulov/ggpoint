import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import { formatUzs } from "@/lib/format";
import type { ProductCardData } from "@/server/catalog";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const discount =
    product.oldPriceUzs && product.oldPriceUzs > product.priceUzs
      ? Math.round((1 - product.priceUzs / product.oldPriceUzs) * 100)
      : null;

  return (
    <Link
      href={`/catalog/${product.category.slug}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface/40 transition-colors hover:bg-surface/70"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : null}

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.isNew && (
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Новинка
            </span>
          )}
          {discount !== null && (
            <span className="inline-flex items-center gap-1 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              <Tag className="h-3 w-3" />−{discount}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <div className="text-xs uppercase tracking-wide text-muted">
            {product.brand.name}
          </div>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold sm:text-lg">
            {formatUzs(product.priceUzs)}
          </span>
          {product.oldPriceUzs && product.oldPriceUzs > product.priceUzs && (
            <span className="text-xs text-muted line-through">
              {formatUzs(product.oldPriceUzs)}
            </span>
          )}
        </div>
        {product.stock <= 0 ? (
          <div className="text-xs text-muted">Нет в наличии</div>
        ) : product.stock <= 3 ? (
          <div className="text-xs" style={{ color: "#f59e0b" }}>
            Осталось {product.stock} шт.
          </div>
        ) : null}
      </div>
    </Link>
  );
}
