// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }
    
    init() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('kilimo_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
        
        // Login form
        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
    }
    
    loadUsers() {
        const users = localStorage.getItem('kilimo_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers() {
        localStorage.setItem('kilimo_users', JSON.stringify(this.users));
    }
    
    handleAuth() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const accountType = document.getElementById('accountType').value;
        const btn = document.querySelector('#authForm button[type="submit"]');
        
        if (!username || !password) {
            showNotification('Tafadhali jaza nyanja zote!', 'error');
            if (window.analytics) {
                window.analytics.trackEvent('Auth', 'validation_error');
            }
            return;
        }
        
        if (btn.textContent === 'Ingia') {
            this.login(username, password);
        } else {
            this.register(username, password, accountType);
        }
    }
    
    register(username, password, accountType) {
        // Check if user exists
        if (this.users.find(u => u.username === username)) {
            showNotification('Jina la mtumiaji tayari lipo!', 'error');
            if (window.analytics) {
                window.analytics.trackEvent('Auth', 'register_failed', 'username_exists');
            }
            return;
        }
        
        const user = {
            id: Date.now().toString(),
            username,
            password,
            accountType,
            joined: new Date().toISOString(),
            followers: 0,
            following: 0,
            posts: 0,
            bio: `Mkulima wa kidunia 🌍`,
            avatar: '/images/default-avatar.png'
        };
        
        this.users.push(user);
        this.saveUsers();
        this.login(username, password);
        showNotification('Akaunti imeundwa! Karibu Kilimo Smart!', 'success');
        
        // Track registration
        if (window.analytics) {
            window.analytics.trackUserAction('register', {
                username: username,
                account_type: accountType
            });
            // Dispatch event
            document.dispatchEvent(new CustomEvent('userRegister', {
                detail: { username, accountType }
            }));
        }
    }
    
    login(username, password) {
        const user = this.users.find(u => 
            u.username === username && u.password === password
        );
        
        if (!user) {
            showNotification('Jina au nenosiri si sahihi!', 'error');
            if (window.analytics) {
                window.analytics.trackEvent('Auth', 'login_failed', 'invalid_credentials');
            }
            return;
        }
        
        this.currentUser = user;
        localStorage.setItem('kilimo_user', JSON.stringify(user));
        this.updateUI();
        showNotification(`Karibu tena ${user.username}!`, 'success');
        document.getElementById('loginModal').classList.remove('show');
        
        // Track login
        if (window.analytics) {
            window.analytics.trackUserAction('login', { username: username });
            document.dispatchEvent(new CustomEvent('userLogin', {
                detail: { username }
            }));
        }
    }
    
    logout() {
        if (this.currentUser && window.analytics) {
            window.analytics.trackUserAction('logout', { 
                username: this.currentUser.username 
            });
        }
        
        this.currentUser = null;
        localStorage.removeItem('kilimo_user');
        this.updateUI();
        showNotification('Umefunga akaunti yako.', 'info');
    }
    
    updateUI() {
        const profileName = document.getElementById('profileName');
        const profileBio = document.getElementById('profileBio');
        const profileAvatar = document.querySelector('.profile-avatar');
        const postInput = document.getElementById('postInput');
        
        if (this.currentUser) {
            if (profileName) profileName.textContent = this.currentUser.username;
            if (profileBio) profileBio.textContent = this.currentUser.bio;
            if (profileAvatar) profileAvatar.src = this.currentUser.avatar || '/images/default-avatar.png';
            if (postInput) postInput.placeholder = `Chapisha kama ${this.currentUser.username}...`;
            
            // Show profile stats
            document.querySelectorAll('.profile-stats span')[0].innerHTML = 
                `<strong>${this.currentUser.followers}</strong> Wanaofuata`;
            document.querySelectorAll('.profile-stats span')[1].innerHTML = 
                `<strong>${this.currentUser.following}</strong> Wanafuata`;
            document.querySelectorAll('.profile-stats span')[2].innerHTML = 
                `<strong>${this.currentUser.posts}</strong> Chapisho`;
        } else {
            // Show login prompt
            document.getElementById('loginModal').classList.add('show');
        }
    }
}

// Initialize Auth
const auth = new AuthManager();
window.auth = auth;
