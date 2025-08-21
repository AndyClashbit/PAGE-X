// Status Bar Component
class StatusBar extends HTMLElement {
    constructor() {
        super();
        this.weatherData = null;
        this.cryptoData = null;
        this.userLocation = null;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log('StatusBar: Component connected');
        this.render();
        this.setupEventListeners();
        this.startClock();
        console.log('StatusBar: Starting location detection...');
        this.detectLocation(); // Start location detection
        this.loadCrypto();
        console.log('StatusBar: Component initialization complete');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css');
                :host {
                    --gruvbox-bg0: #282828;
                    --gruvbox-bg1: #3c3836;
                    --gruvbox-bg2: #504945;
                    --gruvbox-fg0: #fbf1c7;
                    --gruvbox-fg1: #ebdbb2;
                    --gruvbox-blue: #458588;
                    --gruvbox-green: #98971a;
                    --gruvbox-red: #cc241d;
                }
                .status-container {
                    display: flex;
                    justify-content: space-between; /* Revert to space-between */
                    align-items: center;
                    width: 100%;
                    padding: 0 20px;
                    background: rgba(60, 56, 54, 0.6);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px 16px 0 0;
                }
                .status-left, .status-right {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .status-right {
                    transform: translateX(-24px); /* Apply user-requested transform */
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: var(--gruvbox-fg1);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    padding: 8px 12px;
                    border-radius: 8px;
                    background: rgba(80, 73, 69, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .status-item:hover {
                    color: var(--gruvbox-fg0);
                    background: rgba(80, 73, 69, 0.5);
                    transform: translateY(-1px);
                }
                .settings-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    gap: 0;
                }
                .status-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--gruvbox-fg1);
                }
                .clock {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--gruvbox-fg0);
                }
                .weather-temp, .crypto-symbol, .faq-text {
                    font-weight: 600;
                    font-size: 15px;
                }
                .weather-location, .crypto-price {
                    font-size: 12px;
                    color: var(--gruvbox-fg2);
                }
                .crypto-change {
                    font-size: 12px;
                    font-weight: 600;
                }
                .crypto-change.positive { color: var(--gruvbox-green); }
                .crypto-change.negative { color: var(--gruvbox-red); }
            </style>
            
            <div class="status-container">
                <div class="status-left">
                    <div class="clock" id="clock"></div>
                    <div class="status-item weather" id="weather">
                        <span class="status-icon weather-icon"></span>
                        <span class="weather-temp"></span>
                        <span class="weather-location" id="weather-location"></span>
                    </div>
                </div>
                
