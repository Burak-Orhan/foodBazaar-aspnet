class NavigationSystem {
    constructor() {
        this.currentOpenDropdown = null;
        this.isDrawerOpen = false;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.init();
    }

    init() {
        this.setupDesktopDropdowns();
        this.setupMobileDrawer();
        this.setupKeyboardNavigation();
        this.setupClickOutside();
        this.setupEscapeKey();
    }

    setupDesktopDropdowns() {
        const productTrigger = document.getElementById('product-trigger');
        const productDropdown = document.getElementById('product-dropdown');
        const companyTrigger = document.getElementById('company-trigger');
        const companyDropdown = document.getElementById('company-dropdown');

        productTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown('product', productTrigger, productDropdown);
        });

        companyTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown('company', companyTrigger, companyDropdown);
        });

        this.setupDropdownKeyboardNavigation(productDropdown);
        this.setupDropdownKeyboardNavigation(companyDropdown);
    }

    toggleDropdown(dropdownName, trigger, dropdown) {
        const isCurrentlyOpen = !dropdown.classList.contains('hidden');

        this.closeAllDropdowns();

        if (!isCurrentlyOpen) {
            this.openDropdown(dropdownName, trigger, dropdown);
        }
    }

    openDropdown(dropdownName, trigger, dropdown) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('visible');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.querySelector('.caret').classList.add('rotated');
        this.currentOpenDropdown = dropdownName;

        setTimeout(() => {
            const firstFocusable = dropdown.querySelector(this.focusableElements);
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 50);
    }

    closeAllDropdowns() {
        const dropdowns = [
            { name: 'product', trigger: document.getElementById('product-trigger'), dropdown: document.getElementById('product-dropdown') },
            { name: 'company', trigger: document.getElementById('company-trigger'), dropdown: document.getElementById('company-dropdown') }
        ];

        dropdowns.forEach(({ trigger, dropdown }) => {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('visible');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.querySelector('.caret').classList.remove('rotated');
        });

        this.currentOpenDropdown = null;
    }

    setupMobileDrawer() {
        const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const mobileCloseBtn = document.getElementById('mobile-close-btn');
        const mobileProductTrigger = document.getElementById('mobile-product-trigger');
        const mobileProductContent = document.getElementById('mobile-product-content');
        const mobileCompanyTrigger = document.getElementById('mobile-company-trigger');
        const mobileCompanyContent = document.getElementById('mobile-company-content');

        mobileMenuTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.openDrawer();
        });

        mobileCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeDrawer();
        });

        mobileOverlay.addEventListener('click', () => {
            this.closeDrawer();
        });

        mobileProductTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileAccordion(mobileProductTrigger, mobileProductContent);
        });

        mobileCompanyTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileAccordion(mobileCompanyTrigger, mobileCompanyContent);
        });
    }

    openDrawer() {
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileOverlay = document.getElementById('mobile-overlay');

        mobileDrawer.classList.remove('closed');
        mobileDrawer.classList.add('open');
        mobileOverlay.classList.remove('hidden');
        mobileOverlay.classList.add('visible');
        this.isDrawerOpen = true;

        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const firstFocusable = mobileDrawer.querySelector(this.focusableElements);
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }

    closeDrawer() {
        const mobileDrawer = document.getElementById('mobile-drawer');
        const mobileOverlay = document.getElementById('mobile-overlay');

        mobileDrawer.classList.remove('open');
        mobileDrawer.classList.add('closed');
        mobileOverlay.classList.remove('visible');
        mobileOverlay.classList.add('hidden');
        this.isDrawerOpen = false;

        document.body.style.overflow = '';

        document.getElementById('mobile-menu-trigger').focus();
    }

    toggleMobileAccordion(trigger, content) {
        const isOpen = !content.classList.contains('hidden');
        const caret = trigger.querySelector('.caret');

        if (isOpen) {
            content.classList.add('hidden');
            trigger.setAttribute('aria-expanded', 'false');
            caret.classList.remove('rotated');
        } else {
            content.classList.remove('hidden');
            trigger.setAttribute('aria-expanded', 'true');
            caret.classList.add('rotated');
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {

            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    setupDropdownKeyboardNavigation(dropdown) {
        dropdown.addEventListener('keydown', (e) => {
            const focusableElements = Array.from(dropdown.querySelectorAll(this.focusableElements));
            const currentIndex = focusableElements.indexOf(document.activeElement);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
                    focusableElements[nextIndex].focus();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
                    focusableElements[prevIndex].focus();
                    break;

                case 'Home':
                    e.preventDefault();
                    focusableElements[0].focus();
                    break;

                case 'End':
                    e.preventDefault();
                    focusableElements[focusableElements.length - 1].focus();
                    break;
            }
        });
    }

    handleTabNavigation(e) {
        if (this.isDrawerOpen) {
            const drawer = document.getElementById('mobile-drawer');
            const focusableElements = Array.from(drawer.querySelectorAll(this.focusableElements));
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                // shift + tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.currentOpenDropdown) {
                const productDropdown = document.getElementById('product-dropdown');
                const companyDropdown = document.getElementById('company-dropdown');
                const productTrigger = document.getElementById('product-trigger');
                const companyTrigger = document.getElementById('company-trigger');

                const isClickInsideProduct = productDropdown.contains(e.target) || productTrigger.contains(e.target);
                const isClickInsideCompany = companyDropdown.contains(e.target) || companyTrigger.contains(e.target);

                if (!isClickInsideProduct && !isClickInsideCompany) {
                    this.closeAllDropdowns();
                }
            }
        });
    }

    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isDrawerOpen) {
                    this.closeDrawer();
                } else if (this.currentOpenDropdown) {
                    this.closeAllDropdowns();
                    if (this.currentOpenDropdown === 'product') {
                        document.getElementById('product-trigger').focus();
                    } else if (this.currentOpenDropdown === 'company') {
                        document.getElementById('company-trigger').focus();
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NavigationSystem();
    setupScrollAwareNavbar();
});

function setupScrollAwareNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let isScrolling = false;

    function updateNavbar() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
            navbar.querySelector('div > div').style.background = 'rgba(255, 255, 255, 0.35)';
            navbar.querySelector('div > div').style.backdropFilter = 'blur(25px)';
        } else {

            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
            navbar.querySelector('div > div').style.background = 'rgba(255, 255, 255, 0.30)';
            navbar.querySelector('div > div').style.backdropFilter = 'blur(20px)';
        }

        lastScrollY = currentScrollY;
        isScrolling = false;
    }

    function handleScroll() {
        if (!isScrolling) {
            requestAnimationFrame(updateNavbar);
            isScrolling = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    updateNavbar();
}

class NavigationUtils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

window.addEventListener('resize', NavigationUtils.debounce(() => {
    const navigation = window.navigationSystem;
    if (navigation && window.innerWidth >= 768 && navigation.isDrawerOpen) {
        navigation.closeDrawer();
    }
}, 250));

document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

class LoadingStates {
    static showLoading(element) {
        element.classList.add('opacity-50', 'pointer-events-none');
        element.setAttribute('aria-busy', 'true');
    }

    static hideLoading(element) {
        element.classList.remove('opacity-50', 'pointer-events-none');
        element.setAttribute('aria-busy', 'false');
    }
}

class AccessibilityAnnouncer {
    constructor() {
        this.createLiveRegion();
    }

    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

const announcer = new AccessibilityAnnouncer();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationSystem, NavigationUtils, LoadingStates, AccessibilityAnnouncer };
}
