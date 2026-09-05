// Education System
class EducationManager {
    constructor() {
        this.courses = this.loadCourses();
        this.init();
    }
    
    init() {
        this.renderCourses();
        
        document.querySelectorAll('.edu-filter').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.edu-filter').forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = 'rgba(255,255,255,0.4)';
                    b.style.borderColor = 'rgba(255,255,255,0.1)';
                });
                this.style.background = '#d4af37';
                this.style.color = '#0d4a0d';
                this.style.borderColor = '#d4af37';
                
                const category = this.dataset.cat;
                if (category === 'all') {
                    document.querySelectorAll('.edu-card').forEach(c => c.style.display = 'block');
                } else {
                    document.querySelectorAll('.edu-card').forEach(c => {
                        c.style.display = c.dataset.cat === category ? 'block' : 'none';
                    });
                }
            });
        });
    }
    
    loadCourses() {
        const courses = localStorage.getItem('kilimo_education');
        return courses ? JSON.parse(courses) : this.getSampleCourses();
    }
    
    getSampleCourses() {
        return [
            {
                id: '1',
                title: 'Mbinu za Kilimo Endelevu',
                category: 'kilimo',
                description: 'Jifunze mbinu za kisasa za kilimo endelevu zenye tija.',
                duration: 'Saa 4',
                lessons: 12,
                students: 234,
                icon: 'fa-seedling',
                color: '#7dce82'
            },
            {
                id: '2',
                title: 'Ufugaji Bora wa Kuku',
                category: 'ufugaji',
                description: 'Mbinu bora za ufugaji wa kuku wa kienyeji na wa kisasa.',
                duration: 'Saa 3',
                lessons: 8,
                students: 156,
                icon: 'fa-dog',
                color: '#d4af37'
            },
            {
                id: '3',
                title: 'Biashara ya Mazao',
                category: 'biashara',
                description: 'Jinsi ya kuuza mazao yako kwa bei nzuri na kuunda wateja.',
                duration: 'Saa 5',
                lessons: 15,
                students: 312,
                icon: 'fa-hand-holding-usd',
                color: '#7dce82'
            },
            {
                id: '4',
                title: 'Teknolojia katika Kilimo',
                category: 'teknolojia',
                description: 'Matumizi ya teknolojia ya kisasa kwa kilimo, ikiwemo sensorer.',
                duration: 'Saa 6',
                lessons: 20,
                students: 189,
                icon: 'fa-microchip',
                color: '#d4af37'
            }
        ];
    }
    
    renderCourses() {
        const container = document.getElementById('educationContent');
        if (!container) return;
        
        container.innerHTML = this.courses.map(course => `
            <div class="edu-card" data-cat="${course.category}">
                <div class="icon"><i class="fas ${course.icon}" style="color:${course.color};"></i></div>
                <h4>${course.title}</h4>
                <div class="cat"><i class="fas fa-tag"></i> ${course.category.toUpperCase()}</div>
                <p>${course.description}</p>
                <div class="meta">
                    <span><i class="far fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-book"></i> ${course.lessons} mafunzo</span>
                    <span><i class="fas fa-users"></i> ${course.students}</span>
                </div>
            </div>
        `).join('');
    }
}

const educationManager = new EducationManager();
window.educationManager = educationManager;
