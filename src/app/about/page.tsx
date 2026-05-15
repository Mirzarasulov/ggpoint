import { Container } from "@/components/layout/Container";

export const metadata = { title: "О нас" };

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          О <span className="gradient-text">GGPoint</span>
        </h1>
        <div className="mt-8 space-y-4 text-muted leading-relaxed">
          <p>
            GGPoint — магазин игровой периферии в Узбекистане. Мы привозим
            оригинальные товары от ведущих брендов и помогаем геймерам собрать
            сетап мечты.
          </p>
          <p>
            Доставка по Ташкенту — от одного дня, по регионам Узбекистана —
            от двух дней. Все товары проходят проверку перед отправкой.
          </p>
          <p>
            По любым вопросам пишите в Telegram или WhatsApp, указанные на
            странице контактов.
          </p>
        </div>
      </div>
    </Container>
  );
}
