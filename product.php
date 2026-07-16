<?php
// product.php - SEO-оптимизированная страница товара с сохранением всего функционала

// Получаем ID товара
$productId = isset($_GET['id']) ? $_GET['id'] : '';

// Загружаем товары из data/products.json
$productsData = json_decode(file_get_contents('data/products.json'), true);
$product = null;

// Ищем товар по ID
if ($productsData && isset($productsData['products'])) {
    foreach ($productsData['products'] as $p) {
        if ($p['id'] == $productId) {
            $product = $p;
            break;
        }
    }
}

// Если товар не найден - 404
if (!$product) {
    header('HTTP/1.0 404 Not Found');
    echo '<h1>Товар не найден</h1>';
    exit;
}

// Подготавливаем SEO-данные
$title = htmlspecialchars($product['name']) . ' купить в Узбекистане | GGPoint';
$description = 'Купить ' . htmlspecialchars($product['name']) . ' в Узбекистане. Оригинальный товар. Гарантия. Доставка по всему Узбекистану.';
$keywords = htmlspecialchars($product['name']) . ', купить, Узбекистан, ' . htmlspecialchars($product['brand']) . ', игровая периферия';
$canonical = 'https://' . $_SERVER['HTTP_HOST'] . '/product.php?id=' . $productId;
$image = isset($product['images'][0]) ? $product['images'][0] : 'images/default-product.jpg';
$price = preg_replace('/[^0-9]/', '', $product['price']);
$brand = htmlspecialchars($product['brand']);
$category = htmlspecialchars($product['category']);

// Формируем Schema.org JSON-LD
$schema = [
    '@context' => 'https://schema.org',
    '@type' => 'Product',
    'name' => $product['name'],
    'image' => $image,
    'description' => strip_tags($product['description'] ?? ''),
    'brand' => [
        '@type' => 'Brand',
        'name' => $brand
    ],
    'offers' => [
        '@type' => 'Offer',
        'price' => $price,
        'priceCurrency' => 'UZS',
        'availability' => 'https://schema.org/InStock',
        'url' => $canonical
    ]
];

$schemaJson = json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

