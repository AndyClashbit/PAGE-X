// Search Bar Component
class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.currentProvider = 0;
        this.providers = window.CONFIG ? window.CONFIG.searchProviders : [];
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this._loadTheme(); // Load initial theme

        // Listen for theme changes from the settings manager
        document.addEventListener('themeChanged', (e) => {
            this._applyTheme(e.detail.themeName);
        });
    }

    _loadTheme() {
        const savedTheme = localStorage.getItem('dawn-theme') || 'gruvbox';
        this._applyTheme(savedTheme);
    }

    _applyTheme(themeName) {
        const themeLink = this.shadowRoot.getElementById('theme-stylesheet');
        const isGlass = themeName === 'liquid-glass';

        themeLink.setAttribute('href', isGlass ? 'src/styles/liquid-glass.css' : '');

        // The HTML structure is now hardcoded, so no need to dynamically wrap/unwrap.
        // The CSS will handle the appearance based on the loaded stylesheet.
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link id="theme-stylesheet" rel="stylesheet" href="">
            <style>
                :host {
                    --gruvbox-bg0: #282828;
                    --gruvbox-bg1: #3c3836;
                    --gruvbox-bg2: #504945;
                    --gruvbox-bg3: #665c54; /* For placeholder */
                    --gruvbox-fg0: #fbf1c7; /* Main text color */
                    --gruvbox-fg1: #ebdbb2;
                    --gruvbox-fg3: #a89984; /* Dimmer text for placeholder */
                    --gruvbox-blue: #458588;
                    --gruvbox-blue-bright: #83a598;
                }
                :host {
                    display: block;
                    width: 100%;
                    max-width: 700px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 15;
                    margin-top: 2rem;
                    margin-bottom: 4rem;
                }
                
                .search-container {
                    position: relative;
                    width: 100%;
                }
                
                .search-input {
                    width: 100%;
                    padding: 20px 24px;
                    font-size: 18px;
                    background: rgba(60, 56, 54, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    color: var(--gruvbox-fg0);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    font-weight: 400;
                    letter-spacing: 0.025em;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: var(--gruvbox-blue);
                    background: rgba(60, 56, 54, 0.9);
                    box-shadow: 0 12px 40px rgba(69, 133, 136, 0.2);
                    transform: translateY(-2px);
                }
                
                .search-input::placeholder {
                    color: var(--gruvbox-fg3);
                    font-weight: 400;
                }
                
                .search-providers {
                    display: flex;
                    gap: 12px;
                    margin-top: 16px;
                    justify-content: center;
                    overflow-x: auto;
                    padding: 4px;
                    padding-bottom: 12px; /* Space for shadows */
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }

                .search-providers::-webkit-scrollbar {
                    display: none; /* Hide scrollbar for Chrome, Safari, Opera */
                }
                
                .search-provider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(60, 56, 54, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    color: var(--gruvbox-fg1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-weight: 500;
                    white-space: nowrap;
                }
                
                .search-provider:hover {
                    background: rgba(80, 73, 69, 0.8);
                    color: var(--gruvbox-fg0);
                    transform: translateY(-1px);
                }
                
                .search-provider.active {
                    background: var(--gruvbox-blue);
                    border-color: var(--gruvbox-blue-bright);
                    color: var(--gruvbox-fg0);
                    box-shadow: 0 4px 12px rgba(69, 133, 136, 0.25);
                    transform: translateY(-1px);
                }

                /* Styles for the inner text container when liquid glass is active */
                .search-provider .liquidGlass-text {
                    display: flex; /* Ensure flex properties are applied to inner text */
                    align-items: center;
                    gap: 8px;
                }
                
                .search-provider-icon {
                    font-size: 16px;
                }
            </style>
            
            <div class="search-container">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Поиск в интернете..."
                    autocomplete="off"
                    spellcheck="false"
                >
                
                <div class="search-providers">
                    ${this.providers.map((provider, index) => `
                        <button class="search-provider ${index === 0 ? 'active' : ''}" data-provider="${index}">
                            <div class="liquidGlass-effect"></div>
                            <div class="liquidGlass-tint"></div>
                            <div class="liquidGlass-shine"></div>
                            <div class="liquidGlass-text">
                                <span class="search-provider-icon ${provider.icon}"></span>
                                <span>${provider.name}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const input = this.shadowRoot.querySelector('.search-input');
        const providers = this.shadowRoot.querySelectorAll('.search-provider');

        // Focus input on load
        setTimeout(() => input.focus(), 100);

        // Handle search submission
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.performSearch(input.value.trim());
            }
        });

        // Handle provider selection
        providers.forEach(provider => {
            provider.addEventListener('click', () => {
                const index = parseInt(provider.dataset.provider);
                this.setActiveProvider(index);
            });
        });
    }

    setActiveProvider(index) {
        const providers = this.shadowRoot.querySelectorAll('.search-provider');
        const input = this.shadowRoot.querySelector('.search-input');
        
        // Update active state
        providers.forEach((provider, i) => {
            provider.classList.toggle('active', i === index);
        });
        
        this.currentProvider = index;
        
        // Update placeholder
        const provider = this.providers[index];
        input.placeholder = `Поиск в ${provider.name}...`;
    }

    performSearch(query) {
        const provider = this.providers[this.currentProvider];
        const searchUrl = provider.url + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
    }
}

customElements.define('search-bar', SearchBar);