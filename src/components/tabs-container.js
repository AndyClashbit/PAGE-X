// Tabs Container Component
class TabsContainer extends HTMLElement {
    constructor() {
        super();
        this.tabs = []; // Bookmarks will be set via setTabs method
        this.activeTab = 0; // Default to first tab
        this.attachShadow({ mode: 'open' });
    }

    setTabs(tabs) {
        this.tabs = tabs.map(tab => ({ ...tab, currentPage: 0 })); // Initialize currentPage for each tab
        console.log('TabsContainer: setTabs called with:', this.tabs);
        // Ensure activeTab is valid after updating tabs
        if (this.activeTab >= this.tabs.length) {
            this.activeTab = 0;
        }
        this.render(); // Re-render to display updated tabs
    }

    connectedCallback() {
        console.log('TabsContainer: Component connected');
        console.log('Tabs data:', this.tabs);
        this.loadLastVisitedTab(); // Load last visited tab and page
        this.render(); // Render with initial state
        this.switchTab(this.activeTab); // Ensure correct tab is active and rendered
        console.log('TabsContainer: Component initialization complete');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Gruvbox CSS Variables for Shadow DOM */
                :host {
                    --gruvbox-bg0: #282828;
                    --gruvbox-bg1: #3c3836;
                    --gruvbox-bg2: #504945;
                    --gruvbox-bg3: #665c54;
                    --gruvbox-fg0: #fbf1c7;
                    --gruvbox-fg1: #ebdbb2;
                    --gruvbox-blue: #458588;
                    --gruvbox-blue-bright: #83a598;
                }
                
                /* Tabler Icons CSS */
                @import url('https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css');
                
                :host {
                    display: block;
                    width: 100%;
                    position: relative;
                    z-index: 15;
                    margin-top: auto;        /* ИЗМЕНИТЬ НА: 0 */
                    margin-bottom: 8rem;     /* ОСТАВИТЬ КАК ЕСТЬ */
                }
                
                .tabs-header {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
                
                .tab-button {
                    padding: 14px 24px;
                    background: rgba(60, 56, 54, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: var(--gruvbox-fg1);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 16px;
                    font-weight: 500;
                    min-width: 140px;
                    letter-spacing: 0.025em;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .tab-button:hover {
                    background: rgba(80, 73, 69, 0.8);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: var(--gruvbox-fg0);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }
                
                .tab-button.active {
                    background: var(--gruvbox-blue);
                    border-color: var(--gruvbox-blue-bright);
                    color: var(--gruvbox-fg0);
                    box-shadow: 0 6px 20px rgba(69, 133, 136, 0.3);
                    transform: translateY(-2px);
                }
                
                .tab-content {
                    display: none;
                    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .tab-content.active {
                    display: block;
                }
                
                .links-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 16px;
                    max-width: 1200px;
                    margin: 0 auto;
                    min-height: 176px; /* Reserve space for 2 rows of links */
                }
                
                .link-card {
                    background: rgba(60, 56, 54, 0.6);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 12px 8px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                    color: var(--gruvbox-fg0);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    min-height: 80px;
                    position: relative;
                    overflow: hidden;
                }
                
                .link-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .link-card:hover {
                    background: rgba(80, 73, 69, 0.8);
                    border-color: var(--gruvbox-blue);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(69, 133, 136, 0.2);
                }
                
                .link-card:hover::before {
                    opacity: 1;
                }
                
                .link-icon {
                    font-size: 28px;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: rgba(80, 73, 69, 0.4);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 1;
                }
                
                .link-card:hover .link-icon {
                    background: rgba(69, 133, 136, 0.2);
                    border-color: var(--gruvbox-blue);
                    transform: scale(1.05);
                }
                
                .link-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--gruvbox-fg0);
                    letter-spacing: 0.025em;
                    position: relative;
                    z-index: 1;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                
                .pagination-controls {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                    min-height: 34px; /* Reserve space for buttons */
                }
                
                .pagination-button {
                    padding: 8px 12px;
                    background: rgba(60, 56, 54, 0.6);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: var(--gruvbox-fg1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .pagination-button:hover {
                    background: rgba(80, 73, 69, 0.8);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: var(--gruvbox-fg0);
                }
                
                .pagination-button.active {
                    background: var(--gruvbox-blue);
                    border-color: var(--gruvbox-blue-bright);
                    color: var(--gruvbox-fg0);
                }
                
                .favicon {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                }
                
                .fallback-icon {
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .tabs-header {
                        gap: 6px;
                    }
                    
                    .tab-button {
                        padding: 10px 16px;
                        font-size: 14px;
                        min-width: 100px;
                    }
                    
                    .links-grid {
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 12px;
                    }
                    
                    .link-card {
                        padding: 10px 6px;
                        min-height: 70px;
                    }
                    
                    .link-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 24px;
                    }
                    
                    .favicon {
                        width: 20px;
                        height: 20px;
                    }
                    
                    .fallback-icon {
                        font-size: 20px;
                    }
                    
                    .link-icon i {
                        font-size: 20px !important;
                    }
                    
                    .link-name {
                        font-size: 12px;
                    }
                }
                
                @media (max-width: 480px) {
                    .links-grid {
                        grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
                        gap: 6px;
                    }
                    
                    .link-card {
                        padding: 8px 4px;
                        min-height: 50px;
                    }
                    
                    .link-icon {
                        width: 24px;
                        height: 24px;
                    }
                    
                    .favicon {
                        width: 14px;
                        height: 14px;
                    }
                    
                    .fallback-icon {
                        font-size: 14px;
                    }
                    
                    .link-icon i {
                        font-size: 14px !important;
                    }
                    
                    .link-name {
                        font-size: 10px;
                    }
                }
            </style>
            
            <div class="tabs-header">
                ${(this.tabs || []).map((tab, index) => `
                    <button class="tab-button ${index === this.activeTab ? 'active' : ''}" data-tab="${index}">
                        ${this.capitalizeFirst(tab.name)}
                    </button>
                `).join('')}
            </div>
            
            ${(this.tabs || []).map((tab, tabIndex) => {
                const sitesPerPage = 14;
                const totalPages = Math.ceil((tab.links || []).length / sitesPerPage);
                const currentPage = tab.currentPage || 0; // Use tab's currentPage
                const startIndex = currentPage * sitesPerPage;
                const endIndex = startIndex + sitesPerPage;
                const paginatedLinks = (tab.links || []).slice(startIndex, endIndex);

                return `
                <div class="tab-content ${tabIndex === this.activeTab ? 'active' : ''}" data-tab="${tabIndex}">
                    <div class="links-grid">
                        ${paginatedLinks.map(link => `
                            <a href="${link.url}" class="link-card" target="_blank" rel="noopener noreferrer">
                                <div class="link-icon">
                                    <img src="${this.getFaviconUrl(link)}" 
                                         alt="${link.name}" 
                                         class="favicon"
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                    <span class="fallback-icon" style="display: none;">${this.getFallbackIcon(link.name)}</span>
                                </div>
                                <div class="link-name">${link.name}</div>
                            </a>
                        `).join('')}
                    </div>
                    <div class="pagination-controls">
                        ${totalPages > 1 ? Array.from({ length: totalPages }, (_, i) => `
                            <button class="pagination-button ${i === currentPage ? 'active' : ''}" data-page="${i}">
                                ${i + 1}
                            </button>
                        `).join('') : ''}
                    </div>
                </div>
                `;
            }).join('')}
        `;
        this.setupEventListeners(); // Call after innerHTML is set
    }

    setupEventListeners() {
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        console.log('TabsContainer: Found tab buttons:', tabButtons.length, tabButtons); // Added log
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('TabsContainer: Tab button clicked!', button.dataset.tab); // Added log
                const tabIndex = parseInt(button.dataset.tab);
                this.switchTab(tabIndex);
            });

            button.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Prevent default right-click context menu
                const currentTabIndex = parseInt(button.dataset.tab);
                const nextTabIndex = (currentTabIndex + 1) % this.tabs.length;
                this.switchTab(nextTabIndex);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                const tabIndex = parseInt(e.key) - 1;
                if (tabIndex < this.tabs.length) {
                    this.switchTab(tabIndex);
                }
            }
        });

        // Pagination event listeners
        this.shadowRoot.querySelectorAll('.pagination-button').forEach(button => {
            button.addEventListener('click', () => {
                const pageIndex = parseInt(button.dataset.page);
                this.switchPage(this.activeTab, pageIndex);
            });
        });
    }

    switchTab(tabIndex) {
        if (!this.tabs || tabIndex < 0 || tabIndex >= this.tabs.length) return;

        // Update tab buttons
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        tabButtons.forEach((button, index) => {
            button.classList.toggle('active', index === tabIndex);
        });

        // Update tab content
        const tabContents = this.shadowRoot.querySelectorAll('.tab-content');
        tabContents.forEach((content, index) => {
            content.classList.toggle('active', index === tabIndex);
        });

        this.activeTab = tabIndex; // Correctly update activeTab
        this.saveLastVisitedTab();

        // Trigger background change event
        const event = new CustomEvent('tabChanged', {
            detail: { tabIndex, tab: this.tabs[tabIndex] }
        });
        this.dispatchEvent(event);
    }

    loadLastVisitedTab() {
        const lastTabState = localStorage.getItem('dawn-last-tab');
        if (lastTabState !== null) {
            try {
                const { tabIndex, pageIndex } = JSON.parse(lastTabState);
                if (this.tabs && tabIndex >= 0 && tabIndex < this.tabs.length) {
                    this.activeTab = tabIndex; // Set active tab before rendering
                    this.tabs[tabIndex].currentPage = pageIndex || 0; // Set current page
                    // No need to call switchTab here, render will be called by connectedCallback
                }
            } catch (e) {
                console.error('Error parsing last visited tab state:', e);
            }
        }
    }

    saveLastVisitedTab() {
        const tabState = {
            tabIndex: this.activeTab,
            pageIndex: this.tabs[this.activeTab] ? this.tabs[this.activeTab].currentPage : 0
        };
        localStorage.setItem('dawn-last-tab', JSON.stringify(tabState));
    }

    switchPage(tabIndex, pageIndex) {
        if (!this.tabs[tabIndex] || pageIndex < 0 || pageIndex >= Math.ceil(this.tabs[tabIndex].links.length / 14)) return;

        this.tabs[tabIndex].currentPage = pageIndex;
        this.render(); // Re-render to show the new page
        this.saveLastVisitedTab(); // Save current tab and page
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getFaviconUrl(link) { // Change parameter from url to link object
        if (link.favicon) { // Check if favicon is explicitly provided in link data
            return link.favicon;
        }
        try {
            const domain = new URL(link.url).hostname; // Use link.url
            // Using a more robust Google Favicon service URL
            return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
        } catch (e) {
            console.error('Invalid URL for favicon:', link.url, e);
            return ''; // Return empty string for invalid URLs
        }
    }

    getFallbackIcon(name) {
        return name.charAt(0).toUpperCase();
    }
}

customElements.define('tabs-container', TabsContainer);