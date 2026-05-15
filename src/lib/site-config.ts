import type { LucideIcon } from "lucide-react";
import { LayoutGrid, Info, Phone } from "lucide-react";

export const siteConfig = {
  name: "GGPoint",
  title: "GGPoint — магазин игровой периферии",
  description:
    "Оригинальная игровая периферия: мыши, клавиатуры, наушники, кейкапы, материнские платы и коврики. Доставка по Ташкенту и Узбекистану.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  // Если задан — пункт показывает выпадающее меню с категориями (из БД).
  hasCategoriesSubmenu?: boolean;
};

// Верхнее меню — компактное: каталог (с submenu), о нас, контакты.
export const mainNav: readonly NavItem[] = [
  { href: "/catalog", label: "Каталог", icon: LayoutGrid, hasCategoriesSubmenu: true },
  { href: "/about", label: "О нас", icon: Info },
  { href: "/contacts", label: "Контакты", icon: Phone },
] as const;
