// generate-sitemap.js
const fs = require('fs');
const path = require('path');

// Загружаем товары
const products = require('./data/products.json');

// Базовый URL
const baseUrl = 'https://mirzarasulov.github.io/ggpoint';

// Генерируем sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Главные страницы -->
    <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
    <url><loc>${baseUrl}/catalog.html</loc><priority>0.9</priority></url>
    <url><loc>${baseUrl}/about.html</loc><priority>0.8</priority></url>
    <url><loc>${baseUrl}/contacts.html</loc><priority>0.8</priority></url>
    <url><loc>${baseUrl}/keycaps.html</loc><priority>0.8</priority></url>
    <url><loc>${baseUrl}/pads.html</loc><priority>0.8</priority></url>
    <url><loc>${baseUrl}/mb.html</loc><priority>0.8</priority></url>
    
    <!-- Товары -->`;

// Добавляем все товары
products.products.forEach(product => {
    sitemap += `
    <url><loc>${baseUrl}/product.html?id=${product.id}</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>`;
});

sitemap += `
</urlset>`;

// Сохраняем файл
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap создан!');
