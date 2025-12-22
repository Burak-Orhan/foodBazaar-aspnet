let isLoading = false;

// Show loading state for restaurant header
function showRestaurantHeaderSkeleton() {
    const headerContainer = document.getElementById('restaurantHeader');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
                <div class="glass-card overflow-hidden">
                    <div class="flex flex-col md:flex-row gap-6 p-6">
                        <!-- Restaurant Image Skeleton -->
                        <div class="w-full md:w-1/3 flex-shrink-0">
                            <div class="relative aspect-video md:aspect-square rounded-xl overflow-hidden">
                                <div class="skeleton w-full h-full"></div>
                            </div>
                        </div>

                        <!-- Restaurant Details Skeleton -->
                        <div class="flex-1 flex flex-col justify-between">
                            <div>
                                <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                                    <div class="skeleton skeleton-text large" style="width: 60%;"></div>
                                    <div class="skeleton" style="width: 80px; height: 32px; border-radius: 9999px;"></div>
                                </div>

                                <!-- Rating Skeleton -->
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="skeleton skeleton-text" style="width: 150px;"></div>
                                </div>

                                <!-- Delivery Info Skeleton -->
                                <div class="flex flex-wrap items-center gap-4 mb-4">
                                    <div class="skeleton skeleton-text small" style="width: 100px;"></div>
                                    <div class="skeleton skeleton-text small" style="width: 100px;"></div>
                                </div>

                                <!-- Cuisine Tags Skeleton -->
                                <div class="flex flex-wrap gap-2">
                                    <div class="skeleton" style="width: 80px; height: 28px; border-radius: 9999px;"></div>
                                    <div class="skeleton" style="width: 100px; height: 28px; border-radius: 9999px;"></div>
                                    <div class="skeleton" style="width: 70px; height: 28px; border-radius: 9999px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

// Show loading state for product cards
function showProductCardsSkeleton(count = 6) {
    const productListContainer = document.getElementById('productListContainer');
    if (!productListContainer) return;

    const skeletonCards = Array.from({ length: count }, (_, i) => `
                <div class="glass-card p-4">
                    <div class="flex gap-4">
                        <!-- Product Info Skeleton -->
                        <div class="flex-1">
                            <div class="skeleton skeleton-text large mb-2" style="width: 70%;"></div>
                            <div class="skeleton skeleton-text small mb-1" style="width: 90%;"></div>
                            <div class="skeleton skeleton-text small mb-3" style="width: 80%;"></div>
                            <div class="flex gap-2 mb-3">
                                <div class="skeleton" style="width: 60px; height: 24px; border-radius: 9999px;"></div>
                            </div>
                            <div class="skeleton skeleton-text" style="width: 80px;"></div>
                        </div>

                        <!-- Product Image and Button Skeleton -->
                        <div class="flex flex-col items-center gap-2 flex-shrink-0">
                            <div class="w-24 h-24 rounded-lg overflow-hidden">
                                <div class="skeleton w-full h-full"></div>
                            </div>
                            <div class="skeleton" style="width: 60px; height: 36px; border-radius: 0.5rem;"></div>
                        </div>
                    </div>
                </div>
            `).join('');

    productListContainer.innerHTML = `
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="skeleton skeleton-circle" style="width: 24px; height: 24px;"></div>
                        <div class="skeleton skeleton-text large" style="width: 150px;"></div>
                    </div>
                    <div class="grid gap-4">
                        ${skeletonCards}
                    </div>
                </div>
            `;
}

// Show loading indicator
function showLoadingIndicator(message = 'Yükleniyor...') {
    const productListContainer = document.getElementById('productListContainer');
    if (!productListContainer) return;

    productListContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20">
                    <div class="loading-spinner mb-4"></div>
                    <p class="text-white/70 text-sm">${message}</p>
                </div>
            `;
}

// Add image loading handler
function handleImageLoad(imgElement) {
    const container = imgElement.parentElement;
    if (container && container.classList.contains('image-loading')) {
        container.classList.add('loaded');
    }
}

// Add image error handler with loading state
function handleImageError(imgElement, fallbackSrc = 'image/pattern.svg') {
    const container = imgElement.parentElement;
    if (container && container.classList.contains('image-loading')) {
        container.classList.add('loaded');
    }
    imgElement.src = fallbackSrc;
}

// Lazy loading for images using Intersection Observer
function setupLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
}

// Simulate data fetch with loading states
function loadRestaurantData() {
    return new Promise((resolve) => {
        // Show loading skeleton
        showRestaurantHeaderSkeleton();
        showProductCardsSkeleton();

        // Simulate network delay (remove this in production)
        setTimeout(() => {
            resolve(restaurantData);
        }, 800);
    });
}

// Sample restaurant data
const restaurantData = {
    id: 'rest-001',
    name: 'Kebapçı Mehmet Usta',
    rating: 4.7,
    reviewCount: 342,
    deliveryTime: '25-35 dk',
    minimumOrder: 50,
    cuisineTypes: ['Kebap', 'Türk Mutfağı', 'Izgara'],
    status: 'open', // 'open' or 'closed'
    coverImage: 'image/shop.png',
    description: 'Geleneksel Türk mutfağının en lezzetli kebapları'
};

// Category data structure with icons
const categories = [
    { id: 'all', name: 'Tümü', icon: 'fa-th-large' },
    { id: 'kebap', name: 'Kebaplar', icon: 'fa-drumstick-bite' },
    { id: 'pide', name: 'Pideler', icon: 'fa-pizza-slice' },
    { id: 'lahmacun', name: 'Lahmacun', icon: 'fa-circle' },
    { id: 'drinks', name: 'İçecekler', icon: 'fa-glass-water' },
    { id: 'sides', name: 'Yan Ürünler', icon: 'fa-bowl-food' },
    { id: 'salads', name: 'Salatalar', icon: 'fa-leaf' },
    { id: 'desserts', name: 'Tatlılar', icon: 'fa-ice-cream' }
];

// Sample product data
const products = [
    {
        id: 'prod-001',
        restaurantId: 'rest-001',
        categoryId: 'kebap',
        name: 'Adana Kebap',
        description: 'Özel baharatlarla hazırlanmış acılı kıyma kebap',
        price: 85,
        image: 'image/motor.png',
        tags: [{ name: 'Spicy', type: 'spicy', color: '#FF3B30', textColor: 'white' }],
        inStock: true,
        sortOrder: 1
    },
    {
        id: 'prod-002',
        restaurantId: 'rest-001',
        categoryId: 'kebap',
        name: 'Urfa Kebap',
        description: 'Orta acılı, geleneksel Urfa usulü kebap',
        price: 85,
        image: 'image/motor1.png',
        tags: [],
        inStock: true,
        sortOrder: 2
    },
    {
        id: 'prod-003',
        restaurantId: 'rest-001',
        categoryId: 'pide',
        name: 'Kıymalı Pide',
        description: 'Taze kıyma ve özel baharatlarla hazırlanmış pide',
        price: 65,
        image: 'image/pan1.png',
        tags: [{ name: 'Halal', type: 'halal', color: '#34C759', textColor: 'white' }],
        inStock: true,
        sortOrder: 1
    },
    {
        id: 'prod-004',
        restaurantId: 'rest-001',
        categoryId: 'pide',
        name: 'Karışık Pide',
        description: 'Sucuk, kaşar ve yumurtalı özel pide',
        price: 75,
        image: 'image/motor4.png',
        tags: [],
        inStock: false,
        sortOrder: 2
    },
    {
        id: 'prod-005',
        restaurantId: 'rest-001',
        categoryId: 'drinks',
        name: 'Ayran',
        description: 'Ev yapımı taze ayran',
        price: 10,
        image: 'image/pattern.svg',
        tags: [{ name: 'Vegan', type: 'vegan', color: '#34C759', textColor: 'white' }],
        inStock: true,
        sortOrder: 1
    },
    {
        id: 'prod-006',
        restaurantId: 'rest-001',
        categoryId: 'sides',
        name: 'Çoban Salata',
        description: 'Taze domates, salatalık, biber ve soğan',
        price: 25,
        image: 'image/pattern.svg',
        tags: [{ name: 'Vegan', type: 'vegan', color: '#34C759', textColor: 'white' }],
        inStock: true,
        sortOrder: 1
    },
    {
        id: 'prod-007',
        restaurantId: 'rest-001',
        categoryId: 'desserts',
        name: 'Künefe',
        description: 'Antep fıstıklı sıcak künefe',
        price: 55,
        image: 'image/pattern.svg',
        tags: [],
        inStock: true,
        sortOrder: 1
    }
];

// Selected category state
let selectedCategory = 'all';

// Render category filter bar
function renderCategoryFilterBar() {
    const filterBarContainer = document.getElementById('categoryFilterBar');
    if (!filterBarContainer) return;

    const categoryChipsHTML = categories
        .map(category => {
            const isActive = category.id === selectedCategory;
            const activeClass = isActive ? 'active' : '';

            return `
                        <button
                            class="category-chip ${activeClass}"
                            data-category-id="${category.id}"
                            onclick="selectCategory('${category.id}')"
                            aria-label="Kategori: ${category.name}"
                            aria-pressed="${isActive}"
                        >
                            <i class="fas ${category.icon}" aria-hidden="true"></i>
                            <span>${category.name}</span>
                        </button>
                    `;
        })
        .join('');

    filterBarContainer.innerHTML = `
                <div class="category-scroll-container" role="tablist" aria-label="Menü kategorileri">
                    ${categoryChipsHTML}
                </div>
            `;
}

// Handle category selection
function selectCategory(categoryId) {
    selectedCategory = categoryId;
    renderCategoryFilterBar();
    filterAndRenderProducts();
    // Reinitialize ripple effects after category bar update
    reinitializeRippleEffects();
    // Setup keyboard navigation after re-render
    setupCategoryKeyboardNavigation();

    // Announce category change to screen readers
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        const filteredProducts = filterProducts(categoryId);
        announceToScreenReader(`${category.name} kategorisi seçildi. ${filteredProducts.length} ürün gösteriliyor.`);
    }
}

// Filter products based on selected category
function filterProducts(categoryId) {
    if (categoryId === 'all') {
        return products;
    }
    return products.filter(product => product.categoryId === categoryId);
}

// Render products grouped by category
function renderProducts(productsToRender) {
    const productListContainer = document.getElementById('productListContainer');
    if (!productListContainer) return;

    if (productsToRender.length === 0) {
        productListContainer.innerHTML = `
                    <div class="text-center py-20">
                        <p class="text-white/70">Bu kategoride ürün bulunamadı.</p>
                    </div>
                `;
        return;
    }

    // Group products by category
    const productsByCategory = {};
    productsToRender.forEach(product => {
        if (!productsByCategory[product.categoryId]) {
            productsByCategory[product.categoryId] = [];
        }
        productsByCategory[product.categoryId].push(product);
    });

    // Render each category section
    let sectionsHTML = '';
    for (const categoryId in productsByCategory) {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category || category.id === 'all') continue;

        const categoryProducts = productsByCategory[categoryId];

        const productsHTML = categoryProducts
            .map(product => {
                const tagsHTML = product.tags
                    .map(tag => `
                                <span class="px-2 py-1 rounded-full text-xs font-medium"
                                      style="background-color: ${tag.color}; color: ${tag.textColor};">
                                    ${tag.name}
                                </span>
                            `)
                    .join('');

                const outOfStockClass = !product.inStock ? 'opacity-50 grayscale' : '';
                const outOfStockBadge = !product.inStock
                    ? '<span class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Tükendi</span>'
                    : '';

                return `
                            <div class="glass-card product-card p-4 ${outOfStockClass}"
                                 data-product-id="${product.id}"
                                 data-category-id="${product.categoryId}">
                                ${outOfStockBadge}
                                <div class="flex gap-4">
                                    <!-- Product Info -->
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-white mb-2">${product.name}</h3>
                                        <p class="text-sm text-white/70 mb-3">${product.description}</p>
                                        ${tagsHTML ? `<div class="flex flex-wrap gap-2 mb-3">${tagsHTML}</div>` : ''}
                                        <p class="text-xl font-bold text-[#bde83a]">${product.price} ₺</p>
                                    </div>

                                    <!-- Product Image and Button -->
                                    <div class="flex flex-col items-center gap-2 flex-shrink-0">
                                        <div class="w-24 h-24 rounded-lg overflow-hidden image-loading">
                                            <img src="${product.image}"
                                                 alt="${product.name}"
                                                 class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                 onload="handleImageLoad(this)"
                                                 onerror="handleImageError(this)" />
                                        </div>
                                        <button
                                            onclick="addToCart('${product.id}')"
                                            class="px-4 py-2 bg-[#bde83a] hover:bg-[#a5c543] text-black text-sm font-bold rounded-lg transition-all duration-300 shine-button focus-ring ripple-effect shadow-md hover:shadow-lg hover:shadow-[#bde83a]/30 ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}"
                                            ${!product.inStock ? 'disabled' : ''}
                                            aria-label="Sepete ekle: ${product.name}">
                                            <i class="fas fa-plus" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
            })
            .join('');

        sectionsHTML += `
                    <div class="mb-8 category-section" data-category-id="${categoryId}">
                        <div class="flex items-center gap-3 mb-4">
                            <i class="fas ${category.icon} text-[#bde83a] text-xl" aria-hidden="true"></i>
                            <h2 class="text-2xl font-bold text-white">${category.name}</h2>
                        </div>
                        <div class="grid gap-4">
                            ${productsHTML}
                        </div>
                    </div>
                `;
    }

    productListContainer.innerHTML = sectionsHTML;
}

