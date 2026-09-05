// Google Analytics Integration
class AnalyticsManager {
    constructor() {
        this.gaId = 'G-XXXXXXXXXX'; // Replace with your GA ID
        this.init();
    }
    
    init() {
        // Load Google Analytics
        if (this.gaId && this.gaId !== 'G-XXXXXXXXXX') {
            this.loadGA();
            this.trackPageView();
            this.setupEventTracking();
        } else {
            console.log('📊 Analytics: Using local logging (set GA ID for production)');
            this.setupLocalLogging();
        }
    }
    
    loadGA() {
        // Load Google Analytics script
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
        this.localLog('Page View', { page: page || document.title });
    }
    
    trackEvent(category, action, label = null, value = null) {
        if (window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        this.localLog('Event', { category, action, label, value });
    }
    
    trackUserAction(action, data = {}) {
        this.trackEvent('User Action', action, JSON.stringify(data));
    }
    
    setupEventTracking() {
        // Track post creation
        document.addEventListener('postCreated', (e) => {
            this.trackUserAction('post_created', { 
                content: e.detail?.content?.substring(0, 50) 
            });
        });
        
        // Track product views
        document.addEventListener('productViewed', (e) => {
            this.trackUserAction('product_viewed', { 
                product: e.detail?.product 
            });
        });
        
        // Track course views
        document.addEventListener('courseViewed', (e) => {
            this.trackUserAction('course_viewed', { 
                course: e.detail?.course 
            });
        });
        
        // Track user login/register
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
        
        // Track errors
        window.addEventListener('error', (e) => {
            this.trackEvent('Error', e.message || 'Unknown error', e.filename, e.lineno);
        });
    }
    
    setupLocalLogging() {
        // Store logs locally
        this.logs = [];
        this.logToConsole = true;
        
        // Override console methods for logging
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };
        
        console.log = (...args) => {
            this.log('LOG', args);
            originalConsole.log.apply(console, args);
        };
        
        console.error = (...args) => {
            this.log('ERROR', args);
            originalConsole.error.apply(console, args);
        };
        
        console.warn = (...args) => {
            this.log('WARN', args);
            originalConsole.warn.apply(console, args);
        };
        
        console.info = (...args) => {
            this.log('INFO', args);
            originalConsole.info.apply(console, args);
        };
    }
    
    log(level, messages) {
        const entry = {
            timestamp: new Date().toISOString(),
            level: level,
            messages: messages,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(entry);
        
        // Keep only last 1000 logs
        if (this.logs.length > 1000) {
            this.logs.shift();
        }
        
        // Save to localStorage for debugging
        try {
            localStorage.setItem('kilimo_logs', JSON.stringify(this.logs.slice(-100)));
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    localLog(type, data) {
        console.log(`📊 ${type}:`, data);
    }
    
    getLogs() {
        return this.logs;
    }
    
    exportLogs() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kilimo-logs-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize Analytics
const analytics = new AnalyticsManager();
window.analytics = analytics;

// Export logs (accessible via console: analytics.exportLogs())
console.log('📊 Analytics initialized. Use analytics.exportLogs() to export logs.');
