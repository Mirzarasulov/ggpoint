import Link from "next/link";
import { Container } from "./Container";
import { mainNav } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface/30">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="text-xl font-extrabold tracking-tight gradient-text">
              GGPoint
            </div>
            <p className="text-sm text-muted max-w-xs">
              Игровая периферия премиум-класса. Доставка по Ташкенту и Узбекистану.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Каталог
            </h3>
            <ul className="space-y-2 text-sm">
              {mainNav.slice(1, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Помощь
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contacts"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/tracking"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Отслеживание заказа
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Контакты
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>Ташкент, Узбекистан</li>
              <li>10:00 – 21:00 ежедневно</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} GGPoint. Все права защищены.</span>
          <span>Сделано в Ташкенте</span>
        </div>
      </Container>
    </footer>
  );
}