// Filter and render products based on selected category and search query
function filterAndRenderProducts() {
    const searchResults = searchProducts(currentSearchQuery);
    renderProducts(searchResults);
    // Reinitialize ripple effects after rendering
    reinitializeRippleEffects();
}

// Render restaurant header
function renderRestaurantHeader(restaurant) {
    const headerContainer = document.getElementById('restaurantHeader');
    if (!headerContainer) return;

    const statusText = restaurant.status === 'open' ? 'Açık' : 'Kapalı';
    const statusClass = restaurant.status === 'open'
        ? 'bg-[#bde83a] text-black'
        : 'bg-red-500 text-white';

    const cuisineTagsHTML = restaurant.cuisineTypes
        .map(cuisine => `
                    <span class="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">
                        ${cuisine}
                    </span>
                `)
        .join('');

    headerContainer.innerHTML = `
                <div class="glass-card overflow-hidden">
                    <div class="flex flex-col md:flex-row gap-6 p-6">
                        <!-- Restaurant Image -->
                        <div class="w-full md:w-1/3 flex-shrink-0">
                            <div class="relative aspect-video md:aspect-square rounded-xl overflow-hidden image-loading">
                                <img
                                    src="${restaurant.coverImage}"
                                    alt="${restaurant.name}"
                                    class="w-full h-full object-cover"
                                    onload="handleImageLoad(this)"
                                    onerror="handleImageError(this)"
                                />
                            </div>
                        </div>

                        <!-- Restaurant Details -->
                        <div class="flex-1 flex flex-col justify-between">
                            <!-- Top Section: Name and Status -->
                            <div>
                                <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
                                    <h1 class="text-2xl md:text-3xl font-bold text-white">
                                        ${restaurant.name}
                                    </h1>
                                    <span class="${statusClass} px-4 py-1.5 rounded-full text-sm font-semibold">
                                        ${statusText}
                                    </span>
                                </div>

                                <!-- Rating and Reviews -->
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="flex items-center gap-1.5">
                                        <svg class="w-5 h-5 text-[#bde83a]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                        <span class="text-white font-semibold">${restaurant.rating}</span>
                                        <span class="text-white/60 text-sm">(${restaurant.reviewCount} değerlendirme)</span>
                                    </div>
                                </div>

                                <!-- Delivery Info -->
                                <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/80">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-[#bde83a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>${restaurant.deliveryTime}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-[#bde83a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Min. ${restaurant.minimumOrder} ₺</span>
                                    </div>
                                </div>

                                <!-- Cuisine Type Tags -->
                                <div class="flex flex-wrap gap-2">
                                    ${cuisineTagsHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

// Create ARIA live region for announcements
function createAriaLiveRegion() {
    if (!document.getElementById('aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
}

// Announce to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Setup keyboard navigation for category chips
function setupCategoryKeyboardNavigation() {
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach((chip, index) => {
        chip.addEventListener('keydown', (e) => {
            let targetIndex = index;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : categoryChips.length - 1;
                    categoryChips[targetIndex].focus();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = index < categoryChips.length - 1 ? index + 1 : 0;
                    categoryChips[targetIndex].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    categoryChips[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    categoryChips[categoryChips.length - 1].focus();
                    break;
            }
        });
    });
}

// Initialize restaurant header, category filter, and products on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Create ARIA live region for accessibility
    createAriaLiveRegion();

    // Show loading skeletons
    isLoading = true;
    showRestaurantHeaderSkeleton();
    showProductCardsSkeleton();

    // Load restaurant data (simulates API call)
    await loadRestaurantData();

    // Render actual content
    isLoading = false;
    renderRestaurantHeader(restaurantData);
    renderCategoryFilterBar();
    filterAndRenderProducts();

    // Setup keyboard navigation
    setupCategoryKeyboardNavigation();

    // Setup lazy loading for images
    setupLazyLoading();

    // Announce page ready to screen readers
    announceToScreenReader('Menü yüklendi');
});

// Search state
let currentSearchQuery = '';

// Search products by name and description (case-insensitive substring matching)
function searchProducts(query) {
    if (!query || query.trim() === '') {
        // Empty query - return all products (respecting category filter)
        return filterProducts(selectedCategory);
    }

    const normalizedQuery = query.toLowerCase().trim();

    // First filter by category, then by search query
    const categoryFilteredProducts = filterProducts(selectedCategory);

    return categoryFilteredProducts.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
        const descriptionMatch = product.description.toLowerCase().includes(normalizedQuery);
        return nameMatch || descriptionMatch;
    });
}

// Handle search input and update display
function handleSearch(query) {
    currentSearchQuery = query;
    const searchResults = searchProducts(query);
    renderProducts(searchResults);

    // Announce search results to screen readers
    if (query.trim() === '') {
        announceToScreenReader('Arama temizlendi. Tüm ürünler gösteriliyor.');
    } else {
        announceToScreenReader(`${searchResults.length} ürün bulundu.`);
    }
}

// Debounce function for search optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search handler (300ms delay for performance)
const debouncedSearch = debounce(handleSearch, 300);

// Sync desktop and mobile search inputs with debouncing
const desktopSearch = document.getElementById('menuSearch');
const mobileSearch = document.getElementById('menuSearchMobile');

if (desktopSearch && mobileSearch) {
    desktopSearch.addEventListener('input', (e) => {
        const query = e.target.value;
        mobileSearch.value = query;
        debouncedSearch(query);
    });

    mobileSearch.addEventListener('input', (e) => {
        const query = e.target.value;
        desktopSearch.value = query;
        debouncedSearch(query);
    });
}

// ===== INTERACTION POLISH =====

// Ripple effect for buttons
function createRipple(event) {
    const button = event.currentTarget;

    // Don't add ripple if button is disabled
    if (button.disabled) return;

    // Add ripple-effect class if not present
    if (!button.classList.contains('ripple-effect')) {
        button.classList.add('ripple-effect');
    }

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-circle');

    // Remove any existing ripples
    const existingRipple = button.querySelector('.ripple-circle');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(circle);

    // Remove ripple after animation completes
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Add ripple effect to all buttons on page load
function initializeRippleEffects() {
    // Add ripple to all buttons with specific classes
    const rippleButtons = document.querySelectorAll(
        'button.shine-button, button.bg-\\[\\#bde83a\\], .category-chip, .quantity-stepper button'
    );

    rippleButtons.forEach(button => {
        // Remove existing listener if any
        button.removeEventListener('click', createRipple);
        // Add new listener
        button.addEventListener('click', createRipple);
    });
}

// Initialize ripple effects on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeRippleEffects();
});

// Re-initialize ripple effects after dynamic content updates
function reinitializeRippleEffects() {
    setTimeout(() => {
        initializeRippleEffects();
    }, 100);
}

// Placeholder functions for auth modals (to be implemented)
function openLoginModal() {
    console.log('Login modal would open here');
}

function openRegisterModal() {
    console.log('Register modal would open here');
}

// ===== CART STATE MANAGEMENT =====

// Cart data structure
let cart = {
    restaurantId: restaurantData.id,
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0
};

// Cart state change listeners
const cartListeners = [];

// Add a cart state change listener
function addCartListener(listener) {
    cartListeners.push(listener);
}

// Notify all listeners of cart state changes
function notifyCartListeners() {
    cartListeners.forEach(listener => listener(cart));
}

// Add product to cart (add new or increment quantity)
function addToCart(productId) {
    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) {
        return;
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
        // Increment quantity
        existingItem.quantity += 1;
        announceToScreenReader(`${product.name} miktarı artırıldı. Yeni miktar: ${existingItem.quantity}`);
    } else {
        // Add new item to cart
        cart.items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
        announceToScreenReader(`${product.name} sepete eklendi`);
    }

    // Recalculate totals
    updateCartTotals();

    // Notify listeners
    notifyCartListeners();
}

// Remove product from cart (decrement or remove)
function removeFromCart(productId) {
    const existingItem = cart.items.find(item => item.productId === productId);

    if (!existingItem) {
        return;
    }

    const productName = existingItem.name;

    if (existingItem.quantity > 1) {
        // Decrement quantity
        existingItem.quantity -= 1;
        announceToScreenReader(`${productName} miktarı azaltıldı. Yeni miktar: ${existingItem.quantity}`);
    } else {
        // Remove item from cart
        cart.items = cart.items.filter(item => item.productId !== productId);
        announceToScreenReader(`${productName} sepetten çıkarıldı`);
    }

    // Recalculate totals
    updateCartTotals();

    // Notify listeners
    notifyCartListeners();
}

// Update quantity directly
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 0) {
        return;
    }

    if (newQuantity === 0) {
        // Remove item from cart
        cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity = newQuantity;
        }
    }

    // Recalculate totals
    updateCartTotals();

    // Notify listeners
    notifyCartListeners();
}

// Calculate subtotal (sum of price × quantity for all items)
function calculateSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
}

// Calculate delivery fee (conditional based on minimum order)
function calculateDeliveryFee(subtotal, minimumOrder) {
    // If cart is empty, no delivery fee
    if (subtotal === 0) {
        return 0;
    }

    // If subtotal is below minimum order, charge delivery fee
    if (subtotal < minimumOrder) {
        return 15; // Default delivery fee
    }

    // If subtotal meets or exceeds minimum, free delivery
    return 0;
}

// Calculate total (subtotal + delivery fee)
function calculateTotal(subtotal, deliveryFee) {
    return subtotal + deliveryFee;
}

// Calculate and update cart totals
function updateCartTotals() {
    // Calculate subtotal
    cart.subtotal = calculateSubtotal(cart.items);

    // Calculate delivery fee
    cart.deliveryFee = calculateDeliveryFee(cart.subtotal, restaurantData.minimumOrder);

    // Calculate total
    cart.total = calculateTotal(cart.subtotal, cart.deliveryFee);
}

// ===== DESKTOP CART PANEL UI =====

// Render cart items list HTML
function renderCartItems() {
    if (cart.items.length === 0) {
        return '';
    }

    return cart.items
        .map(item => `
                    <div class="cart-item flex items-center gap-3 p-3 rounded-lg transition-all duration-200" data-product-id="${item.productId}">
                        <!-- Product Thumbnail -->
                        <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 image-loading">
                            <img src="${item.image}"
                                 alt="${item.name}"
                                 class="w-full h-full object-cover"
                                 onload="handleImageLoad(this)"
                                 onerror="handleImageError(this)" />
                        </div>

                        <!-- Product Details -->
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-semibold text-white truncate">${item.name}</h4>
                            <p class="text-sm text-[#bde83a] font-bold">${item.price} ₺</p>
                        </div>

                        <!-- Quantity Stepper -->
                        <div class="quantity-stepper flex items-center gap-2 flex-shrink-0">
                            <button
                                onclick="removeFromCart('${item.productId}')"
                                class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-sm font-bold focus-ring ripple-effect"
                                aria-label="Azalt">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path>
                                </svg>
                            </button>
                            <span class="text-white font-semibold text-sm w-6 text-center">${item.quantity}</span>
                            <button
                                onclick="addToCart('${item.productId}')"
                                class="w-7 h-7 rounded-full bg-[#bde83a] hover:bg-[#a5c543] flex items-center justify-center text-black text-sm font-bold focus-ring ripple-effect"
                                aria-label="Artır">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `)
        .join('');
}

// Update cart display to show/hide empty state
function updateCart() {
    const cartPanel = document.getElementById('desktopCartPanel');
    if (!cartPanel) return;

    const stickyContainer = cartPanel.querySelector('.sticky');
    if (!stickyContainer) return;

    // Check if cart is empty
    const isEmpty = cart.items.length === 0;

    if (isEmpty) {
        // Render empty cart state
        stickyContainer.innerHTML = `
                    <div class="glass-card p-6">
                        <h2 class="text-xl font-bold text-white mb-6">Sepetim</h2>
                        <div class="flex flex-col items-center justify-center py-12 text-center">
                            <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <svg class="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                            </div>
                            <p class="text-white/60 text-sm">Sepetiniz şu an boş görünüyor.</p>
                        </div>
                    </div>
                `;
    } else {
        // Render cart with items
        const cartItemsHTML = renderCartItems();
        const deliveryFeeText = cart.deliveryFee === 0 ? 'Ücretsiz' : `${cart.deliveryFee} ₺`;

        stickyContainer.innerHTML = `
                    <div class="glass-card cart-container">
                        <!-- Cart Header -->
                        <div class="p-6 border-b border-white/10">
                            <h2 class="text-xl font-bold text-white">Sepetim</h2>
                        </div>

                        <!-- Cart Items List -->
                        <div class="p-4 space-y-2 max-h-96 overflow-y-auto" id="cartItemsList">
                            ${cartItemsHTML}
                        </div>

                        <!-- Order Summary -->
                        <div class="p-6 border-t border-white/10 space-y-3" id="orderSummary">
                            <div class="flex justify-between text-sm">
                                <span class="text-white/70">Ara Toplam</span>
                                <span class="text-white font-semibold" id="subtotalDisplay">${cart.subtotal.toFixed(2)} ₺</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-white/70">Teslimat Ücreti</span>
                                <span class="text-white font-semibold" id="deliveryFeeDisplay">${deliveryFeeText}</span>
                            </div>
                            <div class="h-px bg-white/10"></div>
                            <div class="flex justify-between">
                                <span class="text-white font-bold">Toplam</span>
                                <span class="text-[#bde83a] font-bold text-lg" id="totalDisplay">${cart.total.toFixed(2)} ₺</span>
                            </div>
                        </div>

                        <!-- Checkout Button -->
                        <div class="p-6 pt-0">
                            <button
                                onclick="handleCheckout()"
                                class="w-full py-3 px-6 bg-[#bde83a] hover:bg-[#a5c543] text-black font-bold rounded-lg transition-all duration-300 shine-button focus-ring ripple-effect shadow-lg shadow-[#bde83a]/30 hover:shadow-xl hover:shadow-[#bde83a]/40 hover:scale-105 active:scale-100"
                                aria-label="Siparişi tamamla">
                                Siparişi Tamamla
                            </button>
                        </div>
                    </div>
                `;
    }

    // Reinitialize ripple effects after cart update
    reinitializeRippleEffects();
}

// Update totals display in the cart
function updateTotals() {
    // Only update if cart has items (not in empty state)
    if (cart.items.length === 0) {
        return;
    }

    const subtotalDisplay = document.getElementById('subtotalDisplay');
    const deliveryFeeDisplay = document.getElementById('deliveryFeeDisplay');
    const totalDisplay = document.getElementById('totalDisplay');

    if (subtotalDisplay) {
        subtotalDisplay.textContent = `${cart.subtotal.toFixed(2)} ₺`;
    }

    if (deliveryFeeDisplay) {
        const deliveryFeeText = cart.deliveryFee === 0 ? 'Ücretsiz' : `${cart.deliveryFee} ₺`;
        deliveryFeeDisplay.textContent = deliveryFeeText;
    }

    if (totalDisplay) {
        totalDisplay.textContent = `${cart.total.toFixed(2)} ₺`;
    }
}

// Render the desktop cart panel (uses updateCart internally)
function renderDesktopCartPanel() {
    updateCart();
}

// Handle checkout action
function handleCheckout() {
    if (cart.items.length === 0) {
        return;
    }

    // Placeholder for checkout functionality
    console.log('Proceeding to checkout with cart:', cart);
    alert('Sipariş tamamlama özelliği yakında eklenecek!');
}

// Add cart listener to update UI when cart changes
addCartListener((updatedCart) => {
    // Check if we need to rebuild the entire cart (empty <-> filled state change)
    const cartItemsList = document.getElementById('cartItemsList');
    const wasEmpty = !cartItemsList;
    const isEmpty = updatedCart.items.length === 0;

    if (wasEmpty !== isEmpty) {
        // State changed between empty and filled, rebuild entire cart
        updateCart();
    } else if (!isEmpty) {
        // Cart has items, update items list and totals
        const cartItemsListContainer = document.getElementById('cartItemsList');
        if (cartItemsListContainer) {
            cartItemsListContainer.innerHTML = renderCartItems();
        }
        updateTotals();
    }
});

// Initialize cart panel on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

// ===== MOBILE CART BAR UI =====

// Update mobile cart bar display
function updateMobileCartBar() {
    const mobileCartBar = document.getElementById('mobileCartBar');
    const mobileCartItemCount = document.getElementById('mobileCartItemCount');
    const mobileCartTotal = document.getElementById('mobileCartTotal');

    if (!mobileCartBar || !mobileCartItemCount || !mobileCartTotal) {
        return;
    }

    // Calculate total item count
    const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // Update item count badge
    mobileCartItemCount.textContent = totalItemCount;

    // Update total price
    mobileCartTotal.textContent = `${cart.total.toFixed(2)} ₺`;

    // Show/hide mobile cart bar based on cart empty state
    if (cart.items.length === 0) {
        // Hide mobile cart bar when cart is empty
        mobileCartBar.classList.add('hidden');
    } else {
        // Show mobile cart bar when cart has items
        mobileCartBar.classList.remove('hidden');
    }
}

// Open mobile cart modal
function openMobileCartModal() {
    const modal = document.getElementById('mobileCartModal');
    if (!modal) return;

    // Render cart items in modal
    renderMobileCartModal();

    // Show modal
    modal.classList.add('open');
    modal.classList.remove('closing');

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Close mobile cart modal
function closeMobileCartModal() {
    const modal = document.getElementById('mobileCartModal');
    if (!modal) return;

    // Add closing animation
    modal.classList.add('closing');

    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.classList.remove('open');
        modal.classList.remove('closing');

        // Restore body scroll
        document.body.style.overflow = '';
    }, 300); // Match animation duration
}

// Render mobile cart modal content
function renderMobileCartModal() {
    const modalBody = document.getElementById('mobileCartModalBody');
    const modalFooter = document.getElementById('mobileCartModalFooter');

    if (!modalBody || !modalFooter) return;

    // Check if cart is empty
    if (cart.items.length === 0) {
        // Render empty cart state
        modalBody.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12 text-center">
                        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <svg class="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                        </div>
                        <p class="text-white/60 text-sm">Sepetiniz şu an boş görünüyor.</p>
                    </div>
                `;
        modalFooter.innerHTML = '';
    } else {
        // Render cart items
        const cartItemsHTML = cart.items
            .map(item => `
                        <div class="cart-item flex items-center gap-3 p-3 rounded-lg bg-white/5 mb-2" data-product-id="${item.productId}">
                            <!-- Product Thumbnail -->
                            <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 image-loading">
                                <img src="${item.image}"
                                     alt="${item.name}"
                                     class="w-full h-full object-cover"
                                     onload="handleImageLoad(this)"
                                     onerror="handleImageError(this)" />
                            </div>

                            <!-- Product Details -->
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-semibold text-white truncate">${item.name}</h4>
                                <p class="text-sm text-[#bde83a] font-bold">${item.price} ₺</p>
                            </div>

                            <!-- Quantity Stepper -->
                            <div class="quantity-stepper flex items-center gap-2 flex-shrink-0">
                                <button
                                    onclick="removeFromCart('${item.productId}')"
                                    class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-sm font-bold focus-ring ripple-effect"
                                    aria-label="Azalt">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path>
                                    </svg>
                                </button>
                                <span class="text-white font-semibold text-sm w-6 text-center">${item.quantity}</span>
                                <button
                                    onclick="addToCart('${item.productId}')"
                                    class="w-8 h-8 rounded-full bg-[#bde83a] hover:bg-[#a5c543] flex items-center justify-center text-black text-sm font-bold focus-ring ripple-effect"
                                    aria-label="Artır">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `)
            .join('');

        modalBody.innerHTML = cartItemsHTML;

        // Render order summary and checkout button
        const deliveryFeeText = cart.deliveryFee === 0 ? 'Ücretsiz' : `${cart.deliveryFee} ₺`;

        modalFooter.innerHTML = `
                    <!-- Order Summary -->
                    <div class="space-y-3 mb-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-white/70">Ara Toplam</span>
                            <span class="text-white font-semibold">${cart.subtotal.toFixed(2)} ₺</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-white/70">Teslimat Ücreti</span>
                            <span class="text-white font-semibold">${deliveryFeeText}</span>
                        </div>
                        <div class="h-px bg-white/10"></div>
                        <div class="flex justify-between">
                            <span class="text-white font-bold">Toplam</span>
                            <span class="text-[#bde83a] font-bold text-lg">${cart.total.toFixed(2)} ₺</span>
                        </div>
                    </div>

                    <!-- Checkout Button -->
                    <button
                        onclick="handleCheckout()"
                        class="w-full py-3 px-6 bg-[#bde83a] hover:bg-[#a5c543] text-black font-bold rounded-lg transition-all duration-300 shine-button focus-ring ripple-effect shadow-lg shadow-[#bde83a]/30 hover:shadow-xl hover:shadow-[#bde83a]/40 hover:scale-105 active:scale-100"
                        aria-label="Siparişi tamamla">
                        Siparişi Tamamla
                    </button>
                `;
    }

    // Reinitialize ripple effects after modal update
    reinitializeRippleEffects();
}

