import Link from "next/link";
import {
  ArrowRight,
  Keyboard,
  MousePointer2,
  Cpu,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
} from "lucide-react";
import { Container } from "@/components/layout/Container";

const categories = [
  {
    href: "/catalog/keycaps",
    title: "Кейкапы",
    description: "PBT, ABS, тематические наборы",
    icon: Keyboard,
  },
  {
    href: "/catalog/pads",
    title: "Коврики",
    description: "От компактных до полноразмерных XL",
    icon: MousePointer2,
  },
  {
    href: "/catalog/motherboards",
    title: "Материнские платы",
    description: "Intel и AMD, актуальные сокеты",
    icon: Cpu,
  },
] as const;

const features = [
  {
    icon: ShieldCheck,
    title: "Оригинал",
    text: "Только официальные товары с гарантией",
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    text: "По Ташкенту от 1 дня, по Узбекистану — от 2",
  },
  {
    icon: CreditCard,
    title: "Удобная оплата",
    text: "Click, Payme, наличные при получении",
  },
  {
    icon: Headphones,
    title: "Поддержка",
    text: "Подскажем по совместимости и характеристикам",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#2563eb,transparent)]" />
          <div className="absolute -bottom-40 right-1/3 h-96 w-[40rem] rounded-full bg-[radial-gradient(closest-side,#7c3aed,transparent)]" />
        </div>
        <Container className="py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-border bg-surface/50 px-3 py-1 text-xs font-medium text-muted">
              Официальный каталог
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              GGPoint —{" "}
              <span className="gradient-text">игровая периферия</span>{" "}
              премиум-класса
            </h1>
            <p className="mt-6 text-base text-muted sm:text-lg">
              Оригинальные товары по лучшим ценам. Быстрая доставка по Ташкенту
              и Узбекистану.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/catalog"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg gradient-bg px-6 py-3 text-base font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
              >
                Перейти в каталог
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border bg-surface/40 px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-surface"
              >
                О магазине
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Популярные <span className="gradient-text">категории</span>
            </h2>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
            >
              Весь каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-surface/40 p-6 transition-all hover:bg-surface/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-bg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{cat.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-muted transition-colors group-hover:text-foreground">
                    Перейти <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <Container>
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
            Почему <span className="gradient-text">GGPoint</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-surface/40 p-5"
                >
                  <Icon className="h-6 w-6" style={{ color: "#7c3aed" }} />
                  <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted">{f.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
