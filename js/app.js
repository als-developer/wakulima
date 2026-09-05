// App Configuration
const APP = {
    name: 'Kilimo Smart',
    version: '1.0.0'
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initNavigation();
    initModals();
    initDarkMode();
    initNotifications();
});

function initApp() {
    console.log(`${APP.name} v${APP.version} initialized`);
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed:', err));
    }
    
    // Online/Offline
    window.addEventListener('online', () => {
        showToast('Mtandao umeunganishwa!', 'success');
    });
    window.addEventListener('offline', () => {
        showToast('Huna mtandao! Baadhi ya vipengele havitafanya kazi.', 'error');
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .bottom-item');
    const pages = {
        home: 'homePage',
        marketplace: 'marketplacePage',
        education: 'educationPage',
        profile: 'profilePage'
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            Object.keys(pages).forEach(key => {
                const el = document.getElementById(pages[key]);
                if (key === page) {
                    el.classList.add('active');
                    el.style.display = 'block';
                } else {
                    el.classList.remove('active');
                    el.style.display = 'none';
                }
            });
            
            // Sync bottom nav
            document.querySelectorAll('.bottom-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === page);
            });
        });
    });
}

function initModals() {
    function openModal(id) {
        document.getElementById(id).classList.add('show');
    }
    function closeModal(id) {
        document.getElementById(id).classList.remove('show');
    }
    
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('postBtn').addEventListener('click', () => openModal('postModal'));
    
    document.querySelectorAll('.close, .close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

function initDarkMode() {
    let darkMode = false;
    document.getElementById('darkToggle').addEventListener('click', function() {
        darkMode = !darkMode;
        document.body.style.background = darkMode ? '#0a0a0a' : 'radial-gradient(ellipse at top, #0d4a0d, #061f06)';
        this.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

function initNotifications() {
    let notifCount = 3;
    document.getElementById('notifBtn').addEventListener('click', function() {
        const badge = this.querySelector('.badge');
        if (notifCount > 0) {
            notifCount = 0;
            badge.style.display = 'none';
            showToast('Arifa zote zimesomwa!', 'success');
        } else {
            showToast('Hakuna arifa mpya', 'info');
        }
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    const colors = {
        success: '#7dce82',
        info: '#d4af37',
        error: '#ff4444'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(13, 74, 13, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 12px 24px;
        color: white;
        font-size: 0.85rem;
        z-index: 3000;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        border-left: 4px solid ${colors[type] || colors.info};
        max-width: 90%;
        text-align: center;
        animation: fadeUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

window.showToast = showToast;
window.APP = APP;
