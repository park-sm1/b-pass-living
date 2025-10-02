// B·PASS Living - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mobileNav.classList.toggle('hidden');
            mobileNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Close mobile menu
                mobileNav.classList.add('hidden');
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                // Navigate to section
                scrollToSection(targetId.substring(1));
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
                mobileNav.classList.add('hidden');
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Smooth scrolling for CTA buttons
    const ctaButtons = document.querySelectorAll('[data-scroll-target]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-scroll-target');
            scrollToSection(targetId);
        });
    });

    // Partner category tabs functionality
    const partnerTabs = document.querySelectorAll('.partner-tab');
    const partnerCategories = document.querySelectorAll('.partner-category');
    
    partnerTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs and categories
            partnerTabs.forEach(t => t.classList.remove('active'));
            partnerCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding category
            const targetCategory = document.querySelector(`.partner-category[data-category="${category}"]`);
            if (targetCategory) {
                targetCategory.classList.add('active');
            }
        });
    });

    // Pass purchase button functionality
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const passName = this.getAttribute('data-pass');
            const passPrice = this.getAttribute('data-price');
            
            showPurchaseModal(passName, passPrice);
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sectionsToObserve = document.querySelectorAll('.benefit-card, .pass-card, .step-card, .stat-card, .location-card');
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let ticking = false;

    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-card h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Smooth scroll to section function
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Purchase modal functionality
function showPurchaseModal(passName, passPrice) {
    // Remove any existing modals
    const existingModal = document.querySelector('.purchase-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${passName} 구매</h3>
                    <button class="modal-close" aria-label="모달 닫기">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-pass-info">
                        <p><strong>선택한 패스:</strong> ${passName}</p>
                        <p><strong>가격:</strong> ${passPrice}</p>
                        <div class="modal-features">
                            <h4>주요 혜택</h4>
                            <ul>
                                <li>부산 전역 교통 바우처</li>
                                <li>문화시설 무료 입장</li>
                                <li>공유오피스 이용권</li>
                                <li>BUSAN Pay 연동</li>
                                ${passName === '30일권' ? '<li>헬스장·샤워시설 이용</li><li>프리미엄 카페 네트워크</li>' : ''}
                            </ul>
                        </div>
                    </div>
                    <div class="modal-notice">
                        <p>📱 실제 서비스에서는 안전한 결제 페이지로 이동합니다</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn--secondary modal-cancel">취소</button>
                        <button class="btn btn--primary modal-confirm">결제하기</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .purchase-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-16);
                font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif;
                animation: modalFadeIn 0.3s ease-out;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
            }
            
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                position: relative;
                z-index: 1;
                width: 100%;
                max-width: 500px;
                max-height: 90vh;
                overflow: auto;
                animation: modalSlideIn 0.3s ease-out;
            }
            
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-20);
                border-bottom: 1px solid var(--color-border);
                background: linear-gradient(135deg, var(--color-bg-1) 0%, var(--color-surface) 100%);
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--color-text);
                font-weight: 600;
                font-size: var(--font-size-xl);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--space-4);
                line-height: 1;
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--ease-standard);
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            .modal-body {
                padding: var(--space-24);
            }
            
            .modal-pass-info p {
                margin-bottom: var(--space-12);
                color: var(--color-text);
                font-weight: 400;
            }
            
            .modal-pass-info strong {
                font-weight: 600;
                color: var(--color-primary);
            }
            
            .modal-features {
                background: var(--color-bg-2);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin: var(--space-16) 0;
            }
            
            .modal-features h4 {
                margin: 0 0 var(--space-12) 0;
                color: var(--color-text);
                font-size: var(--font-size-lg);
                font-weight: 600;
            }
            
            .modal-features ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .modal-features li {
                padding: var(--space-4) 0;
                color: var(--color-text-secondary);
                position: relative;
                padding-left: var(--space-16);
                font-size: var(--font-size-sm);
                font-weight: 400;
            }
            
            .modal-features li::before {
                content: "•";
                position: absolute;
                left: 0;
                color: var(--color-primary);
                font-weight: 700;
            }
            
            .modal-notice {
                background: var(--color-bg-4);
                padding: var(--space-12);
                border-radius: var(--radius-base);
                margin: var(--space-16) 0;
                text-align: center;
            }
            
            .modal-notice p {
                margin: 0;
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
                font-weight: 400;
            }
            
            .modal-actions {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: var(--space-12);
                margin-top: var(--space-20);
            }
            
            @media (max-width: 480px) {
                .modal-actions {
                    grid-template-columns: 1fr;
                }
                
                .purchase-modal {
                    padding: var(--space-8);
                }
                
                .modal-content {
                    max-height: 95vh;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }

    document.body.appendChild(modal);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Modal event handlers
    const closeModal = () => {
        document.body.style.overflow = '';
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.modal-confirm').addEventListener('click', () => {
        // Show success message
        showSuccessMessage(passName);
        closeModal();
    });

    // Prevent modal content click from closing modal
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // ESC key to close modal
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Show success message
function showSuccessMessage(passName) {
    const successModal = document.createElement('div');
    successModal.className = 'purchase-modal success-modal';
    successModal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="success-content">
                    <div class="success-icon">✅</div>
                    <h3>구매 완료!</h3>
                    <p>${passName} 선택이 완료되었습니다.<br>실제 서비스에서는 결제가 진행되고<br>패스 이용 안내가 전송됩니다.</p>
                    <button class="btn btn--primary success-ok">확인</button>
                </div>
            </div>
        </div>
    `;
    
    // Add success modal styles if not present
    if (!document.querySelector('#success-modal-styles')) {
        const successStyles = document.createElement('style');
        successStyles.id = 'success-modal-styles';
        successStyles.textContent = `
            .success-modal .modal-content {
                max-width: 400px;
            }
            .success-content {
                text-align: center;
                padding: var(--space-32);
            }
            .success-icon {
                font-size: 64px;
                margin-bottom: var(--space-16);
                animation: successBounce 0.6s ease-out;
            }
            
            @keyframes successBounce {
                0% { transform: scale(0); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .success-content h3 {
                color: var(--color-success);
                margin-bottom: var(--space-16);
                font-weight: 600;
            }
            .success-content p {
                color: var(--color-text-secondary);
                margin-bottom: var(--space-24);
                line-height: 1.6;
                font-weight: 400;
            }
        `;
        document.head.appendChild(successStyles);
    }
    
    document.body.appendChild(successModal);
    
    successModal.querySelector('.success-ok').addEventListener('click', () => {
        document.body.removeChild(successModal);
    });
    
    successModal.querySelector('.modal-overlay').addEventListener('click', () => {
        document.body.removeChild(successModal);
    });
}

// Animate numbers function for statistics
function animateNumber(element) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    const text = element.textContent;
    const numberMatch = text.match(/[\d,]+/);
    
    if (!numberMatch) return;
    
    const number = parseInt(numberMatch[0].replace(/,/g, ''));
    const suffix = text.replace(numberMatch[0], '');
    
    let current = 0;
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds
    
    function updateNumber() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        current = number * easeOutQuart;
        
        if (progress < 1) {
            const formattedNumber = Math.floor(current).toLocaleString('ko-KR');
            element.textContent = formattedNumber + suffix;
            requestAnimationFrame(updateNumber);
        } else {
            const formattedNumber = number.toLocaleString('ko-KR');
            element.textContent = formattedNumber + suffix;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Touch gesture support for mobile partner tabs
let touchStartX = 0;
let touchEndX = 0;

const partnerContent = document.getElementById('partnerContent');
if (partnerContent) {
    partnerContent.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    partnerContent.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next category
            const activeTabs = document.querySelectorAll('.partner-tab');
            const activeIndex = Array.from(activeTabs).findIndex(tab => tab.classList.contains('active'));
            const nextIndex = (activeIndex + 1) % activeTabs.length;
            activeTabs[nextIndex].click();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous category  
            const activeTabs = document.querySelectorAll('.partner-tab');
            const activeIndex = Array.from(activeTabs).findIndex(tab => tab.classList.contains('active'));
            const prevIndex = activeIndex === 0 ? activeTabs.length - 1 : activeIndex - 1;
            activeTabs[prevIndex].click();
        }
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab navigation through partner tabs
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.target.classList.contains('partner-tab')) {
        e.preventDefault();
        const tabs = Array.from(document.querySelectorAll('.partner-tab'));
        const currentIndex = tabs.indexOf(e.target);
        let nextIndex;
        
        if (e.key === 'ArrowLeft') {
            nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        } else {
            nextIndex = (currentIndex + 1) % tabs.length;
        }
        
        tabs[nextIndex].click();
        tabs[nextIndex].focus();
    }
});

// Initialize lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => img.classList.add('loaded'));
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle resize-dependent functionality
        const mobileNav = document.getElementById('mobileNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (window.innerWidth > 768) {
            // Hide mobile menu on desktop
            if (mobileNav) {
                mobileNav.classList.add('hidden');
                mobileNav.classList.remove('active');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
        }
    }, 250);
});