import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

// ---------- Currencies ----------

const currencies = [
  { code: "UZS", name: "Узбекский сум", symbol: "сум", decimals: 0, isBase: true,  sortOrder: 1 },
  { code: "USD", name: "Доллар США",    symbol: "$",   decimals: 2, isBase: false, sortOrder: 2 },
];

// Курсы — сколько UZS за 1 единицу. Стартовые значения, обновляются админом
// или через API ЦБ Узбекистана.
const exchangeRates: Record<string, string> = {
  UZS: "1",
  USD: "12500",
};

// ---------- Brands ----------

type BrandSlug =
  | "razer" | "logitech" | "keychron" | "akko" | "varmilo" | "artisan"
  | "asus" | "msi" | "asrock" | "hyperx" | "lg" | "samsung" | "dell";

const brands: Array<{ slug: BrandSlug; name: string; sortOrder: number }> = [
  { slug: "razer",    name: "Razer",    sortOrder: 1 },
  { slug: "logitech", name: "Logitech", sortOrder: 2 },
  { slug: "samsung",  name: "Samsung",  sortOrder: 3 },
  { slug: "lg",       name: "LG",       sortOrder: 4 },
  { slug: "dell",     name: "Dell",     sortOrder: 5 },
  { slug: "asus",     name: "ASUS",     sortOrder: 6 },
  { slug: "msi",      name: "MSI",      sortOrder: 7 },
  { slug: "asrock",   name: "ASRock",   sortOrder: 8 },
  { slug: "hyperx",   name: "HyperX",   sortOrder: 9 },
  { slug: "keychron", name: "Keychron", sortOrder: 10 },
  { slug: "akko",     name: "Akko",     sortOrder: 11 },
  { slug: "varmilo",  name: "Varmilo",  sortOrder: 12 },
  { slug: "artisan",  name: "Artisan",  sortOrder: 13 },
];

// ---------- Categories ----------

type CatSlug =
  | "mice" | "keyboards" | "keycaps" | "pads"
  | "motherboards" | "headphones" | "monitors";

const categories: Array<{ slug: CatSlug; name: string; sortOrder: number }> = [
  { slug: "mice",         name: "Мыши",              sortOrder: 1 },
  { slug: "keyboards",    name: "Клавиатуры",        sortOrder: 2 },
  { slug: "monitors",     name: "Мониторы",          sortOrder: 3 },
  { slug: "keycaps",      name: "Кейкапы",           sortOrder: 4 },
  { slug: "pads",         name: "Коврики",           sortOrder: 5 },
  { slug: "headphones",   name: "Наушники",          sortOrder: 6 },
  { slug: "motherboards", name: "Материнские платы", sortOrder: 7 },
];

// ---------- Attributes ----------

type AttrSlug =
  | "connection" | "sensor" | "dpi_max" | "weight_g" | "has_rgb"
  | "switch_type" | "layout" | "form_factor" | "socket" | "memory_type"
  | "has_wifi" | "m2_slots" | "material" | "profile" | "size" | "driver_size_mm"
  | "diagonal_inch" | "resolution" | "refresh_rate_hz" | "panel_type" | "response_time_ms";

