import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// Firebase config
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

let products = [];
let hotPrices = {};
let brands = {};

// Load data
function loadData() {
    // Products
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        products = data ? Object.values(data) : [];
        updateUI();
    });

    // Hot prices
    const hotPricesRef = ref(database, 'hotPrices');
    onValue(hotPricesRef, (snapshot) => {
        hotPrices = snapshot.val() || {};
        updateUI();
    });

    // Brands
    const brandsRef = ref(database, 'brands');
    onValue(brandsRef, (snapshot) => {
        brands = snapshot.val() || {};
        renderBrands();
    });
}

// Update UI
function updateUI() {
    updateCategoryCounts();
    renderNewProducts();
    renderHotPrices();
}

// Update category counts
function updateCategoryCounts() {
    const categories = {
        'мышь': 'mouseCount',
        'клавиатура': 'keyboardCount',
        'наушники': 'headphonesCount',
        'монитор': 'monitorCount'
    };
    
    Object.entries(categories).forEach(([category, elementId]) => {
        const count = products.filter(p => p.category === category).length;
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${count} товаров`;
        }
    });
}

// Render brands
function renderBrands() {
    const brandsGrid = document.getElementById('brandsGrid');
    if (!brandsGrid) return;
    
    brandsGrid.innerHTML = '';
    
    // All brands card
    const allCard = createBrandCard('Все бренды', null, 'all');
    brandsGrid.appendChild(allCard);
    
    // Brand cards
    Object.values(brands).forEach(brand => {
        const card = createBrandCard(brand.name, brand.icon);
        brandsGrid.appendChild(card);
    });
}

function createBrandCard(name, icon, value = name) {
    const card = document.createElement('div');
    card.className = 'brand-card';
    card.dataset.brand = value;
    
    if (value === 'all') {
        card.innerHTML = `
            <div class="brand-logo">
                <i class="fas fa-layer-group" style="font-size: 2.5rem; color: #cbd5e1"></i>
            </div>
            <div class="brand-name">${name}</div>
        `;
    } else {
        card.innerHTML = `
            <div class="brand-logo">
                <img src="${icon}" alt="${name}" onerror="this.src='https://via.placeholder.com/100x100/666/fff?text=${name}'">
            </div>
            <div class="brand-name">${name}</div>
        `;
    }
    
    card.addEventListener('click', () => {
        window.location.href = `catalog.html?brand=${value}`;
    });
    
    return card;
}

// Render new products
function renderNewProducts() {
    const grid = document.getElementById('newProductsGrid');
    if (!grid) return;
    
    const newProducts = [...products]
        .filter(p => p.category !== 'keycaps')
        .sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0))
        .slice(0, 4);
    
    grid.innerHTML = '';
    
    newProducts.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

// Render hot prices
function renderHotPrices() {
    const grid = document.getElementById('hotPricesGrid');
    if (!grid) return;
    
    const hotProducts = Object.keys(hotPrices)
        .map(id => products.find(p => p.id == id))
        .filter(p => p && p.category !== 'keycaps')
        .slice(0, 4);
    
    grid.innerHTML = '';
    
    if (hotProducts.length === 0) {
        grid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-fire" style="font-size: 3rem; color: #ff6b00; margin-bottom: 1rem;"></i>
                <h3>Скоро появятся скидки!</h3>
                <p style="color: var(--text-secondary);">Следите за обновлениями</p>
            </div>
        `;
        return;
    }
    
    hotProducts.forEach(product => {
        grid.appendChild(createHotPriceCard(product, hotPrices[product.id]));
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.images?.[0] || 'https://via.placeholder.com/300x200/ffffff/333333?text=Нет+фото'}" 
                 alt="${product.name}" 
                 class="product-image">
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description-short">${product.description?.substring(0, 80)}...</p>
            <p class="product-price">${product.price}</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        // Open product detail
        console.log('Open product:', product);
    });
    
    return card;
}

function createHotPriceCard(product, hotInfo) {
    const card = document.createElement('div');
    card.className = 'hot-price-card';
    
    card.innerHTML = `
        <div class="hot-price-badge">
            <i class="fas fa-fire"></i>
            СКИДКА
        </div>
        <div class="hot-price-image-container">
            <img src="${product.images?.[0] || 'https://via.placeholder.com/300x200/ffffff/333333?text=Нет+фото'}" 
                 alt="${product.name}" 
                 class="hot-price-image">
        </div>
        <div class="hot-price-info">
            <h3 class="hot-price-name">${product.name}</h3>
            <p class="hot-price-description">${product.description?.substring(0, 60)}...</p>
            <div class="hot-price-prices">
                <span class="new-price">${product.price}</span>
                <span class="discount-percent">-30%</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        // Open product detail
        console.log('Open hot product:', product);
    });
    
    return card;
}

function getCategoryName(key) {
    const categories = {
        'мышь': 'Мышь',
        'клавиатура': 'Клавиатура',
        'наушники': 'Наушники',
        'монитор': 'Монитор',
        'keycaps': 'Кейкапы'
    };
    return categories[key] || key;
}

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

updateCartCount();

// Admin login
document.getElementById('adminBtn')?.addEventListener('click', () => {
    window.location.href = 'admin-login.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
function loadCategoryCounts() {
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
        const products = snapshot.val() ? Object.values(snapshot.val()) : [];
        
        // Считаем товары по категориям
        const counts = {
            'мышь': products.filter(p => p.category === 'мышь').length,
            'клавиатура': products.filter(p => p.category === 'клавиатура').length,
            'наушники': products.filter(p => p.category === 'наушники').length,
            'монитор': products.filter(p => p.category === 'монитор').length,
            'keycaps': products.filter(p => p.category === 'keycaps').length
        };
        
        // Обновляем счетчики
        document.getElementById('mouseCount').textContent = `${counts.мышь} товаров`;
        document.getElementById('keyboardCount').textContent = `${counts.клавиатура} товаров`;
        document.getElementById('headphonesCount').textContent = `${counts.наушники} товаров`;
        document.getElementById('monitorCount').textContent = `${counts.монитор} товаров`;
        
        // Добавляем счетчик для кейкапов
        const keycapsElement = document.getElementById('keycapsCount');
        if (keycapsElement) {
            keycapsElement.textContent = `${counts.keycaps} товаров`;
        }
        
        // Обновляем общее количество товаров
        const totalElement = document.getElementById('totalProducts');
        if (totalElement) {
            totalElement.textContent = products.length;
        }
    });
}