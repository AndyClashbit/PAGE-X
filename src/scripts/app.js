// Import styles
import '../styles/main.css';
import '../assets/bg-1.css';
import '../assets/bg-2.css';
import '../assets/bg-3.css';

// Import components
import '../components/solar-system.js';
import '../components/search-bar.js';
import '../components/tabs-container.js';
import '../components/icon-loader.js';
import '../components/status-bar.js';
import '../components/quick-search.js';
import '../components/todo-panel.js';
import '../components/bookmark-editor.js';
import '../settings/settings-manager.js';

// Import scripts
import { YamlParser } from './yaml-parser.ts';

// Main Application
class DawnApp {
    constructor() {
        this.solarSystem = null;
        this.settingsManager = null;
        this.todoPanel = null;
        this.quickSearch = null;
        this.init();
    }

    init() {
        this.loadAndApplyTheme();
        if (process.env.NODE_ENV === 'development') {
            localStorage.removeItem('dawn-bookmarks');
            console.log('Bookmarks cache cleared in development mode.');
        }
        this.setupComponents();
        this.setupEventListeners();
        this.loadBookmarks();
    }

    loadAndApplyTheme() {
        const savedTheme = localStorage.getItem('dawn-theme') || 'liquid-glass';
        let themeLink = document.getElementById('theme-stylesheet');
        if (!themeLink) {
            themeLink = document.createElement('link');
            themeLink.id = 'theme-stylesheet';
            themeLink.rel = 'stylesheet';
            document.head.appendChild(themeLink);
        }
        themeLink.href = `src/styles/${savedTheme}.css`;
    }

    async loadBookmarks() {
        console.log('Attempting to load bookmarks...');
        let bookmarksToLoad = [];

        if (window.CONFIG && window.CONFIG.tabs && window.CONFIG.tabs.length > 0) {
            console.log('Loading bookmarks from window.CONFIG.tabs');
            bookmarksToLoad = window.CONFIG.tabs;
        } else {
            const savedBookmarks = localStorage.getItem('dawn-bookmarks');
            if (savedBookmarks) {
                try {
                    bookmarksToLoad = JSON.parse(savedBookmarks);
                } catch (e) {
                    console.error('Error parsing bookmarks from localStorage:', e);
                }
            }

            if (bookmarksToLoad.length === 0) {
                console.log('Loading bookmarks from YAML files...');
                try {
                    const bookmarkFilesResponse = await fetch('/Bookmakers/bookmarks.json');
                    const bookmarkFiles = await bookmarkFilesResponse.json();

                    for (const file of bookmarkFiles.files) {
                        const response = await fetch(`/Bookmakers/${file}`);
                        const yamlString = await response.text();
                        const parsedLinks = YamlParser.parse(yamlString);
                        const tabName = file.replace('.yaml', '');
                        bookmarksToLoad.push({ name: tabName, links: parsedLinks });
                    }
                    localStorage.setItem('dawn-bookmarks', JSON.stringify(bookmarksToLoad));
                } catch (error) {
                    console.error('Error loading bookmarks from YAML files:', error);
                    bookmarksToLoad = [];
                }
            }
        }

        this.bookmarks = bookmarksToLoad;
        const tabsContainer = document.querySelector('tabs-container');
        if (tabsContainer) {
            tabsContainer.setTabs(this.bookmarks);
        }
    }

    setupComponents() {
        console.log('Setting up components...');
        this.solarSystem = document.querySelector('solar-system');
        this.settingsManager = document.querySelector('settings-manager');
        this.todoPanel = document.querySelector('todo-panel');
        this.quickSearch = document.querySelector('quick-search');
        
        if (this.solarSystem) {
            console.log('Initializing solar system...');
            this.initSolarSystem();
        } else {
            console.error('Solar system element not found!');
        }
    }

