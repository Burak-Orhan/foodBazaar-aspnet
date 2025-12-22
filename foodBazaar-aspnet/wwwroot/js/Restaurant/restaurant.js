
        // Sync Mobile and Desktop Search
        const restaurantSearch = document.getElementById('restaurantSearch');
        const restaurantSearchMobile = document.getElementById('restaurantSearchMobile');

        if (restaurantSearch && restaurantSearchMobile) {
            // Sync desktop to mobile
            restaurantSearch.addEventListener('input', (e) => {
                restaurantSearchMobile.value = e.target.value;
            });

            // Sync mobile to desktop
            restaurantSearchMobile.addEventListener('input', (e) => {
                restaurantSearch.value = e.target.value;
                // Trigger the debounced search
                const event = new Event('input', { bubbles: true });
                restaurantSearch.dispatchEvent(event);
            });
        }

        // Smooth Scroll for Anchor Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Radio Group Keyboard Navigation (Arrow Keys)
        document.querySelectorAll('[role="radiogroup"]').forEach(radioGroup => {
            const radios = Array.from(radioGroup.querySelectorAll('input[type="radio"]'));

            radios.forEach((radio, index) => {
                radio.addEventListener('keydown', (e) => {
                    let nextIndex;

                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextIndex = (index + 1) % radios.length;
                        radios[nextIndex].checked = true;
                        radios[nextIndex].focus();
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        nextIndex = (index - 1 + radios.length) % radios.length;
                        radios[nextIndex].checked = true;
                        radios[nextIndex].focus();
                    }
                });
            });
        });

        // Price Range Slider Update
        const priceSlider = document.getElementById('priceRangeSlider');
        const priceValue = document.getElementById('priceValue');

        if (priceSlider && priceValue) {
            priceSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                priceValue.textContent = value >= 500 ? '₺500+' : `₺${value}`;
            });
        }

        // Clear Filters Button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                // Reset sort to recommended
                const sortRadios = document.querySelectorAll('input[name="sort"]');
                sortRadios.forEach(radio => {
                    radio.checked = radio.value === 'recommended';
                });

                // Uncheck all chips
                const chips = document.querySelectorAll('.chip');
                chips.forEach(chip => {
                    chip.setAttribute('aria-pressed', 'false');
                });

                // Uncheck all cuisine checkboxes
                const cuisineCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
                cuisineCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });

                // Reset price slider
                if (priceSlider && priceValue) {
                    priceSlider.value = 500;
                    priceValue.textContent = '₺500+';
                }

                console.log('Filters cleared');
            });
        }

        // Empty State Clear Filters Button
        const emptyStateClearBtn = document.getElementById('emptyStateClearBtn');

        if (emptyStateClearBtn) {
            emptyStateClearBtn.addEventListener('click', () => {
                // Trigger the same clear filters logic
                if (clearFiltersBtn) {
                    clearFiltersBtn.click();
                }

                // Hide empty state
                const emptyState = document.getElementById('emptyState');
                if (emptyState) {
                    emptyState.hidden = true;
                }

                console.log('Filters cleared from empty state');
            });
        }

        // Mobile Filter Drawer
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        const filterSidebar = document.getElementById('filterSidebar');
        const filterCloseBtn = document.getElementById('filterCloseBtn');
        const filterOverlay = document.getElementById('filterOverlay');

        function openFilterDrawer() {
            if (filterSidebar && filterOverlay) {
                filterSidebar.classList.add('open');
                filterOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeFilterDrawer() {
            if (filterSidebar && filterOverlay) {
                filterSidebar.classList.remove('open');
                filterOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Open drawer on mobile filter button click
        if (mobileFilterBtn) {
            mobileFilterBtn.addEventListener('click', openFilterDrawer);
        }

        // Close drawer on close button click
        if (filterCloseBtn) {
            filterCloseBtn.addEventListener('click', closeFilterDrawer);
        }

        // Close drawer on overlay click
        if (filterOverlay) {
            filterOverlay.addEventListener('click', closeFilterDrawer);
        }

        // Close drawer on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && filterSidebar?.classList.contains('open')) {
                closeFilterDrawer();
            }
        });

        // ============================================
        // Filter State Management
        // ============================================

        /**
         * Global filter state object
         * Tracks all active filters for restaurant filtering
         */
        const filterState = {
            sort: 'recommended',
            quickFilters: {
                fastDelivery: false,
                newRestaurants: false,
                freeDelivery: false
            },
            cuisineTypes: [],
            priceRange: 500,
            openNow: false,
            searchQuery: ''
        };

        /**
         * Log the current filter state to console
         * Used for testing and debugging filter changes
         */
        function logFilterState() {
            console.log('=== Filter State Updated ===');
            console.log('Sort:', filterState.sort);
            console.log('Quick Filters:', filterState.quickFilters);
            console.log('Cuisine Types:', filterState.cuisineTypes);
            console.log('Price Range:', filterState.priceRange);
            console.log('Open Now:', filterState.openNow);
            console.log('Search Query:', filterState.searchQuery);
            console.log('===========================');
        }

        // ============================================
        // URL Sync and State Management
        // ============================================

        /**
         * Sync filter state to URL query parameters
         * Updates the browser URL without reloading the page
         * Enables shareable filter links and browser history support
         */
        function syncFiltersToURL() {
            const params = new URLSearchParams();

            // Add sort parameter if not default
            if (filterState.sort !== 'recommended') {
                params.set('sort', filterState.sort);
            }

            // Add quick filters if enabled
            if (filterState.quickFilters.fastDelivery) {
                params.set('fastDelivery', 'true');
            }
            if (filterState.quickFilters.newRestaurants) {
                params.set('newRestaurants', 'true');
            }
            if (filterState.quickFilters.freeDelivery) {
                params.set('freeDelivery', 'true');
            }

            // Add cuisine types if any selected
            if (filterState.cuisineTypes.length > 0) {
                params.set('cuisine', filterState.cuisineTypes.join(','));
            }

            // Add price range if not default (500)
            if (filterState.priceRange !== 500) {
                params.set('price', filterState.priceRange.toString());
            }

            // Add open now filter if enabled
            if (filterState.openNow) {
                params.set('openNow', 'true');
            }

            // Add search query if present
            if (filterState.searchQuery) {
                params.set('q', filterState.searchQuery);
            }

            // Build the new URL
            const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;

            // Update browser history without reloading
            window.history.pushState({ filters: filterState }, '', newURL);

            console.log('🔗 URL updated:', newURL);
        }

        /**
         * Parse URL query parameters and restore filter state
         * Called on page load and when browser back/forward buttons are used
         */
        function parseURLAndRestoreFilters() {
            const params = new URLSearchParams(window.location.search);

            console.log('🔍 Parsing URL parameters...');

            // Restore sort
            const sort = params.get('sort');
            if (sort && ['recommended', 'rating', 'delivery-time', 'min-order'].includes(sort)) {
                filterState.sort = sort;
                const sortRadio = document.querySelector(`input[name="sort"][value="${sort}"]`);
                if (sortRadio) {
                    sortRadio.checked = true;
                }
                console.log('  ✓ Sort restored:', sort);
            }

            // Restore quick filters
            if (params.get('fastDelivery') === 'true') {
                filterState.quickFilters.fastDelivery = true;
                const chip = document.querySelector('.chip[data-filter="fast-delivery"]');
                if (chip) chip.setAttribute('aria-pressed', 'true');
                console.log('  ✓ Fast Delivery filter restored');
            }

            if (params.get('newRestaurants') === 'true') {
                filterState.quickFilters.newRestaurants = true;
                const chip = document.querySelector('.chip[data-filter="new-restaurants"]');
                if (chip) chip.setAttribute('aria-pressed', 'true');
                console.log('  ✓ New Restaurants filter restored');
            }

            if (params.get('freeDelivery') === 'true') {
                filterState.quickFilters.freeDelivery = true;
                const chip = document.querySelector('.chip[data-filter="free-delivery"]');
                if (chip) chip.setAttribute('aria-pressed', 'true');
                console.log('  ✓ Free Delivery filter restored');
            }

            // Restore cuisine types
            const cuisineParam = params.get('cuisine');
            if (cuisineParam) {
                const cuisines = cuisineParam.split(',').filter(c => c.trim());
                filterState.cuisineTypes = cuisines;

                cuisines.forEach(cuisine => {
                    const checkbox = document.querySelector(`.filter-checkbox input[type="checkbox"][value="${cuisine}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                console.log('  ✓ Cuisine types restored:', cuisines);
            }

            // Restore price range
            const price = params.get('price');
            if (price) {
                const priceValue = parseInt(price);
                if (!isNaN(priceValue) && priceValue >= 0 && priceValue <= 500) {
                    filterState.priceRange = priceValue;
                    const priceSlider = document.getElementById('priceRangeSlider');
                    const priceLabel = document.getElementById('priceValue');
                    if (priceSlider) {
                        priceSlider.value = priceValue;
                    }
                    if (priceLabel) {
                        priceLabel.textContent = priceValue >= 500 ? '₺500+' : `₺${priceValue}`;
                    }
                    console.log('  ✓ Price range restored:', priceValue);
                }
            }

            // Restore open now filter
            if (params.get('openNow') === 'true') {
                filterState.openNow = true;
                const openNowCheckbox = document.getElementById('openNowFilter');
                if (openNowCheckbox) {
                    openNowCheckbox.checked = true;
                }
                console.log('  ✓ Open Now filter restored');
            }

            // Restore search query
            const searchQuery = params.get('q');
            if (searchQuery) {
                filterState.searchQuery = searchQuery;
                const searchInput = document.getElementById('restaurantSearch');
                if (searchInput) {
                    searchInput.value = searchQuery;
                }
                console.log('  ✓ Search query restored:', searchQuery);
            }

            console.log('✅ Filter state restored from URL');
            logFilterState();
        }

        /**
         * Handle browser back/forward button navigation
         * Restores filter state when user navigates through history
         */
        function handlePopState(event) {
            console.log('⬅️ Browser back/forward button pressed');

            if (event.state && event.state.filters) {
                // Restore from history state
                console.log('Restoring filters from history state');
                Object.assign(filterState, event.state.filters);
            } else {
                // Parse URL if no state available
                console.log('Parsing URL to restore filters');
                parseURLAndRestoreFilters();
            }

            // TODO: In future tasks, this will trigger restaurant grid update
            console.log('Filter state after navigation:', filterState);
        }

        // Initialize URL sync on page load
        window.addEventListener('DOMContentLoaded', () => {
            // Parse URL and restore filters on initial page load
            parseURLAndRestoreFilters();
        });

        // Listen for browser back/forward button events
        window.addEventListener('popstate', handlePopState);

        console.log('✅ URL sync and state management initialized');

        // ============================================
        // Chip Toggle Functionality
        // ============================================

        /**
         * Handle chip button toggle
         * Updates aria-pressed state and filter state
         */
        const chips = document.querySelectorAll('.chip[data-filter]');

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Get current pressed state
                const isPressed = chip.getAttribute('aria-pressed') === 'true';
                const filterType = chip.getAttribute('data-filter');

                // Toggle aria-pressed attribute
                chip.setAttribute('aria-pressed', !isPressed);

                // Update filter state based on chip type
                switch (filterType) {
                    case 'fast-delivery':
                        filterState.quickFilters.fastDelivery = !isPressed;
                        console.log(`Quick Filter: Fast Delivery ${!isPressed ? 'enabled' : 'disabled'}`);
                        break;
                    case 'new-restaurants':
                        filterState.quickFilters.newRestaurants = !isPressed;
                        console.log(`Quick Filter: New Restaurants ${!isPressed ? 'enabled' : 'disabled'}`);
                        break;
                    case 'free-delivery':
                        filterState.quickFilters.freeDelivery = !isPressed;
                        console.log(`Quick Filter: Free Delivery ${!isPressed ? 'enabled' : 'disabled'}`);
                        break;
                }

                // Log the updated filter state
                logFilterState();

                // Sync filters to URL
                syncFiltersToURL();

                // TODO: In future tasks, this will trigger restaurant grid filtering
            });
        });

        console.log('Chip toggle functionality initialized');

        // ============================================
        // Sort Radio Button Handlers
        // ============================================

        /**
         * Handle sort option changes
         * Updates filter state when sort radio buttons change
         */
        const sortRadios = document.querySelectorAll('input[name="sort"]');

        sortRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    filterState.sort = e.target.value;
                    console.log(`Sort changed to: ${e.target.value}`);
                    logFilterState();

                    // Sync filters to URL
                    syncFiltersToURL();

                    // TODO: In future tasks, this will trigger restaurant grid re-sorting
                }
            });
        });

        console.log('Sort radio button handlers initialized');

        // ============================================
        // Cuisine Checkbox Handlers
        // ============================================

        /**
         * Handle cuisine category checkbox changes
         * Updates filter state with selected cuisine types
         */
        const cuisineCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]:not(#openNowFilter)');

        cuisineCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const cuisineValue = e.target.value;

                if (e.target.checked) {
                    // Add cuisine to filter state if not already present
                    if (!filterState.cuisineTypes.includes(cuisineValue)) {
                        filterState.cuisineTypes.push(cuisineValue);
                        console.log(`Cuisine added: ${cuisineValue}`);
                    }
                } else {
                    // Remove cuisine from filter state
                    filterState.cuisineTypes = filterState.cuisineTypes.filter(c => c !== cuisineValue);
                    console.log(`Cuisine removed: ${cuisineValue}`);
                }

                logFilterState();

                // Sync filters to URL
                syncFiltersToURL();

                // TODO: In future tasks, this will trigger restaurant grid filtering
            });
        });

        console.log('Cuisine checkbox handlers initialized');

        // ============================================
        // Price Range Slider Handler
        // ============================================

        /**
         * Handle price range slider changes
         * Updates filter state with selected price range
         */
        if (priceSlider && priceValue) {
            priceSlider.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                filterState.priceRange = value;
                console.log(`Price range changed to: ₺${value >= 500 ? '500+' : value}`);
                logFilterState();

                // Sync filters to URL
                syncFiltersToURL();

                // TODO: In future tasks, this will trigger restaurant grid filtering
            });
        }

        console.log('Price range slider handler initialized');

        // ============================================
        // Open Now Checkbox Handler
        // ============================================

        /**
         * Handle "Open Now" status filter checkbox
         * Updates filter state with open now status
         */
        const openNowFilter = document.getElementById('openNowFilter');

        if (openNowFilter) {
            openNowFilter.addEventListener('change', (e) => {
                filterState.openNow = e.target.checked;
                console.log(`Open Now filter: ${e.target.checked ? 'enabled' : 'disabled'}`);
                logFilterState();

                // Sync filters to URL
                syncFiltersToURL();

                // TODO: In future tasks, this will trigger restaurant grid filtering
            });
        }

        console.log('Open Now filter handler initialized');

        // ============================================
        // Clear Filters Enhancement
        // ============================================

        /**
         * Enhanced clear filters functionality
         * Resets all filters to default state
         */
        if (clearFiltersBtn) {
            // Remove the old event listener by cloning the button
            const newClearFiltersBtn = clearFiltersBtn.cloneNode(true);
            clearFiltersBtn.parentNode.replaceChild(newClearFiltersBtn, clearFiltersBtn);

            newClearFiltersBtn.addEventListener('click', () => {
                // Reset sort to recommended
                const sortRadios = document.querySelectorAll('input[name="sort"]');
                sortRadios.forEach(radio => {
                    radio.checked = radio.value === 'recommended';
                });
                filterState.sort = 'recommended';

                // Uncheck all chips
                const chips = document.querySelectorAll('.chip');
                chips.forEach(chip => {
                    chip.setAttribute('aria-pressed', 'false');
                });
                filterState.quickFilters = {
                    fastDelivery: false,
                    newRestaurants: false,
                    freeDelivery: false
                };

                // Uncheck all cuisine checkboxes
                const cuisineCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
                cuisineCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                filterState.cuisineTypes = [];
                filterState.openNow = false;

                // Reset price slider
                if (priceSlider && priceValue) {
                    priceSlider.value = 500;
                    priceValue.textContent = '₺500+';
                    filterState.priceRange = 500;
                }

                // Clear search input
                const searchInput = document.getElementById('restaurantSearch');
                if (searchInput) {
                    searchInput.value = '';
                }
                filterState.searchQuery = '';

                console.log('All filters cleared');
                logFilterState();

                // Sync filters to URL (will clear URL params)
                syncFiltersToURL();

                // TODO: In future tasks, this will trigger restaurant grid reset
            });
        }

        console.log('Filter interaction logic initialized successfully');

        // ============================================
        // Search Debounce Functionality
        // ============================================

        /**
         * Debounce helper function
         * Delays the execution of a function until after a specified delay
         * @param {Function} func - The function to debounce
         * @param {number} delay - The delay in milliseconds (350ms as per requirements)
         * @returns {Function} - The debounced function
         */
        function debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                // Clear the previous timeout
                clearTimeout(timeoutId);
                // Set a new timeout
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }

        /**
         * Handle search input
         * This function will be called after the debounce delay
         * @param {string} query - The search query
         */
        function handleSearch(query) {
            console.log('Search triggered with query:', query);

            // Update filter state with search query
            filterState.searchQuery = query.trim();

            // TODO: In future tasks, this will trigger actual restaurant filtering
            // For now, we're just logging to test the debounce functionality

            if (query.trim() === '') {
                console.log('Search cleared - showing all restaurants');
            } else {
                console.log(`Searching for: "${query}"`);
                // Future implementation will filter restaurants here
            }

            logFilterState();

            // Sync filters to URL
            syncFiltersToURL();
        }

        // Get the search input element
        const searchInput = document.getElementById('restaurantSearch');

        if (searchInput) {
            // Create debounced version of handleSearch with 350ms delay
            const debouncedSearch = debounce(handleSearch, 350);

            // Add input event listener
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                debouncedSearch(query);
            });

            // Add keydown event listener for Escape key to clear search
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    searchInput.value = '';
                    handleSearch(''); // Immediately trigger search clear
                    searchInput.blur(); // Optional: remove focus from input
                    console.log('Search cleared via Escape key');
                }
            });

            console.log('Search debounce functionality initialized (350ms delay)');
        }

        // ============================================
        // Infinite Scroll Functionality
        // ============================================

        /**
         * Infinite Scroll Implementation using Intersection Observer API
         * Triggers loading of additional restaurants when user scrolls near the bottom
         */

        // Get references to DOM elements
        const scrollTrigger = document.querySelector('.scroll-trigger');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const gridContainer = document.querySelector('.grid-container');

        // State management for infinite scroll
        let isLoading = false;
        let currentPage = 1;
        let hasMoreData = true;

        /**
         * Simulate loading more restaurants
         * In a real application, this would fetch data from an API
         */
        function loadMoreRestaurants() {
            // Prevent multiple simultaneous loads
            if (isLoading || !hasMoreData) {
                console.log('Load prevented:', { isLoading, hasMoreData });
                return;
            }

            // Set loading state
            isLoading = true;

            // Show loading indicator
            if (loadingIndicator) {
                loadingIndicator.hidden = false;
            }

            console.log(`🔄 Infinite scroll triggered - Loading page ${currentPage + 1}...`);

            // Simulate API call with setTimeout (replace with actual fetch in production)
            setTimeout(() => {
                console.log(`✅ Page ${currentPage + 1} loaded successfully`);

                // Increment page counter
                currentPage++;

                // Simulate: After 3 pages, no more data (for testing purposes)
                if (currentPage >= 3) {
                    hasMoreData = false;
                    console.log('📭 No more restaurants to load');
                }

                // Hide loading indicator
                if (loadingIndicator) {
                    loadingIndicator.hidden = true;
                }

                // Reset loading state
                isLoading = false;

                // TODO: In future tasks, append new restaurant cards to gridContainer
                // Example: gridContainer.innerHTML += newRestaurantCardsHTML;

            }, 1500); // Simulate 1.5 second API delay
        }

        /**
         * Intersection Observer callback
         * Called when the scroll trigger element enters/exits the viewport
         * @param {IntersectionObserverEntry[]} entries - Array of observed elements
         * @param {IntersectionObserver} observer - The observer instance
         */
        function handleIntersection(entries, observer) {
            entries.forEach(entry => {
                // Check if the trigger element is intersecting (visible in viewport)
                if (entry.isIntersecting) {
                    console.log('📍 Scroll trigger entered viewport (200px threshold)');
                    loadMoreRestaurants();
                }
            });
        }

        /**
         * Initialize Intersection Observer
         * Sets up the observer with 200px threshold as per requirements
         */
        function initInfiniteScroll() {
            // Check if scroll trigger element exists
            if (!scrollTrigger) {
                console.error('Scroll trigger element not found');
                return;
            }

            // Create Intersection Observer with options
            const observerOptions = {
                root: null, // Use viewport as root
                rootMargin: '200px', // Trigger 200px before reaching the element
                threshold: 0 // Trigger as soon as any part is visible
            };

            // Create the observer
            const observer = new IntersectionObserver(handleIntersection, observerOptions);

            // Start observing the scroll trigger element
            observer.observe(scrollTrigger);

            console.log('✨ Infinite scroll initialized with Intersection Observer');
            console.log('   - Threshold: 200px before scroll trigger');
            console.log('   - Trigger element:', scrollTrigger);
            console.log('   - Scroll down to test the functionality');
        }

        // Initialize infinite scroll when DOM is ready
        if (scrollTrigger && loadingIndicator) {
            initInfiniteScroll();
        } else {
            console.error('Required elements for infinite scroll not found:', {
                scrollTrigger: !!scrollTrigger,
                loadingIndicator: !!loadingIndicator
            });
        }

        // ============================================
        // Error Handling UI
        // ============================================

        /**
         * Show network error banner
         * Displays an error message when restaurant data fails to load
         */
        function showNetworkError() {
            const errorBanner = document.getElementById('networkErrorBanner');
            if (errorBanner) {
                errorBanner.hidden = false;
                console.error('❌ Network error: Failed to load restaurants');
            }
        }

        /**
         * Hide network error banner
         * Removes the error message from view
         */
        function hideNetworkError() {
            const errorBanner = document.getElementById('networkErrorBanner');
            if (errorBanner) {
                errorBanner.hidden = true;
                console.log('✅ Network error banner hidden');
            }
        }

        /**
         * Retry loading restaurants
         * Called when user clicks the "Tekrar Dene" button
         */
        function retryLoadRestaurants() {
            console.log('🔄 Retrying to load restaurants...');
            hideNetworkError();

            // Show loading indicator
            if (loadingIndicator) {
                loadingIndicator.hidden = false;
            }

            // Simulate retry attempt (replace with actual API call in production)
            setTimeout(() => {
                // Simulate successful retry
                if (loadingIndicator) {
                    loadingIndicator.hidden = true;
                }
                console.log('✅ Retry successful - restaurants loaded');

                // In case of failure, you would call showNetworkError() again
                // showNetworkError();
            }, 1000);
        }

        /**
         * Handle image load failure
         * Replaces failed images with a fallback placeholder
         * @param {HTMLImageElement} img - The image element that failed to load
         */
        function handleImageError(img) {
            // Prevent infinite loop if fallback also fails
            if (img.dataset.fallbackApplied) {
                return;
            }

            img.dataset.fallbackApplied = 'true';

            // Get the restaurant name from the card title
            const card = img.closest('.restaurant-card');
            let fallbackText = '?';

            if (card) {
                const titleElement = card.querySelector('.card-title');
                if (titleElement) {
                    // Get first letter of restaurant name
                    fallbackText = titleElement.textContent.trim().charAt(0).toUpperCase();
                }
            }

            // Create fallback placeholder
            const wrapper = img.parentElement;
            if (wrapper) {
                // Hide the broken image
                img.style.display = 'none';

                // Create fallback div
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.setAttribute('aria-label', 'Görsel yüklenemedi');
                fallback.textContent = fallbackText;

                // Insert fallback before the image
                wrapper.insertBefore(fallback, img);

                console.log(`🖼️ Image fallback applied for: ${img.alt || 'Unknown'}`);
            }
        }

        /**
         * Initialize image error handlers
         * Adds error event listeners to all restaurant card images
         */
        function initImageErrorHandlers() {
            const restaurantImages = document.querySelectorAll('.restaurant-card .card-image');
            const campaignImages = document.querySelectorAll('.campaign-card .campaign-image');

            // Add error handlers to restaurant card images
            restaurantImages.forEach(img => {
                img.addEventListener('error', function () {
                    handleImageError(this);
                });
            });

            // Add error handlers to campaign card images
            campaignImages.forEach(img => {
                img.addEventListener('error', function () {
                    handleImageError(this);
                });
            });

            console.log(`🖼️ Image error handlers initialized for ${restaurantImages.length + campaignImages.length} images`);
        }

        // Initialize image error handlers when DOM is ready
        initImageErrorHandlers();

        // Example: Simulate network error for testing (uncomment to test)
        // setTimeout(() => {
        //     showNetworkError();
        // }, 2000);

        console.log('✅ Error handling UI initialized');
