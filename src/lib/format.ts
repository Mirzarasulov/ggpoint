// Форматирование чисел/денег под локаль ru-UZ.

export function formatUzs(amount: number): string {
  // 799000 → "799 000 сум"
  return `${new Intl.NumberFormat("ru-RU").format(amount)} сум`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}