// Add cart listener to update mobile cart bar when cart changes
addCartListener((updatedCart) => {
    updateMobileCartBar();

    // Update mobile cart modal if it's open
    const modal = document.getElementById('mobileCartModal');
    if (modal && modal.classList.contains('open')) {
        renderMobileCartModal();
    }
});

// Initialize mobile cart bar on page load
document.addEventListener('DOMContentLoaded', () => {
    updateMobileCartBar();
});

// Export functions for testing
if (typeof window !== 'undefined') {
    window.cart = cart;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.updateCartTotals = updateCartTotals;
    window.calculateSubtotal = calculateSubtotal;
    window.calculateDeliveryFee = calculateDeliveryFee;
    window.calculateTotal = calculateTotal;
    window.addCartListener = addCartListener;
    window.restaurantData = restaurantData;
    window.renderDesktopCartPanel = renderDesktopCartPanel;
    window.renderCartItems = renderCartItems;
    window.updateCart = updateCart;
    window.updateTotals = updateTotals;
    window.handleCheckout = handleCheckout;
    window.updateMobileCartBar = updateMobileCartBar;
    window.openMobileCartModal = openMobileCartModal;
    window.closeMobileCartModal = closeMobileCartModal;
    window.renderMobileCartModal = renderMobileCartModal;
    window.searchProducts = searchProducts;
    window.handleSearch = handleSearch;
    window.products = products;
    window.categories = categories;
    window.selectedCategory = selectedCategory;
    window.currentSearchQuery = currentSearchQuery;
    // Loading state functions
    window.showRestaurantHeaderSkeleton = showRestaurantHeaderSkeleton;
    window.showProductCardsSkeleton = showProductCardsSkeleton;
    window.showLoadingIndicator = showLoadingIndicator;
    window.handleImageLoad = handleImageLoad;
    window.handleImageError = handleImageError;
    window.loadRestaurantData = loadRestaurantData;
    window.isLoading = isLoading;
}