import type { LucideIcon } from "lucide-react";
import {
  Home,
  LayoutGrid,
  Keyboard,
  MousePointer2,
  Cpu,
  Info,
  Phone,
} from "lucide-react";

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
};

export const mainNav: readonly NavItem[] = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/catalog", label: "Каталог", icon: LayoutGrid },
  { href: "/keycaps", label: "Кейкапы", icon: Keyboard },
  { href: "/pads", label: "Коврики", icon: MousePointer2 },
  { href: "/motherboards", label: "MB", icon: Cpu },
  { href: "/about", label: "О нас", icon: Info },
  { href: "/contacts", label: "Контакты", icon: Phone },
] as const;
