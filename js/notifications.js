// Notifications System
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.init();
    }
    
    init() {
        this.renderNotifications();
        
        // Request permission for push notifications
        this.requestPermission();
        
        // Check for new notifications periodically
        setInterval(() => this.checkNewNotifications(), 60000);
    }
    
    loadNotifications() {
        const notifs = localStorage.getItem('kilimo_notifications');
        return notifs ? JSON.parse(notifs) : this.getSampleNotifications();
    }
    
    saveNotifications() {
        localStorage.setItem('kilimo_notifications', JSON.stringify(this.notifications));
    }
    
    getSampleNotifications() {
        return [
            {
                id: '1',
                title: 'Chapisho lipya',
                message: 'Mkulima Smart amechapisha chapisho jipya',
                time: Date.now() - 3600000,
                read: false,
                type: 'post'
            },
            {
                id: '2',
                title: 'Bidhaa mpya sokoni',
                message: 'Mbolea mpya ya organic imewekwa sokoni',
                time: Date.now() - 7200000,
                read: false,
                type: 'marketplace'
            },
            {
                id: '3',
                title: 'Mafunzo mapya',
                message: 'Mafunzo ya teknolojia ya kilimo yamepatikana',
                time: Date.now() - 14400000,
                read: true,
                type: 'education'
            }
        ];
    }
    
    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    addNotification(title, message, type = 'general') {
        const notif = {
            id: Date.now().toString(),
            title,
            message,
            time: Date.now(),
            read: false,
            type
        };
        
        this.notifications.unshift(notif);
        this.saveNotifications();
        this.renderNotifications();
        
        // Show push notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/images/icon-192.png',
                badge: '/images/icon-192.png'
            });
        }
        
        // Update badge
        this.updateBadge();
    }
    
    checkNewNotifications() {
        // In a real app, this would check server for new notifications
        // For demo, we'll randomly add one
        if (Math.random() < 0.1) {
            const messages = [
                'Mkulima mpya amejiunga!',
                'Bidhaa mpya imewekwa sokoni',
                'Mafunzo mapya yamepatikana',
                'Mtu amependa chapisho lako'
            ];
            
            this.addNotification(
                'Habari mpya!',
                messages[Math.floor(Math.random() * messages.length)]
            );
        }
    }
    
    renderNotifications() {
        const notifBtn = document.getElementById('notifBtn');
        const badge = document.querySelector('.notif-badge');
        
        if (badge) {
            const unread = this.notifications.filter(n => !n.read).length;
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'block' : 'none';
        }
        
        // Render notification list (for dropdown)
        let notifContainer = document.querySelector('.notif-dropdown');
        
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.className = 'notif-dropdown';
            notifContainer.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: white;
                border-radius: var(--border-radius);
                box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                max-width: 380px;
                width: 90%;
                max-height: 400px;
                overflow-y: auto;
                display: none;
                z-index: 2000;
                padding: 12px;
            `;
            document.body.appendChild(notifContainer);
        }
        
        if (this.notifications.length === 0) {
            notifContainer.innerHTML = `
                <div style="text-align:center;padding:20px;color:#888;">
                    <div style="font-size:2rem;margin-bottom:8px;">🔔</div>
                    <p>Hakuna arifa mpya</p>
                </div>
            `;
            return;
        }
        
        notifContainer.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid #eee;margin-bottom:8px;">
                <strong>Arifa</strong>
                <button onclick="window.notificationManager.markAllRead()" 
                        style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:0.8rem;">
                    Soma zote
                </button>
            </div>
            ${this.notifications.map(n => `
                <div class="notif-item ${n.read ? 'read' : 'unread'}" 
                     style="padding:10px;margin:4px 0;border-radius:8px;background:${n.read ? '#f9f9f9' : '#f0f7f0'};border-left:3px solid ${n.read ? '#ddd' : 'var(--gold)'};cursor:pointer;"
                     onclick="window.notificationManager.markRead('${n.id}')">
                    <div style="font-weight:600;font-size:0.9rem;">${n.title}</div>
                    <div style="font-size:0.85rem;color:#666;">${n.message}</div>
                    <div style="font-size:0.7rem;color:#aaa;margin-top:4px;">
                        ${this.formatTime(n.time)}
                    </div>
                </div>
            `).join('')}
        `;
        
        // Toggle dropdown
        document.getElementById('notifBtn')?.addEventListener('click', () => {
            const isVisible = notifContainer.style.display === 'block';
            notifContainer.style.display = isVisible ? 'none' : 'block';
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notif-btn') && !e.target.closest('.notif-dropdown')) {
                notifContainer.style.display = 'none';
            }
        });
    }
    
    markRead(notifId) {
        const notif = this.notifications.find(n => n.id === notifId);
        if (notif) {
            notif.read = true;
            this.saveNotifications();
            this.renderNotifications();
        }
    }
    
    markAllRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.renderNotifications();
        document.querySelector('.notif-dropdown').style.display = 'none';
    }
    
    formatTime(timestamp) {
        const diff = Date.now() -
