import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight gradient-text"
        >
          GGPoint
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label="Корзина"
            className="hidden md:inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href="/account"
            aria-label="Аккаунт"
            className="hidden md:inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
