// App Configuration
const APP = {
    name: 'Kilimo Smart',
    version: '1.0.0',
    debug: true
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initNavigation();
    initModals();
    loadPosts();
    loadMarketplace();
    loadEducation();
    loadCommunity();
    initWeather();
    initNotifications();
    initAnalyticsTracking(); // ADDED
});

// Initialize App
function initApp() {
    console.log(`${APP.name} v${APP.version} initialized`);
    
    // Check for service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed:', err));
    }
    
    // Check for online/offline
    window.addEventListener('online', () => {
        showNotification('Mtandao umeunganishwa!', 'success');
        if (window.analytics) {
            window.analytics.trackEvent('Network', 'online');
        }
    });
    window.addEventListener('offline', () => {
        showNotification('Huna mtandao! Baadhi ya vipengele havitafanya kazi.', 'error');
        if (window.analytics) {
            window.analytics.trackEvent('Network', 'offline');
        }
    });
}

// ADDED: Analytics Tracking
function initAnalyticsTracking() {
    // Track page navigation
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
        link.addEventListener('click', () => {
            const page = link.dataset.page;
            if (window.analytics) {
                window.analytics.trackPageView(page);
            }
        });
    });
    
    // Track post creation
    document.addEventListener('postCreated', (e) => {
        if (window.analytics) {
            window.analytics.trackUserAction('post_created', {
                content_length: e.detail?.content?.length || 0
            });
        }
    });
    
    // Track product clicks
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-primary');
        if (btn && btn.textContent.includes('Nunua')) {
            if (window.analytics) {
                window.analytics.trackEvent('Marketplace', 'buy_click');
            }
        }
    });
    
    // Track auth events
    document.addEventListener('userLogin', (e) => {
        if (window.analytics) {
            window.analytics.trackUserAction('login', {
                username: e.detail?.username
            });
        }
    });
    
    document.addEventListener('userRegister', (e) => {
        if (window.analytics) {
            window.analytics.trackUserAction('register', {
                username: e.detail?.username,
                account_type: e.detail?.accountType
            });
        }
    });
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-item');
    const pages = {
        home: 'homePage',
        marketplace: 'marketplacePage',
        education: 'educationPage',
        community: 'communityPage',
        profile: 'profilePage'
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Update active states
            document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
                el.classList.remove('active');
            });
            link.classList.add('active');
            
            // Show page
            Object.keys(pages).forEach(key => {
                const pageEl = document.getElementById(pages[key]);
                pageEl.classList.toggle('active', key === page);
            });
            
            // Update URL
            history.pushState({ page }, '', `?page=${page}`);
            
            // Track page view
            if (window.analytics) {
                window.analytics.trackPageView(page);
            }
        });
    });
    
    // Handle back button
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            navigateTo(e.state.page);
        }
    });
}

function navigateTo(page) {
    const link = document.querySelector(`[data-page="${page}"]`);
    if (link) link.click();
}

// Modals
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
            if (window.analytics) {
                window.analytics.trackEvent('Modal', 'close');
            }
        });
    });
    
    // Click outside to close
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                if (window.analytics) {
                    window.analytics.trackEvent('Modal', 'close_outside');
                }
            }
        });
    });
    
    // Login/Register toggle
    const switchLink = document.getElementById('switchToRegister');
    if (switchLink) {
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            const form = document.getElementById('authForm');
            const btn = form.querySelector('button[type="submit"]');
            const title = form.closest('.modal-content').querySelector('h3');
            
            if (btn.textContent === 'Ingia') {
                btn.textContent = 'Jisajili';
                title.textContent = 'Jisajili Sasa';
                switchLink.textContent = 'Una akaunti? Ingia';
                document.getElementById('accountType').style.display = 'block';
                if (window.analytics) {
                    window.analytics.trackEvent('Auth', 'switch_to_register');
                }
            } else {
                btn.textContent = 'Ingia';
                title.textContent = 'Ingia au Jisajili';
                switchLink.textContent = 'Huna akaunti? Jisajili';
                document.getElementById('accountType').style.display = 'block';
                if (window.analytics) {
                    window.analytics.trackEvent('Auth', 'switch_to_login');
                }
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        info: '#2196F3',
        success: '#4CAF50',
        error: '#f44336',
        warning: '#FF9800'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification-pop';
    notification.style.borderColor = colors[type] || colors.info;
    notification.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1.5rem;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background:none;border:none;font-size:1.2rem;cursor:pointer;">✕</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Track notification
    if (window.analytics) {
        window.analytics.trackEvent('Notification', type, message.substring(0, 50));
    }
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Export for other modules
window.APP = APP;
window.showNotification = showNotification;
window.navigateTo = navigateTo;
