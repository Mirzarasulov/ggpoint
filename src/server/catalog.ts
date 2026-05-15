import "server-only";

import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export type CatalogFilters = {
  categorySlug?: string;
  brandSlugs?: string[];
  // Динамические фильтры из category_attributes:
  // { socket: ["AM5"], memory_type: ["DDR4", "DDR5"], has_wifi: ["true"] }
  specs?: Record<string, string[]>;
  // Сортировка по новизне (default) или цене.
  sort?: "new" | "price_asc" | "price_desc";
};

// Список всех категорий для UI (sidebar и пр.).
export async function getAllCategories() {
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

// Категория по slug — для страниц `/catalog/[category]`. null если не найдена.
export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true },
  });
}

// Все активные бренды для UI.
export async function getAllBrands() {
  return db.brand.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

// Атрибуты, прикреплённые к категории, помеченные как isFilter.
// Используется для рендеринга динамических фильтров sidebar.
export async function getFilterAttributesForCategory(categorySlug: string) {
  const category = await db.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });
  if (!category) return [];

  const rows = await db.categoryAttribute.findMany({
    where: { categoryId: category.id, isFilter: true },
    orderBy: { sortOrder: "asc" },
    select: {
      attribute: {
        select: { slug: true, name: true, type: true, unit: true, options: true },
      },
    },
  });
  return rows.map((r) => r.attribute);
}

// Главный запрос каталога. Возвращает товары + связи под карточки.
export async function getProducts(filters: CatalogFilters) {
  const { categorySlug, brandSlugs, specs, sort = "new" } = filters;

  // category и brand резолвим через nested where, не через дополнительные запросы.
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(brandSlugs && brandSlugs.length
      ? { brand: { slug: { in: brandSlugs } } }
      : {}),
  };

  // Фильтрация по specs — каждое поле может иметь несколько значений (OR
  // внутри одного атрибута, AND между атрибутами).
  if (specs) {
    const andConditions = Object.entries(specs)
      .filter(([, vals]) => vals.length > 0)
      .map(([key, vals]) => ({
        OR: vals.map((rawValue) => {
          // BOOLEAN ("true"/"false") и NUMBER могут приходить как строки из
          // URL; пытаемся восстановить тип, иначе сравниваем как строку.
          const coerced =
            rawValue === "true" ? true
            : rawValue === "false" ? false
            : /^-?\d+(\.\d+)?$/.test(rawValue) ? Number(rawValue)
            : rawValue;
          return { specs: { path: [key], equals: coerced } };
        }),
      }));
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }
  }

  const orderBy =
    sort === "price_asc" ? { priceUzs: "asc" as const }
    : sort === "price_desc" ? { priceUzs: "desc" as const }
    : { createdAt: "desc" as const };

  return db.product.findMany({
    where,
    orderBy,
    include: {
      brand: { select: { slug: true, name: true } },
      category: { select: { slug: true, name: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
    },
  });
}

export type ProductCardData = Awaited<ReturnType<typeof getProducts>>[number];

// Карточка отдельного товара со всеми связями для product detail page.
export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: {
      brand: { select: { slug: true, name: true } },
      category: {
        select: {
          slug: true,
          name: true,
          categoryAttributes: {
            orderBy: { sortOrder: "asc" },
            select: {
              attribute: {
                select: { slug: true, name: true, type: true, unit: true },
              },
            },
          },
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { url: true, alt: true },
      },
    },
  });
}

export type ProductDetailData = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

// Похожие товары той же категории, исключая сам товар.
export async function getRelatedProducts(productId: string, categoryId: string, take = 4) {
  return db.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: productId },
    },
    take,
    orderBy: { createdAt: "desc" },
    include: {
      brand: { select: { slug: true, name: true } },
      category: { select: { slug: true, name: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
    },
  });
}
