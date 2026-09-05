// Weather System
class WeatherManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.getWeather();
        setInterval(() => this.getWeather(), 1800000);
    }
    
    getWeather() {
        const data = this.simulateWeather();
        this.displayWeather(data);
    }
    
    simulateWeather() {
        const conditions = ['Jua kali', 'Mawingu', 'Jua na mawingu', 'Mvua'];
        const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-sun', 'fa-cloud-rain'];
        const temps = [28, 30, 25, 32, 27, 29, 31];
        const index = Math.floor(Math.random() * conditions.length);
        
        return {
            temp: temps[Math.floor(Math.random() * temps.length)],
            condition: conditions[index],
            icon: icons[index],
            humidity: 50 + Math.floor(Math.random() * 40),
            wind: 5 + Math.floor(Math.random() * 20)
        };
    }
    
    displayWeather(data) {
        const widget = document.querySelector('.weather-widget');
        if (!widget) return;
        
        widget.innerHTML = `
            <div class="left">
                <span class="icon"><i class="fas ${data.icon}"></i></span>
                <div>
                    <div class="temp">${data.temp}°C</div>
                    <div class="cond"><i class="fas fa-cloud-sun"></i> ${data.condition}</div>
                </div>
            </div>
            <div class="right">
                <span><i class="fas fa-tint"></i> ${data.humidity}%</span>
                <span><i class="fas fa-wind"></i> ${data.wind} km/h</span>
            </div>
            <div class="updated"><i class="fas fa-clock"></i> Imesasishwa sasa hivi</div>
        `;
    }
}

const weatherManager = new WeatherManager();
window.weatherManager = weatherManager;
