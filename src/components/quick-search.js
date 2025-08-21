// Quick Search Component
class QuickSearch extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.config = {}; // Initialize config
    }

    

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    -webkit-backdrop-filter: blur(4px);
                    backdrop-filter: blur(4px);
                }
                
                .quick-search-container {
                    background: var(--gruvbox-bg1);
                    border: 1px solid var(--gruvbox-bg2);
                    border-radius: 16px;
                    padding: 32px;
                    width: 90%;
                    max-width: 800px;
                    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
                }
                
                .quick-search-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                
                .quick-search-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--gruvbox-fg0);
                }
                
                .quick-search-close {
                    background: none;
                    border: none;
                    color: var(--gruvbox-fg2);
                    font-size: 24px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                
                .quick-search-close:hover {
                    color: var(--gruvbox-fg0);
                    background: var(--gruvbox-bg2);
                }
                
                .quick-search-input {
                    width: 100%;
                    padding: 16px 20px;
                    background: var(--gruvbox-bg0-soft);
                    border: 1px solid var(--gruvbox-bg2);
                    border-radius: 12px;
                    color: var(--gruvbox-fg0);
                    font-size: 18px;
                    margin-bottom: 24px;
                    font-family: inherit;
                }
                
                .quick-search-input:focus {
                    outline: none;
                    border-color: var(--gruvbox-blue);
                }
                
                .quick-search-results {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }
                
                .quick-search-section {
                    margin-bottom: 24px;
                }
                
                .quick-search-section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--gruvbox-fg0);
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid var(--gruvbox-bg2);
                }
                
                .quick-search-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: var(--gruvbox-bg0-soft);
                    border: 1px solid var(--gruvbox-bg2);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    color: var(--gruvbox-fg0);
                }
                
                .quick-search-item:hover {
                    background: var(--gruvbox-bg2);
                    border-color: var(--gruvbox-bg3);
                    transform: translateY(-1px);
                }
                
                .quick-search-item-icon {
                    font-size: 20px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    background: var(--gruvbox-bg2);
                }
                
                .quick-search-item-text {
                    flex: 1;
                    font-size: 14px;
                }
                
                .quick-search-item-shortcut {
                    font-size: 12px;
                    color: var(--gruvbox-fg2);
                    background: var(--gruvbox-bg2);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                
                @media (max-width: 768px) {
                    .quick-search-container {
                        width: 95%;
                        padding: 24px;
                    }
                    
                    .quick-search-results {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            
            <div class="quick-search-container">
                <div class="quick-search-header">
                    <div class="quick-search-title">Быстрый поиск</div>
                    <button class="quick-search-close" id="closeBtn">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                
                <input 
                    type="text" 
                    class="quick-search-input" 
                    id="searchInput"
                    placeholder="Поиск функций и настроек..."
                    autocomplete="off"
                >
                
                <div class="quick-search-results" id="searchResults">
                    <div class="quick-search-section">
                        <div class="quick-search-section-title">Основные функции</div>
                        <div class="quick-search-item" data-action="todo">
                            <div class="quick-search-item-icon">
                                <i class="ti ti-checklist"></i>
                            </div>
                            <div class="quick-search-item-text">Открыть задачи</div>
                            <div class="quick-search-item-shortcut">T</div>
                        </div>
                        <div class="quick-search-item" data-action="search">
                            <div class="quick-search-item-icon">
                                <i class="ti ti-search"></i>
                            </div>
                            <div class="quick-search-item-text">Быстрый поиск</div>
                            <div class="quick-search-item-shortcut">S</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const closeBtn = this.shadowRoot.getElementById('closeBtn');
        const searchInput = this.shadowRoot.getElementById('searchInput');
        const searchItems = this.shadowRoot.querySelectorAll('.quick-search-item');

        // Close panel
        closeBtn.addEventListener('click', () => {
            this.hide();
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filterResults(e.target.value);
        });

        // Handle item clicks
        searchItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleAction(action, item.dataset);
            });
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });

        // Close on outside click
        this.addEventListener('click', (e) => {
            if (e.target === this) {
                this.hide();
            }
        });

        // Focus input on show
        setTimeout(() => searchInput.focus(), 100);
    }

    filterResults(query) {
        const searchItems = this.shadowRoot.querySelectorAll('.quick-search-item');
        const queryLower = query.toLowerCase();

        searchItems.forEach(item => {
            const text = item.querySelector('.quick-search-item-text').textContent.toLowerCase();
            const shouldShow = text.includes(queryLower);
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    handleAction(action, data) {
        switch (action) {
            case 'todo':
                this.dispatchEvent(new CustomEvent('openTodo'));
                break;
            case 'search':
                this.dispatchEvent(new CustomEvent('openSearch'));
                break;
            case 'settings':
                this.dispatchEvent(new CustomEvent('openSettings'));
                break;
            case 'tab':
                this.dispatchEvent(new CustomEvent('switchTab', {
                    detail: { tabIndex: parseInt(data.tab) }
                }));
                break;
            case 'provider':
                this.dispatchEvent(new CustomEvent('switchProvider', {
                    detail: { providerIndex: parseInt(data.provider) }
                }));
                break;
        }
        this.hide();
    }

    show() {
        this.classList.remove('hidden');
    }

    hide() {
        this.classList.add('hidden');
    }

    isVisible() {
        return !this.classList.contains('hidden');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

customElements.define('quick-search', QuickSearch);