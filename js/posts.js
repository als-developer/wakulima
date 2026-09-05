// Posts System
class PostManager {
    constructor() {
        this.posts = this.loadPosts();
        this.init();
    }
    
    init() {
        // Create post
        document.getElementById('postBtn')?.addEventListener('click', () => {
            this.createPost();
        });
        
        document.getElementById('postInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createPost();
        });
        
        // Submit post from modal
        document.getElementById('submitPostBtn')?.addEventListener('click', () => {
            const text = document.getElementById('postTextarea').value;
            if (text) {
                this.createPost(text);
                document.getElementById('postModal').classList.remove('show');
                document.getElementById('postTextarea').value = '';
            }
        });
    }
    
    loadPosts() {
        const posts = localStorage.getItem('kilimo_posts');
        return posts ? JSON.parse(posts) : this.getSamplePosts();
    }
    
    savePosts() {
        localStorage.setItem('kilimo_posts', JSON.stringify(this.posts));
    }
    
    getSamplePosts() {
        return [
            {
                id: '1',
                author: 'Mkulima Smart',
                authorAvatar: '/images/default-avatar.png',
                content: 'Leo nimepanda mbegu mpya za mahindi zenye tija. Natumaini mavuno mazuri! 🌽',
                time: new Date(Date.now() - 3600000).toISOString(),
                likes: 24,
                comments: 5,
                liked: false,
                type: 'text'
            },
            {
                id: '2',
                author: 'FarmTech',
                authorAvatar: '/images/default-avatar.png',
                content: 'Teknolojia mpya ya kumwagilia inapunguza matumizi ya maji kwa 40%. Tafadhali tembelea mtandao wetu kwa maelezo zaidi.',
                time: new Date(Date.now() - 7200000).toISOString(),
                likes: 42,
                comments: 12,
                liked: false,
                type: 'text'
            }
        ];
    }
    
    createPost(content) {
        if (!auth.currentUser) {
            showNotification('Tafadhali ingia kwanza!', 'warning');
            document.getElementById('loginModal').classList.add('show');
            return;
        }
        
        const input = document.getElementById('postInput');
        const text = content || input.value.trim();
        
        if (!text) {
            showNotification('Andika kitu!', 'warning');
            return;
        }
        
        const post = {
            id: Date.now().toString(),
            author: auth.currentUser.username,
            authorAvatar: auth.currentUser.avatar || '/images/default-avatar.png',
            content: text,
            time: new Date().toISOString(),
            likes: 0,
            comments: 0,
            liked: false,
            type: 'text'
        };
        
        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();
        input.value = '';
        
        // Update user post count
        auth.currentUser.posts++;
        localStorage.setItem('kilimo_user', JSON.stringify(auth.currentUser));
        
        showNotification('Chapisho limechapishwa!', 'success');
    }
    
    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (!auth.currentUser) {
            showNotification('Ingia kwanza ili kupenda!', 'warning');
            document.getElementById('loginModal').classList.add('show');
            return;
        }
        
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        this.savePosts();
        this.renderPosts();
    }
    
    renderPosts() {
        const container = document.getElementById('postsContainer');
        if (!container) return;
        
        if (this.posts.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px;color:#888;">
                    <div style="font-size:3rem;margin-bottom:12px;">🌾</div>
                    <h3>Hakuna chapisho bado</h3>
                    <p>Kuwa wa kwanza kuchapisha!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.posts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <img src="${post.authorAvatar}" alt="${post.author}" class="avatar">
                    <div>
                        <div class="post-author">${post.author}</div>
                        <div class="post-time">${this.formatTime(post.time)}</div>
                    </div>
                </div>
                <div class="post-content">${this.formatContent(post.content)}</div>
                <div class="post-actions">
                    <button onclick="window.postManager.toggleLike('${post.id}')" 
                            class="${post.liked ? 'liked' : ''}">
                        ${post.liked ? '❤️' : '🤍'} ${post.likes}
                    </button>
                    <button onclick="window.showNotification('Maoni yanaandaliwa...', 'info')">
                        💬 ${post.comments}
                    </button>
                    <button onclick="window.showNotification('Imehifadhiwa!', 'success')">
                        🔖
                    </button>
                    <button onclick="window.sharePost('${post.id}')">
                        📤
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    formatContent(content) {
        // Convert URLs to links
        return content.replace(/(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" style="color:var(--gold);">$1</a>'
        ).replace(/#(\w+)/g, 
            '<span style="color:var(--primary);font-weight:600;">#$1</span>'
        );
    }
    
    formatTime(timestamp) {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Sasa hivi';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return new Date(timestamp).toLocaleDateString('sw');
    }
}

// Initialize Posts
const postManager = new PostManager();
window.postManager = postManager;

// Share post function
window.sharePost = function(postId) {
    if (navigator.share) {
        navigator.share({
            title: 'Kilimo Smart',
            text: 'Angalia chapisho hili kwenye Kilimo Smart!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Kiungo kimenakiliwa!', 'success');
        });
    }
};
