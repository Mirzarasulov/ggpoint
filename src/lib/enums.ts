// Соответствия CHECK constraint'ам в БД. Если меняешь значения здесь —
// меняй также CHECK в Prisma миграции через `migrate dev --create-only`.

export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const DeliveryMethod = {
  PICKUP: "PICKUP",
  COURIER: "COURIER",
} as const;
export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod];

export const PaymentMethod = {
  CASH: "CASH",
  CARD_TRANSFER: "CARD_TRANSFER",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const ExchangeRateSource = {
  MANUAL: "MANUAL",
  CBU: "CBU",
  OPEN_EXCHANGE: "OPEN_EXCHANGE",
} as const;
export type ExchangeRateSource =
  (typeof ExchangeRateSource)[keyof typeof ExchangeRateSource];

export const AttributeType = {
  ENUM: "ENUM",
  STRING: "STRING",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
} as const;
export type AttributeType = (typeof AttributeType)[keyof typeof AttributeType];
