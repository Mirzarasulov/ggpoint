import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata = { title: "Корзина" };

export default function CartPage() {
  return (
    <PlaceholderPage
      title="Корзина"
      description="Корзина появится после подключения каталога — Phase 3."
      backHref="/catalog"
      backLabel="В каталог"
    />
  );
}
