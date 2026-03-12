// Blog JavaScript

const blogPosts = [
    {
        id: 1,
        title: "10 Essential Cybersecurity Tips for Remote Workers",
        excerpt: "Working from home? Learn how to secure your home office and protect sensitive company data from cyber threats.",
        category: "security",
        categoryLabel: "Security",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600",
        date: "January 12, 2024",
        readTime: "6 min read"
    },
    {
        id: 2,
        title: "Understanding VPN Protocols: Which One is Right for You?",
        excerpt: "A comprehensive guide to WireGuard, OpenVPN, IKEv2, and other VPN protocols. Learn which protocol suits your needs.",
        category: "technology",
        categoryLabel: "Technology",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600",
        date: "January 10, 2024",
        readTime: "10 min read"
    },
    {
        id: 3,
        title: "How to Access Geo-Restricted Content Safely",
        excerpt: "Discover how VPNs can help you access content from around the world while maintaining your privacy and security.",
        category: "guides",
        categoryLabel: "Guides",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
        date: "January 8, 2024",
        readTime: "5 min read"
    },
    {
        id: 4,
        title: "The Future of Internet Privacy: Trends to Watch in 2024",
        excerpt: "From AI-powered threats to new privacy regulations, explore what's shaping the future of online privacy.",
        category: "news",
        categoryLabel: "News",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
        date: "January 5, 2024",
        readTime: "7 min read"
    },
    {
        id: 5,
        title: "Public Wi-Fi Safety: Protecting Yourself on Open Networks",
        excerpt: "Coffee shop Wi-Fi can be dangerous. Learn how to stay safe when connecting to public networks.",
        category: "security",
        categoryLabel: "Security",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
        date: "January 3, 2024",
        readTime: "4 min read"
    },
    {
        id: 6,
        title: "VPN vs Proxy: What's the Difference?",
        excerpt: "Confused about VPNs and proxies? We break down the key differences to help you choose the right tool.",
        category: "guides",
        categoryLabel: "Guides",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600",
        date: "December 28, 2023",
        readTime: "6 min read"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    try {
        initBlog();
        initCategories();
        initSearch();
        initNewsletter();
    } catch (error) {
        console.error('Blog initialization error:', error);
    }
});

function initBlog() {
    renderPosts(blogPosts);
}

function renderPosts(posts) {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    
    grid.innerHTML = posts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="blog-card-content">
                <span class="blog-card-category">${post.categoryLabel}</span>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="blog-card-meta">
                    <span>${post.date}</span>
                    <span>${post.readTime}</span>
                </div>
            </div>
        </article>
    `).join('');
}

function initCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter posts
            const category = btn.dataset.category;
            if (category === 'all') {
                renderPosts(blogPosts);
            } else {
                const filtered = blogPosts.filter(post => post.category === category);
                renderPosts(filtered);
            }
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            renderPosts(blogPosts);
            return;
        }
        
        const filtered = blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.categoryLabel.toLowerCase().includes(searchTerm)
        );
        
        renderPosts(filtered);
    });
}

function initNewsletter() {
    const form = document.getElementById('blogNewsletterForm');
    if (!form) return;
    
    // Helper function for notifications
    function notify(title, message, type) {
        if (typeof showNotification === 'function') {
            showNotification(title, message, type);
        } else {
            alert(title + ': ' + message);
        }
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        // Save subscriber
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        }
        
        notify('Subscribed!', 'Thank you for subscribing to our newsletter.', 'success');
        form.reset();
    });
}

// Load More Button
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        if (typeof showNotification === 'function') {
            showNotification('Coming Soon', 'More articles will be available soon!', 'info');
        } else {
            alert('Coming Soon: More articles will be available soon!');
        }
    });
}

console.log('Blog loaded successfully!');
