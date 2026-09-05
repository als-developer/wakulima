// Notifications System
class NotificationManager {
    constructor() {
        this.notifications = this.loadNotifications();
        this.init();
    }
    
    init() {
        this.renderNotifications();
        this.requestPermission();
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
                read: false
            },
            {
                id: '2',
                title: 'Bidhaa mpya sokoni',
                message: 'Mbolea mpya ya organic imewasili sokoni',
                time: Date.now() - 7200000,
                read: false
            }
        ];
    }
    
    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    addNotification(title, message) {
        const notif = {
            id: Date.now().toString(),
            title,
            message,
            time: Date.now(),
            read: false
        };
        
        this.notifications.unshift(notif);
        this.saveNotifications();
        this.renderNotifications();
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/images/icon-192.png'
            });
        }
        
        this.updateBadge();
    }
    
    checkNewNotifications() {
        if (Math.random() < 0.05) {
            const messages = [
                'Mkulima mpya amejiunga!',
                'Bidhaa mpya imewekwa sokoni',
                'Mafunzo mapya yamepatikana'
            ];
            this.addNotification('Habari mpya!', messages[Math.floor(Math.random() * messages.length)]);
        }
    }
    
    renderNotifications() {
        const badge = document.querySelector('.badge');
        if (badge) {
            const unread = this.notifications.filter(n => !n.read).length;
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'block' : 'none';
        }
    }
    
    updateBadge() {
        this.renderNotifications();
    }
}

const notificationManager = new NotificationManager();
window.notificationManager = notificationManager;
