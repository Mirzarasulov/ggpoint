import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata = { title: "Товар" };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PlaceholderPage
      title={`Товар: ${slug}`}
      description="Страница товара с галереей, характеристиками и кнопкой добавления в корзину будет здесь."
      backHref="/catalog"
      backLabel="В каталог"
    />
  );
}
