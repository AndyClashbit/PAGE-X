class SettingsManager extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadSettings();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }

                .modal-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-content {
                    background: var(--gruvbox-bg0, #282828);
                    color: var(--gruvbox-fg0, #fbf1c7);
                    border-radius: 8px;
                    padding: 24px;
                    width: 90%;
                    max-width: 600px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    transform: translateY(-20px);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                }

                .modal-overlay.open .modal-content {
                    transform: translateY(0);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--gruvbox-bg2, #504945);
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }

                .modal-title {
                    font-size: 24px;
                    margin: 0;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 28px;
                    color: var(--gruvbox-fg1, #ebdbb2);
                    cursor: pointer;
                    line-height: 1;
                }

                .modal-body {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding-right: 10px;
                }

                .setting-section {
                    margin-bottom: 25px;
                }

                .setting-section h3 {
                    font-size: 18px;
                    color: var(--gruvbox-fg1, #ebdbb2);
                    margin-top: 0;
                    margin-bottom: 15px;
                    border-bottom: 1px solid var(--gruvbox-bg3, #665c54);
                    padding-bottom: 10px;
                }

                .setting-item {
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .setting-item label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                }
                
                .setting-item input[type="range"], .setting-item select {
                    width: 100%;
                    padding: 8px;
                    background: var(--gruvbox-bg1, #3c3836);
                    border: 1px solid var(--gruvbox-bg2, #504945);
                    color: var(--gruvbox-fg0, #fbf1c7);
                    border-radius: 4px;
                }

                .setting-item input[type="checkbox"] {
                    margin-right: 10px;
                }
                
                .range-value {
                    margin-left: 15px;
                    font-weight: 500;
                }
            </style>
            
            <div class="modal-overlay" id="settings-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Настройки</h2>
                        <button class="close-button" id="close-settings-panel">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="setting-section">
                            <h3>Тема</h3>
                            <div class="setting-item">
                                <label for="theme-select">Выберите тему оформления:</label>
                                <select id="theme-select">
                                    <option value="gruvbox">Gruvbox</option>
                                    <option value="material">Material</option>
                                    <option value="liquid-glass">Liquid Glass</option>
                                </select>
                            </div>
                        </div>

                        <div class="setting-section">
                            <h3>Анимация Фона</h3>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="solar-enabled">
                                    Включить "Солнечную систему"
                                </label>
                            </div>
                            <div class="setting-item">
                                <label for="solar-speed">Скорость анимации:</label>
                                <div>
                                    <input type="range" id="solar-speed" min="0.1" max="5" step="0.1" value="1">
                                    <span id="solar-speed-value" class="range-value">1.0x</span>
                                </div>
                            </div>
                            <div class="setting-item">
                                <label for="solar-opacity">Прозрачность:</label>
                                <div>
                                    <input type="range" id="solar-opacity" min="0" max="100" step="1" value="30">
                                    <span id="solar-opacity-value" class="range-value">30%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const modal = this.shadowRoot.getElementById('settings-modal');
        const closeButton = this.shadowRoot.getElementById('close-settings-panel');
        
        closeButton.addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        // Theme
        const themeSelect = this.shadowRoot.getElementById('theme-select');
        themeSelect.addEventListener('change', () => this.saveSettings());

        // Solar System
        const solarEnabledCheckbox = this.shadowRoot.getElementById('solar-enabled');
        const solarSpeedInput = this.shadowRoot.getElementById('solar-speed');
        const solarSpeedValue = this.shadowRoot.getElementById('solar-speed-value');
        const solarOpacityInput = this.shadowRoot.getElementById('solar-opacity');
        const solarOpacityValue = this.shadowRoot.getElementById('solar-opacity-value');

        solarSpeedInput.addEventListener('input', (e) => solarSpeedValue.textContent = `${parseFloat(e.target.value).toFixed(1)}x`);
        solarOpacityInput.addEventListener('input', (e) => solarOpacityValue.textContent = `${e.target.value}%`);

        solarEnabledCheckbox.addEventListener('change', () => this.saveSettings());
        solarSpeedInput.addEventListener('change', () => this.saveSettings());
        solarOpacityInput.addEventListener('change', () => this.saveSettings());
    }

    open() {
        this.isOpen = true;
        this.shadowRoot.getElementById('settings-modal').classList.add('open');
        this.loadSettings();
    }

    close() {
        this.isOpen = false;
        this.shadowRoot.getElementById('settings-modal').classList.remove('open');
    }

    loadSettings() {
        // Theme
        const savedTheme = localStorage.getItem('dawn-theme') || 'gruvbox';
        this.shadowRoot.getElementById('theme-select').value = savedTheme;
        this.applyTheme(savedTheme);

        // Solar System
        const savedSolarEnabled = localStorage.getItem('solarEnabled') !== 'false';
        const savedSolarSpeed = localStorage.getItem('solarSpeed') || '1';
        const savedSolarOpacity = localStorage.getItem('solarOpacity') || '30';

        this.shadowRoot.getElementById('solar-enabled').checked = savedSolarEnabled;
        this.shadowRoot.getElementById('solar-speed').value = savedSolarSpeed;
        this.shadowRoot.getElementById('solar-speed-value').textContent = `${parseFloat(savedSolarSpeed).toFixed(1)}x`;
        this.shadowRoot.getElementById('solar-opacity').value = savedSolarOpacity;
        this.shadowRoot.getElementById('solar-opacity-value').textContent = `${savedSolarOpacity}%`;
    }

    saveSettings() {
        // Theme
        const selectedTheme = this.shadowRoot.getElementById('theme-select').value;
        localStorage.setItem('dawn-theme', selectedTheme);
        this.applyTheme(selectedTheme);

        // Solar System
        const solarEnabled = this.shadowRoot.getElementById('solar-enabled').checked;
        const solarSpeed = this.shadowRoot.getElementById('solar-speed').value;
        const solarOpacity = this.shadowRoot.getElementById('solar-opacity').value;
        localStorage.setItem('solarEnabled', solarEnabled);
        localStorage.setItem('solarSpeed', solarSpeed);
        localStorage.setItem('solarOpacity', solarOpacity);

        // Dispatch event to notify other components
        this.dispatchEvent(new CustomEvent('settingsChanged', {
            detail: { solarEnabled, solarSpeed: parseFloat(solarSpeed), solarOpacity: parseFloat(solarOpacity) },
            bubbles: true,
            composed: true
        }));
    }

    applyTheme(themeName) {
        let themeLink = document.getElementById('theme-stylesheet');
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = 'theme-stylesheet';
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }
        themeLink.href = `src/styles/${themeName}.css`;

        // Dispatch event to notify components of the theme change
        this.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { themeName },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('settings-manager', SettingsManager);