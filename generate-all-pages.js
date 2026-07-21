// generate-all-pages.js
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

// ====== КОНФИГ ======
const firebaseConfig = {
    apiKey: "AIzaSyDcyOWAF7TA8h8P36Sk5EbDPzA9sEFuTXo",
    authDomain: "ggpoint-shop.firebaseapp.com",
    databaseURL: "https://ggpoint-shop-default-rtdb.firebaseio.com",
    projectId: "ggpoint-shop",
    storageBucket: "ggpoint-shop.firebasestorage.app",
    messagingSenderId: "182227173652",
    appId: "1:182227173652:web:0949e2edae9900afd98201"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ====== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        if (m === "'") return '&#039;';
        return m;
    });
}

function generateSlug(name) {
    if (!name) return 'product';
    return String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function formatPrice(price) {
    if (!price) return 'Цена не указана';
    return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
}

function getCategoryName(key) {
    const cats = { 
        'мышь': 'Игровая мышь', 
        'клавиатура': 'Клавиатура', 
        'наушники': 'Наушники', 
        'монитор': 'Монитор', 
        'keycaps': 'Кейкапы', 
        'pads': 'Коврик', 
        'mb': 'Материнская плата' 
    };
    return cats[key] || key || 'Товар';
}

// ====== ГЕНЕРАЦИЯ HTML СТРАНИЦЫ ======
function generateProductPage(product, id) {
    const slug = generateSlug(product.name);
    const title = `${product.name} купить в Узбекистане | GGPoint`;
    const description = product.description || `Купить ${product.name} в Узбекистане. Оригинальный товар, гарантия, доставка.`;
    const image = product.images?.[0] || 'https://mirzarasulov.github.io/ggpoint/images/default-product.jpg';
    const price = formatPrice(product.price);
    const category = getCategoryName(product.category);
    const brand = product.brand || '';
    
    // Характеристики
    let specsHtml = '';
    if (product.specs) {
        for (const [key, value] of Object.entries(product.specs)) {
            specsHtml += `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(value)}</td></tr>`;
        }
    }

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ====== ОСНОВНЫЕ SEO ТЕГИ ====== -->
    <title>${title}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(product.name)}, купить, Узбекистан, ${brand}, игровая периферия, цена">
    <link rel="canonical" href="https://mirzarasulov.github.io/ggpoint/product/${slug}-${id}.html">
    
    <!-- ====== OPEN GRAPH (для соцсетей) ====== -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="https://mirzarasulov.github.io/ggpoint/product/${slug}-${id}.html">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="GGPoint">
    <meta property="product:price:amount" content="${product.price || 0}">
    <meta property="product:price:currency" content="UZS">
    
    <!-- ====== TWITTER CARD ====== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${image}">
    
    <!-- ====== SCHEMA.ORG (структурированные данные) ====== -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "${escapeHtml(product.name)}",
        "description": "${escapeHtml(description)}",
        "image": "${image}",
        "sku": "${id}",
        "brand": {
            "@type": "Brand",
            "name": "${escapeHtml(brand)}"
        },
        "category": "${category}",
        "offers": {
            "@type": "Offer",
            "price": "${product.price || 0}",
            "priceCurrency": "UZS",
            "availability": "https://schema.org/InStock",
            "url": "https://mirzarasulov.github.io/ggpoint/product/${slug}-${id}.html"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${product.rating || 4.5}",
            "reviewCount": "${product.reviews || 0}"
        }
    }
    </script>
    
    <!-- ====== ДЛЯ ПОИСКОВИКОВ ====== -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    
    <style>
        /* ====== БАЗОВЫЕ СТИЛИ ====== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0f1a;
            color: #fff;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        /* ====== ХЕДЕР ====== */
        header {
            background: rgba(10, 15, 26, 0.95);
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(37, 99, 235, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 800;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: #94a3b8;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #fff;
        }
        
        /* ====== СТРАНИЦА ТОВАРА ====== */
        .product-page {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin-top: 2rem;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .product-image-main {
            width: 100%;
            max-height: 500px;
            object-fit: contain;
            background: white;
            border-radius: 16px;
            padding: 1rem;
        }
        
        .product-title {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #f1f5f9;
        }
        
        .product-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .product-category {
            background: rgba(37, 99, 235, 0.2);
            color: #60a5fa;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
        }
        
        .product-brand {
            color: #94a3b8;
            font-size: 0.85rem;
        }
        
        .product-price {
            font-size: 2.5rem;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(37, 99, 235, 0.1);
            border-radius: 12px;
            border: 1px solid rgba(37, 99, 235, 0.3);
        }
        
        .product-description {
            color: #94a3b8;
            line-height: 1.8;
            margin-bottom: 2rem;
            font-size: 1rem;
        }
        
        .product-specs {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .product-specs h2 {
            color: #f1f5f9;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .specs-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .specs-table tr {
            border-bottom: 1px solid #334155;
        }
        
        .specs-table td {
            padding: 0.8rem;
            color: #94a3b8;
            font-size: 0.9rem;
        }
        
        .specs-table td:first-child {
            color: #f1f5f9;
            font-weight: 600;
            width: 200px;
        }
        
        .product-gallery {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .product-gallery img {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s;
        }
        
        .product-gallery img:hover {
            border-color: #2563eb;
        }
        
        .btn-buy {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #fff;
            padding: 1rem 2rem;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            margin-top: 1rem;
        }
        
        .btn-buy:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
        }
        
        /* ====== ПОХОЖИЕ ТОВАРЫ ====== */
        .related-products {
            margin-top: 3rem;
        }
        
        .related-products h2 {
            color: #f1f5f9;
            margin-bottom: 1.5rem;
        }
        
        .related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .related-card {
            background: rgba(30, 41, 59, 0.3);
            border-radius: 16px;
            padding: 1rem;
            text-align: center;
            transition: all 0.3s;
            border: 1px solid rgba(37, 99, 235, 0.1);
            cursor: pointer;
        }
        
        .related-card:hover {
            transform: translateY(-5px);
            border-color: #2563eb;
        }
        
        .related-card img {
            width: 100%;
            height: 120px;
            object-fit: contain;
            background: white;
            border-radius: 8px;
        }
        
        .related-card h3 {
            color: #f1f5f9;
            font-size: 0.9rem;
            margin: 0.5rem 0;
        }
        
        .related-card .price {
            color: #2563eb;
            font-weight: 600;
        }
        
        /* ====== ФУТЕР ====== */
        footer {
            background: #0a0f1a;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
            margin-top: 3rem;
            padding: 2rem;
            text-align: center;
            color: #64748b;
        }
        
        /* ====== АДАПТИВ ====== */
        @media (max-width: 768px) {
            .product-grid {
                grid-template-columns: 1fr;
            }
            
            .product-title {
                font-size: 1.5rem;
            }
            
            .product-price {
                font-size: 2rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .product-gallery {
                grid-template-columns: repeat(4, 1fr);
            }
            
            .specs-table td:first-child {
                width: 100px;
            }
        }
    </style>
</head>
<body>
    <!-- ====== ХЕДЕР ====== -->
    <header>
        <div class="header-container">
            <a href="https://mirzarasulov.github.io/ggpoint/" class="logo">GGPoint</a>
            <ul class="nav-links">
                <li><a href="https://mirzarasulov.github.io/ggpoint/catalog.html">Каталог</a></li>
                <li><a href="https://mirzarasulov.github.io/ggpoint/about.html">О нас</a></li>
                <li><a href="https://mirzarasulov.github.io/ggpoint/contacts.html">Контакты</a></li>
            </ul>
        </div>
    </header>

    <!-- ====== ОСНОВНОЙ КОНТЕНТ ====== -->
    <div class="container">
        <div class="product-page">
            <div class="product-grid">
                <!-- Левая колонка - фото -->
                <div>
                    <img src="${image}" alt="${escapeHtml(product.name)}" class="product-image-main">
                    ${product.images && product.images.length > 1 ? `
                    <div class="product-gallery">
                        ${product.images.slice(1, 5).map(img => `
                            <img src="${img}" alt="${escapeHtml(product.name)}" onclick="this.parentElement.parentElement.querySelector('.product-image-main').src='${img}'">
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <!-- Правая колонка - информация -->
                <div>
                    <h1 class="product-title">${escapeHtml(product.name)}</h1>
                    
                    <div class="product-meta">
                        <span class="product-category">${category}</span>
                        ${brand ? `<span class="product-brand">🏷️ ${escapeHtml(brand)}</span>` : ''}
                        <span class="product-brand">📦 Артикул: ${id}</span>
                    </div>
                    
                    <div class="product-price">${price}</div>
                    
                    <div class="product-description">
                        ${escapeHtml(description)}
                    </div>
                    
                    <a href="https://mirzarasulov.github.io/ggpoint/product.html?id=${id}" class="btn-buy">
                        🛒 Подробнее на сайте
                    </a>
                </div>
            </div>
            
            <!-- Характеристики -->
            ${specsHtml ? `
            <div class="product-specs">
                <h2>📋 Характеристики ${escapeHtml(product.name)}</h2>
                <table class="specs-table">
                    ${specsHtml}
                </table>
            </div>
            ` : ''}
        </div>
    </div>

    <!-- ====== ФУТЕР ====== -->
    <footer>
        <p>© 2025 GGPoint - Игровая периферия в Узбекистане</p>
        <p style="margin-top:0.5rem; font-size:0.8rem;">
            <a href="https://mirzarasulov.github.io/ggpoint/" style="color:#64748b;">Главная</a> | 
            <a href="https://mirzarasulov.github.io/ggpoint/catalog.html" style="color:#64748b;">Каталог</a> | 
            <a href="https://t.me/GGPointUz" style="color:#64748b;">Telegram</a>
        </p>
    </footer>

    <!-- ====== СКРИПТ ДЛЯ АНАЛИТИКИ ====== -->
    <script>
        // Яндекс.Метрика (добавьте свой код)
        // Google Analytics (добавьте свой код)
        
        // Консольное сообщение для проверки индексации
        console.log('✅ Страница товара: ${escapeHtml(product.name)}');
        console.log('✅ Артикул: ${id}');
        console.log('✅ Цена: ${price}');
    </script>
</body>
</html>`;
}

// ====== ГЕНЕРАЦИЯ ВСЕХ СТРАНИЦ ======
async function generateAllPages() {
    console.log('🚀 Начинаем генерацию страниц...');
    
    try {
        // Получаем все товары
        const productsRef = ref(db, 'products');
        const snapshot = await get(productsRef);
        const products = snapshot.val();
        
        if (!products) {
            console.log('❌ Товары не найдены!');
            return;
        }
        
        // Создаем папку
        if (!fs.existsSync('product')) {
            fs.mkdirSync('product');
        }
        
        let sitemapUrls = [];
        let productCount = 0;
        
        // Генерируем страницы для каждого товара
        for (const [id, product] of Object.entries(products)) {
            if (!product || !product.name) continue;
            
            const slug = generateSlug(product.name);
            const filename = `${slug}-${id}.html`;
            const filepath = `product/${filename}`;
            
            const html = generateProductPage(product, id);
            fs.writeFileSync(filepath, html);
            
            sitemapUrls.push({
                url: `https://mirzarasulov.github.io/ggpoint/product/${filename}`,
                lastmod: new Date().toISOString().split('T')[0],
                priority: '0.9'
            });
            
            productCount++;
            console.log(`✅ ${productCount}. Создана: ${filename}`);
        }
        
        // Генерируем sitemap.xml
        generateSitemap(sitemapUrls);
        
        // Генерируем robots.txt
        generateRobotsTxt();
        
        console.log(`\n🎉 ГОТОВО! Сгенерировано ${productCount} страниц!`);
        console.log('📁 Папка: /product/');
        console.log('📄 Карта сайта: sitemap.xml');
        console.log('🤖 robots.txt: robots.txt');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
}

// ====== ГЕНЕРАЦИЯ SITEMAP.XML ======
function generateSitemap(urls) {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <!-- Главная -->
    <url>
        <loc>https://mirzarasulov.github.io/ggpoint/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Каталог -->
    <url>
        <loc>https://mirzarasulov.github.io/ggpoint/catalog.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- Страницы товаров -->
    ${urls.map(u => `
    <url>
        <loc>${u.url}</loc>
        <lastmod>${u.lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('')}
    
</urlset>`;
    
    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('✅ Создан: sitemap.xml');
}

// ====== ГЕНЕРАЦИЯ ROBOTS.TXT ======
function generateRobotsTxt() {
    const robots = `# Все боты welcome!
User-agent: *
Allow: /
Allow: /product/
Allow: /catalog.html
Allow: /index.html

# Запрещаем админку
Disallow: /admin-panel.html
Disallow: /editor.html
Disallow: /offline.html

# Карта сайта
Sitemap: https://mirzarasulov.github.io/ggpoint/sitemap.xml

# Для Яндекса
Host: https://mirzarasulov.github.io/ggpoint/

# Для Google
User-agent: Googlebot
Allow: /
Allow: /product/
Sitemap: https://mirzarasulov.github.io/ggpoint/sitemap.xml

# Для Bing
User-agent: bingbot
Allow: /
Allow: /product/

# Время обновления
Crawl-delay: 1`;
    
    fs.writeFileSync('robots.txt', robots);
    console.log('✅ Создан: robots.txt');
}

// ====== ЗАПУСК ======
generateAllPages();