// Передаём продукт в JavaScript
$productJson = json_encode($product, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    
    <!-- ====== SEO TAGS ====== -->
    <title><?php echo $title; ?></title>
    <meta name="description" content="<?php echo $description; ?>">
    <meta name="keywords" content="<?php echo $keywords; ?>">
    <link rel="canonical" href="<?php echo $canonical; ?>">
    
    <!-- ====== OPEN GRAPH ====== -->
    <meta property="og:title" content="<?php echo $title; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $image; ?>">
    <meta property="og:url" content="<?php echo $canonical; ?>">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="GGPoint">
    
    <!-- ====== TWITTER CARD ====== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $title; ?>">
    <meta name="twitter:description" content="<?php echo $description; ?>">
    <meta name="twitter:image" content="<?php echo $image; ?>">
    
    <!-- ====== SCHEMA.ORG JSON-LD ====== -->
    <script type="application/ld+json">
        <?php echo $schemaJson; ?>
    </script>
    
    <meta name="theme-color" content="#0f172a">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="apple-touch-icon" href="apple-touch-icon-180x180.png">
    
    <!-- Font Awesome -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
    
    <!-- Styles -->
    <link rel="stylesheet" href="css/main.css">
    
    <style>
        /* ====== ВСЕ ВАШИ СТИЛИ ИЗ product.html ====== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background: #0a0f1a;
            color: #fff;
            line-height: 1.5;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.15), transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1), transparent 50%);
            pointer-events: none;
            z-index: -1;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        header {
            background: rgba(10, 15, 26, 0.8);
            backdrop-filter: blur(20px);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(37, 99, 235, 0.2);
            transition: all 0.3s ease;
        }
        
        header.scrolled {
            padding: 0.7rem 2rem;
            background: rgba(10, 15, 26, 0.95);
        }
        
        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .logo a {
            font-size: 1.8rem;
            font-weight: 800;
            text-decoration: none;
            background: linear-gradient(135deg, #2563eb, #7c3aed, #a855f7);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 3s ease infinite;
        }
        
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 101;
        }
        
        .nav-list {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-link {
            color: #94a3b8;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            font-weight: 500;
            position: relative;
        }
        
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
            width: 100%;
        }
        
        .nav-link:hover,
        .nav-link.active {
            color: #fff;
        }
        
        .beta-badge {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            font-size: 0.55rem;
            padding: 0.2rem 0.5rem;
            border-radius: 20px;
            margin-left: 0.3rem;
        }
        
        .tracking-btn-main {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #fff;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .tracking-btn-main:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .product-page {
            padding: 4rem 2rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
        }
        
        .back-button {
            position: absolute;
            top: 4rem;
            left: 2rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid #2563eb;
            color: #2563eb;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            font-size: 0.9rem;
            text-decoration: none;
        }
        
        .back-button:hover {
            background: #2563eb;
            color: white;
            transform: translateX(-5px);
        }
        
        .close-button {
            position: absolute;
            top: 4rem;
            right: 2rem;
            width: 40px;
            height: 40px;
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid #ef4444;
            color: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            font-size: 1.2rem;
        }
        
        .close-button:hover {
            background: #ef4444;
            color: white;
            transform: scale(1.1);
        }
        
        .product-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .product-gallery {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
        }
        
        .main-image-container {
            position: relative;
            width: 100%;
            height: 450px;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 1rem;
            cursor: zoom-in;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .main-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }
        
        .main-image.zoomed {
            transform: scale(2);
            cursor: zoom-out;
        }
        
        .zoom-hint {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.7rem;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        .gallery-nav {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 1rem;
            pointer-events: none;
        }
        
        .gallery-btn {
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.7);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            pointer-events: all;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .gallery-btn:hover:not(:disabled) {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        .gallery-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .thumbnail-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .thumbnail {
            width: 100%;
            height: 70px;
            object-fit: contain;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            padding: 0.2rem;
        }
        
        .thumbnail:hover {
            transform: translateY(-2px);
            border-color: #2563eb;
        }
        
        .thumbnail.active {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }
        
        .photo-count {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: rgba(37, 99, 235, 0.1);
            border-radius: 8px;
            color: #94a3b8;
            font-size: 0.8rem;
        }
        
        .fullscreen-btn {
            background: transparent;
            border: 1px solid #2563eb;
            color: #2563eb;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.8rem;
        }
        
        .fullscreen-btn:hover {
            background: #2563eb;
            color: white;
        }
        
        .product-info {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
        }
        
        .product-badge {
            display: inline-block;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .product-badge.sale {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        
        .product-title {
            font-size: 1.8rem;
            margin-bottom: 0.8rem;
            color: #f1f5f9;
            line-height: 1.3;
        }
        
        .product-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .product-category {
            color: #2563eb;
            background: rgba(37, 99, 235, 0.1);
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
        }
        
        .product-brand {
            color: #94a3b8;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        .product-brand img {
            height: 20px;
        }
        
        .product-price-block {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
            border-radius: 16px;
            padding: 1.2rem;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.3);
        }
        
        .current-price {
            font-size: 2rem;
            font-weight: bold;
            color: #2563eb;
        }
        
        .old-price {
            font-size: 1.2rem;
            color: #94a3b8;
            text-decoration: line-through;
            margin-left: 0.8rem;
        }
        
        .discount-info {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 0.2rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-left: 0.8rem;
        }
        
        .product-description {
            margin-bottom: 1.5rem;
            color: #94a3b8;
            line-height: 1.6;
            font-size: 0.9rem;
        }
        
        /* YouTube секция */
        .youtube-section-bottom {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin: 1.5rem 0;
        }
        
        .youtube-header-bottom {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .youtube-icon-large {
            width: 50px;
            height: 50px;
            background: #ff0000;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }
        
        .youtube-title h3 {
            font-size: 1.2rem;
            margin-bottom: 0.2rem;
            color: #f1f5f9;
        }
        
        .youtube-title p {
            font-size: 0.8rem;
            color: #94a3b8;
        }
        
        .youtube-badge {
            background: rgba(255,0,0,0.1);
            color: #ff0000;
            padding: 0.4rem 1rem;
            border-radius: 30px;
            font-weight: 600;
            border: 1px solid #ff0000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
        }
        
        .video-container-bottom {
            position: relative;
            width: 100%;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
            min-height: 200px;
        }
        
        .video-container-bottom iframe {
            width: 100%;
            height: 400px;
            border: none;
            display: block;
        }
        
        .no-video-bottom {
            text-align: center;
            padding: 3rem;
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            color: #94a3b8;
            border: 1px dashed #ff0000;
        }
        
        .product-tabs {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin: 1.5rem 0;
        }
        
        .tabs-header {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid #334155;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 0.8rem 1.5rem;
            background: transparent;
            border: none;
            color: #94a3b8;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .tab-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: #2563eb;
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .tab-btn:hover {
            color: #2563eb;
        }
        
        .tab-btn.active {
            color: #2563eb;
        }
        
        .tab-btn.active::after {
            transform: scaleX(1);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
            animation: fadeInUp 0.3s ease;
        }
        
        .formatted-description {
            color: #94a3b8;
            line-height: 1.7;
            font-size: 0.9rem;
        }
        
        .formatted-description div {
            margin-bottom: 0.5rem;
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
            font-size: 0.85rem;
        }
        
        .specs-table td:first-child {
            font-weight: 600;
            color: #f1f5f9;
            width: 180px;
        }
        
        .reviews-section {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin: 1.5rem 0;
        }
        
        .reviews-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #f1f5f9;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .reviews-list {
            margin-bottom: 1.5rem;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .review-item {
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid #334155;
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            flex-wrap: wrap;
        }
        
        .review-author {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .review-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .review-name {
            font-weight: 600;
            color: #f1f5f9;
            font-size: 0.9rem;
        }
        
        .review-date {
            font-size: 0.7rem;
            color: #94a3b8;
        }
        
        .review-rating {
            color: #ffd700;
            font-size: 0.9rem;
        }
        
        .review-text {
            color: #94a3b8;
            line-height: 1.6;
            margin-top: 0.5rem;
            font-size: 0.85rem;
        }
        
        .admin-reply-block {
            margin-top: 0.8rem;
            padding-top: 0.8rem;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
        }
        
        .admin-reply-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .admin-reply-header i {
            color: #2563eb;
        }
        
        .admin-reply-header span {
            font-weight: 600;
            color: #2563eb;
            font-size: 0.8rem;
        }
        
        .admin-reply-text {
            color: #94a3b8;
            font-size: 0.85rem;
            line-height: 1.5;
        }
        
        .no-reviews {
            text-align: center;
            padding: 2rem;
            color: #94a3b8;
        }
        
        .add-review-form {
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            padding: 1.2rem;
            margin-top: 1rem;
        }
        
        .add-review-form h3 {
            margin-bottom: 0.8rem;
            font-size: 1rem;
        }
        
        .star-rating {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            cursor: pointer;
        }
        
        .star-rating i {
            font-size: 1.5rem;
            color: #ffd700;
            transition: all 0.2s ease;
        }
        
        .review-input, .review-name-input {
            width: 100%;
            padding: 0.7rem;
            background: #0f172a;
            border: 2px solid #334155;
            border-radius: 10px;
            color: #fff;
            margin-bottom: 0.8rem;
            resize: vertical;
            font-family: inherit;
            font-size: 0.85rem;
        }
        
        .review-input:focus, .review-name-input:focus {
            outline: none;
            border-color: #2563eb;
        }
        
        .submit-review-btn {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            padding: 0.7rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 0.9rem;
        }
        
        .submit-review-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
        }
        
        .related-products {
            margin-top: 2rem;
        }
        
        .related-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #f1f5f9;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .product-card {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid rgba(37, 99, 235, 0.2);
            cursor: pointer;
            position: relative;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            border-color: #2563eb;
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);
        }
        
        .product-badge-sale {
            position: absolute;
            top: 8px;
            left: 8px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 0.2rem 0.6rem;
            border-radius: 20px;
            font-size: 0.65rem;
            font-weight: 600;
            z-index: 2;
        }
        
        .product-image-container {
            height: 150px;
            overflow: hidden;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
            transform: scale(1.05);
        }
        
        .product-card .product-info {
            padding: 0.8rem;
            background: transparent;
            border: none;
        }
        
        .product-card .product-category {
            font-size: 0.65rem;
            color: #60a5fa;
            margin-bottom: 0.3rem;
        }
        
        .product-card .product-name {
            font-size: 0.85rem;
            margin-bottom: 0.3rem;
            font-weight: 600;
            color: #f1f5f9;
        }
        
        .product-card .product-price {
            font-size: 0.9rem;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
        }
        
        .fullscreen-gallery {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.98);
            z-index: 3000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .fullscreen-gallery.active {
            display: flex;
        }
        
        .fullscreen-image-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .fullscreen-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            transition: transform 0.3s ease;
            cursor: zoom-in;
        }
        
        .fullscreen-image.zoomed {
            transform: scale(2);
            cursor: zoom-out;
        }
        
        .fullscreen-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.1);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 3001;
        }
        
        .fullscreen-close:hover {
            background: #ef4444;
            transform: scale(1.1);
        }
        
        .fullscreen-nav {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 2rem;
            pointer-events: none;
            z-index: 3001;
        }
        
        .fullscreen-nav-btn {
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.1);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            pointer-events: all;
            transition: all 0.3s ease;
        }
        
        .fullscreen-nav-btn:hover {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        .fullscreen-counter {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0,0,0,0.5);
            padding: 0.5rem 1.5rem;
            border-radius: 30px;
            font-size: 0.9rem;
            border: 1px solid rgba(255,255,255,0.2);
            z-index: 3001;
        }
        
        footer {
            background: #0a0f1a;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
            margin-top: 3rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .footer-section h3 {
            font-size: 1.3rem;
            margin-bottom: 0.8rem;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .footer-section h4 {
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
        }
        
        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 0.3rem;
        }
        
        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.8rem;
        }
        
        .footer-links a:hover {
            color: #60a5fa;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.3rem;
            color: #94a3b8;
            font-size: 0.8rem;
        }
        
        .social-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .social-link {
            width: 36px;
            height: 36px;
            background: rgba(37, 99, 235, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
            border: 1px solid rgba(37, 99, 235, 0.3);
        }
        
        .social-link:hover {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            transform: translateY(-3px) rotate(360deg);
        }
        
        .footer-bottom {
            text-align: center;
            padding: 1rem;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
            color: #64748b;
            font-size: 0.7rem;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 100;
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
        }
        
        .back-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5);
        }
        
        .back-to-top.show {
            display: flex;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 4000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            background: #1e293b;
            margin: 15% auto;
            padding: 1.5rem;
            border-radius: 20px;
            width: 90%;
            max-width: 400px;
            border: 1px solid rgba(37, 99, 235, 0.3);
            animation: scaleIn 0.3s ease;
        }
        
        .close-modal {
            float: right;
            font-size: 1.3rem;
            cursor: pointer;
            background: none;
            border: none;
            color: #94a3b8;
        }
        
        .form-group {
            margin-bottom: 0.8rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.3rem;
            color: #94a3b8;
            font-size: 0.85rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.6rem;
            background: #0f172a;
            border: 2px solid #334155;
            border-radius: 10px;
            color: #fff;
        }
        
        .btn-primary-modal {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #fff;
            border: none;
            padding: 0.7rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
            
            .nav-list {
                display: none;
                position: absolute;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(10, 15, 26, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 1rem;
                gap: 1rem;
                border-bottom: 1px solid rgba(37, 99, 235, 0.3);
                z-index: 99;
            }
            
            .nav-list.show {
                display: flex;
            }
            
            .product-container {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .main-image-container {
                height: 300px;
            }
            
            .thumbnail-grid {
                grid-template-columns: repeat(4, 1fr);
            }
            
            .thumbnail {
                height: 55px;
            }
            
            .back-button {
                top: 5rem;
                left: 1rem;
                padding: 0.4rem 1rem;
                font-size: 0.8rem;
            }
            
            .close-button {
                top: 5rem;
                right: 1rem;
                width: 35px;
                height: 35px;
                font-size: 1rem;
            }
            
            .product-title {
                font-size: 1.4rem;
            }
            
            .current-price {
                font-size: 1.6rem;
            }
            
            .tracking-btn-main span {
                display: none;
            }
            
            .tracking-btn-main {
                padding: 0.5rem 0.8rem;
            }
            
            .products-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .fullscreen-nav-btn {
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
            
            .video-container-bottom iframe {
                height: 250px;
            }
            
            .youtube-header-bottom {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <!-- ====== HEADER ====== -->
    <header id="mainHeader">
        <div class="header-container">
            <div class="logo">
                <a href="index.html">GGPoint</a>
            </div>
            
            <button class="menu-toggle" id="menuToggle">
                <i class="fas fa-bars"></i>
            </button>
            
            <nav>
                <ul class="nav-list" id="navList">
                    <li><a href="index.html" class="nav-link"><i class="fas fa-home"></i>Главная</a></li>
                    <li><a href="catalog.html" class="nav-link"><i class="fas fa-th-large"></i>Каталог</a></li>
                    <li><a href="keycaps.html" class="nav-link"><i class="fas fa-keyboard"></i>Кейкапы<span class="beta-badge">Коллекция</span></a></li>
                    <li><a href="pads.html" class="nav-link"><i class="fas fa-mouse-pointer"></i>Коврики<span class="beta-badge">Новинка</span></a></li>
                    <li><a href="mb.html" class="nav-link"><i class="fas fa-microchip"></i>MB<span class="beta-badge">Материнские платы</span></a></li>
                    <li><a href="about.html" class="nav-link"><i class="fas fa-info-circle"></i>О нас</a></li>
                    <li><a href="contacts.html" class="nav-link"><i class="fas fa-phone"></i>Контакты</a></li>
                </ul>
            </nav>
            
            <div class="header-actions">
                <button class="tracking-btn-main" id="trackingBtn">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Отследить</span>
                </button>
            </div>
        </div>
    </header>

    <!-- ====== КНОПКИ НАВИГАЦИИ ====== -->
    <button class="back-button" onclick="goBack()"><i class="fas fa-arrow-left"></i><span>Назад</span></button>
    <button class="close-button" onclick="closeAndGoBack()" title="Закрыть"><i class="fas fa-times"></i></button>

    <!-- ====== СТРАНИЦА ТОВАРА ====== -->
    <div class="product-page">
        <div class="product-container">
            <!-- Галерея -->
            <div class="product-gallery">
                <div class="main-image-container" id="mainImageContainer">
                    <img src="<?php echo htmlspecialchars($product['images'][0] ?? 'https://via.placeholder.com/500x400/1e293b/2563eb?text=Нет+фото'); ?>" 
                         alt="<?php echo htmlspecialchars($product['name']); ?>" 
                         class="main-image" id="mainImage">
                    <div class="zoom-hint"><i class="fas fa-search-plus"></i><span>Клик для увеличения</span></div>
                    <div class="gallery-nav">
                        <button class="gallery-btn" id="prevImageBtn" onclick="changeImage(-1)"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-btn" id="nextImageBtn" onclick="changeImage(1)"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="thumbnail-grid" id="thumbnailGrid">
                    <?php foreach ($product['images'] ?? [] as $index => $img): ?>
                        <img src="<?php echo htmlspecialchars($img); ?>" 
                             alt="<?php echo htmlspecialchars($product['name']); ?>" 
                             class="thumbnail <?php echo $index === 0 ? 'active' : ''; ?>" 
                             onclick="setImage(<?php echo $index; ?>)">
                    <?php endforeach; ?>
                </div>
                <div class="photo-count">
                    <span><i class="fas fa-camera"></i> <span id="photoCount"><?php echo count($product['images'] ?? []); ?> фото</span></span>
                    <button class="fullscreen-btn" onclick="openFullscreen()"><i class="fas fa-expand"></i> На весь экран</button>
                </div>
            </div>
            
            <!-- Информация о товаре -->
            <div class="product-info">
                <div id="saleBadge">
                    <?php if (isset($product['sale']) && $product['sale']): ?>
                        <span class="product-badge sale"><i class="fas fa-fire"></i> Скидка!</span>
                    <?php endif; ?>
                </div>
                <h1 class="product-title" id="productTitle"><?php echo htmlspecialchars($product['name']); ?></h1>
                <div class="product-meta">
                    <span class="product-category" id="productCategory"><?php echo htmlspecialchars($product['category'] ?? 'Товар'); ?></span>
                    <div class="product-brand" id="productBrand">
                        <span><?php echo htmlspecialchars($product['brand'] ?? ''); ?></span>
                    </div>
                </div>
                <div class="product-price-block">
                    <span class="current-price" id="productPrice"><?php echo htmlspecialchars($product['price'] ?? 'Цена не указана'); ?></span>
                    <?php if (isset($product['old_price']) && $product['old_price']): ?>
                        <span class="old-price" id="oldPrice"><?php echo htmlspecialchars($product['old_price']); ?></span>
                        <span class="discount-info" id="discountInfo">🔥 -<?php echo round((1 - (preg_replace('/[^0-9]/', '', $product['price']) / preg_replace('/[^0-9]/', '', $product['old_price']))) * 100); ?>%</span>
                    <?php endif; ?>
                </div>
                <div class="product-description" id="productDescription">
                    <?php 
                    $desc = $product['description'] ?? '';
                    echo nl2br(htmlspecialchars(mb_substr($desc, 0, 200)));
                    if (mb_strlen($desc) > 200) echo '...';
                    ?>
                </div>
            </div>
        </div>
        
        <!-- YouTube секция -->
        <div class="youtube-section-bottom" id="youtubeSectionBottom">
            <div class="youtube-header-bottom">
                <div class="youtube-icon-large"><i class="fab fa-youtube"></i></div>
                <div class="youtube-title">
                    <h3>Видеообзор товара</h3>
                    <p>Смотрите подробный обзор на YouTube канале</p>
                </div>
                <div class="youtube-badge"><i class="fas fa-play"></i><span>Смотреть</span></div>
            </div>
            <div id="videoContainerBottom" class="video-container-bottom">
                <?php 
                $videoId = '';
                if (isset($product['video']) && $product['video']) {
                    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/i', $product['video'], $matches)) {
                        $videoId = $matches[1];
                    }
                }
                ?>
                <?php if ($videoId): ?>
                    <iframe src="https://www.youtube.com/embed/<?php echo $videoId; ?>?autoplay=0&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
                <?php else: ?>
                    <div class="no-video-bottom"><i class="fab fa-youtube"></i><h4>Видеообзор скоро появится</h4></div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Вкладки -->
        <div class="product-tabs">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="desc">Полное описание</button>
                <button class="tab-btn" data-tab="specs">Характеристики</button>
            </div>
            <div class="tab-content active" id="tab-desc">
                <div id="fullDescription" class="formatted-description">
                    <?php 
                    $fullDesc = $product['description'] ?? 'Описание отсутствует';
                    echo nl2br(htmlspecialchars($fullDesc));
                    ?>
                </div>
            </div>
            <div class="tab-content" id="tab-specs">
                <table class="specs-table" id="specsTable">
                    <tr><td style="font-weight:600;color:#f1f5f9;">Бренд</td><td><?php echo htmlspecialchars($product['brand'] ?? '-'); ?></td></tr>
                    <tr><td style="font-weight:600;color:#f1f5f9;">Категория</td><td><?php echo htmlspecialchars($product['category'] ?? '-'); ?></td></tr>
                    <tr><td style="font-weight:600;color:#f1f5f9;">Артикул</td><td><?php echo htmlspecialchars($productId); ?></td></tr>
                    <?php if (isset($product['specs']) && is_array($product['specs'])): ?>
                        <?php foreach ($product['specs'] as $key => $value): ?>
                            <tr><td style="font-weight:600;color:#f1f5f9;"><?php echo htmlspecialchars($key); ?></td><td><?php echo htmlspecialchars($value); ?></td></tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </table>
            </div>
        </div>
        
        <!-- Отзывы -->
        <div class="reviews-section" id="reviewsSection">
            <div class="reviews-title">
                <i class="fas fa-star" style="color:#ffd700;"></i> 
                Отзывы о товаре <span id="reviewsCount" style="font-size:0.9rem; color:#94a3b8;"></span>
            </div>
            <div class="reviews-list" id="reviewsList">
                <div class="no-reviews">Загрузка отзывов...</div>
            </div>
            
            <div class="add-review-form">
                <h3>Оставить отзыв</h3>
                <div class="star-rating" id="starRating">
                    <i class="far fa-star" data-rating="1"></i><i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i><i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                </div>
                <input type="text" id="reviewName" class="review-name-input" placeholder="Ваше имя" maxlength="50">
                <textarea id="reviewText" class="review-input" rows="3" placeholder="Поделитесь впечатлениями о товаре..." maxlength="999"></textarea>
                <button class="submit-review-btn" id="submitReviewBtn" onclick="submitReview()">
                    <i class="fas fa-paper-plane"></i> Отправить отзыв
                </button>
            </div>
        </div>
        
        <!-- Похожие товары -->
        <div class="related-products">
            <h2 class="related-title">Похожие товары</h2>
            <div class="products-grid" id="relatedProducts"></div>
        </div>
    </div>

    <!-- ====== FULLSCREEN GALLERY ====== -->
    <div class="fullscreen-gallery" id="fullscreenGallery">
        <button class="fullscreen-close" onclick="closeFullscreen()">×</button>
        <div class="fullscreen-nav">
            <button class="fullscreen-nav-btn" onclick="fullscreenChangeImage(-1)"><i class="fas fa-chevron-left"></i></button>
            <button class="fullscreen-nav-btn" onclick="fullscreenChangeImage(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="fullscreen-image-container">
            <img src="" alt="" class="fullscreen-image" id="fullscreenImage" onclick="toggleFullscreenZoom()">
        </div>
        <div class="fullscreen-counter" id="fullscreenCounter">1 / 1</div>
    </div>

    <!-- ====== FOOTER ====== -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>GGPoint</h3>
                <p>Ваш надежный магазин игровой периферии в Узбекистане.</p>
                <div class="social-links">
                    <a href="https://t.me/GGPointUz" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>
                </div>
            </div>
            <div class="footer-section">
                <h4>Навигация</h4>
                <ul class="footer-links">
                    <li><a href="index.html">Главная</a></li>
                    <li><a href="catalog.html">Каталог</a></li>
                    <li><a href="keycaps.html">Кейкапы</a></li>
                    <li><a href="pads.html">Коврики</a></li>
                    <li><a href="mb.html">MB</a></li>
                    <li><a href="about.html">О нас</a></li>
                    <li><a href="contacts.html">Контакты</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Контакты</h4>
                <div class="contact-info">
                    <div class="contact-item"><i class="fas fa-phone"></i><span>+998 97 747 0157</span></div>
                    <div class="contact-item"><i class="fab fa-telegram"></i><span><a href="https://t.me/GGPointUz" target="_blank">@GGPointUz</a></span></div>
                </div>
            </div>
        </div>
        <div class="footer-bottom"><p>&copy; 2025 GGPoint. Все права защищены.</p></div>
    </footer>

    <!-- ====== КНОПКА НАВЕРХ ====== -->
    <button class="back-to-top" id="backToTop"><i class="fas fa-arrow-up"></i></button>

    <!-- ====== МОДАЛКА АДМИНКИ ====== -->
    <div class="modal" id="adminLoginModal">
        <div class="modal-content">
            <button class="close-modal" id="closeAdminModal">&times;</button>
            <h2 style="background:linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; text-align:center; margin-bottom:1.5rem;">Вход в админ-панель</h2>
            <form id="adminLoginForm">
                <div class="form-group"><label>Логин</label><input type="text" id="adminLogin" required></div>
                <div class="form-group"><label>Пароль</label><input type="password" id="adminPassword" required></div>
                <button type="submit" class="btn-primary-modal"><i class="fas fa-sign-in-alt"></i> Войти</button>
            </form>
        </div>
    </div>

    <!-- ====== JAVASCRIPT ====== -->
    <script>
        // Данные товара из PHP
        const productData = <?php echo $productJson; ?>;
        const productId = '<?php echo $productId; ?>';
        const productImages = <?php echo json_encode($product['images'] ?? []); ?>;
        let currentImageIndex = 0;
        let selectedRating = 5;

        // ====== ГАЛЕРЕЯ ======
        function setImage(index) {
            if (index < 0 || index >= productImages.length) return;
            currentImageIndex = index;
            document.getElementById('mainImage').src = productImages[index];
            document.getElementById('fullscreenImage').src = productImages[index];
            document.querySelectorAll('.thumbnail').forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
            document.getElementById('photoCount').textContent = `${productImages.length} фото`;
            document.getElementById('fullscreenCounter').textContent = `${index + 1} / ${productImages.length}`;
        }

        function changeImage(delta) {
            const newIndex = currentImageIndex + delta;
            if (newIndex >= 0 && newIndex < productImages.length) {
                setImage(newIndex);
            }
        }

        function openFullscreen() {
            const gallery = document.getElementById('fullscreenGallery');
            gallery.classList.add('active');
            document.getElementById('fullscreenImage').src = productImages[currentImageIndex];
            document.getElementById('fullscreenCounter').textContent = `${currentImageIndex + 1} / ${productImages.length}`;
            document.body.style.overflow = 'hidden';
        }

        function closeFullscreen() {
            document.getElementById('fullscreenGallery').classList.remove('active');
            document.body.style.overflow = '';
        }

        function fullscreenChangeImage(delta) {
            let newIndex = currentImageIndex + delta;
            if (newIndex < 0) newIndex = productImages.length - 1;
            if (newIndex >= productImages.length) newIndex = 0;
            setImage(newIndex);
            document.getElementById('fullscreenImage').classList.remove('zoomed');
        }

        function toggleFullscreenZoom() {
            document.getElementById('fullscreenImage').classList.toggle('zoomed');
        }

        // ====== НАВИГАЦИЯ ======
        function goBack() {
            document.referrer ? window.history.back() : window.location.href = 'catalog.html';
        }

        function closeAndGoBack() {
            document.referrer ? window.history.back() : window.location.href = 'catalog.html';
        }

        // ====== ТАБЫ ======
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        // ====== ЗВЕЗДЫ ДЛЯ ОТЗЫВОВ ======
        function updateStarDisplay(rating) {
            document.querySelectorAll('#starRating i').forEach((star, i) => {
                star.className = i < rating ? 'fas fa-star' : 'far fa-star';
            });
        }

        document.querySelectorAll('#starRating i').forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                updateStarDisplay(selectedRating);
            });
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                document.querySelectorAll('#starRating i').forEach((s, i) => {
                    s.className = i < rating ? 'fas fa-star' : 'far fa-star';
                });
            });
        });
        document.getElementById('starRating').addEventListener('mouseleave', () => updateStarDisplay(selectedRating));

        // ====== ОТЗЫВЫ (Firebase) ======
        // Импорт Firebase
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
        import { getDatabase, ref, onValue, push } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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
        const database = getDatabase(app);

        // Загрузка отзывов
        function loadReviews() {
            const reviewsRef = ref(database, 'reviews');
            onValue(reviewsRef, (snapshot) => {
                const data = snapshot.val();
                const reviews = data ? Object.values(data).filter(r => r.productId == productId && r.status === 'approved') : [];
                renderReviews(reviews);
            });
        }

        function renderReviews(reviews) {
            const container = document.getElementById('reviewsList');
            const countSpan = document.getElementById('reviewsCount');
            
            if (reviews.length === 0) {
                container.innerHTML = '<div class="no-reviews"><i class="fas fa-comment"></i><br>Пока отзывов нет. Будьте первым!</div>';
                if (countSpan) countSpan.textContent = '(0)';
                return;
            }
            
            if (countSpan) countSpan.textContent = `(${reviews.length})`;
            container.innerHTML = reviews.map(r => `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-author">
                            <div class="review-avatar">${(r.author?.charAt(0) || 'А').toUpperCase()}</div>
                            <div><div class="review-name">${escapeHtml(r.author) || 'Аноним'}</div>
                            <div class="review-date">${new Date(r.date).toLocaleDateString('ru-RU')}</div></div>
                        </div>
                        <div class="review-rating">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
                    </div>
                    <div class="review-text">${escapeHtml(r.text)}</div>
                    ${r.adminReply ? `
                        <div class="admin-reply-block">
                            <div class="admin-reply-header"><i class="fas fa-user-shield"></i><span>Ответ администратора</span></div>
                            <div class="admin-reply-text">${escapeHtml(r.adminReply)}</div>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
        }

        async function submitReview() {
            const name = document.getElementById('reviewName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            
            if (!text) { showNotification('Напишите текст отзыва'); return; }
            if (text.length < 5) { showNotification('Отзыв должен содержать минимум 5 символов'); return; }
            
            try {
                await push(ref(database, 'reviews'), {
                    productId: productId,
                    productName: productData?.name || 'Товар',
                    author: name || 'Аноним',
                    text: text,
                    rating: selectedRating,
                    date: new Date().toISOString(),
                    status: 'pending'
                });
                showNotification('Спасибо за отзыв! Он появится после модерации.');
                document.getElementById('reviewName').value = '';
                document.getElementById('reviewText').value = '';
                selectedRating = 5;
                updateStarDisplay(5);
            } catch (error) {
                showNotification('Ошибка при отправке отзыва');
            }
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = 'position:fixed; top:20px; right:20px; background:#10b981; color:white; padding:0.8rem 1.2rem; border-radius:8px; font-weight:600; z-index:9999; animation:slideIn 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.2); font-size:0.9rem;';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // ====== ПОХОЖИЕ ТОВАРЫ ======
        function loadRelatedProducts() {
            const productsRef = ref(database, 'products');
            onValue(productsRef, (snapshot) => {
                const data = snapshot.val();
                const products = data ? Object.entries(data).map(([id, d]) => ({ ...d, id })) : [];
                renderRelatedProducts(products);
            });
        }

        function renderRelatedProducts(products) {
            if (!productData) return;
            const related = products
                .filter(p => p.category === productData.category && p.id != productId)
                .slice(0, 4);
            
            const grid = document.getElementById('relatedProducts');
            if (!grid) return;
            
            if (related.length === 0) {
                grid.innerHTML = '<p style="color: #94a3b8;">Похожих товаров не найдено</p>';
                return;
            }
            
            grid.innerHTML = related.map(p => `
                <div class="product-card" data-id="${p.id}">
                    ${p.sale ? '<div class="product-badge-sale"><i class="fas fa-fire"></i> Скидка</div>' : ''}
                    <div class="product-image-container">
                        <img src="${p.images?.[0] || 'https://via.placeholder.com/300x200/1e293b/2563eb?text=Нет+фото'}" 
                             class="product-image" 
                             alt="${escapeHtml(p.name)}" 
                             loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${escapeHtml(p.category || 'Товар')}</div>
                        <h3 class="product-name">${escapeHtml(p.name)}</h3>
                        <p class="product-price">${escapeHtml(p.price || 'Цена не указана')}</p>
                    </div>
                </div>
            `).join('');
            
            document.querySelectorAll('#relatedProducts .product-card').forEach(card => {
                const id = card.dataset.id;
                card.addEventListener('click', () => window.location.href = `product.php?id=${id}`);
            });
        }

        // ====== SCROLL ======
        window.addEventListener('scroll', () => {
            const header = document.getElementById('mainHeader');
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
            document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
        });

        document.getElementById('backToTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('trackingBtn')?.addEventListener('click', () => {
            window.location.href = 'tracking.html';
        });

        // ====== MOBILE MENU ======
        const menuToggle = document.getElementById('menuToggle');
        const navList = document.getElementById('navList');
        let isMenuOpen = false;
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                isMenuOpen = !isMenuOpen;
                navList.classList.toggle('show');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars', 'fa-times');
                    icon.classList.add(isMenuOpen ? 'fa-times' : 'fa-bars');
                }
            });
            navList.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('show');
                    isMenuOpen = false;
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.classList.remove('fa-times');
                });
            });
        }

        // ====== ADMIN LOGIN ======
        let ctrlClickCount = 0;
        let ctrlClickTimer = null;
        document.addEventListener('click', e => {
            if (e.ctrlKey) {
                ctrlClickCount++;
                clearTimeout(ctrlClickTimer);
                ctrlClickTimer = setTimeout(() => ctrlClickCount = 0, 800);
                if (ctrlClickCount === 3) {
                    document.getElementById('adminLoginModal').style.display = 'block';
                    ctrlClickCount = 0;
                }
            }
        });

        document.getElementById('closeAdminModal')?.addEventListener('click', () => {
            document.getElementById('adminLoginModal').style.display = 'none';
        });

        window.addEventListener('click', e => {
            if (e.target === document.getElementById('adminLoginModal')) {
                document.getElementById('adminLoginModal').style.display = 'none';
            }
        });

        document.getElementById('adminLoginForm')?.addEventListener('submit', e => {
            e.preventDefault();
            if (document.getElementById('adminLogin').value === 'admin' && 
                document.getElementById('adminPassword').value === 'admin') {
                document.getElementById('adminLoginModal').style.display = 'none';
                window.location.href = 'admin-panel.html';
            } else {
                alert('Неверный логин или пароль!');
            }
        });

        // ====== MAIN IMAGE ZOOM ======
        document.getElementById('mainImageContainer')?.addEventListener('click', () => {
            document.getElementById('mainImage').classList.toggle('zoomed');
        });

        // ====== INIT ======
        // Инициализация галереи
        if (productImages.length > 0) {
            setImage(0);
        }

        // Загрузка отзывов и похожих товаров
        loadReviews();
        loadRelatedProducts();

        // Обновляем количество фото
        document.getElementById('photoCount').textContent = `${productImages.length} фото`;

        // Навигация по клавишам
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'Escape') {
                if (document.getElementById('fullscreenGallery').classList.contains('active')) {
                    closeFullscreen();
                }
            }
        });
    </script>
