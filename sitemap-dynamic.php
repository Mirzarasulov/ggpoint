<?php
header('Content-Type: application/xml; charset=utf-8');

// Функция для получения товаров из Firebase
function getProducts() {
    $url = "https://ggpoint-shop-default-rtdb.firebaseio.com/products.json";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

$products = getProducts();

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

if ($products) {
    foreach ($products as $id => $product) {
        $date = isset($product['dateAdded']) ? date('Y-m-d', strtotime($product['dateAdded'])) : date('Y-m-d');
        
        echo "  <url>\n";
        echo "    <loc>https://ggpoint.uz/product.html?id={$id}</loc>\n";
        echo "    <lastmod>{$date}</lastmod>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.8</priority>\n";
        echo "  </url>\n";
    }
}

// Добавляем категории
$categories = ['мышь', 'клавиатура', 'наушники', 'монитор', 'keycaps'];
foreach ($categories as $cat) {
    echo "  <url>\n";
    echo "    <loc>https://ggpoint.uz/catalog.html?category={$cat}</loc>\n";
    echo "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';
?>
