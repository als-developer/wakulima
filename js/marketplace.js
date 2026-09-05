// Marketplace System
class MarketplaceManager {
    constructor() {
        this.items = this.loadItems();
        this.init();
    }
    
    init() {
        this.renderItems();
        
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.filterItems();
        });
        
        document.getElementById('searchMarket').addEventListener('input', () => {
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
                title: 'Mbolea Organic',
                price: '25,000 TSh',
                category: 'mbolea',
                seller: 'GreenFarm Ltd',
                rating: 4.8
            },
            {
                id: '2',
                title: 'Mbegu Mahindi',
                price: '15,000 TSh',
                category: 'mbegu',
                seller: 'SeedCo Ltd',
                rating: 5.0
            },
            {
                id: '3',
                title: 'Trekta ya Mkulima',
                price: '4,500,000 TSh',
                category: 'vifaa',
                seller: 'AgriMachines',
                rating: 4.9
            },
            {
                id: '4',
                title: 'Nafaka za Mahindi',
                price: '8,000 TSh',
                category: 'nafaka',
                seller: 'HarvestPlus',
                rating: 4.3
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
                <div class="morph-card text-center" style="grid-column:1/-1;padding:40px;">
                    <i class="fas fa-search" style="font-size:3rem;color:rgba(255,255,255,0.1);"></i>
                    <p style="color:rgba(255,255,255,0.3);margin-top:8px;">Hakuna bidhaa zilizopatikana</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = displayItems.map(item => `
            <div class="product-card">
                <div class="img"><i class="fas ${this.getIcon(item.category)}"></i></div>
                <div class="info">
                    <div class="title">${item.title}</div>
                    <div class="price">${item.price}</div>
                    <div class="seller"><i class="fas fa-user"></i> ${item.seller}</div>
                    <div class="rating">${this.getStars(item.rating)}</div>
                    <button class="btn-buy"><i class="fas fa-shopping-cart"></i> Nunua</button>
                </div>
            </div>
        `).join('');
    }
    
    getIcon(category) {
        const icons = {
            'mbolea': 'fa-leaf',
            'mbegu': 'fa-seedling',
            'vifaa': 'fa-tractor',
            'nafaka': 'fa-wheat',
            'dawa': 'fa-flask'
        };
        return icons[category] || 'fa-box';
    }
    
    getStars(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '⭐'.repeat(full) + (half ? '✨' : '') + '☆'.repeat(empty);
    }
}

const marketplaceManager = new MarketplaceManager();
window.marketplaceManager = marketplaceManager;
