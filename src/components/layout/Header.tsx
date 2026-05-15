import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import { getAllCategories } from "@/server/catalog";

export async function Header() {
  const categories = await getAllCategories();
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight gradient-text"
        >
          GGPoint
        </Link>

        <DesktopNav categories={cats} />

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label="Корзина"
            className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href="/account"
            aria-label="Аккаунт"
            className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <MobileNav categories={cats} />
        </div>
      </Container>
    </header>
  );
}
