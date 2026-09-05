// Posts System
class PostManager {
    constructor() {
        this.posts = this.loadPosts();
        this.init();
    }
    
    init() {
        document.getElementById('postBtn').addEventListener('click', () => {
            this.createPost();
        });
        
        document.getElementById('postInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createPost();
        });
        
        document.getElementById('submitPostBtn').addEventListener('click', () => {
            const text = document.getElementById('postTextarea').value.trim();
            if (text) {
                this.createPost(text);
                document.getElementById('postTextarea').value = '';
                document.getElementById('postModal').classList.remove('show');
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
                liked: false
            },
            {
                id: '2',
                author: 'FarmTech',
                authorAvatar: '/images/default-avatar.png',
                content: 'Teknolojia mpya ya kumwagilia inapunguza matumizi ya maji kwa 40%.',
                time: new Date(Date.now() - 7200000).toISOString(),
                likes: 42,
                comments: 12,
                liked: false
            }
        ];
    }
    
    createPost(content) {
        if (!auth.currentUser) {
            showToast('Tafadhali ingia kwanza!', 'warning');
            document.getElementById('loginModal').classList.add('show');
            return;
        }
        
        const input = document.getElementById('postInput');
        const text = content || input.value.trim();
        
        if (!text) {
            showToast('Andika kitu!', 'warning');
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
            liked: false
        };
        
        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();
        input.value = '';
        
        auth.currentUser.posts++;
        localStorage.setItem('kilimo_user', JSON.stringify(auth.currentUser));
        
        showToast('Chapisho limechapishwa!', 'success');
        document.dispatchEvent(new CustomEvent('postCreated', {
            detail: { content: text }
        }));
    }
    
    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (!auth.currentUser) {
            showToast('Ingia kwanza ili kupenda!', 'warning');
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
                <div class="morph-card text-center" style="padding:40px;">
                    <i class="fas fa-newspaper" style="font-size:3rem;color:rgba(255,255,255,0.1);"></i>
                    <p style="color:rgba(255,255,255,0.3);margin-top:8px;">Hakuna chapisho bado</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.posts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <img src="${post.authorAvatar}" alt="${post.author}" class="avatar">
                    <div>
                        <div class="name">${post.author}</div>
                        <div class="time"><i class="far fa-clock"></i> ${this.formatTime(post.time)}</div>
                    </div>
                </div>
                <div class="post-body">${post.content}</div>
                <div class="post-actions">
                    <button onclick="window.postManager.toggleLike('${post.id}')" class="${post.liked ? 'liked' : ''}">
                        <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i> ${post.likes}
                    </button>
                    <button><i class="far fa-comment"></i> ${post.comments}</button>
                    <button><i class="far fa-bookmark"></i></button>
                    <button><i class="fas fa-share-alt"></i></button>
                </div>
            </div>
        `).join('');
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

const postManager = new PostManager();
window.postManager = postManager;
