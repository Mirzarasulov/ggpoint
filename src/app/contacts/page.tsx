import { MessageCircle, MapPin, Clock, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";

export const metadata = { title: "Контакты" };

const items = [
  {
    icon: MapPin,
    title: "Адрес",
    value: "Ташкент, Узбекистан",
  },
  {
    icon: Clock,
    title: "Часы работы",
    value: "Ежедневно, 10:00 – 21:00",
  },
  {
    icon: Phone,
    title: "Телефон",
    value: "Скоро добавим",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    value: "Скоро добавим",
  },
] as const;

export default function ContactsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          <span className="gradient-text">Контакты</span>
        </h1>
        <p className="mt-3 text-muted">
          Свяжитесь с нами любым удобным способом.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className="rounded-xl border border-border bg-surface/40 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-bg">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  {it.title}
                </h3>
                <p className="mt-1 text-base text-foreground">{it.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
