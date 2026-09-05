// ============================================================
// KILIMO SMART - PWA INSTALL PROMPT
// ============================================================

class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.installBanner = null;
        this.installBtn = null;
        this.init();
    }

    init() {
        // Check if already installed
        if (this.isAppInstalled()) {
            console.log('✅ App already installed');
            return;
        }

        // Listen for beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallBanner();
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            console.log('✅ App installed successfully!');
            this.hideInstallBanner();
            this.showToast('Kilimo Smart imesakinishwa kwenye simu yako! 🎉', 'success');
            
            // Track installation
            if (window.analytics) {
                window.analytics.trackEvent('PWA', 'installed');
            }
        });

        // Check if app is already installed
        if (window.navigator.standalone === true) {
            console.log('✅ Running in standalone mode');
            this.hideInstallBanner();
        }

        // Check for display mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ Running in standalone mode (media query)');
            this.hideInstallBanner();
        }

        // Listen for display mode changes
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
            if (e.matches) {
                console.log('✅ Switched to standalone mode');
                this.hideInstallBanner();
            }
        });
    }

    // ============================================================
    // Check if app is installed
    // ============================================================
    isAppInstalled() {
        // Check if running in standalone mode
        if (window.navigator.standalone === true) {
            return true;
        }
        
        // Check display mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }

        // Check if installed via Chrome
        if (window.navigator && window.navigator.getInstalledRelatedApps) {
            // This is a promise, we'll handle it async
            return false;
        }

        return false;
    }

    // ============================================================
    // Show install banner
    // ============================================================
    showInstallBanner() {
        // Don't show if already installed
        if (this.isAppInstalled()) return;

        // Don't show if already showing
        if (this.installBanner) return;

        // Check if user dismissed before
        if (localStorage.getItem('pwa_install_dismissed') === 'true') {
            return;
        }

        console.log('📱 Showing install banner');

        // Create banner
        this.installBanner = document.createElement('div');
        this.installBanner.id = 'pwa-install-banner';
        this.installBanner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 92%;
            max-width: 400px;
            background: rgba(13, 74, 13, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 40px rgba(0,0,0,0.5);
            padding: 16px 20px;
            z-index: 9999;
            animation: slideUp 0.4s ease;
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        // Banner content
        this.installBanner.innerHTML = `
            <div style="flex-shrink:0;">
                <img src="/images/icon-72.png" alt="Kilimo Smart" 
                     style="width:48px;height:48px;border-radius:12px;border:2px solid #d4af37;">
            </div>
            <div style="flex:1;">
                <div style="font-weight:700;color:white;font-size:0.9rem;">Sakinisha Kilimo Smart</div>
                <div style="color:rgba(255,255,255,0.5);font-size:0.75rem;">Pata uzoefu bora kama App</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">
                <button id="pwa-install-btn" style="
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                ">
                    <i class="fas fa-download"></i> Sakinisha
                </button>
                <button id="pwa-dismiss-btn" style="
                    background: transparent;
                    color: rgba(255,255,255,0.3);
                    border: none;
                    padding: 8px 10px;
                    border-radius: 30px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    ✕
                </button>
            </div>
        `;

        document.body.appendChild(this.installBanner);

        // Install button
        this.installBtn = document.getElementById('pwa-install-btn');
        this.installBtn.addEventListener('click', () => {
            this.installApp();
        });

        // Dismiss button
        const dismissBtn = document.getElementById('pwa-dismiss-btn');
        dismissBtn.addEventListener('click', () => {
            this.hideInstallBanner();
            localStorage.setItem('pwa_install_dismissed', 'true');
            
            if (window.analytics) {
                window.analytics.trackEvent('PWA', 'banner_dismissed');
            }
        });
    }

    // ============================================================
    // Hide install banner
    // ============================================================
    hideInstallBanner() {
        if (this.installBanner) {
            this.installBanner.style.opacity = '0';
            this.installBanner.style.transform = 'translateX(-50%) translateY(20px)';
            this.installBanner.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                if (this.installBanner && this.installBanner.parentNode) {
                    this.installBanner.remove();
                }
                this.installBanner = null;
                this.installBtn = null;
            }, 300);
        }
    }

    // ============================================================
    // Install app
    // ============================================================
    async installApp() {
        if (!this.deferredPrompt) {
            // Try to trigger install via manifest
            this.triggerInstallViaManifest();
            return;
        }

        try {
            // Show install prompt
            this.deferredPrompt.prompt();
            
            // Wait for user choice
            const result = await this.deferredPrompt.userChoice;
            
            if (result.outcome === 'accepted') {
                console.log('✅ User accepted install');
                this.hideInstallBanner();
                this.showToast('App inasakinishwa... 🚀', 'info');
                
                if (window.analytics) {
                    window.analytics.trackEvent('PWA', 'install_accepted');
                }
            } else {
                console.log('❌ User declined install');
                localStorage.setItem('pwa_install_dismissed', 'true');
                this.hideInstallBanner();
                
                if (window.analytics) {
                    window.analytics.trackEvent('PWA', 'install_declined');
                }
            }
            
            this.deferredPrompt = null;
        } catch (error) {
            console.error('Install error:', error);
            this.showToast('Tatizo katika kusakinisha. Jaribu tena.', 'error');
        }
    }

    // ============================================================
    // Fallback: Trigger install via manifest
    // ============================================================
    triggerInstallViaManifest() {
        // Some browsers support navigator.install()
        if (navigator.install) {
            navigator.install({
                name: 'Kilimo Smart',
                icon: '/images/icon-192.png'
            }).then(() => {
                this.hideInstallBanner();
                this.showToast('App imesakinishwa! 🎉', 'success');
            }).catch(() => {
                this.showToast('Sakinisha kwa mikono: chagua "Ongeza kwenye Skrini"', 'info');
            });
        } else {
            // Show manual install instructions
            this.showManualInstallInstructions();
        }
    }

    // ============================================================
    // Manual install instructions
    // ============================================================
    showManualInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <div style="text-align:left;font-size:0.8rem;color:rgba(255,255,255,0.7);">
                    <p style="margin:4px 0;">📱 <strong>iPhone/iPad:</strong></p>
                    <ol style="padding-left:20px;margin:4px 0;">
                        <li>Bonyeza <strong>📤</strong> (Share) chini ya skrini</li>
                        <li>Chagua <strong>"Add to Home Screen"</strong></li>
                        <li>Bonyeza <strong>"Add"</strong></li>
                    </ol>
                </div>
            `;
        } else if (isAndroid) {
            instructions = `
                <div style="text-align:left;font-size:0.8rem;color:rgba(255,255,255,0.7);">
                    <p style="margin:4px 0;">📱 <strong>Android:</strong></p>
                    <ol style="padding-left:20px;margin:4px 0;">
                        <li>Bonyeza <strong>⋮</strong> (Menu) kwenye browser</li>
                        <li>Chagua <strong>"Add to Home screen"</strong></li>
                        <li>Bonyeza <strong>"Add"</strong></li>
                    </ol>
                </div>
            `;
        } else {
            instructions = `
                <div style="text-align:left;font-size:0.8rem;color:rgba(255,255,255,0.7);">
                    <p style="margin:4px 0;">💻 <strong>Kwa Kompyuta:</strong></p>
                    <ol style="padding-left:20px;margin:4px 0;">
                        <li>Bonyeza <strong>🔒</strong> kwenye address bar</li>
                        <li>Chagua <strong>"Install App"</strong> au <strong>"Add to Home screen"</strong></li>
                    </ol>
                </div>
            `;
        }

        // Show instruction modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        modal.innerHTML = `
            <div style="
                background: rgba(13,74,13,0.95);
                border-radius: 24px;
                padding: 24px;
                max-width: 380px;
                width: 92%;
                border: 1px solid rgba(255,255,255,0.06);
            ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="color:white;font-size:1.1rem;">
                        <i class="fas fa-download" style="color:#d4af37;"></i> Sakinisha App
                    </h3>
                    <button id="pwa-instruction-close" style="
                        background:transparent;
                        border:none;
                        color:rgba(255,255,255,0.3);
                        font-size:1.5rem;
                        cursor:pointer;
                    ">✕</button>
                </div>
                ${instructions}
                <button id="pwa-instruction-gotit" style="
                    width:100%;
                    margin-top:12px;
                    padding:10px;
                    border-radius:30px;
                    border:none;
                    background: linear-gradient(135deg, #d4af37, #b8860b);
                    color: white;
                    font-weight:600;
                    font-size:0.9rem;
                    cursor:pointer;
                ">
                    <i class="fas fa-check"></i> Naelewa
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close handlers
        const close = () => modal.remove();
        document.getElementById('pwa-instruction-close').addEventListener('click', close);
        document.getElementById('pwa-instruction-gotit').addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    }

    // ============================================================
    // Toast notification
    // ============================================================
    showToast(message, type = 'info') {
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
            background: rgba(13,74,13,0.95);
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
}

// ============================================================
// Initialize PWA Install Manager
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const pwaInstall = new PWAInstallManager();
    window.pwaInstall = pwaInstall;
});

// Add CSS animation if not exists
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);