</body>
</html><?php
// product.php - SEO-оптимизированная страница товара с сохранением всего функционала

// Получаем ID товара
$productId = isset($_GET['id']) ? $_GET['id'] : '';

// Загружаем товары из data/products.json
$productsData = json_decode(file_get_contents('data/products.json'), true);
$product = null;

// Ищем товар по ID
if ($productsData && isset($productsData['products'])) {
    foreach ($productsData['products'] as $p) {
        if ($p['id'] == $productId) {
            $product = $p;
            break;
        }
    }
}

// Если товар не найден - 404
if (!$product) {
    header('HTTP/1.0 404 Not Found');
    echo '<h1>Товар не найден</h1>';
    exit;
}

// Подготавливаем SEO-данные
$title = htmlspecialchars($product['name']) . ' купить в Узбекистане | GGPoint';
$description = 'Купить ' . htmlspecialchars($product['name']) . ' в Узбекистане. Оригинальный товар. Гарантия. Доставка по всему Узбекистану.';
$keywords = htmlspecialchars($product['name']) . ', купить, Узбекистан, ' . htmlspecialchars($product['brand']) . ', игровая периферия';
$canonical = 'https://' . $_SERVER['HTTP_HOST'] . '/product.php?id=' . $productId;
$image = isset($product['images'][0]) ? $product['images'][0] : 'images/default-product.jpg';
$price = preg_replace('/[^0-9]/', '', $product['price']);
$brand = htmlspecialchars($product['brand']);
$category = htmlspecialchars($product['category']);

