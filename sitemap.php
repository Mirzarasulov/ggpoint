<?php
// sitemap.php - Динамическая генерация sitemap из Firebase

header('Content-Type: application/xml; charset=utf-8');

// Функция для получения данных из Firebase
function getFirebaseData($path) {
    $url = "https://ggpoint-shop-default-rtdb.firebaseio.com/{$path}.json";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// Получаем все товары
$products = getFirebaseData('products');

// Начало XML
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// Статические страницы
$static_pages = [
    ['loc' => 'https://ggpoint.uz/', 'priority' => '1.0', 'changefreq' => 'daily'],
    ['loc' => 'https://ggpoint.uz/catalog.html', 'priority' => '0.9', 'changefreq' => 'daily'],
    ['loc' => 'https://ggpoint.uz/keycaps.html', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['loc' => 'https://ggpoint.uz/about.html', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => 'https://ggpoint.uz/contacts.html', 'priority' => '0.7', 'changefreq' => 'monthly'],
];

foreach ($static_pages as $page) {
    echo "  <url>\n";
    echo "    <loc>{$page['loc']}</loc>\n";
    echo "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
    echo "    <changefreq>{$page['changefreq']}</changefreq>\n";
    echo "    <priority>{$page['priority']}</priority>\n";
    echo "  </url>\n";
}

// Динамические страницы товаров
if ($products) {
    foreach ($products as $id => $product) {
        // Только если товар опубликован
        if (isset($product['published']) && $product['published'] === false) continue;
        
        $date = isset($product['dateAdded']) ? date('Y-m-d', strtotime($product['dateAdded'])) : date('Y-m-d');
        
        echo "  <url>\n";
        echo "    <loc>https://ggpoint.uz/product.html?id={$id}</loc>\n";
        echo "    <lastmod>{$date}</lastmod>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.8</priority>\n";
        echo "  </url>\n";
    }
}

// Категории
$categories = ['мышь', 'клавиатура', 'наушники', 'монитор', 'keycaps'];
foreach ($categories as $cat) {
    echo "  <url>\n";
    echo "    <loc>https://ggpoint.uz/catalog.html?category={$cat}</loc>\n";
    echo "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

// Закрываем urlset
echo '</urlset>';
?>