const attributes: Array<{
  slug: AttrSlug;
  name: string;
  type: "ENUM" | "STRING" | "NUMBER" | "BOOLEAN";
  unit?: string;
  options?: string[];
}> = [
  // Универсальные
  { slug: "connection",    name: "Подключение", type: "ENUM",    options: ["Проводное", "Беспроводное", "Bluetooth"] },
  { slug: "has_rgb",       name: "RGB подсветка", type: "BOOLEAN" },

  // Мыши
  { slug: "sensor",        name: "Сенсор",        type: "STRING" },
  { slug: "dpi_max",       name: "Макс. DPI",     type: "NUMBER", unit: "DPI" },
  { slug: "weight_g",      name: "Вес",           type: "NUMBER", unit: "г" },

  // Клавиатуры
  { slug: "switch_type",   name: "Тип переключателей", type: "ENUM",
    options: ["Tactile", "Linear", "Clicky", "Optical", "Membrane"] },
  { slug: "layout",        name: "Раскладка", type: "ENUM",
    options: ["Full", "TKL", "75%", "65%", "60%"] },

  // Материнские платы
  { slug: "socket",        name: "Сокет",       type: "ENUM",
    options: ["AM4", "AM5", "LGA1700", "LGA1851"] },
  { slug: "memory_type",   name: "Тип памяти",  type: "ENUM",   options: ["DDR4", "DDR5"] },
  { slug: "form_factor",   name: "Форм-фактор", type: "ENUM",
    options: ["ATX", "mATX", "ITX", "E-ATX"] },
  { slug: "has_wifi",      name: "Wi-Fi",       type: "BOOLEAN" },
  { slug: "m2_slots",      name: "Слоты M.2",   type: "NUMBER" },

  // Кейкапы
  { slug: "material",      name: "Материал", type: "ENUM",
    options: ["PBT", "ABS", "Aluminum", "Tissue"] },
  { slug: "profile",       name: "Профиль",  type: "ENUM",
    options: ["Cherry", "OEM", "SA", "XDA", "MDA"] },

  // Коврики
  { slug: "size",          name: "Размер", type: "ENUM",
    options: ["S", "M", "L", "XL", "XXL"] },

  // Наушники
  { slug: "driver_size_mm", name: "Размер драйвера", type: "NUMBER", unit: "мм" },

  // Мониторы
  { slug: "diagonal_inch", name: "Диагональ", type: "NUMBER", unit: "″" },
  { slug: "resolution",    name: "Разрешение", type: "ENUM",
    options: ["1920×1080", "2560×1440", "3440×1440", "3840×2160"] },
  { slug: "refresh_rate_hz", name: "Частота обновления", type: "NUMBER", unit: "Гц" },
  { slug: "panel_type",    name: "Тип матрицы", type: "ENUM",
    options: ["IPS", "VA", "TN", "OLED"] },
  { slug: "response_time_ms", name: "Время отклика", type: "NUMBER", unit: "мс" },
];

// Какие атрибуты к каким категориям. sortOrder задаёт порядок в UI фильтров.
const categoryAttributeMap: Record<CatSlug, Array<{ attr: AttrSlug; isFilter?: boolean }>> = {
  mice: [
    { attr: "connection" },
    { attr: "sensor", isFilter: false },
    { attr: "dpi_max", isFilter: false },
    { attr: "weight_g", isFilter: false },
    { attr: "has_rgb" },
  ],
  keyboards: [
    { attr: "switch_type" },
    { attr: "layout" },
    { attr: "connection" },
    { attr: "has_rgb" },
  ],
  motherboards: [
    { attr: "socket" },
    { attr: "memory_type" },
    { attr: "form_factor" },
    { attr: "has_wifi" },
    { attr: "m2_slots", isFilter: false },
  ],
  keycaps: [
    { attr: "material" },
    { attr: "profile" },
    { attr: "layout" },
  ],
  pads: [
    { attr: "material" },
    { attr: "size" },
  ],
  headphones: [
    { attr: "connection" },
    { attr: "driver_size_mm", isFilter: false },
    { attr: "has_rgb" },
  ],
  monitors: [
    { attr: "diagonal_inch", isFilter: false },
    { attr: "resolution" },
    { attr: "refresh_rate_hz", isFilter: false },
    { attr: "panel_type" },
    { attr: "response_time_ms", isFilter: false },
  ],
};

// ---------- Products ----------

type ProductSeed = {
  slug: string;
  name: string;
  description: string;
  priceUzs: number;
  oldPriceUzs?: number;
  images: Array<{ url: string; alt?: string }>;
  stock: number;
  isNew?: boolean;
  categorySlug: CatSlug;
  brandSlug: BrandSlug;
  specs: Record<string, string | number | boolean>;
};

