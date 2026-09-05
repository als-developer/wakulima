// Marketplace System
class MarketplaceManager {
    constructor() {
        this.items = this.loadItems();
        this.init();
    }
    
    init() {
        this.renderItems();
        
        // Filters
        document.getElementById('categoryFilter')?.addEventListener('change', () => {
            this.filterItems();
        });
        
        document.getElementById('searchMarket')?.addEventListener('input', () => {
            this.filterItems();
        });
    }
    
    loadItems() {
        const items = localStorage.getItem('kilimo_marketplace');
        return items ? JSON.parse(items) : this.getSampleItems();
    }
    
    saveItems() {
        localStorage.setItem('kilimo_marketplace', JSON.stringify(this.items));
    }
    
    getSampleItems() {
        return [
            {
                id: '1',
                title: 'Mbolea ya Organic',
                price: '25,000 TSh',
                category: 'mbolea',
                seller: 'GreenFarm Ltd',
                image: '/images/product1.jpg',
                rating: 4.8,
                description: 'Mbolea asili ya mboji iliyochanganywa na madini'
            },
            {
                id: '2',
                title: 'Mbegu za Mahindi Hybrid',
                price: '15,000 TSh',
                category: 'mbegu',
                seller: 'SeedCo Tanzania',
                image: '/images/product2.jpg',
                rating: 4.5,
                description: 'Mbegu bora za mahindi zenye tija ya tani 40 kwa ekari'
            },
            {
                id: '3',
                title: 'Trekta ya Mkulima',
                price: '4,500,000 TSh',
                category: 'vifaa',
                seller: 'AgriMachines',
                image: '/images/product3.jpg',
                rating: 4.9,
                description: 'Trekta yenye nguvu ya 75HP, inafaa kwa shamba kubwa'
            },
            {
                id: '4',
                title: 'Nafaka za Mahindi',
                price: '8,000 TSh',
                category: 'nafaka',
                seller: 'HarvestPlus',
                image: '/images/product4.jpg',
                rating: 4.3,
                description: 'Mahindi mazuri ya mavuno ya mwaka huu'
            }
        ];
    }
    
    filterItems() {
        const category = document.getElementById('categoryFilter').value;
        const search = document.getElementById('searchMarket').value.toLowerCase();
        
        let filtered = this.items;
        
        if (category !== 'all') {
            filtered = filtered.filter(item => item.category === category);
        }
        
        if (search) {
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                item.seller.toLowerCase().includes(search)
            );
        }
        
        this.renderItems(filtered);
    }
    
    renderItems(items = null) {
        const container = document.getElementById('marketplaceItems');
        if (!container) return;
        
        const displayItems = items || this.items;
        
        if (displayItems.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">
                    <div style="font-size:3rem;margin-bottom:12px;">🔍</div>
                    <h3>Hakuna bidhaa zilizopatikana</h3>
                    <p>Jaribu kubadili vigezo vya utafutaji</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = displayItems.map(item => `
            <div class="marketplace-item">
                <div style="background:linear-gradient(135deg,#f0f0f0,#e0e0e0);height:200px;display:flex;align-items:center;justify-content:center;font-size:3rem;">
                    ${this.getCategoryIcon(item.category)}
                </div>
                <div class="item-info">
                    <div class="item-title">${item.title}</div>
                    <div class="item-price">${item.price}</div>
                    <div class="item-seller">👤 ${item.seller}</div>
                    <div style="color:#888;font-size:0.9rem;margin:8px 0;">
                        ⭐ ${item.rating} ${this.getStars(item.rating)}
                    </div>
                    <p style="color:#666;font-size:0.9rem;margin:8px 0;">${item.description}</p>
                    <button onclick="window.marketplaceManager.buyItem('${item.id}')" 
                            class="btn-primary" style="width:100%;">
                        Nunua Sasa
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    getCategoryIcon(category) {
        const icons = {
            'mbolea': '🌱',
            'mbegu': '🌾',
            'vifaa': '🚜',
            'nafaka': '🌽',
            'dawa': '🧪'
        };
        return icons[category] || '📦';
    }
    
    getStars(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '⭐'.repeat(full) + (half ? '✨' : '') + '☆'.repeat(empty);
    }
    
    buyItem(itemId) {
        if (!auth.currentUser) {
            showNotification('Ingia kwanza ili kununua!', 'warning');
            document.getElementById('loginModal').classList.add('show');
            return;
        }
        
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;
        
        showNotification(`Umeweka ${item.title} kwenye kikapu!`, 'success');
    }
}

// Initialize Marketplace
const marketplaceManager = new MarketplaceManager();
window.marketplaceManager = marketplaceManager;
