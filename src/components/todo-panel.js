// Todo Panel Component
class TodoPanel extends HTMLElement {
    constructor() {
        super();
        this.todos = this.loadTodos();
        this.attachShadow({ mode: 'open' });
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
                
                .todo-container {
                    background: var(--gruvbox-bg1);
                    border: 1px solid var(--gruvbox-bg2);
                    border-radius: 16px;
                    padding: 32px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
                }
                
                .todo-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                
                .todo-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--gruvbox-fg0);
                }
                
                .todo-close {
                    background: none;
                    border: none;
                    color: var(--gruvbox-fg2);
                    font-size: 24px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                
                .todo-close:hover {
                    color: var(--gruvbox-fg0);
                    background: var(--gruvbox-bg2);
                }
                
                .todo-form {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                
                .todo-input {
                    flex: 1;
                    padding: 12px 16px;
                    background: var(--gruvbox-bg0-soft);
                    border: 1px solid var(--gruvbox-bg2);
                    border-radius: 8px;
                    color: var(--gruvbox-fg0);
                    font-size: 16px;
                    font-family: inherit;
                }
                
                .todo-input:focus {
                    outline: none;
                    border-color: var(--gruvbox-blue);
                }
                
                .todo-add {
                    padding: 12px 20px;
                    background: var(--gruvbox-green);
                    border: none;
                    border-radius: 8px;
                    color: var(--gruvbox-fg0);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                
                .todo-add:hover {
                    background: var(--gruvbox-green-bright);
                }
                
                .todo-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .todo-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: var(--gruvbox-bg0-soft);
                    border: 1px solid var(--gruvbox-bg2);
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }
                
                .todo-item:hover {
                    border-color: var(--gruvbox-bg3);
                }
                
                .todo-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: var(--gruvbox-green);
                    cursor: pointer;
                }
                
                .todo-text {
                    flex: 1;
                    color: var(--gruvbox-fg0);
                    font-size: 16px;
                    font-family: inherit;
                }
                
                .todo-text.completed {
                    text-decoration: line-through;
                    color: var(--gruvbox-fg3);
                }
                
                .todo-delete {
                    background: none;
                    border: none;
                    color: var(--gruvbox-red);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    font-size: 16px;
                }
                
                .todo-delete:hover {
                    background: var(--gruvbox-red);
                    color: var(--gruvbox-fg0);
                }
                
                .todo-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid var(--gruvbox-bg2);
                    font-size: 14px;
                    color: var(--gruvbox-fg2);
                }
                
                .todo-clear {
                    background: none;
                    border: none;
                    color: var(--gruvbox-orange);
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    font-family: inherit;
                }
                
                .todo-clear:hover {
                    background: var(--gruvbox-orange);
                    color: var(--gruvbox-fg0);
                }
                
                @media (max-width: 768px) {
                    .todo-container {
                        width: 95%;
                        padding: 24px;
                    }
                    
                    .todo-form {
                        flex-direction: column;
                    }
                    
                    .todo-add {
                        width: 100%;
                    }
                }
            </style>
            
            <div class="todo-container">
                <div class="todo-header">
                    <div class="todo-title">Задачи</div>
                    <button class="todo-close" id="closeBtn">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                
                <form class="todo-form" id="todoForm">
                    <input 
                        type="text" 
                        class="todo-input" 
                        id="todoInput"
                        placeholder="Добавить новую задачу..."
                        autocomplete="off"
                    >
                    <button type="submit" class="todo-add">
                        <i class="ti ti-plus"></i>
                    </button>
                </form>
                
                <div class="todo-list" id="todoList">
                    ${this.renderTodos()}
                </div>
                
                <div class="todo-stats">
                    <span id="todoStats">
                        ${this.getTodoStats()}
                    </span>
                    <button class="todo-clear" id="clearBtn">
                        Очистить выполненные
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const closeBtn = this.shadowRoot.getElementById('closeBtn');
        const todoForm = this.shadowRoot.getElementById('todoForm');
        const todoInput = this.shadowRoot.getElementById('todoInput');
        const clearBtn = this.shadowRoot.getElementById('clearBtn');

        // Close panel
        closeBtn.addEventListener('click', () => {
            this.hide();
        });

        // Add new todo
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = todoInput.value.trim();
            if (text) {
                this.addTodo(text);
                todoInput.value = '';
            }
        });

        // Clear completed todos
        clearBtn.addEventListener('click', () => {
            this.clearCompleted();
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
    }

    renderTodos() {
        if (this.todos.length === 0) {
            return '<div style="text-align: center; color: var(--gruvbox-fg2); padding: 20px;">Нет задач</div>';
        }

        return this.todos.map((todo, index) => `
            <div class="todo-item">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-index="${index}"
                >
                <div class="todo-text ${todo.completed ? 'completed' : ''}">
                    ${this.escapeHtml(todo.text)}
                </div>
                <button class="todo-delete" data-index="${index}">
                    <i class="ti ti-trash"></i>
                </button>
            </div>
        `).join('');
    }

    setupTodoEventListeners() {
        const checkboxes = this.shadowRoot.querySelectorAll('.todo-checkbox');
        const deleteButtons = this.shadowRoot.querySelectorAll('.todo-delete');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.toggleTodo(index);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.todo-delete').dataset.index);
                this.deleteTodo(index);
            });
        });
    }

    addTodo(text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveTodos();
        this.updateDisplay();
    }

    toggleTodo(index) {
        this.todos[index].completed = !this.todos[index].completed;
        this.saveTodos();
        this.updateDisplay();
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
        this.saveTodos();
        this.updateDisplay();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.updateDisplay();
    }

    updateDisplay() {
        const todoList = this.shadowRoot.getElementById('todoList');
        const todoStats = this.shadowRoot.getElementById('todoStats');
        
        todoList.innerHTML = this.renderTodos();
        todoStats.textContent = this.getTodoStats();
        
        this.setupTodoEventListeners();
    }

    getTodoStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        return `${pending} осталось, ${completed} выполнено`;
    }

    loadTodos() {
        try {
            const stored = localStorage.getItem('dawn-todos');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading todos:', error);
            return [];
        }
    }

    saveTodos() {
        try {
            localStorage.setItem('dawn-todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    }

    show() {
        this.classList.remove('hidden');
        this.shadowRoot.querySelector('#todoInput').focus();
    }

    hide() {
        this.classList.add('hidden');
    }

    isVisible() {
        return !this.classList.contains('hidden');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('todo-panel', TodoPanel); 