// Формируем Schema.org JSON-LD
$schema = [
    '@context' => 'https://schema.org',
    '@type' => 'Product',
    'name' => $product['name'],
    'image' => $image,
    'description' => strip_tags($product['description'] ?? ''),
    'brand' => [
        '@type' => 'Brand',
        'name' => $brand
    ],
    'offers' => [
        '@type' => 'Offer',
        'price' => $price,
        'priceCurrency' => 'UZS',
        'availability' => 'https://schema.org/InStock',
        'url' => $canonical
    ]
];

$schemaJson = json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

// Передаём продукт в JavaScript
$productJson = json_encode($product, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    
    <!-- ====== SEO TAGS ====== -->
    <title><?php echo $title; ?></title>
    <meta name="description" content="<?php echo $description; ?>">
    <meta name="keywords" content="<?php echo $keywords; ?>">
    <link rel="canonical" href="<?php echo $canonical; ?>">
    
    <!-- ====== OPEN GRAPH ====== -->
    <meta property="og:title" content="<?php echo $title; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $image; ?>">
    <meta property="og:url" content="<?php echo $canonical; ?>">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="GGPoint">
    
    <!-- ====== TWITTER CARD ====== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $title; ?>">
    <meta name="twitter:description" content="<?php echo $description; ?>">
    <meta name="twitter:image" content="<?php echo $image; ?>">
    
    <!-- ====== SCHEMA.ORG JSON-LD ====== -->
    <script type="application/ld+json">
        <?php echo $schemaJson; ?>
    </script>
    
    <meta name="theme-color" content="#0f172a">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="apple-touch-icon" href="apple-touch-icon-180x180.png">
    
    <!-- Font Awesome -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
    
    <!-- Styles -->
    <link rel="stylesheet" href="css/main.css">
    
    <style>
        /* ====== ВСЕ ВАШИ СТИЛИ ИЗ product.html ====== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background: #0a0f1a;
            color: #fff;
            line-height: 1.5;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.15), transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1), transparent 50%);
            pointer-events: none;
            z-index: -1;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        header {
            background: rgba(10, 15, 26, 0.8);
            backdrop-filter: blur(20px);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(37, 99, 235, 0.2);
            transition: all 0.3s ease;
        }
        
        header.scrolled {
            padding: 0.7rem 2rem;
            background: rgba(10, 15, 26, 0.95);
        }
        
        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .logo a {
            font-size: 1.8rem;
            font-weight: 800;
            text-decoration: none;
            background: linear-gradient(135deg, #2563eb, #7c3aed, #a855f7);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 3s ease infinite;
        }
        
        .menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 101;
        }
        
        .nav-list {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-link {
            color: #94a3b8;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            font-weight: 500;
            position: relative;
        }
        
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            transition: width 0.3s ease;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
            width: 100%;
        }
        
        .nav-link:hover,
        .nav-link.active {
            color: #fff;
        }
        
        .beta-badge {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            font-size: 0.55rem;
            padding: 0.2rem 0.5rem;
            border-radius: 20px;
            margin-left: 0.3rem;
        }
        
        .tracking-btn-main {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #fff;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .tracking-btn-main:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .product-page {
            padding: 4rem 2rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
        }
        
        .back-button {
            position: absolute;
            top: 4rem;
            left: 2rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid #2563eb;
            color: #2563eb;
            border-radius: 30px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            font-size: 0.9rem;
            text-decoration: none;
        }
        
        .back-button:hover {
            background: #2563eb;
            color: white;
            transform: translateX(-5px);
        }
        
        .close-button {
            position: absolute;
            top: 4rem;
            right: 2rem;
            width: 40px;
            height: 40px;
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid #ef4444;
            color: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            font-size: 1.2rem;
        }
        
        .close-button:hover {
            background: #ef4444;
            color: white;
            transform: scale(1.1);
        }
        
        .product-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .product-gallery {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
        }
        
        .main-image-container {
            position: relative;
            width: 100%;
            height: 450px;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 1rem;
            cursor: zoom-in;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .main-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }
        
        .main-image.zoomed {
            transform: scale(2);
            cursor: zoom-out;
        }
        
        .zoom-hint {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.7rem;
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        .gallery-nav {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 1rem;
            pointer-events: none;
        }
        
        .gallery-btn {
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.7);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            pointer-events: all;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .gallery-btn:hover:not(:disabled) {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        .gallery-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .thumbnail-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .thumbnail {
            width: 100%;
            height: 70px;
            object-fit: contain;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            padding: 0.2rem;
        }
        
        .thumbnail:hover {
            transform: translateY(-2px);
            border-color: #2563eb;
        }
        
        .thumbnail.active {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }
        
        .photo-count {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: rgba(37, 99, 235, 0.1);
            border-radius: 8px;
            color: #94a3b8;
            font-size: 0.8rem;
        }
        
        .fullscreen-btn {
            background: transparent;
            border: 1px solid #2563eb;
            color: #2563eb;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.8rem;
        }
        
        .fullscreen-btn:hover {
            background: #2563eb;
            color: white;
        }
        
        .product-info {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
        }
        
        .product-badge {
            display: inline-block;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .product-badge.sale {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        
        .product-title {
            font-size: 1.8rem;
            margin-bottom: 0.8rem;
            color: #f1f5f9;
            line-height: 1.3;
        }
        
        .product-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .product-category {
            color: #2563eb;
            background: rgba(37, 99, 235, 0.1);
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
        }
        
        .product-brand {
            color: #94a3b8;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        .product-brand img {
            height: 20px;
        }
        
        .product-price-block {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
            border-radius: 16px;
            padding: 1.2rem;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.3);
        }
        
        .current-price {
            font-size: 2rem;
            font-weight: bold;
            color: #2563eb;
        }
        
        .old-price {
            font-size: 1.2rem;
            color: #94a3b8;
            text-decoration: line-through;
            margin-left: 0.8rem;
        }
        
        .discount-info {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 0.2rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-left: 0.8rem;
        }
        
        .product-description {
            margin-bottom: 1.5rem;
            color: #94a3b8;
            line-height: 1.6;
            font-size: 0.9rem;
        }
        
        /* YouTube секция */
        .youtube-section-bottom {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin: 1.5rem 0;
        }
        
        .youtube-header-bottom {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .youtube-icon-large {
            width: 50px;
            height: 50px;
            background: #ff0000;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }
        
        .youtube-title h3 {
            font-size: 1.2rem;
            margin-bottom: 0.2rem;
            color: #f1f5f9;
        }
        
        .youtube-title p {
            font-size: 0.8rem;
            color: #94a3b8;
        }
        
        .youtube-badge {
            background: rgba(255,0,0,0.1);
            color: #ff0000;
            padding: 0.4rem 1rem;
            border-radius: 30px;
            font-weight: 600;
            border: 1px solid #ff0000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
        }
        
        .video-container-bottom {
            position: relative;
            width: 100%;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
            min-height: 200px;
        }
        
        .video-container-bottom iframe {
            width: 100%;
            height: 400px;
            border: none;
            display: block;
        }
        
        .no-video-bottom {
            text-align: center;
            padding: 3rem;
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            color: #94a3b8;
            border: 1px dashed #ff0000;
        }
        
        .product-tabs {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin: 1.5rem 0;
        }
        
        .tabs-header {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid #334155;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 0.8rem 1.5rem;
            background: transparent;
            border: none;
            color: #94a3b8;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .tab-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: #2563eb;
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .tab-btn:hover {
            color: #2563eb;
        }
        
        .tab-btn.active {
            color: #2563eb;
        }
        
        .tab-btn.active::after {
            transform: scaleX(1);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
            animation: fadeInUp 0.3s ease;
        }
        
        .formatted-description {
            color: #94a3b8;
            line-height: 1.7;
            font-size: 0.9rem;
        }
        
        .formatted-description div {
            margin-bottom: 0.5rem;
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
            font-size: 0.85rem;
        }
        
        .specs-table td:first-child {
            font-weight: 600;
            color: #f1f5f9;
            width: 180px;
        }
        
        .reviews-section {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(37, 99, 235, 0.2);
            margin: 1.5rem 0;
        }
        
        .reviews-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #f1f5f9;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .reviews-list {
            margin-bottom: 1.5rem;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .review-item {
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid #334155;
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            flex-wrap: wrap;
        }
        
        .review-author {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .review-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .review-name {
            font-weight: 600;
            color: #f1f5f9;
            font-size: 0.9rem;
        }
        
        .review-date {
            font-size: 0.7rem;
            color: #94a3b8;
        }
        
        .review-rating {
            color: #ffd700;
            font-size: 0.9rem;
        }
        
        .review-text {
            color: #94a3b8;
            line-height: 1.6;
            margin-top: 0.5rem;
            font-size: 0.85rem;
        }
        
        .admin-reply-block {
            margin-top: 0.8rem;
            padding-top: 0.8rem;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
        }
        
        .admin-reply-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .admin-reply-header i {
            color: #2563eb;
        }
        
        .admin-reply-header span {
            font-weight: 600;
            color: #2563eb;
            font-size: 0.8rem;
        }
        
        .admin-reply-text {
            color: #94a3b8;
            font-size: 0.85rem;
            line-height: 1.5;
        }
        
        .no-reviews {
            text-align: center;
            padding: 2rem;
            color: #94a3b8;
        }
        
        .add-review-form {
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            padding: 1.2rem;
            margin-top: 1rem;
        }
        
        .add-review-form h3 {
            margin-bottom: 0.8rem;
            font-size: 1rem;
        }
        
        .star-rating {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            cursor: pointer;
        }
        
        .star-rating i {
            font-size: 1.5rem;
            color: #ffd700;
            transition: all 0.2s ease;
        }
        
        .review-input, .review-name-input {
            width: 100%;
            padding: 0.7rem;
            background: #0f172a;
            border: 2px solid #334155;
            border-radius: 10px;
            color: #fff;
            margin-bottom: 0.8rem;
            resize: vertical;
            font-family: inherit;
            font-size: 0.85rem;
        }
        
        .review-input:focus, .review-name-input:focus {
            outline: none;
            border-color: #2563eb;
        }
        
        .submit-review-btn {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            padding: 0.7rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 0.9rem;
        }
        
        .submit-review-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
        }
        
        .related-products {
            margin-top: 2rem;
        }
        
        .related-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #f1f5f9;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .product-card {
            background: rgba(30, 41, 59, 0.3);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
            border: 1px solid rgba(37, 99, 235, 0.2);
            cursor: pointer;
            position: relative;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            border-color: #2563eb;
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);
        }
        
        .product-badge-sale {
            position: absolute;
            top: 8px;
            left: 8px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 0.2rem 0.6rem;
            border-radius: 20px;
            font-size: 0.65rem;
            font-weight: 600;
            z-index: 2;
        }
        
        .product-image-container {
            height: 150px;
            overflow: hidden;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
            transform: scale(1.05);
        }
        
        .product-card .product-info {
            padding: 0.8rem;
            background: transparent;
            border: none;
        }
        
        .product-card .product-category {
            font-size: 0.65rem;
            color: #60a5fa;
            margin-bottom: 0.3rem;
        }
        
        .product-card .product-name {
            font-size: 0.85rem;
            margin-bottom: 0.3rem;
            font-weight: 600;
            color: #f1f5f9;
        }
        
        .product-card .product-price {
            font-size: 0.9rem;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
        }
        
        .fullscreen-gallery {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.98);
            z-index: 3000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .fullscreen-gallery.active {
            display: flex;
        }
        
        .fullscreen-image-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .fullscreen-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            transition: transform 0.3s ease;
            cursor: zoom-in;
        }
        
        .fullscreen-image.zoomed {
            transform: scale(2);
            cursor: zoom-out;
        }
        
        .fullscreen-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.1);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 3001;
        }
        
        .fullscreen-close:hover {
            background: #ef4444;
            transform: scale(1.1);
        }
        
        .fullscreen-nav {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 2rem;
            pointer-events: none;
            z-index: 3001;
        }
        
        .fullscreen-nav-btn {
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.1);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            pointer-events: all;
            transition: all 0.3s ease;
        }
        
        .fullscreen-nav-btn:hover {
            background: #2563eb;
            transform: scale(1.1);
        }
        
        .fullscreen-counter {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0,0,0,0.5);
            padding: 0.5rem 1.5rem;
            border-radius: 30px;
            font-size: 0.9rem;
            border: 1px solid rgba(255,255,255,0.2);
            z-index: 3001;
        }
        
        footer {
            background: #0a0f1a;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
            margin-top: 3rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .footer-section h3 {
            font-size: 1.3rem;
            margin-bottom: 0.8rem;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .footer-section h4 {
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
        }
        
        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 0.3rem;
        }
        
        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.8rem;
        }
        
        .footer-links a:hover {
            color: #60a5fa;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.3rem;
            color: #94a3b8;
            font-size: 0.8rem;
        }
        
        .social-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .social-link {
            width: 36px;
            height: 36px;
            background: rgba(37, 99, 235, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
            border: 1px solid rgba(37, 99, 235, 0.3);
        }
        
        .social-link:hover {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            transform: translateY(-3px) rotate(360deg);
        }
        
        .footer-bottom {
            text-align: center;
            padding: 1rem;
            border-top: 1px solid rgba(37, 99, 235, 0.2);
            color: #64748b;
            font-size: 0.7rem;
        }
        
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 100;
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
        }
        
        .back-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5);
        }
        
        .back-to-top.show {
            display: flex;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 4000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            background: #1e293b;
            margin: 15% auto;
            padding: 1.5rem;
            border-radius: 20px;
            width: 90%;
            max-width: 400px;
            border: 1px solid rgba(37, 99, 235, 0.3);
            animation: scaleIn 0.3s ease;
        }
        
        .close-modal {
            float: right;
            font-size: 1.3rem;
            cursor: pointer;
            background: none;
            border: none;
            color: #94a3b8;
        }
        
        .form-group {
            margin-bottom: 0.8rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.3rem;
            color: #94a3b8;
            font-size: 0.85rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.6rem;
            background: #0f172a;
            border: 2px solid #334155;
            border-radius: 10px;
            color: #fff;
        }
        
        .btn-primary-modal {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #fff;
            border: none;
            padding: 0.7rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
        }
        
        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
            
            .nav-list {
                display: none;
                position: absolute;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(10, 15, 26, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 1rem;
                gap: 1rem;
                border-bottom: 1px solid rgba(37, 99, 235, 0.3);
                z-index: 99;
            }
            
            .nav-list.show {
                display: flex;
            }
            
            .product-container {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .main-image-container {
                height: 300px;
            }
            
            .thumbnail-grid {
                grid-template-columns: repeat(4, 1fr);
            }
            
            .thumbnail {
                height: 55px;
            }
            
            .back-button {
                top: 5rem;
                left: 1rem;
                padding: 0.4rem 1rem;
                font-size: 0.8rem;
            }
            
            .close-button {
                top: 5rem;
                right: 1rem;
                width: 35px;
                height: 35px;
                font-size: 1rem;
            }
            
            .product-title {
                font-size: 1.4rem;
            }
            
            .current-price {
                font-size: 1.6rem;
            }
            
            .tracking-btn-main span {
                display: none;
            }
            
            .tracking-btn-main {
                padding: 0.5rem 0.8rem;
            }
            
            .products-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .fullscreen-nav-btn {
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
            
            .video-container-bottom iframe {
                height: 250px;
            }
            
            .youtube-header-bottom {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <!-- ====== HEADER ====== -->
    <header id="mainHeader">
        <div class="header-container">
            <div class="logo">
                <a href="index.html">GGPoint</a>
            </div>
            
            <button class="menu-toggle" id="menuToggle">
                <i class="fas fa-bars"></i>
            </button>
            
            <nav>
                <ul class="nav-list" id="navList">
                    <li><a href="index.html" class="nav-link"><i class="fas fa-home"></i>Главная</a></li>
                    <li><a href="catalog.html" class="nav-link"><i class="fas fa-th-large"></i>Каталог</a></li>
                    <li><a href="keycaps.html" class="nav-link"><i class="fas fa-keyboard"></i>Кейкапы<span class="beta-badge">Коллекция</span></a></li>
                    <li><a href="pads.html" class="nav-link"><i class="fas fa-mouse-pointer"></i>Коврики<span class="beta-badge">Новинка</span></a></li>
                    <li><a href="mb.html" class="nav-link"><i class="fas fa-microchip"></i>MB<span class="beta-badge">Материнские платы</span></a></li>
                    <li><a href="about.html" class="nav-link"><i class="fas fa-info-circle"></i>О нас</a></li>
                    <li><a href="contacts.html" class="nav-link"><i class="fas fa-phone"></i>Контакты</a></li>
                </ul>
            </nav>
            
            <div class="header-actions">
                <button class="tracking-btn-main" id="trackingBtn">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Отследить</span>
                </button>
            </div>
        </div>
    </header>

    <!-- ====== КНОПКИ НАВИГАЦИИ ====== -->
    <button class="back-button" onclick="goBack()"><i class="fas fa-arrow-left"></i><span>Назад</span></button>
    <button class="close-button" onclick="closeAndGoBack()" title="Закрыть"><i class="fas fa-times"></i></button>

    <!-- ====== СТРАНИЦА ТОВАРА ====== -->
    <div class="product-page">
        <div class="product-container">
            <!-- Галерея -->
            <div class="product-gallery">
                <div class="main-image-container" id="mainImageContainer">
                    <img src="<?php echo htmlspecialchars($product['images'][0] ?? 'https://via.placeholder.com/500x400/1e293b/2563eb?text=Нет+фото'); ?>" 
                         alt="<?php echo htmlspecialchars($product['name']); ?>" 
                         class="main-image" id="mainImage">
                    <div class="zoom-hint"><i class="fas fa-search-plus"></i><span>Клик для увеличения</span></div>
                    <div class="gallery-nav">
                        <button class="gallery-btn" id="prevImageBtn" onclick="changeImage(-1)"><i class="fas fa-chevron-left"></i></button>
                        <button class="gallery-btn" id="nextImageBtn" onclick="changeImage(1)"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="thumbnail-grid" id="thumbnailGrid">
                    <?php foreach ($product['images'] ?? [] as $index => $img): ?>
                        <img src="<?php echo htmlspecialchars($img); ?>" 
                             alt="<?php echo htmlspecialchars($product['name']); ?>" 
                             class="thumbnail <?php echo $index === 0 ? 'active' : ''; ?>" 
                             onclick="setImage(<?php echo $index; ?>)">
                    <?php endforeach; ?>
                </div>
                <div class="photo-count">
                    <span><i class="fas fa-camera"></i> <span id="photoCount"><?php echo count($product['images'] ?? []); ?> фото</span></span>
                    <button class="fullscreen-btn" onclick="openFullscreen()"><i class="fas fa-expand"></i> На весь экран</button>
                </div>
            </div>
            
            <!-- Информация о товаре -->
            <div class="product-info">
                <div id="saleBadge">
                    <?php if (isset($product['sale']) && $product['sale']): ?>
                        <span class="product-badge sale"><i class="fas fa-fire"></i> Скидка!</span>
                    <?php endif; ?>
                </div>
                <h1 class="product-title" id="productTitle"><?php echo htmlspecialchars($product['name']); ?></h1>
                <div class="product-meta">
                    <span class="product-category" id="productCategory"><?php echo htmlspecialchars($product['category'] ?? 'Товар'); ?></span>
                    <div class="product-brand" id="productBrand">
                        <span><?php echo htmlspecialchars($product['brand'] ?? ''); ?></span>
                    </div>
                </div>
                <div class="product-price-block">
                    <span class="current-price" id="productPrice"><?php echo htmlspecialchars($product['price'] ?? 'Цена не указана'); ?></span>
                    <?php if (isset($product['old_price']) && $product['old_price']): ?>
                        <span class="old-price" id="oldPrice"><?php echo htmlspecialchars($product['old_price']); ?></span>
                        <span class="discount-info" id="discountInfo">🔥 -<?php echo round((1 - (preg_replace('/[^0-9]/', '', $product['price']) / preg_replace('/[^0-9]/', '', $product['old_price']))) * 100); ?>%</span>
                    <?php endif; ?>
                </div>
                <div class="product-description" id="productDescription">
                    <?php 
                    $desc = $product['description'] ?? '';
                    echo nl2br(htmlspecialchars(mb_substr($desc, 0, 200)));
                    if (mb_strlen($desc) > 200) echo '...';
                    ?>
                </div>
            </div>
        </div>
        
        <!-- YouTube секция -->
        <div class="youtube-section-bottom" id="youtubeSectionBottom">
            <div class="youtube-header-bottom">
                <div class="youtube-icon-large"><i class="fab fa-youtube"></i></div>
                <div class="youtube-title">
                    <h3>Видеообзор товара</h3>
                    <p>Смотрите подробный обзор на YouTube канале</p>
                </div>
                <div class="youtube-badge"><i class="fas fa-play"></i><span>Смотреть</span></div>
            </div>
            <div id="videoContainerBottom" class="video-container-bottom">
                <?php 
                $videoId = '';
                if (isset($product['video']) && $product['video']) {
                    if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/i', $product['video'], $matches)) {
                        $videoId = $matches[1];
                    }
                }
                ?>
                <?php if ($videoId): ?>
                    <iframe src="https://www.youtube.com/embed/<?php echo $videoId; ?>?autoplay=0&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
                <?php else: ?>
                    <div class="no-video-bottom"><i class="fab fa-youtube"></i><h4>Видеообзор скоро появится</h4></div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Вкладки -->
        <div class="product-tabs">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="desc">Полное описание</button>
                <button class="tab-btn" data-tab="specs">Характеристики</button>
            </div>
            <div class="tab-content active" id="tab-desc">
                <div id="fullDescription" class="formatted-description">
                    <?php 
                    $fullDesc = $product['description'] ?? 'Описание отсутствует';
                    echo nl2br(htmlspecialchars($fullDesc));
                    ?>
                </div>
            </div>
            <div class="tab-content" id="tab-specs">
                <table class="specs-table" id="specsTable">
                    <tr><td style="font-weight:600;color:#f1f5f9;">Бренд</td><td><?php echo htmlspecialchars($product['brand'] ?? '-'); ?></td></tr>
                    <tr><td style="font-weight:600;color:#f1f5f9;">Категория</td><td><?php echo htmlspecialchars($product['category'] ?? '-'); ?></td></tr>
                    <tr><td style="font-weight:600;color:#f1f5f9;">Артикул</td><td><?php echo htmlspecialchars($productId); ?></td></tr>
                    <?php if (isset($product['specs']) && is_array($product['specs'])): ?>
                        <?php foreach ($product['specs'] as $key => $value): ?>
                            <tr><td style="font-weight:600;color:#f1f5f9;"><?php echo htmlspecialchars($key); ?></td><td><?php echo htmlspecialchars($value); ?></td></tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </table>
            </div>
        </div>
        
        <!-- Отзывы -->
        <div class="reviews-section" id="reviewsSection">
            <div class="reviews-title">
                <i class="fas fa-star" style="color:#ffd700;"></i> 
                Отзывы о товаре <span id="reviewsCount" style="font-size:0.9rem; color:#94a3b8;"></span>
            </div>
            <div class="reviews-list" id="reviewsList">
                <div class="no-reviews">Загрузка отзывов...</div>
            </div>
            
            <div class="add-review-form">
                <h3>Оставить отзыв</h3>
                <div class="star-rating" id="starRating">
                    <i class="far fa-star" data-rating="1"></i><i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i><i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                </div>
                <input type="text" id="reviewName" class="review-name-input" placeholder="Ваше имя" maxlength="50">
                <textarea id="reviewText" class="review-input" rows="3" placeholder="Поделитесь впечатлениями о товаре..." maxlength="999"></textarea>
                <button class="submit-review-btn" id="submitReviewBtn" onclick="submitReview()">
                    <i class="fas fa-paper-plane"></i> Отправить отзыв
                </button>
            </div>
        </div>
        
        <!-- Похожие товары -->
        <div class="related-products">
            <h2 class="related-title">Похожие товары</h2>
            <div class="products-grid" id="relatedProducts"></div>
        </div>
    </div>

    <!-- ====== FULLSCREEN GALLERY ====== -->
    <div class="fullscreen-gallery" id="fullscreenGallery">
        <button class="fullscreen-close" onclick="closeFullscreen()">×</button>
        <div class="fullscreen-nav">
            <button class="fullscreen-nav-btn" onclick="fullscreenChangeImage(-1)"><i class="fas fa-chevron-left"></i></button>
            <button class="fullscreen-nav-btn" onclick="fullscreenChangeImage(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="fullscreen-image-container">
            <img src="" alt="" class="fullscreen-image" id="fullscreenImage" onclick="toggleFullscreenZoom()">
        </div>
        <div class="fullscreen-counter" id="fullscreenCounter">1 / 1</div>
    </div>

    <!-- ====== FOOTER ====== -->
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>GGPoint</h3>
                <p>Ваш надежный магазин игровой периферии в Узбекистане.</p>
                <div class="social-links">
                    <a href="https://t.me/GGPointUz" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>
                </div>
            </div>
            <div class="footer-section">
                <h4>Навигация</h4>
                <ul class="footer-links">
                    <li><a href="index.html">Главная</a></li>
                    <li><a href="catalog.html">Каталог</a></li>
                    <li><a href="keycaps.html">Кейкапы</a></li>
                    <li><a href="pads.html">Коврики</a></li>
                    <li><a href="mb.html">MB</a></li>
                    <li><a href="about.html">О нас</a></li>
                    <li><a href="contacts.html">Контакты</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Контакты</h4>
                <div class="contact-info">
                    <div class="contact-item"><i class="fas fa-phone"></i><span>+998 97 747 0157</span></div>
                    <div class="contact-item"><i class="fab fa-telegram"></i><span><a href="https://t.me/GGPointUz" target="_blank">@GGPointUz</a></span></div>
                </div>
            </div>
        </div>
        <div class="footer-bottom"><p>&copy; 2025 GGPoint. Все права защищены.</p></div>
    </footer>

    <!-- ====== КНОПКА НАВЕРХ ====== -->
    <button class="back-to-top" id="backToTop"><i class="fas fa-arrow-up"></i></button>

    <!-- ====== МОДАЛКА АДМИНКИ ====== -->
    <div class="modal" id="adminLoginModal">
        <div class="modal-content">
            <button class="close-modal" id="closeAdminModal">&times;</button>
            <h2 style="background:linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; text-align:center; margin-bottom:1.5rem;">Вход в админ-панель</h2>
            <form id="adminLoginForm">
                <div class="form-group"><label>Логин</label><input type="text" id="adminLogin" required></div>
                <div class="form-group"><label>Пароль</label><input type="password" id="adminPassword" required></div>
                <button type="submit" class="btn-primary-modal"><i class="fas fa-sign-in-alt"></i> Войти</button>
            </form>
        </div>
    </div>

    <!-- ====== JAVASCRIPT ====== -->
    <script>
        // Данные товара из PHP
        const productData = <?php echo $productJson; ?>;
        const productId = '<?php echo $productId; ?>';
        const productImages = <?php echo json_encode($product['images'] ?? []); ?>;
        let currentImageIndex = 0;
        let selectedRating = 5;

        // ====== ГАЛЕРЕЯ ======
        function setImage(index) {
            if (index < 0 || index >= productImages.length) return;
            currentImageIndex = index;
            document.getElementById('mainImage').src = productImages[index];
            document.getElementById('fullscreenImage').src = productImages[index];
            document.querySelectorAll('.thumbnail').forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
            document.getElementById('photoCount').textContent = `${productImages.length} фото`;
            document.getElementById('fullscreenCounter').textContent = `${index + 1} / ${productImages.length}`;
        }

        function changeImage(delta) {
            const newIndex = currentImageIndex + delta;
            if (newIndex >= 0 && newIndex < productImages.length) {
                setImage(newIndex);
            }
        }

        function openFullscreen() {
            const gallery = document.getElementById('fullscreenGallery');
            gallery.classList.add('active');
            document.getElementById('fullscreenImage').src = productImages[currentImageIndex];
            document.getElementById('fullscreenCounter').textContent = `${currentImageIndex + 1} / ${productImages.length}`;
            document.body.style.overflow = 'hidden';
        }

        function closeFullscreen() {
            document.getElementById('fullscreenGallery').classList.remove('active');
            document.body.style.overflow = '';
        }

        function fullscreenChangeImage(delta) {
            let newIndex = currentImageIndex + delta;
            if (newIndex < 0) newIndex = productImages.length - 1;
            if (newIndex >= productImages.length) newIndex = 0;
            setImage(newIndex);
            document.getElementById('fullscreenImage').classList.remove('zoomed');
        }

        function toggleFullscreenZoom() {
            document.getElementById('fullscreenImage').classList.toggle('zoomed');
        }

        // ====== НАВИГАЦИЯ ======
        function goBack() {
            document.referrer ? window.history.back() : window.location.href = 'catalog.html';
        }

        function closeAndGoBack() {
            document.referrer ? window.history.back() : window.location.href = 'catalog.html';
        }

        // ====== ТАБЫ ======
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        // ====== ЗВЕЗДЫ ДЛЯ ОТЗЫВОВ ======
        function updateStarDisplay(rating) {
            document.querySelectorAll('#starRating i').forEach((star, i) => {
                star.className = i < rating ? 'fas fa-star' : 'far fa-star';
            });
        }

        document.querySelectorAll('#starRating i').forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                updateStarDisplay(selectedRating);
            });
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                document.querySelectorAll('#starRating i').forEach((s, i) => {
                    s.className = i < rating ? 'fas fa-star' : 'far fa-star';
                });
            });
        });
        document.getElementById('starRating').addEventListener('mouseleave', () => updateStarDisplay(selectedRating));

        // ====== ОТЗЫВЫ (Firebase) ======
        // Импорт Firebase
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
        import { getDatabase, ref, onValue, push } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

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
        const database = getDatabase(app);

        // Загрузка отзывов
        function loadReviews() {
            const reviewsRef = ref(database, 'reviews');
            onValue(reviewsRef, (snapshot) => {
                const data = snapshot.val();
                const reviews = data ? Object.values(data).filter(r => r.productId == productId && r.status === 'approved') : [];
                renderReviews(reviews);
            });
        }

        function renderReviews(reviews) {
            const container = document.getElementById('reviewsList');
            const countSpan = document.getElementById('reviewsCount');
            
            if (reviews.length === 0) {
                container.innerHTML = '<div class="no-reviews"><i class="fas fa-comment"></i><br>Пока отзывов нет. Будьте первым!</div>';
                if (countSpan) countSpan.textContent = '(0)';
                return;
            }
            
            if (countSpan) countSpan.textContent = `(${reviews.length})`;
            container.innerHTML = reviews.map(r => `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-author">
                            <div class="review-avatar">${(r.author?.charAt(0) || 'А').toUpperCase()}</div>
                            <div><div class="review-name">${escapeHtml(r.author) || 'Аноним'}</div>
                            <div class="review-date">${new Date(r.date).toLocaleDateString('ru-RU')}</div></div>
                        </div>
                        <div class="review-rating">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
                    </div>
                    <div class="review-text">${escapeHtml(r.text)}</div>
                    ${r.adminReply ? `
                        <div class="admin-reply-block">
                            <div class="admin-reply-header"><i class="fas fa-user-shield"></i><span>Ответ администратора</span></div>
                            <div class="admin-reply-text">${escapeHtml(r.adminReply)}</div>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
        }

        async function submitReview() {
            const name = document.getElementById('reviewName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            
            if (!text) { showNotification('Напишите текст отзыва'); return; }
            if (text.length < 5) { showNotification('Отзыв должен содержать минимум 5 символов'); return; }
            
            try {
                await push(ref(database, 'reviews'), {
                    productId: productId,
                    productName: productData?.name || 'Товар',
                    author: name || 'Аноним',
                    text: text,
                    rating: selectedRating,
                    date: new Date().toISOString(),
                    status: 'pending'
                });
                showNotification('Спасибо за отзыв! Он появится после модерации.');
                document.getElementById('reviewName').value = '';
                document.getElementById('reviewText').value = '';
                selectedRating = 5;
                updateStarDisplay(5);
            } catch (error) {
                showNotification('Ошибка при отправке отзыва');
            }
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = 'position:fixed; top:20px; right:20px; background:#10b981; color:white; padding:0.8rem 1.2rem; border-radius:8px; font-weight:600; z-index:9999; animation:slideIn 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.2); font-size:0.9rem;';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // ====== ПОХОЖИЕ ТОВАРЫ ======
        function loadRelatedProducts() {
            const productsRef = ref(database, 'products');
            onValue(productsRef, (snapshot) => {
                const data = snapshot.val();
                const products = data ? Object.entries(data).map(([id, d]) => ({ ...d, id })) : [];
                renderRelatedProducts(products);
            });
        }

        function renderRelatedProducts(products) {
            if (!productData) return;
            const related = products
                .filter(p => p.category === productData.category && p.id != productId)
                .slice(0, 4);
            
            const grid = document.getElementById('relatedProducts');
            if (!grid) return;
            
            if (related.length === 0) {
                grid.innerHTML = '<p style="color: #94a3b8;">Похожих товаров не найдено</p>';
                return;
            }
            
            grid.innerHTML = related.map(p => `
                <div class="product-card" data-id="${p.id}">
                    ${p.sale ? '<div class="product-badge-sale"><i class="fas fa-fire"></i> Скидка</div>' : ''}
                    <div class="product-image-container">
                        <img src="${p.images?.[0] || 'https://via.placeholder.com/300x200/1e293b/2563eb?text=Нет+фото'}" 
                             class="product-image" 
                             alt="${escapeHtml(p.name)}" 
                             loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${escapeHtml(p.category || 'Товар')}</div>
                        <h3 class="product-name">${escapeHtml(p.name)}</h3>
                        <p class="product-price">${escapeHtml(p.price || 'Цена не указана')}</p>
                    </div>
                </div>
            `).join('');
            
            document.querySelectorAll('#relatedProducts .product-card').forEach(card => {
                const id = card.dataset.id;
                card.addEventListener('click', () => window.location.href = `product.php?id=${id}`);
            });
        }

        // ====== SCROLL ======
        window.addEventListener('scroll', () => {
            const header = document.getElementById('mainHeader');
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
            document.getElementById('backToTop').classList.toggle('show', window.scrollY > 300);
        });

        document.getElementById('backToTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.getElementById('trackingBtn')?.addEventListener('click', () => {
            window.location.href = 'tracking.html';
        });

        // ====== MOBILE MENU ======
        const menuToggle = document.getElementById('menuToggle');
        const navList = document.getElementById('navList');
        let isMenuOpen = false;
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                isMenuOpen = !isMenuOpen;
                navList.classList.toggle('show');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars', 'fa-times');
                    icon.classList.add(isMenuOpen ? 'fa-times' : 'fa-bars');
                }
            });
            navList.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('show');
                    isMenuOpen = false;
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.classList.remove('fa-times');
                });
            });
        }

        // ====== ADMIN LOGIN ======
        let ctrlClickCount = 0;
        let ctrlClickTimer = null;
        document.addEventListener('click', e => {
            if (e.ctrlKey) {
                ctrlClickCount++;
                clearTimeout(ctrlClickTimer);
                ctrlClickTimer = setTimeout(() => ctrlClickCount = 0, 800);
                if (ctrlClickCount === 3) {
                    document.getElementById('adminLoginModal').style.display = 'block';
                    ctrlClickCount = 0;
                }
            }
        });

        document.getElementById('closeAdminModal')?.addEventListener('click', () => {
            document.getElementById('adminLoginModal').style.display = 'none';
        });

        window.addEventListener('click', e => {
            if (e.target === document.getElementById('adminLoginModal')) {
                document.getElementById('adminLoginModal').style.display = 'none';
            }
        });

        document.getElementById('adminLoginForm')?.addEventListener('submit', e => {
            e.preventDefault();
            if (document.getElementById('adminLogin').value === 'admin' && 
                document.getElementById('adminPassword').value === 'admin') {
                document.getElementById('adminLoginModal').style.display = 'none';
                window.location.href = 'admin-panel.html';
            } else {
                alert('Неверный логин или пароль!');
            }
        });

        // ====== MAIN IMAGE ZOOM ======
        document.getElementById('mainImageContainer')?.addEventListener('click', () => {
            document.getElementById('mainImage').classList.toggle('zoomed');
        });

        // ====== INIT ======
        // Инициализация галереи
        if (productImages.length > 0) {
            setImage(0);
        }

        // Загрузка отзывов и похожих товаров
        loadReviews();
        loadRelatedProducts();

        // Обновляем количество фото
        document.getElementById('photoCount').textContent = `${productImages.length} фото`;

        // Навигация по клавишам
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'Escape') {
                if (document.getElementById('fullscreenGallery').classList.contains('active')) {
                    closeFullscreen();
                }
            }
        });
    </script>
</body>
</html>
