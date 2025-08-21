// Bookmark Editor Component
class BookmarkEditor extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.attachShadow({ mode: 'open' });
        this.bookmarks = []; // Local copy of bookmarks
        this.selectedTabIndex = -1; // Index of the currently selected tab in the editor
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadBookmarks();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --gruvbox-bg0: #282828;
                    --gruvbox-bg1: #3c3836;
                    --gruvbox-bg2: #504945;
                    --gruvbox-fg0: #fbf1c7;
                    --gruvbox-fg1: #ebdbb2;
                    --gruvbox-fg2: #bdae93;
                    --gruvbox-blue: #458588;
                    --gruvbox-red: #cc241d;
                }

                /* Modal Overlay */
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

                /* Modal Content */
                .modal-content {
                    background: var(--gruvbox-bg0);
                    border-radius: 8px;
                    padding: 20px;
                    width: 90%;
                    max-width: 800px;
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
                    border-bottom: 1px solid var(--gruvbox-bg2);
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }

                .modal-title {
                    font-size: 24px;
                    color: var(--gruvbox-fg0);
                    margin: 0;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: var(--gruvbox-fg1);
                    cursor: pointer;
                }

                .modal-body {
                    display: flex;
                    flex-grow: 1;
                    overflow: hidden;
                }

                .tabs-list {
                    width: 30%;
                    border-right: 1px solid var(--gruvbox-bg2);
                    padding-right: 15px;
                    overflow-y: auto;
                }

                .links-list {
                    width: 70%;
                    padding-left: 15px;
                    overflow-y: auto;
                }

                .tab-item, .link-item {
                    background: var(--gruvbox-bg1);
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    color: var(--gruvbox-fg1);
                    transition: background-color 0.2s ease;
                }

                .tab-item.active {
                    background-color: var(--gruvbox-blue);
                }

                .link-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .tab-item > span {
                    font-weight: 500;
                    font-size: 1.1em;
                    color: var(--gruvbox-fg1);
                }

                .link-item-header span {
                    flex-grow: 1;
                }

                .tab-item-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                }

                .tab-item-actions button,
                .link-item-header button {
                    margin-left: 8px;
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    background-color: var(--gruvbox-blue);
                    color: var(--gruvbox-fg0);
                }

                .tab-item-actions button {
                    font-size: 12px;
                    margin-left: 0;
                    flex-grow: 1;
                }

                .tab-item-actions button.delete-tab-button,
                .link-item-header button.delete-link-button {
                    background-color: var(--gruvbox-red);
                }

                .link-details {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 5px;
                    font-size: 0.9em;
                    color: var(--gruvbox-fg2);
                }

                .add-button {
                    background: var(--gruvbox-blue);
                    color: var(--gruvbox-fg0);
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            </style>
            
            <div class="modal-overlay" id="bookmark-editor-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Редактировать закладки</h2>
                        <button class="close-button" id="close-bookmark-editor">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="tabs-list" id="tabs-list">
                            <div id="tabs-list-content">
                                <!-- Tabs will be rendered here -->
                            </div>
                            <button class="add-button" id="add-tab-button">Добавить вкладку</button>
                        </div>
                        <div class="links-list" id="links-list">
                            <div id="links-list-content">
                                <!-- Links will be rendered here -->
                            </div>
                            <button class="add-button" id="add-link-button">Добавить ссылку</button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="add-button" id="save-bookmarks">Сохранить изменения</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const modal = this.shadowRoot.getElementById('bookmark-editor-modal');
        const closeButton = this.shadowRoot.getElementById('close-bookmark-editor');
        const addTabButton = this.shadowRoot.getElementById('add-tab-button');
        const addLinkButton = this.shadowRoot.getElementById('add-link-button');
        const saveBookmarksButton = this.shadowRoot.getElementById('save-bookmarks');

        closeButton.addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        addTabButton.addEventListener('click', () => this.addTab());
        addLinkButton.addEventListener('click', () => this.addLink());

        // Initial rendering of links if a tab is already selected
        if (this.selectedTabIndex !== -1) {
            this.renderLinks();
        }

        // Initial rendering of links if a tab is already selected
        if (this.selectedTabIndex !== -1) {
            this.renderLinks();
        }
        saveBookmarksButton.addEventListener('click', () => this.saveBookmarks());
    }

    open(bookmarks = null) {
        this.isOpen = true;
        this.shadowRoot.getElementById('bookmark-editor-modal').classList.add('open');
        if (bookmarks) {
            this.bookmarks = JSON.parse(JSON.stringify(bookmarks)); // Deep copy to prevent modifying original object
            if (this.bookmarks.length > 0) {
                this.selectedTabIndex = 0;
            } else {
                this.selectedTabIndex = -1;
            }
            this.renderBookmarks();
        } else {
            this.loadBookmarks(); // Fallback to old method
        }
    }

    close() {
        this.isOpen = false;
        this.shadowRoot.getElementById('bookmark-editor-modal').classList.remove('open');
    }

    loadBookmarks() {
        const saved = localStorage.getItem('dawn-bookmarks');
        this.bookmarks = saved ? JSON.parse(saved) : [];
        if (this.bookmarks.length > 0) {
            this.selectedTabIndex = 0; // Select the first tab by default
        } else {
            this.selectedTabIndex = -1;
        }
        this.renderBookmarks();
    }

    renderBookmarks() {
        const tabsListContent = this.shadowRoot.getElementById('tabs-list-content');
        tabsListContent.innerHTML = ''; // Clear existing tabs
        this.bookmarks.forEach((tab, index) => {
            const tabItem = document.createElement('div');
            tabItem.className = 'tab-item';
            if (index === this.selectedTabIndex) {
                tabItem.classList.add('active');
            }
            tabItem.innerHTML = `
                <span>${tab.name}</span>
                <div class="tab-item-actions">
                    <button class="edit-tab-button" data-index="${index}">Редактировать</button>
                    <button class="delete-tab-button" data-index="${index}">Удалить</button>
                </div>
            `;
            tabItem.addEventListener('click', (e) => {
                // Only switch tab if click is not on a button
                if (!e.target.closest('button')) {
                    this.selectTab(index);
                }
            });
            tabsListContent.appendChild(tabItem);
        });

        // Re-attach event listeners for edit/delete buttons after rendering
        tabsListContent.querySelectorAll('.edit-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent tab selection
                const index = parseInt(e.target.dataset.index);
                this.editTab(index);
            });
        });

        tabsListContent.querySelectorAll('.delete-tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent tab selection
                const index = parseInt(e.target.dataset.index);
                this.deleteTab(index);
            });
        });

        // Render links for the currently selected tab
        this.renderLinks();
    }

    addTab() {
        const tabName = prompt('Введите название новой вкладки:');
        if (tabName) {
            this.bookmarks.push({ name: tabName, links: [] });
            this.renderBookmarks();
        }
    }

    editTab(index) {
        const newName = prompt('Введите новое название для вкладки:', this.bookmarks[index].name);
        if (newName !== null && newName.trim() !== '') {
            this.bookmarks[index].name = newName.trim();
            this.renderBookmarks();
        }
    }

    deleteTab(index) {
        if (confirm('Вы уверены, что хотите удалить эту вкладку?')) {
            this.bookmarks.splice(index, 1);
            this.renderBookmarks();
        }
    }

    addLink() {
        if (this.selectedTabIndex === -1) {
            alert('Пожалуйста, выберите вкладку, чтобы добавить ссылку.');
            return;
        }
        const linkName = prompt('Введите название новой ссылки:');
        if (linkName === null || linkName.trim() === '') return;

        const linkUrl = prompt('Введите URL новой ссылки:');
        if (linkUrl === null || linkUrl.trim() === '') return;

        this.bookmarks[this.selectedTabIndex].links.push({ name: linkName.trim(), url: linkUrl.trim() });
        this.renderLinks();
    }

    editLink(tabIndex, linkIndex) {
        const link = this.bookmarks[tabIndex].links[linkIndex];
        const newName = prompt('Введите новое название для ссылки:', link.name);
        if (newName === null || newName.trim() === '') return;

        const newUrl = prompt('Введите новый URL для ссылки:', link.url);
        if (newUrl === null || newUrl.trim() === '') return;

        link.name = newName.trim();
        link.url = newUrl.trim();
        this.renderLinks();
    }

    deleteLink(tabIndex, linkIndex) {
        if (confirm('Вы уверены, что хотите удалить эту ссылку?')) {
            this.bookmarks[tabIndex].links.splice(linkIndex, 1);
            this.renderLinks();
        }
    }

    selectTab(index) {
        this.selectedTabIndex = index;
        this.renderBookmarks(); // Re-render to highlight selected tab
        this.renderLinks();
    }

    renderLinks() {
        const linksListContent = this.shadowRoot.getElementById('links-list-content');
        linksListContent.innerHTML = ''; // Clear existing links

        if (this.selectedTabIndex !== -1 && this.bookmarks[this.selectedTabIndex]) {
            const currentTabLinks = this.bookmarks[this.selectedTabIndex].links;
            currentTabLinks.forEach((link, linkIndex) => {
                const linkItem = document.createElement('div');
                linkItem.className = 'link-item';
                linkItem.innerHTML = `
                    <div class="link-item-header">
                        <span>${link.name}</span>
                        <div>
                            <button class="edit-link-button" data-tab-index="${this.selectedTabIndex}" data-link-index="${linkIndex}">Редактировать</button>
                            <button class="delete-link-button" data-tab-index="${this.selectedTabIndex}" data-link-index="${linkIndex}">Удалить</button>
                        </div>
                    </div>
                    <div class="link-details">
                        <span>URL: ${link.url}</span>
                    </div>
                `;
                linksListContent.appendChild(linkItem);
            });

            // Attach event listeners for link buttons
            linksListContent.querySelectorAll('.edit-link-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tabIndex = parseInt(e.target.dataset.tabIndex);
                    const linkIndex = parseInt(e.target.dataset.linkIndex);
                    this.editLink(tabIndex, linkIndex);
                });
            });

            linksListContent.querySelectorAll('.delete-link-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const tabIndex = parseInt(e.target.dataset.tabIndex);
                    const linkIndex = parseInt(e.target.dataset.linkIndex);
                    this.deleteLink(tabIndex, linkIndex);
                });
            });
        }
    }

    saveBookmarks() {
        localStorage.setItem('dawn-bookmarks', JSON.stringify(this.bookmarks));
        this.dispatchEvent(new CustomEvent('bookmarksChanged', { bubbles: true, composed: true }));
        this.close();
        alert('Закладки сохранены!');
    }
}

customElements.define('bookmark-editor', BookmarkEditor);