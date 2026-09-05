// Google Analytics Integration
class AnalyticsManager {
    constructor() {
        this.gaId = 'G-XXXXXXXXXX'; // Replace with your GA ID
        this.init();
    }
    
    init() {
        if (this.gaId && this.gaId !== 'G-XXXXXXXXXX') {
            this.loadGA();
            this.trackPageView();
            this.setupEventTracking();
        } else {
            console.log('📊 Analytics: Using local logging');
            this.setupLocalLogging();
        }
    }
    
    loadGA() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.gaId);
        window.gtag = gtag;
    }
    
    trackPageView(page = null) {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_title: page || document.title,
                page_location: window.location.href
            });
        }
    }
    
    trackEvent(category, action, label = null, value = null) {
        if (window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
    }
    
    trackUserAction(action, data = {}) {
        this.trackEvent('User Action', action, JSON.stringify(data));
    }
    
    setupEventTracking() {
        document.addEventListener('postCreated', (e) => {
            this.trackUserAction('post_created', { 
                content: e.detail?.content?.substring(0, 50) 
            });
        });
        
        document.addEventListener('userLogin', (e) => {
            this.trackUserAction('user_login', { 
                username: e.detail?.username 
            });
        });
        
        document.addEventListener('userRegister', (e) => {
            this.trackUserAction('user_register', { 
                username: e.detail?.username 
            });
        });
        
        window.addEventListener('error', (e) => {
            this.trackEvent('Error', e.message || 'Unknown error');
        });
    }
    
    setupLocalLogging() {
        this.logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
            this.logs.push({ timestamp: new Date().toISOString(), args });
            originalLog.apply(console, args);
        };
    }
}

const analytics = new AnalyticsManager();
window.analytics = analytics;
