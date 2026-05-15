import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata = { title: "Оформление заказа" };

export default function CheckoutPage() {
  return (
    <PlaceholderPage
      title="Оформление заказа"
      description="Форма доставки и оплаты появится на Phase 3."
      backHref="/cart"
      backLabel="В корзину"
    />
  );
}
