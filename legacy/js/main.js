// GGPoint Main JavaScript
// Общая логика для всех страниц

// ========== Корзина ==========
const CartManager = {
    // Получить корзину
    getCart() {
        const cart = localStorage.getItem('ggpoint_cart');
        return cart ? JSON.parse(cart) : [];
    },
    
    // Добавить товар
    addItem(product, quantity = 1) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                quantity: quantity
            });
        }
        
        localStorage.setItem('ggpoint_cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Товар добавлен в корзину', 'success');
        return cart;
    },
    
    // Удалить товар
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('ggpoint_cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Товар удален из корзины', 'info');
        return cart;
    },
    
    // Обновить количество
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            localStorage.setItem('ggpoint_cart', JSON.stringify(cart));
            this.updateCartCount();
        }
        return cart;
    },
    
    // Очистить корзину
    clearCart() {
        localStorage.removeItem('ggpoint_cart');
        this.updateCartCount();
        this.showNotification('Корзина очищена', 'info');
        return [];
    },
    
    // Обновить счетчик в иконке корзины
    updateCartCount() {
        const cart = this.getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadges = document.querySelectorAll('.cart-count');
        cartBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },
    
    // Показать уведомление
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// ========== Избранное ==========
const FavoritesManager = {
    getFavorites() {
        const favorites = localStorage.getItem('ggpoint_favorites');
        return favorites ? JSON.parse(favorites) : [];
    },
    
    addFavorite(productId) {
        let favorites = this.getFavorites();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('ggpoint_favorites', JSON.stringify(favorites));
            this.showNotification('Добавлено в избранное', 'success');
        }
        return favorites;
    },
    
    removeFavorite(productId) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem('ggpoint_favorites', JSON.stringify(favorites));
        this.showNotification('Удалено из избранного', 'info');
        return favorites;
    },
    
    isFavorite(productId) {
        return this.getFavorites().includes(productId);
    },
    
    toggleFavorite(productId) {
        if (this.isFavorite(productId)) {
            return this.removeFavorite(productId);
        } else {
            return this.addFavorite(productId);
        }
    },
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'heart' : 'info-circle'}"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// ========== Кнопка "Наверх" ==========
const BackToTop = {
    init() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// ========== Адаптивные изображения (lazy loading) ==========
const LazyLoadImages = {
    init() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // Intersection Observer для еще более ленивой загрузки
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => observer.observe(img));
        }
    }
};

// ========== Уведомления ==========
const Notifications = {
    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },
    
    show(title, body, icon = '/images/favicon-32x32.png') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon });
        }
    }
};

// ========== Отслеживание просмотров товаров ==========
const RecentlyViewed = {
    addProduct(product) {
        let viewed = this.getProducts();
        viewed = viewed.filter(p => p.id !== product.id);
        viewed.unshift(product);
        if (viewed.length > 10) viewed.pop();
        localStorage.setItem('ggpoint_recently_viewed', JSON.stringify(viewed));
    },
    
    getProducts() {
        const viewed = localStorage.getItem('ggpoint_recently_viewed');
        return viewed ? JSON.parse(viewed) : [];
    },
    
    clear() {
        localStorage.removeItem('ggpoint_recently_viewed');
    }
};

// ========== Инициализация ==========
document.addEventListener('DOMContentLoaded', () => {
    // Кнопка "Наверх"
    BackToTop.init();
    
    // Lazy loading
    LazyLoadImages.init();
    
    // Обновление счетчика корзины
    CartManager.updateCartCount();
    
    // Запрос разрешения на уведомления (опционально)
    // Notifications.requestPermission();
    
    // Обработка добавления в корзину на страницах
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const product = JSON.parse(btn.dataset.product || '{}');
            if (product.id) {
                CartManager.addItem(product);
            }
        });
    });
    
    // Обработка добавления в избранное
    document.querySelectorAll('.add-to-favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = btn.dataset.id;
            if (productId) {
                FavoritesManager.toggleFavorite(productId);
                btn.classList.toggle('favorite-active');
            }
        });
    });
});

// Экспорт для глобального использования
window.GGPoint = {
    cart: CartManager,
    favorites: FavoritesManager,
    recentlyViewed: RecentlyViewed,
    notifications: Notifications
};