const products: ProductSeed[] = [
  // --- Мыши ---
  {
    slug: "razer-deathadder-v3",
    name: "Razer DeathAdder V3",
    description:
      "Эргономичная игровая мышь с сенсором Focus Pro 30K, 8 программируемых кнопок, вес 59 г. Идеальна для FPS и MOBA.",
    priceUzs: 799_000,
    oldPriceUzs: 899_000,
    images: [{ url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&q=80", alt: "Razer DeathAdder V3" }],
    stock: 12, isNew: true, categorySlug: "mice", brandSlug: "razer",
    specs: { connection: "Проводное", sensor: "Focus Pro 30K", dpi_max: 30000, weight_g: 59, has_rgb: true },
  },
  {
    slug: "logitech-g-pro-x-superlight",
    name: "Logitech G Pro X Superlight 2",
    description:
      "Беспроводная киберспортивная мышь, 63 г, сенсор HERO 2 32K DPI, до 95 часов работы.",
    priceUzs: 1_550_000,
    images: [{ url: "https://images.unsplash.com/photo-1615663249857-9c4e3f3a99d8?w=900&q=80", alt: "Logitech G Pro X Superlight 2" }],
    stock: 7, categorySlug: "mice", brandSlug: "logitech",
    specs: { connection: "Беспроводное", sensor: "HERO 2", dpi_max: 32000, weight_g: 63, has_rgb: false },
  },

  // --- Клавиатуры ---
  {
    slug: "logitech-g-pro-keyboard",
    name: "Logitech G Pro Keyboard",
    description:
      "Компактная механическая клавиатура с переключателями GX Blue, RGB-подсветка, съёмный USB-C кабель.",
    priceUzs: 1_299_000,
    images: [{ url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=900&q=80", alt: "Logitech G Pro Keyboard" }],
    stock: 9, categorySlug: "keyboards", brandSlug: "logitech",
    specs: { switch_type: "Clicky", layout: "TKL", connection: "Проводное", has_rgb: true },
  },
  {
    slug: "keychron-q1-pro",
    name: "Keychron Q1 Pro",
    description:
      "75% беспроводная клавиатура, алюминиевый корпус, hot-swap, gasket-mount, поддержка QMK/VIA.",
    priceUzs: 2_750_000,
    images: [{ url: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=900&q=80", alt: "Keychron Q1 Pro" }],
    stock: 4, isNew: true, categorySlug: "keyboards", brandSlug: "keychron",
    specs: { switch_type: "Tactile", layout: "75%", connection: "Беспроводное", has_rgb: true },
  },

  // --- Кейкапы ---
  {
    slug: "akko-clear-blue-keycaps",
    name: "Akko Clear Blue PBT Keycaps",
    description:
      "Набор кейкапов PBT, профиль Cherry, double-shot, 158 клавиш. Совместим с большинством механических клавиатур.",
    priceUzs: 420_000,
    images: [{ url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=900&q=80", alt: "Akko Clear Blue PBT" }],
    stock: 18, categorySlug: "keycaps", brandSlug: "akko",
    specs: { material: "PBT", profile: "Cherry", layout: "Full" },
  },
  {
    slug: "varmilo-sakura-keycaps",
    name: "Varmilo Sakura Keycaps",
    description:
      "Дизайнерский набор в тематике сакуры. PBT, dye-sub печать, 132 клавиши, профиль OEM.",
    priceUzs: 590_000,
    images: [{ url: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=900&q=80", alt: "Varmilo Sakura" }],
    stock: 6, categorySlug: "keycaps", brandSlug: "varmilo",
    specs: { material: "PBT", profile: "OEM", layout: "Full" },
  },

  // --- Коврики ---
  {
    slug: "razer-gigantus-v2",
    name: "Razer Gigantus V2 (XXL)",
    description:
      "Тканевый коврик 940×410 мм, толщина 4 мм, прорезиненное основание. Оптимизирован для оптических сенсоров.",
    priceUzs: 320_000,
    images: [{ url: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=900&q=80", alt: "Razer Gigantus V2" }],
    stock: 22, categorySlug: "pads", brandSlug: "razer",
    specs: { material: "Tissue", size: "XXL" },
  },
  {
    slug: "artisan-zero-xsoft-xl",
    name: "Artisan Zero XSoft XL",
    description:
      "Японский премиум-коврик, мягкое плетение, идеальный glide для эйминга. Размер XL 490×420 мм.",
    priceUzs: 780_000,
    images: [{ url: "https://images.unsplash.com/photo-1639936343105-cb95b50aaba1?w=900&q=80", alt: "Artisan Zero XSoft XL" }],
    stock: 3, isNew: true, categorySlug: "pads", brandSlug: "artisan",
    specs: { material: "Tissue", size: "XL" },
  },

  // --- Материнские платы ---
  {
    slug: "asus-rog-strix-b650e-f",
    name: "ASUS ROG Strix B650E-F Gaming WIFI",
    description:
      "AM5, DDR5, PCIe 5.0, Wi-Fi 6E, 3× M.2, Aura Sync RGB. Под Ryzen 7000-серии.",
    priceUzs: 4_650_000,
    images: [{ url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=900&q=80", alt: "ASUS ROG Strix B650E-F" }],
    stock: 5, categorySlug: "motherboards", brandSlug: "asus",
    specs: { socket: "AM5", memory_type: "DDR5", form_factor: "ATX", has_wifi: true, m2_slots: 3 },
  },
  {
    slug: "msi-mag-z790-tomahawk",
    name: "MSI MAG Z790 Tomahawk WIFI",
    description:
      "LGA 1700, DDR5, PCIe 5.0 x16, 4× M.2, Wi-Fi 6E. Совместима с Intel Core 13/14-го поколения.",
    priceUzs: 5_200_000,
    images: [{ url: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=900&q=80", alt: "MSI MAG Z790 Tomahawk" }],
    stock: 4, categorySlug: "motherboards", brandSlug: "msi",
    specs: { socket: "LGA1700", memory_type: "DDR5", form_factor: "ATX", has_wifi: true, m2_slots: 4 },
  },
  {
    slug: "asrock-b550m-pro4",
    name: "ASRock B550M Pro4",
    description:
      "Бюджетная mATX плата под AM4, DDR4, PCIe 4.0, без Wi-Fi. Хороший выбор для Ryzen 5000.",
    priceUzs: 1_950_000,
    images: [{ url: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=900&q=80", alt: "ASRock B550M Pro4" }],
    stock: 6, categorySlug: "motherboards", brandSlug: "asrock",
    specs: { socket: "AM4", memory_type: "DDR4", form_factor: "mATX", has_wifi: false, m2_slots: 2 },
  },

  // --- Мониторы ---
  {
    slug: "lg-ultragear-27gp850",
    name: "LG UltraGear 27GP850",
    description:
      "27\" IPS QHD 165 Гц, 1 мс GtG, NVIDIA G-SYNC Compatible, HDR10. Идеален для соревновательных шутеров.",
    priceUzs: 4_900_000,
    images: [{ url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=80", alt: "LG UltraGear 27GP850" }],
    stock: 6, isNew: true, categorySlug: "monitors", brandSlug: "lg",
    specs: { diagonal_inch: 27, resolution: "2560×1440", refresh_rate_hz: 165, panel_type: "IPS", response_time_ms: 1 },
  },
  {
    slug: "samsung-odyssey-g7-32",
    name: "Samsung Odyssey G7 32\"",
    description:
      "32\" изогнутая VA 1440p, 240 Гц, 1 мс. FreeSync Premium Pro, HDR600. Премиум-уровень для геймеров.",
    priceUzs: 7_500_000,
    images: [{ url: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=900&q=80", alt: "Samsung Odyssey G7 32" }],
    stock: 3, categorySlug: "monitors", brandSlug: "samsung",
    specs: { diagonal_inch: 32, resolution: "2560×1440", refresh_rate_hz: 240, panel_type: "VA", response_time_ms: 1 },
  },
  {
    slug: "dell-s2421hgf",
    name: "Dell S2421HGF",
    description:
      "24\" Full HD TN 144 Гц, 1 мс. Бюджетный игровой монитор с быстрой матрицей.",
    priceUzs: 2_300_000,
    images: [{ url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=900&q=80", alt: "Dell S2421HGF" }],
    stock: 9, categorySlug: "monitors", brandSlug: "dell",
    specs: { diagonal_inch: 24, resolution: "1920×1080", refresh_rate_hz: 144, panel_type: "TN", response_time_ms: 1 },
  },

  // --- Наушники ---
  {
    slug: "hyperx-cloud-iii-wireless",
    name: "HyperX Cloud III Wireless",
    description:
      "Беспроводные игровые наушники, 53-мм драйверы, до 120 часов работы, DTS Headphone:X.",
    priceUzs: 2_100_000,
    images: [{ url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&q=80", alt: "HyperX Cloud III Wireless" }],
    stock: 8, categorySlug: "headphones", brandSlug: "hyperx",
    specs: { connection: "Беспроводное", driver_size_mm: 53, has_rgb: false },
  },
];

// ---------- Main ----------

async function main() {
  // 1. Currencies
  console.log("⏳ Seeding currencies...");
  for (const c of currencies) {
    await db.currency.upsert({
      where: { code: c.code },
      update: { name: c.name, symbol: c.symbol, decimals: c.decimals, isBase: c.isBase, sortOrder: c.sortOrder },
      create: c,
    });
  }
  console.log(`   ✓ ${currencies.length} currencies`);

  // 2. Exchange rates (только если нет ни одной записи на валюту)
  console.log("⏳ Seeding initial exchange rates...");
  let newRates = 0;
  for (const [code, rate] of Object.entries(exchangeRates)) {
    const existing = await db.exchangeRate.findFirst({ where: { currencyCode: code } });
    if (!existing) {
      await db.exchangeRate.create({
        data: { currencyCode: code, rateUzs: rate, source: "MANUAL" },
      });
      newRates++;
    }
  }
  console.log(`   ✓ ${newRates} new rates`);

  // 3. Brands
  console.log("⏳ Seeding brands...");
  const brandMap: Record<BrandSlug, string> = {} as Record<BrandSlug, string>;
  for (const b of brands) {
    const row = await db.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, sortOrder: b.sortOrder },
      create: b,
    });
    brandMap[b.slug] = row.id;
  }
  console.log(`   ✓ ${brands.length} brands`);

  // 4. Categories
  console.log("⏳ Seeding categories...");
  const catMap: Record<CatSlug, string> = {} as Record<CatSlug, string>;
  for (const c of categories) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    catMap[c.slug] = row.id;
  }
  console.log(`   ✓ ${categories.length} categories`);

  // 5. Attributes
  console.log("⏳ Seeding attributes...");
  const attrMap: Record<AttrSlug, string> = {} as Record<AttrSlug, string>;
  for (const a of attributes) {
    const row = await db.attribute.upsert({
      where: { slug: a.slug },
      update: { name: a.name, type: a.type, unit: a.unit ?? null, options: a.options ?? [] },
      create: { slug: a.slug, name: a.name, type: a.type, unit: a.unit, options: a.options ?? [] },
    });
    attrMap[a.slug] = row.id;
  }
  console.log(`   ✓ ${attributes.length} attributes`);

  // 6. Category-attribute mapping
  console.log("⏳ Seeding category-attribute mapping...");
  let catAttrCount = 0;
  for (const [catSlug, attrs] of Object.entries(categoryAttributeMap) as Array<[CatSlug, typeof categoryAttributeMap[CatSlug]]>) {
    let sortOrder = 0;
    for (const link of attrs) {
      await db.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: catMap[catSlug],
            attributeId: attrMap[link.attr],
          },
        },
        update: { isFilter: link.isFilter ?? true, sortOrder },
        create: {
          categoryId: catMap[catSlug],
          attributeId: attrMap[link.attr],
          isFilter: link.isFilter ?? true,
          sortOrder,
        },
      });
      sortOrder++;
      catAttrCount++;
    }
  }
  console.log(`   ✓ ${catAttrCount} category-attribute links`);

  // 7. Products + images
  console.log("⏳ Seeding products...");
  for (const p of products) {
    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        priceUzs: p.priceUzs,
        oldPriceUzs: p.oldPriceUzs ?? null,
        stock: p.stock,
        isNew: p.isNew ?? false,
        categoryId: catMap[p.categorySlug],
        brandId: brandMap[p.brandSlug],
        specs: p.specs,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceUzs: p.priceUzs,
        oldPriceUzs: p.oldPriceUzs,
        stock: p.stock,
        isNew: p.isNew ?? false,
        category: { connect: { id: catMap[p.categorySlug] } },
        brand: { connect: { id: brandMap[p.brandSlug] } },
        specs: p.specs,
      },
    });

    // Заменяем все картинки (delete + create)
    await db.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      await db.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          alt: img.alt ?? p.name,
          sortOrder: i,
          isPrimary: i === 0,
        },
      });
    }
  }
  console.log(`   ✓ ${products.length} products with images & specs`);

  await db.$disconnect();
  console.log("✅ Seed done");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
