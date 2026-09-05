// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }
    
    init() {
        const savedUser = localStorage.getItem('kilimo_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
        
        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
        
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthMode();
        });
    }
    
    loadUsers() {
        const users = localStorage.getItem('kilimo_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers() {
        localStorage.setItem('kilimo_users', JSON.stringify(this.users));
    }
    
    toggleAuthMode() {
        const form = document.getElementById('authForm');
        const btn = form.querySelector('button[type="submit"]');
        const title = form.closest('.modal-content').querySelector('h3');
        const switchLink = document.getElementById('switchToRegister');
        
        if (btn.innerHTML.indexOf('Ingia') !== -1) {
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Jisajili';
            title.innerHTML = '<i class="fas fa-user-plus" style="color:var(--gold-main);"></i> Jisajili Sasa';
            switchLink.textContent = 'Una akaunti? Ingia';
        } else {
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingia';
            title.innerHTML = '<i class="fas fa-sign-in-alt" style="color:var(--gold-main);"></i> Ingia au Jisajili';
            switchLink.textContent = 'Huna akaunti? Jisajili';
        }
    }
    
    handleAuth() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const accountType = document.getElementById('accountType').value;
        const btn = document.querySelector('#authForm button[type="submit"]');
        
        if (!username || !password) {
            showToast('Tafadhali jaza nyanja zote!', 'error');
            return;
        }
        
        if (btn.innerHTML.indexOf('Ingia') !== -1) {
            this.login(username, password);
        } else {
            this.register(username, password, accountType);
        }
    }
    
    register(username, password, accountType) {
        if (this.users.find(u => u.username === username)) {
            showToast('Jina la mtumiaji tayari lipo!', 'error');
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
            bio: 'Mkulima wa kidunia 🌍',
            avatar: '/images/default-avatar.png'
        };
        
        this.users.push(user);
        this.saveUsers();
        this.login(username, password);
        showToast('Akaunti imeundwa! Karibu Kilimo Smart!', 'success');
        
        document.dispatchEvent(new CustomEvent('userRegister', {
            detail: { username, accountType }
        }));
    }
    
    login(username, password) {
        const user = this.users.find(u => 
            u.username === username && u.password === password
        );
        
        if (!user) {
            showToast('Jina au nenosiri si sahihi!', 'error');
            return;
        }
        
        this.currentUser = user;
        localStorage.setItem('kilimo_user', JSON.stringify(user));
        this.updateUI();
        showToast(`Karibu tena ${user.username}!`, 'success');
        document.getElementById('loginModal').classList.remove('show');
        
        document.dispatchEvent(new CustomEvent('userLogin', {
            detail: { username }
        }));
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('kilimo_user');
        this.updateUI();
        showToast('Umefunga akaunti yako.', 'info');
    }
    
    updateUI() {
        const profileName = document.getElementById('profileName');
        const profileBio = document.querySelector('.profile-body .bio');
        const profileAvatar = document.querySelector('.profile-body .avatar');
        const postInput = document.getElementById('postInput');
        const loginBtn = document.getElementById('loginBtn');
        
        if (this.currentUser) {
            if (profileName) profileName.textContent = this.currentUser.username;
            if (profileBio) profileBio.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${this.currentUser.bio}`;
            if (profileAvatar) profileAvatar.src = this.currentUser.avatar || '/images/default-avatar.png';
            if (postInput) postInput.placeholder = `Chapisha kama ${this.currentUser.username}...`;
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Toka`;
                loginBtn.onclick = () => this.logout();
            }
        } else {
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Ingia`;
                loginBtn.onclick = () => document.getElementById('loginModal').classList.add('show');
            }
        }
    }
}

const auth = new AuthManager();
window.auth = auth;
