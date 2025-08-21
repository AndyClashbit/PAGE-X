// userconfig.js - Конфигурация пользователя для PAGE X
console.log('Loading user configuration...');

window.CONFIG = {
  // Поисковые системы (ожидается searchProviders)
  searchProviders: [
    { name: "Google", url: "https://www.google.com/search?q=", icon: "ti ti-brand-google" },
    { name: "GitHub", url: "https://github.com/search?q=", icon: "ti ti-brand-github" },
    { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", icon: "ti ti-brand-duckduckgo" },
    { name: "Bing", url: "https://www.bing.com/search?q=", icon: "ti ti-brand-bing" },
    { name: "YouTube", url: "https://www.youtube.com/results?search_query=", icon: "ti ti-brand-youtube" }
  ],
  
  // Вкладки с ссылками
    // Вкладки с ссылками
  // Настройки темы
  
  // Настройки темы
  theme: 'gruvbox',
  animations: true,
  opacity: 100,
  
  // Настройки поиска
  search: {
    autofocus: true,
    placeholder: 'Поиск в интернете...'
  },
  
  // Поисковая система по умолчанию
  defaultProvider: 'google',
  
  // Настройки вкладок
  openLastVisitedTab: true,
  showIcons: true,
  
  // Настройки солнечной системы
  solarSystem: {
    enabled: true,
    opacity: 80,  // Увеличено с 60 до 80 для лучшей видимости
    animationSpeed: 1
  },
  
  // Настройки погоды
  temperature: {
    location: '', // Оставляем пустым для автоматического определения
    scale: 'C', // C - Цельсий, F - Фаренгейт
    apiProvider: 'open-meteo', // open-meteo (бесплатный, без ключа) или openweathermap
    language: 'ru', // Язык описания погоды (ru, en, etc.)
    units: 'metric', // metric - Цельсий, imperial - Фаренгейт
    autoDetect: true, // Автоматическое определение местоположения
    updateInterval: 300000 // Интервал обновления в миллисекундах (5 минут)
  },
  
  // Настройки криптовалют
  crypto: {
    coin: 'BTC',
    currency: 'USD',
    apiKey: '', // API ключ CoinGecko (опционально)
    updateInterval: 60000 // Интервал обновления в миллисекундах (1 минута)
  },
  
  // Настройки часов
  clock: {
    format: 'H:i', // Формат времени: H:i, h:i p, H:i:s
    timezone: 'auto', // auto - автоматически, или конкретный часовой пояс
    showSeconds: false // Показывать секунды
  },
  
  // Экспериментальные функции
  
};

console.log('User configuration loaded successfully:', window.CONFIG);