    setupEventListeners() {
        document.addEventListener('bookmarksChanged', () => {
            this.loadBookmarks();
        });

        document.addEventListener('openSettings', () => {
            if (this.settingsManager) {
                this.settingsManager.open();
            }
        });

        document.addEventListener('settingsChanged', (e) => {
            const { solarSpeed, solarOpacity, solarEnabled } = e.detail;
            if (this.solarSystem) {
                this.setAnimationSpeed(solarSpeed);
                this.setSolarSystemOpacity(solarOpacity);
                this.solarSystem.style.display = solarEnabled ? 'block' : 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    initSolarSystem() {
        console.log('Initializing solar system...');
        this.baseAnimationDurations = {
            mercury: 3, venus: 7, earth: 10, mars: 19, jupiter: 116,
            saturn: 285, uranus: 840, neptune: 1640
        };
        
        const savedSolarSpeed = parseFloat(localStorage.getItem('solarSpeed')) || 1;
        const savedSolarOpacity = parseFloat(localStorage.getItem('solarOpacity')) || 30;
        const solarEnabled = localStorage.getItem('solarEnabled') !== 'false';

        if (solarEnabled) {
            this.solarSystem.setActive(true);
            this.solarSystem.style.display = 'block';
            this.solarSystem.style.opacity = savedSolarOpacity / 100;
            this.setAnimationSpeed(savedSolarSpeed);
        } else {
            this.solarSystem.style.display = 'none';
        }
    }
    
    setAnimationSpeed(speed) {
        if (!this.solarSystem || !this.solarSystem.shadowRoot) return;
        const orbits = this.solarSystem.shadowRoot.querySelectorAll('.orbit');
        const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        orbits.forEach((orbit, index) => {
            const planetName = planetNames[index];
            if (planetName && this.baseAnimationDurations[planetName]) {
                const baseDuration = this.baseAnimationDurations[planetName];
                orbit.style.animationDuration = `${baseDuration / speed}s`;
            }
        });
    }
    
    setSolarSystemOpacity(opacity) {
        if (!this.solarSystem) return;
        this.solarSystem.style.opacity = opacity / 100;
    }

    toggleSolarSystem() {
        if (!this.solarSystem) return;
        const isEnabled = this.solarSystem.style.display !== 'none';
        localStorage.setItem('solarEnabled', !isEnabled);
        if (!isEnabled) {
            this.initSolarSystem(); // Re-init to apply settings
        } else {
            this.solarSystem.style.display = 'none';
        }
    }

    handleKeyboardShortcuts(e) {
        const code = e.code.toLowerCase();
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (code) {
            case 'keyb':
                this.toggleSolarSystem();
                break;
            case 'digit1': case 'digit2': case 'digit3': case 'digit4': case 'digit5':
            case 'digit6': case 'digit7': case 'digit8': case 'digit9':
                const tabIndex = parseInt(e.code.slice(-1)) - 1;
                const tabsContainer = document.querySelector('tabs-container');
                if (tabsContainer && tabIndex < tabsContainer.tabs.length) {
                    tabsContainer.switchTab(tabIndex);
                }
                break;
            case 'escape':
                if (this.settingsManager && this.settingsManager.isOpen) this.settingsManager.close();
                if (this.todoPanel && this.todoPanel.isOpen) this.todoPanel.close();
                if (this.quickSearch && this.quickSearch.isOpen) this.quickSearch.close();
                break;
        }
    }

    clearBookmarksCache() {
        localStorage.removeItem('dawn-bookmarks');
        console.log('Bookmarks cache cleared. Please refresh.');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dawnApp = new DawnApp();
    window.dawnApp.clearBookmarksCache = window.dawnApp.clearBookmarksCache.bind(window.dawnApp); // Bind for global access
    console.log('To clear bookmarks cache, run: window.dawnApp.clearBookmarksCache() in console and refresh.');
    
    // Add global functions for testing and debugging
    window.solarSystem = {
        setSpeed: (speed) => {
            if (window.dawnApp) {
                window.dawnApp.setAnimationSpeed(speed);
            }
        },
        setOpacity: (opacity) => {
            if (window.dawnApp) {
                window.dawnApp.setSolarSystemOpacity(opacity);
            }
        },
        toggle: () => {
            if (window.dawnApp) {
                window.dawnApp.toggleSolarSystem();
            }
        },
        checkVisibility: () => {
            if (window.dawnApp) {
                window.dawnApp.checkPlanetsVisibility();
            }
        },
        forceShow: () => {
            if (window.dawnApp && window.dawnApp.solarSystem) {
                const solar = window.dawnApp.solarSystem;
                solar.style.display = 'block';
                solar.style.opacity = '1';
                solar.style.zIndex = '9999'; // Временно поднимаем наверх
                solar.style.position = 'fixed';
                solar.style.top = '0';
                solar.style.left = '0';
                solar.style.width = '100%';
                solar.style.height = '100%';
                solar.style.background = 'red'; // Яркий красный фон для тестирования
                console.log('Solar system forced to show with red background');
            }
        }
    };
    
    console.log('Global solar system controls available:');
    console.log('- solarSystem.setSpeed(speed) - Set animation speed (0.1 to 3)');
    console.log('- solarSystem.setOpacity(opacity) - Set opacity (0 to 100)');
    console.log('- solarSystem.toggle() - Toggle on/off');
    console.log('- solarSystem.checkVisibility() - Check planets visibility');
    console.log('- solarSystem.forceShow() - Force show with red background for testing');
}); 