                <div class="status-right">
                    <div class="status-item settings-button" id="settings-button">
                        <span class="status-icon">
                            <svg width="20" height="20" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg" role="img">
                                <style>
                                    .gear { transform-origin: 50px 50px; animation: spin 4s linear infinite; }
                                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                                </style>
                                <g class="gear" fill="currentColor">
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(0 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(30 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(60 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(90 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(120 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(150 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(180 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(210 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(240 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(270 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(300 50 50)"/>
                                    <rect x="47" y="8" width="6" height="12" rx="1" transform="rotate(330 50 50)"/>
                                </g>
                                <circle cx="50" cy="50" r="30" fill="currentColor" />
                                <circle cx="50" cy="50" r="10" fill="var(--gruvbox-bg1)" />
                            </svg>
                        </span>
                    </div>
                    <div class="status-item edit-bookmarks-button" id="edit-bookmarks-button">
                        <span class="status-icon">
                            <i class="ti ti-edit"></i>
                        </span>
                    </div>
                    <div class="status-item crypto" id="crypto">
                        <span class="status-icon crypto-symbol"></span>
                        <span class="crypto-price"></span>
                        <span class="crypto-change"></span>
                    </div>
                    <div class="status-item faq" id="faq">
                        <span class="status-icon ti ti-help"></span>
                        <span class="faq-text">FAQ</span>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target;

            // Find the closest ancestor which is a clickable item
            const settingsButton = target.closest('#settings-button');
            const weatherElement = target.closest('#weather');
            const cryptoElement = target.closest('#crypto');
            const faqElement = target.closest('#faq');
            const editBookmarksButton = target.closest('#edit-bookmarks-button');

            if (settingsButton) {
                this.dispatchEvent(new CustomEvent('openSettings', { bubbles: true, composed: true }));
                return;
            }
            if (editBookmarksButton) {
                const editor = document.querySelector('bookmark-editor');
                if (editor) {
                    const bookmarks = window.dawnApp ? window.dawnApp.bookmarks : null;
                    editor.open(bookmarks);
                } else {
                    console.error('Bookmark editor element not found!');
                }
                return;
            }
            if (weatherElement) {
                this.toggleLocationInput();
                return;
            }
            if (cryptoElement) {
                this.cycleCryptoCoins();
                return;
            }
            if (faqElement) {
                window.open('faq.html', '_blank');
                return;
            }
        });
    }

    

    // Автоматическое определение местоположения
    detectLocation() {
        console.log('Starting location detection...');

        const savedLocation = localStorage.getItem('dawn-weather-location');
        if (savedLocation) {
            console.log('Loading saved location from localStorage:', savedLocation);
            this.userLocation = savedLocation;
            this.updateLocationDisplay();
            this.loadWeather();
            return;
        }
        
        if (!navigator.geolocation) {
            console.log('Geolocation not supported, using fallback');
            this.setFallbackLocation();
            return;
        }
        
        // Обновляем отображение местоположения
        this.updateLocationDisplay('Определение местоположения...');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Location detected:', position.coords);
                const { latitude, longitude } = position.coords;
                this.getCityFromCoords(latitude, longitude);
            },
            (error) => {
                let errorMessage = 'Location detection failed: ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'User denied the request for Geolocation. Please enable location permissions for this site.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable. This might be due to network issues, disabled location services, or privacy settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'The request to get user location timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                console.error(errorMessage, error);
                // Note: The browser might show a "[Violation] Only request geolocation information in response to a user gesture." warning.
                // This is a browser-level warning for non-user-initiated requests and does not necessarily prevent the API from working,
                // but it's good practice to trigger geolocation from a user interaction if possible.
                this.setFallbackLocation();
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000 // 5 минут
            }
        );
    }
    
    // Установка резервного местоположения
    setFallbackLocation() {
        console.log('Setting fallback location');
        this.userLocation = 'Москва'; // Резервное местоположение
        this.updateLocationDisplay();
        this.loadWeather();
    }

    // Получение названия города по координатам
    async getCityFromCoords(lat, lon) {
        try {
            console.log('Getting city from coordinates:', lat, lon);
            
            // Для координат используем прямое получение погоды без геокодирования
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1`;
            console.log('Direct weather URL:', weatherUrl);
            
            const weatherResponse = await fetch(weatherUrl);
            
            if (weatherResponse.ok) {
                const weatherData = await weatherResponse.json();
                console.log('Weather data from coordinates:', weatherData);
                
                // Устанавливаем местоположение как координаты
                this.userLocation = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
                this.saveLocation();
                this.updateLocationDisplay();
                
                // Обрабатываем данные о погоде
                this.weatherData = {
                    main: { temp: weatherData.current.temperature_2m },
                    weather: [{ 
                        icon: this.convertWeatherCodeToIcon(weatherData.current.weather_code, weatherData.current.is_day) 
                    }]
                };
                this.updateWeatherDisplay();
            } else {
                console.error('Weather API error for coordinates:', weatherResponse.status);
                this.setDefaultLocation();
            }
        } catch (error) {
            console.error('Error getting weather from coordinates:', error);
            this.setDefaultLocation();
        }
    }

    // Установка местоположения по умолчанию
    setDefaultLocation() {
        const configLocation = window.CONFIG ? window.CONFIG.temperature.location : '';
        
        if (configLocation && configLocation.trim() !== '') {
            this.userLocation = configLocation;
            console.log('Setting config location:', this.userLocation);
            this.updateLocationDisplay();
            this.loadWeather();
        } else {
            console.log('No config location, trying auto-detection...');
            this.detectLocation();
        }
    }

    // Сохранение местоположения в localStorage
    saveLocation() {
        if (this.userLocation) {
            localStorage.setItem('dawn-weather-location', this.userLocation);
        }
    }

    // Обновление отображения местоположения
    updateLocationDisplay(text = null) {
        const locationElement = this.shadowRoot.getElementById('weather-location');
        if (locationElement && (text || this.userLocation)) {
            locationElement.textContent = text || this.userLocation;
        }
    }

    // Переключение между отображением и вводом местоположения
    toggleLocationInput() {
        const weatherElement = this.shadowRoot.getElementById('weather');
        const locationElement = this.shadowRoot.getElementById('weather-location');
        
        if (locationElement.tagName === 'INPUT') {
            // Сохраняем введённое значение
            const newLocation = locationElement.value.trim();
            if (newLocation) {
                this.userLocation = newLocation;
                this.saveLocation();
                this.loadWeather();
            }
            
            // Возвращаем отображение
            locationElement.outerHTML = '<div class="weather-location" id="weather-location">' + this.userLocation + '</div>';
        } else {
            // Заменяем на поле ввода
            locationElement.outerHTML = `<input type="text" class="location-input" id="weather-location" value="${this.userLocation || ''}" placeholder="Введите город">`;
            
            const input = this.shadowRoot.getElementById('weather-location');
            input.focus();
            input.select();
            
            // Обработка Enter и Escape
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.toggleLocationInput();
                } else if (e.key === 'Escape') {
                    this.toggleLocationInput();
                }
            });
            
            // Потеря фокуса
            input.addEventListener('blur', () => {
                setTimeout(() => this.toggleLocationInput(), 100);
            });
        }
    }

    startClock() {
        const clockElement = this.shadowRoot.getElementById('clock');
        
        const updateClock = () => {
            const now = new Date();
            const timeString = this.formatTime(now, window.CONFIG ? window.CONFIG.clock.format : 'H:i');
            clockElement.textContent = timeString;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    

    async loadWeather() {
        if (!this.userLocation) {
            console.log('No user location set, skipping weather load');
            return;
        }
        
        console.log('Loading weather for location:', this.userLocation);
        
        try {
            // Сначала получаем координаты города через геокодирование
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(this.userLocation)}&count=1&language=ru&format=json`;
            console.log('Geocoding URL:', geocodeUrl);
            
            const geocodeResponse = await fetch(geocodeUrl);
            
            if (geocodeResponse.ok) {
                const geocodeData = await geocodeResponse.json();
                console.log('Geocoding response:', geocodeData);
                
                if (geocodeData.results && geocodeData.results.length > 0) {
                    const { latitude, longitude } = geocodeData.results[0];
                    console.log('Coordinates:', latitude, longitude);
                    
                    // Получаем погоду через Open-Meteo API
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1`;
                    console.log('Weather URL:', weatherUrl);
                    
                    const weatherResponse = await fetch(weatherUrl);
                    
                    if (weatherResponse.ok) {
                        const weatherData = await weatherResponse.json();
                        console.log('Weather response:', weatherData);
                        
                        this.weatherData = {
                            main: { temp: weatherData.current.temperature_2m },
                            weather: [{ 
                                icon: this.convertWeatherCodeToIcon(weatherData.current.weather_code, weatherData.current.is_day) 
                            }]
                        };
                        console.log('Processed weather data:', this.weatherData);
                        this.updateWeatherDisplay();
                    } else {
                        console.error('Weather API error:', weatherResponse.status, weatherResponse.statusText);
                        throw new Error('Weather API error');
                    }
                } else {
                    console.error('City not found in geocoding response');
                    throw new Error('City not found');
                }
            } else {
                console.error('Geocoding API error:', geocodeResponse.status, geocodeResponse.statusText);
                throw new Error('Geocoding API error');
            }
        } catch (error) {
            console.error('Weather loading error:', error);
            console.log('Using mock weather data');
            this.weatherData = {
                main: { temp: 22 },
                weather: [{ icon: '01d' }]
            };
            this.updateWeatherDisplay();
        }
    }

    updateWeatherDisplay() {
        console.log('Updating weather display with data:', this.weatherData);
        
        if (!this.weatherData) {
            console.log('No weather data available');
            return;
        }
        
        const weatherElement = this.shadowRoot.getElementById('weather');
        if (!weatherElement) {
            console.error('Weather element not found');
            return;
        }
        
        const tempElement = weatherElement.querySelector('.weather-temp');
        const iconElement = weatherElement.querySelector('.weather-icon');
        
        if (!tempElement || !iconElement) {
            console.error('Weather temp or icon element not found');
            return;
        }
        
        const temp = this.weatherData.main.temp;
        const scale = window.CONFIG ? window.CONFIG.temperature.scale : 'C';
        
        console.log('Temperature:', temp, 'Scale:', scale);
        
        let displayTemp;
        if (scale === 'F') {
            displayTemp = Math.round((temp * 9/5) + 32);
        } else {
            displayTemp = Math.round(temp);
        }
        
        console.log('Display temperature:', displayTemp);
        tempElement.textContent = `${displayTemp}°${scale}`;
        
        // Update icon based on weather condition
        const weatherIcon = this.getWeatherIcon(this.weatherData.weather[0].icon);
        console.log('Weather icon:', weatherIcon);
        iconElement.className = `weather-icon ${weatherIcon}`;
        
        console.log('Weather display updated successfully');
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'ti ti-sun',
            '01n': 'ti ti-moon',
            '02d': 'ti ti-cloud',
            '02n': 'ti ti-cloud',
            '03d': 'ti ti-cloud',
            '03n': 'ti ti-cloud',
            '04d': 'ti ti-clouds',
            '04n': 'ti ti-clouds',
            '09d': 'ti ti-cloud-rain',
            '09n': 'ti ti-cloud-rain',
            '10d': 'ti ti-cloud-rain',
            '10n': 'ti ti-cloud-rain',
            '11d': 'ti ti-cloud-lightning',
            '11n': 'ti ti-cloud-lightning',
            '13d': 'ti ti-snowflake',
            '13n': 'ti ti-snowflake',
            '50d': 'ti ti-mist',
            '50n': 'ti ti-mist'
        };
        
        return iconMap[iconCode] || 'ti ti-cloud';
    }

    toggleTemperatureScale() {
        if (!window.CONFIG) return;
        window.CONFIG.temperature.scale = window.CONFIG.temperature.scale === 'C' ? 'F' : 'C';
        this.updateWeatherDisplay();
    }

    async loadCrypto() {
        if (!window.CONFIG) return;
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoinGeckoId(window.CONFIG.crypto.coin)}&vs_currencies=${window.CONFIG.crypto.currency.toLowerCase()}&include_24hr_change=true`);
            if (response.ok) {
                this.cryptoData = await response.json();
                this.updateCryptoDisplay();
            }
        } catch (error) {
            console.log('Crypto API not available, using mock data');
            this.cryptoData = {
                [this.getCoinGeckoId(CONFIG.crypto.coin)]: {
                    [CONFIG.crypto.currency.toLowerCase()]: 45000,
                    [`${CONFIG.crypto.currency.toLowerCase()}_24h_change`]: 2.5
                }
            };
            this.updateCryptoDisplay();
        }
    }

    getCoinGeckoId(symbol) {
        const coinMap = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'ADA': 'cardano',
            'DOT': 'polkadot',
            'LINK': 'chainlink',
            'LTC': 'litecoin',
            'BCH': 'bitcoin-cash',
            'XLM': 'stellar',
            'XRP': 'ripple',
            'DOGE': 'dogecoin'
        };
        
        return coinMap[symbol] || 'bitcoin';
    }

    updateCryptoDisplay() {
        if (!this.cryptoData || !window.CONFIG) return;
        
        const cryptoElement = this.shadowRoot.getElementById('crypto');
        const symbolElement = cryptoElement.querySelector('.crypto-symbol');
        const priceElement = cryptoElement.querySelector('.crypto-price');
        const changeElement = cryptoElement.querySelector('.crypto-change');
        
        const coinId = this.getCoinGeckoId(window.CONFIG.crypto.coin);
        const currency = window.CONFIG.crypto.currency.toLowerCase();
        const coinData = this.cryptoData[coinId];
        
        if (coinData) {
            const price = coinData[currency];
            const change = coinData[`${currency}_24h_change`];
            
            symbolElement.textContent = window.CONFIG.crypto.coin;
            priceElement.textContent = `$${price.toLocaleString()}`;
            
            const changeText = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
            changeElement.textContent = changeText;
            changeElement.style.color = change >= 0 ? 'var(--gruvbox-green)' : 'var(--gruvbox-red)';
        }
    }

    cycleCryptoCoins() {
        if (!window.CONFIG) return;
        
        const coins = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'LTC', 'BCH', 'XLM', 'XRP', 'DOGE'];
        const currentIndex = coins.indexOf(window.CONFIG.crypto.coin);
        const nextIndex = (currentIndex + 1) % coins.length;
        
        window.CONFIG.crypto.coin = coins[nextIndex];
        this.loadCrypto();
    }

    // Конвертация кодов погоды Open-Meteo в иконки
    convertWeatherCodeToIcon(code, isDay) {
        const weatherCodeMap = {
            0: isDay ? '01d' : '01n',   // Ясно
            1: isDay ? '02d' : '02n',   // Преимущественно ясно
            2: isDay ? '03d' : '03n',   // Переменная облачность
            3: isDay ? '04d' : '04n',   // Пасмурно
            45: isDay ? '50d' : '50n',  // Туман
            48: isDay ? '50d' : '50n',  // Туман с инеем
            51: isDay ? '09d' : '09n',  // Легкая морось
            53: isDay ? '09d' : '09n',  // Умеренная морось
            55: isDay ? '09d' : '09n',  // Сильная морось
            56: isDay ? '09d' : '09n',  // Легкая морось с градом
            57: isDay ? '09d' : '09n',  // Сильная морось с градом
            61: isDay ? '10d' : '10n',  // Легкий дождь
            63: isDay ? '10d' : '10n',  // Умеренный дождь
            65: isDay ? '10d' : '10n',  // Сильный дождь
            66: isDay ? '10d' : '10n',  // Легкий дождь с градом
            67: isDay ? '10d' : '10n',  // Сильный дождь с градом
            71: isDay ? '13d' : '13n',  // Легкий снег
            73: isDay ? '13d' : '13n',  // Умеренный снег
            75: isDay ? '13d' : '13n',  // Сильный снег
            77: isDay ? '13d' : '13n',  // Снежная крупа
            80: isDay ? '09d' : '09n',  // Легкие ливни
            81: isDay ? '09d' : '09n',  // Умеренные ливни
            82: isDay ? '09d' : '09n',  // Сильные ливни
            85: isDay ? '13d' : '13n',  // Легкие снежные ливни
            86: isDay ? '13d' : '13n',  // Сильные снежные ливни
            95: isDay ? '11d' : '11n',  // Гроза
            96: isDay ? '11d' : '11n',  // Гроза с градом
            99: isDay ? '11d' : '11n'   // Сильная гроза с градом
        };
        
        return weatherCodeMap[code] || (isDay ? '01d' : '01n');
    }

    formatTime(date, format) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        let formattedHours = hours;
        let ampm = '';

        if (format.includes('h')) { // 12-hour format
            formattedHours = hours % 12;
            formattedHours = formattedHours === 0 ? 12 : formattedHours; // 0 should be 12 AM/PM
            ampm = hours >= 12 ? 'PM' : 'AM';
        }

        const pad = (num) => num < 10 ? '0' + num : num;

        let result = format;
        result = result.replace(/H/g, pad(hours));
        result = result.replace(/h/g, pad(formattedHours));
        result = result.replace(/i/g, pad(minutes));
        result = result.replace(/s/g, pad(pad(seconds))); // Not used in current format, but good to have
        result = result.replace(/A/g, ampm);

        return result;
    }
}

customElements.define('status-bar', StatusBar);