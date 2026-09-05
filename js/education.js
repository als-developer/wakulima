// Education System
class EducationManager {
    constructor() {
        this.courses = this.loadCourses();
        this.init();
    }
    
    init() {
        this.renderCourses();
        
        // Category filters
        document.querySelectorAll('.edu-cat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.edu-cat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterCourses(btn.dataset.cat);
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
                description: 'Jifunze mbinu za kisasa za kilimo endelevu zenye tija na zisizoharibu mazingira.',
                duration: 'Saa 4',
                level: 'Wote',
                image: '🌿',
                author: 'Dr. John Mwamba',
                lessons: 12,
                students: 234
            },
            {
                id: '2',
                title: 'Ufugaji Bora wa Kuku',
                category: 'ufugaji',
                description: 'Mbinu bora za ufugaji wa kuku wa kienyeji na wa kisasa kwa faida kubwa.',
                duration: 'Saa 3',
                level: 'Wote',
                image: '🐔',
                author: 'Mama Sarah',
                lessons: 8,
                students: 156
            },
            {
                id: '3',
                title: 'Biashara ya Mazao',
                category: 'biashara',
                description: 'Jinsi ya kuuza mazao yako kwa bei nzuri na kuunda mtandao wa wateja.',
                duration: 'Saa 5',
                level: 'Wote',
                image: '📊',
                author: 'Bi. Asha K.',
                lessons: 15,
                students: 312
            },
            {
                id: '4',
                title: 'Teknolojia katika Kilimo',
                category: 'teknolojia',
                description: 'Matumizi ya teknolojia ya kisasa kwa kilimo, ikiwemo sensorer na drones.',
                duration: 'Saa 6',
                level: 'Wote',
                image: '📱',
                author: 'Eng. Peter',
                lessons: 20,
                students: 189
            }
        ];
    }
    
    filterCourses(category) {
        const filtered = category === 'all' 
            ? this.courses 
            : this.courses.filter(c => c.category === category);
        this.renderCourses(filtered);
    }
    
    renderCourses(courses = null) {
        const container = document.getElementById('educationContent');
        if (!container) return;
        
        const displayCourses = courses || this.courses;
        
        container.innerHTML = displayCourses.map(course => `
            <div class="edu-card" onclick="window.educationManager.viewCourse('${course.id}')">
                <div style="font-size:3rem;margin-bottom:8px;">${course.image}</div>
                <h3 style="color:var(--primary);margin-bottom:4px;">${course.title}</h3>
                <div style="color:var(--gold);font-weight:600;font-size:0.9rem;margin-bottom:8px;">
                    ${course.category.toUpperCase()}
                </div>
                <p style="color:#666;margin:8px 0;font-size:0.9rem;">${course.description}</p>
                <div style="display:flex;gap:16px;flex-wrap:wrap;margin:12px 0;font-size:0.85rem;color:#888;">
                    <span>⏱️ ${course.duration}</span>
                    <span>📚 ${course.lessons} mafunzo</span>
                    <span>👨‍🎓 ${course.students} wanafunzi</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;border-top:1px solid #eee;padding-top:12px;">
                    <span style="font-weight:500;">${course.author}</span>
                    <span style="font-size:0.8rem;background:var(--gold);color:white;padding:4px 12px;border-radius:20px;">
                        ${course.level}
                    </span>
                </div>
            </div>
        `).join('');
    }
    
    viewCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;
        
        showNotification(`Mafunzo: ${course.title} yanaandaliwa...`, 'info');
        // Would navigate to course detail page
    }
}

// Initialize Education
const educationManager = new EducationManager();
window.educationManager = educationManager;
