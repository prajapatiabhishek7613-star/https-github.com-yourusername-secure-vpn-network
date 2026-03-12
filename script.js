// VPN Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-menu');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                mobileMenu.innerHTML = `
                    <ul class="mobile-nav-links">
                        <li><a href="about.html">About</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                    <div class="mobile-nav-actions">
                        <a href="login.html" class="btn btn-secondary btn-full">Log In</a>
                        <a href="register.html" class="btn btn-primary btn-full">Get Started</a>
                    </div>
                `;
                document.body.appendChild(mobileMenu);
                
                // Add mobile menu styles
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-menu {
                        position: fixed;
                        top: 72px;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: var(--bg-primary);
                        padding: 24px;
                        z-index: 999;
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                    }
                    
                    .mobile-menu.active {
                        transform: translateX(0);
                    }
                    
                    .mobile-nav-links {
                        list-style: none;
                        margin-bottom: 24px;
                    }
                    
                    .mobile-nav-links li {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    .mobile-nav-links a {
                        display: block;
                        padding: 16px 0;
                        color: var(--text-primary);
                        text-decoration: none;
                        font-size: 1.1rem;
                        font-weight: 500;
                    }
                    
                    .mobile-nav-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .mobile-menu-btn.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    
                    .mobile-menu-btn.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .mobile-menu-btn.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -6px);
                    }
                `;
                document.head.appendChild(style);
            }
            
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Pricing toggle functionality
    const billingToggle = document.getElementById('billing-toggle');
    const priceAmounts = document.querySelectorAll('.pricing-price .amount');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            // Update toggle labels
            toggleLabels.forEach((label, index) => {
                if ((isYearly && index === 1) || (!isYearly && index === 0)) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
            
            // Update prices with animation
            priceAmounts.forEach(amount => {
                const monthlyPrice = amount.dataset.monthly;
                const yearlyPrice = amount.dataset.yearly;
                const newPrice = isYearly ? yearlyPrice : monthlyPrice;
                
                // Animate price change
                amount.style.opacity = '0';
                amount.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    amount.textContent = newPrice;
                    amount.style.opacity = '1';
                    amount.style.transform = 'translateY(0)';
                }, 200);
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(15, 15, 26, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 15, 26, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .pricing-card, .download-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation class styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Server location pulse animation
    const serverDots = document.querySelectorAll('.server-dot');
    serverDots.forEach((dot, index) => {
        dot.style.animationDelay = `${index * 0.3}s`;
    });
    
    // Button click handlers - only prevent default for actual buttons without links
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only show popup for buttons with no href or just #
            if (href === '#' || !href) {
                e.preventDefault();
                
                // Check if this is a submit button inside a form
                if (this.type === 'submit' || this.closest('form')) {
                    return; // Let form handle it
                }
                
                // Show coming soon popup only for truly unfinished features
                if (typeof showNotification === 'function') {
                    showNotification('Coming Soon', 'This feature is currently under development.', 'info');
                } else {
                    alert('Coming Soon: This feature is currently under development.');
                }
            }
            // Otherwise, let the link work normally
        });
    });
    
    // Notification function
    function showNotification(title, message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 24px;
                background: var(--bg-card);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-left: 4px solid var(--primary);
                border-radius: var(--radius-lg);
                padding: 20px 24px;
                display: flex;
                align-items: flex-start;
                gap: 16px;
                max-width: 400px;
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-content h4 {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 4px;
            }
            
            .notification-content p {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            }
        }
        
        updateCounter();
    }
    
    // Observe stats for counter animation
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number, .server-stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const num = parseInt(text.replace(/\D/g, ''));
                    if (num) {
                        stat.textContent = '0';
                        animateCounter(stat, num);
                    }
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    const serverStats = document.querySelector('.server-stats');
    
    if (heroStats) statObserver.observe(heroStats);
    if (serverStats) statObserver.observe(serverStats);
    
    console.log('SecureVPN website loaded successfully!');
});

// Theme Switcher Functions (Global)
function toggleThemeMenu() {
    const menu = document.getElementById('themeMenu');
    if (menu) menu.classList.toggle('active');
}

function setTheme(theme) {
    if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
    
    // Update active state
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.theme === theme) {
            opt.classList.add('active');
        }
    });
    
    // Close menu
    const menu = document.getElementById('themeMenu');
    if (menu) menu.classList.remove('active');
}

// Load saved theme on all pages
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'default';
    setTheme(savedTheme);
});

// Close theme menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.theme-switcher')) {
        const menu = document.getElementById('themeMenu');
        if (menu) menu.classList.remove('active');
    }
});
