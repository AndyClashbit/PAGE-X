class IconLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cache = new Map();
        this.loading = new Set();
        this.fallbackIcons = {
            'github.com': 'ti ti-brand-github',
            'twitter.com': 'ti ti-brand-twitter',
            'reddit.com': 'ti ti-brand-reddit',
            'discord.com': 'ti ti-brand-discord',
            'telegram.org': 'ti ti-brand-telegram',
            'youtube.com': 'ti ti-brand-youtube',
            'stackoverflow.com': 'ti ti-brand-stackoverflow',
            'dev.to': 'ti ti-brand-dev',
            'medium.com': 'ti ti-brand-medium',
            'codepen.io': 'ti ti-brand-codepen',
            'jsfiddle.net': 'ti ti-brand-jsfiddle',
            'replit.com': 'ti ti-brand-replit',
            'netflix.com': 'ti ti-brand-netflix',
            'spotify.com': 'ti ti-brand-spotify',
            'twitch.tv': 'ti ti-brand-twitch',
            'steam.com': 'ti ti-brand-steam'
        };
        this.init();
    }

    init() {
        this.render();
        // Добавляем небольшую задержку для правильной инициализации
        setTimeout(() => {
            this.loadIcon();
        }, 0);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                
                .icon-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    background: var(--icon-bg, transparent);
                    border-radius: var(--icon-border-radius, 8px);
                    overflow: hidden;
                }
                
                .icon {
                    width: var(--icon-size, 24px);
                    height: var(--icon-size, 24px);
                    color: var(--icon-color, currentColor);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                
                .icon svg {
                    width: 100%;
                    height: 100%;
                }
                
                .loading {
                    opacity: 0.6;
                }
                
                .error {
                    opacity: 0.4;
                }
                
                /* Fallback icon styles */
                .fallback-icon {
                    font-size: var(--icon-size, 24px);
                    color: var(--icon-color, currentColor);
                }
                
                /* Tabler Icons support */
                .ti {
                    font-family: 'tabler-icons' !important;
                    font-style: normal;
                    font-weight: normal !important;
                    font-variant: normal;
                    text-transform: none;
                    line-height: 1;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            </style>
            
            <div class="icon-container">
                <div class="icon" id="icon-element">
                    <!-- Icon will be loaded here -->
                </div>
            </div>
        `;
    }

    static get observedAttributes() {
        return ['url', 'size', 'color', 'bg'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.shadowRoot) {
            switch (name) {
                case 'url':
                    this.loadIcon();
                    break;
                case 'size':
                    this.updateSize(newValue);
                    break;
                case 'color':
                    this.updateColor(newValue);
                    break;
                case 'bg':
                    this.updateBackground(newValue);
                    break;
            }
        }
    }

    get url() {
        return this.getAttribute('url');
    }

    get size() {
        return this.getAttribute('size') || '24px';
    }

    get color() {
        return this.getAttribute('color') || 'currentColor';
    }

    get bg() {
        return this.getAttribute('bg') || 'transparent';
    }

    updateSize(size) {
        const iconElement = this.shadowRoot.querySelector('.icon');
        const fallbackElement = this.shadowRoot.querySelector('.fallback-icon');
        
        if (iconElement) {
            iconElement.style.setProperty('--icon-size', size);
        }
        
        if (fallbackElement) {
            fallbackElement.style.fontSize = size;
        }
    }

    updateColor(color) {
        const iconElement = this.shadowRoot.querySelector('.icon');
        
        if (iconElement) {
            iconElement.style.setProperty('--icon-color', color);
        }
    }

    updateBackground(bg) {
        const containerElement = this.shadowRoot.querySelector('.icon-container');
        
        if (containerElement) {
            containerElement.style.setProperty('--icon-bg', bg);
        }
    }

    async loadIcon() {
        if (!this.url) return;

        const domain = this.extractDomain(this.url);
        const iconElement = this.shadowRoot.querySelector('#icon-element');
        
        // Add loading state
        iconElement.classList.add('loading');
        
        try {
            // Check cache first
            if (this.cache.has(domain)) {
                this.displayIcon(this.cache.get(domain));
                return;
            }

            // Try to load favicon
            const favicon = await this.loadFavicon(domain);
            if (favicon) {
                this.cache.set(domain, favicon);
                this.displayIcon(favicon);
                return;
            }

            // Try fallback icon
            const fallbackIcon = this.getFallbackIcon(domain);
            if (fallbackIcon) {
                this.cache.set(domain, fallbackIcon);
                this.displayIcon(fallbackIcon);
                return;
            }

            // Default icon
            this.displayDefaultIcon();
            
        } catch (error) {
            console.warn(`Failed to load icon for ${domain}:`, error);
            this.displayDefaultIcon();
        } finally {
            iconElement.classList.remove('loading');
        }
    }

    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.toLowerCase();
        } catch {
            return url.toLowerCase();
        }
    }

    async loadFavicon(domain) {
        // Try multiple favicon sources
        const faviconUrls = [
            `https://${domain}/favicon.ico`,
            `https://${domain}/apple-touch-icon.png`,
            `https://${domain}/apple-touch-icon-precomposed.png`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            `https://favicon.io/favicon/${domain}/`
        ];

        for (const url of faviconUrls) {
            try {
                const response = await fetch(url, { 
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                
                if (response.ok || response.status === 0) { // no-cors returns status 0
                    return {
                        type: 'image',
                        url: url,
                        domain: domain
                    };
                }
            } catch (error) {
                // Continue to next URL
                continue;
            }
        }

        return null;
    }

    getFallbackIcon(domain) {
        // Check for exact domain match
        if (this.fallbackIcons[domain]) {
            return {
                type: 'iconify',
                icon: this.fallbackIcons[domain],
                domain: domain
            };
        }

        // Check for partial domain match
        for (const [key, icon] of Object.entries(this.fallbackIcons)) {
            if (domain.includes(key.replace('.com', '').replace('.org', ''))) {
                return {
                    type: 'iconify',
                    icon: icon,
                    domain: domain
                };
            }
        }

        return null;
    }

    displayIcon(iconData) {
        const iconElement = this.shadowRoot.querySelector('#icon-element');
        iconElement.innerHTML = '';

        if (iconData.type === 'image') {
            const img = document.createElement('img');
            img.src = iconData.url;
            img.alt = `${iconData.domain} icon`;
            img.onerror = () => {
                this.displayDefaultIcon();
            };
            iconElement.appendChild(img);
        } else if (iconData.type === 'iconify') {
            const iconifyElement = document.createElement('span');
            iconifyElement.className = iconData.icon;
            iconElement.appendChild(iconifyElement);
        }
    }

    displayDefaultIcon() {
        const iconElement = this.shadowRoot.querySelector('#icon-element');
        iconElement.innerHTML = '<span class="fallback-icon">🌐</span>';
        iconElement.classList.add('error');
    }

    // Public API methods
    refresh() {
        this.cache.delete(this.extractDomain(this.url));
        this.loadIcon();
    }

    setUrl(url) {
        this.setAttribute('url', url);
    }

    setSize(size) {
        this.setAttribute('size', size);
    }

    setColor(color) {
        this.setAttribute('color', color);
    }

    setBackground(bg) {
        this.setAttribute('bg', bg);
    }
}

customElements.define('icon-loader', IconLoader); 