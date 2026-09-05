// Weather System
class WeatherManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.getWeather();
        
        // Refresh weather every 30 minutes
        setInterval(() => this.getWeather(), 1800000);
    }
    
    getWeather() {
        // Use free weather API or simulate
        // For demo, we'll use simulated data
        const weatherData = this.simulateWeather();
        this.displayWeather(weatherData);
    }
    
    simulateWeather() {
        const conditions = ['☀️ Jua kali', '⛅ Mawingu', '🌤️ Jua na mawingu', '🌧️ Mvua'];
        const temps = [28, 30, 25, 32, 27, 29, 31];
        
        return {
            temp: temps[Math.floor(Math.random() * temps.length)],
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            humidity: 50 + Math.floor(Math.random() * 40),
            wind: 5 + Math.floor(Math.random() * 20)
        };
    }
    
    displayWeather(data) {
        // Find weather element or create one
        let weatherEl = document.querySelector('.weather-widget');
        
        if (!weatherEl) {
            weatherEl = document.createElement('div');
            weatherEl.className = 'weather-widget';
            weatherEl.style.cssText = `
                background: white;
                padding: 16px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                margin: 16px 0;
                border-left: 4px solid var(--gold);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
            `;
            
            const homePage = document.getElementById('homePage');
            if (homePage) {
                homePage.insertBefore(weatherEl, homePage.firstChild);
            }
        }
        
        weatherEl.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:2rem;">${data.condition.split(' ')[0]}</span>
                <div>
                    <div style="font-weight:600;font-size:1.2rem;">${data.temp}°C</div>
                    <div style="color:#666;font-size:0.9rem;">${data.condition}</div>
                </div>
            </div>
            <div style="display:flex;gap:20px;color:#666;font-size:0.9rem;">
                <span>💧 ${data.humidity}%</span>
                <span>💨 ${data.wind} km/h</span>
            </div>
            <div style="font-size:0.8rem;color:#888;">
                🕐 Imesasishwa: ${new Date().toLocaleTimeString('sw')}
            </div>
        `;
    }
}

// Initialize Weather
const weatherManager = new WeatherManager();
