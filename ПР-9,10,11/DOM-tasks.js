// Работа с DOM, события, отображение задач

// Состояние приложения
let tasks = [];
let currentFilter = 'all';
let currentSort = 'newest';

// Инициализация приложения
function initApp() {
    loadTasks();
    bindEvents();
    renderTasks();
    updateStats();
}

// Загрузка/сохранение
function loadTasks() {
    try {
        const raw = localStorage.getItem('tasks');
        tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
        tasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
        // если localStorage недоступен — молча игнорируем
        console.warn('Не удалось сохранить в localStorage', e);
    }
}

// Привязка событий
function bindEvents() {
    const form = document.getElementById('task-form');
    if (form) form.addEventListener('submit', onAddTask);

    const search = document.getElementById('task-search');
    if (search) search.addEventListener('input', debounce(() => renderTasks(), 300));

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', onFilterClick);
    });

    const sortEl = document.getElementById('sort-tasks');
    if (sortEl) sortEl.addEventListener('change', e => {
        currentSort = e.target.value;
        renderTasks();
    });

    const clearBtn = document.getElementById('clear-completed');
    if (clearBtn) clearBtn.addEventListener('click', onClearCompleted);

    const exportBtn = document.getElementById('export-tasks');
    if (exportBtn) exportBtn.addEventListener('click', onExportTasks);

    const importBtn = document.getElementById('import-tasks');
    if (importBtn) importBtn.addEventListener('click', onImportTasks);
}

// Добавление новой задачи
function onAddTask(e) {
    e.preventDefault();
    const titleEl = document.getElementById('task-title');
    const descEl = document.getElementById('task-description');
    const priorityEl = document.getElementById('task-priority');
    const deadlineEl = document.getElementById('task-deadline');
    const categoryEl = document.getElementById('task-category');

    const data = {
        title: (titleEl && titleEl.value) ? titleEl.value.trim() : '',
        description: descEl ? descEl.value.trim() : '',
        priority: priorityEl ? priorityEl.value : 'medium',
        deadline: deadlineEl ? deadlineEl.value : '',
        category: categoryEl ? categoryEl.value : 'personal'
    };

    const errors = validateTask(data);
    if (errors) {
        showFormErrors(errors);
        return;
    }

    clearFormErrors();

    const factory = createTaskFactory();
    const newTask = factory(data);

    tasks = tasksReducer(tasks, { type: 'ADD_TASK', task: newTask });
    saveTasks();
    renderTasks();
    updateStats();

    e.target.reset();
    showNotification('Задача добавлена', 'success');
}

// Отрисовка списка задач
function renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;

    let list = filterTasks(tasks, currentFilter);
    const searchValue = (document.getElementById('task-search') || {}).value || '';
    list = searchTasks(list, searchValue);
    list = sortTasks(list, currentSort);

    if (list.length === 0) {
        container.innerHTML = '<div class="text-center mt-20">Задачи не найдены</div>';
        return;
    }

    container.innerHTML = list.map(taskToHtml).join('');
}

// Генерирует HTML одной задачи
function taskToHtml(task) {
    const completedAttr = task.completed ? 'checked' : '';
    const desc = task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : '';
    const deadline = task.deadline ? `<span class="task-deadline">📅 ${formatDate(task.deadline)}</span>` : '';
    const created = task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '';

    return `
        <div class="task-card ${task.completed ? 'completed' : ''} ${task.priority}-priority" data-id="${task.id}">
            <div class="task-content">
                <div class="task-title">
                    <input type="checkbox" ${completedAttr} onchange="toggleTaskCompletion('${task.id}')" />
                    <span>${escapeHtml(task.title)}</span>
                </div>
                ${desc}
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${getPriorityText(task.priority)}</span>
                    <span class="task-category">${getCategoryText(task.category)}</span>
                    ${deadline}
                    <span class="task-date">Создано: ${created}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask('${task.id}')">✏️</button>
                <button class="btn-delete" onclick="deleteTask('${task.id}')">🗑️</button>
            </div>
        </div>
    `;
}

// Обновление статистики в шапке
function updateStats() {
    const s = calculateTaskStats(tasks);
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('total-tasks', s.total);
    setText('completed-tasks', s.completed);
    setText('active-tasks', s.active);
    setText('priority-tasks', s.highPriority);
}

// Обработчики фильтров/очистки/экспорта/импорта
function onFilterClick(e) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const target = e.currentTarget;
    target.classList.add('active');
    currentFilter = target.dataset.filter || 'all';
    renderTasks();
}

function onClearCompleted() {
    if (!confirm('Удалить все выполненные задачи?')) return;
    tasks = tasksReducer(tasks, { type: 'CLEAR_COMPLETED' });
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Выполненные задачи удалены', 'info');
}

function onExportTasks() {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function onImportTasks() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function(evt) {
        const file = evt.target.files && evt.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const parsed = JSON.parse(ev.target.result);
                if (!Array.isArray(parsed)) throw new Error('Неверный формат');
                tasks = parsed;
                saveTasks();
                renderTasks();
                updateStats();
                showNotification('Задачи импортированы', 'success');
            } catch (err) {
                showNotification('Ошибка при импорте файла', 'warning');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Операции над задачами
function toggleTaskCompletion(id) {
    tasks = tasksReducer(tasks, { type: 'TOGGLE_TASK', taskId: id });
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    if (!confirm('Удалить эту задачу?')) return;
    tasks = tasksReducer(tasks, { type: 'DELETE_TASK', taskId: id });
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Задача удалена', 'warning');
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    // Заполняем форму
    const titleEl = document.getElementById('task-title');
    const descEl = document.getElementById('task-description');
    const priorityEl = document.getElementById('task-priority');
    const deadlineEl = document.getElementById('task-deadline');
    const categoryEl = document.getElementById('task-category');

    if (titleEl) titleEl.value = task.title || '';
    if (descEl) descEl.value = task.description || '';
    if (priorityEl) priorityEl.value = task.priority || 'medium';
    if (deadlineEl) deadlineEl.value = task.deadline || '';
    if (categoryEl) categoryEl.value = task.category || 'personal';

    // Удаляем старую задачу (при сохранении форма добавит новую запись)
    tasks = tasksReducer(tasks, { type: 'DELETE_TASK', taskId: id });
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Редактирование: внесите изменения и нажмите Добавить', 'info');
}

// Вспомогательные функции для DOM
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function getPriorityText(p) {
    return { high: 'Высокий', medium: 'Средний', low: 'Низкий' }[p] || p;
}

function getCategoryText(c) {
    return { work: 'Работа', personal: 'Личное', study: 'Учеба', health: 'Здоровье' }[c] || c;
}

function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#dc3545' : '#17a2b8'};
        color: #fff;
        border-radius: 6px;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0,0,0,.12);
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function showFormErrors(errors) {
    clearFormErrors();
    Object.entries(errors).forEach(([field, msg]) => {
        const input = document.getElementById(`task-${field}`);
        if (!input) return;
        input.style.borderColor = '#dc3545';
        const el = document.createElement('div');
        el.className = 'error-message';
        el.textContent = msg;
        el.style.cssText = 'color:#dc3545;font-size:.85rem;margin-top:6px;';
        input.parentNode.appendChild(el);
    });
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(n => n.remove());
    document.querySelectorAll('#task-form input, #task-form textarea, #task-form select').forEach(i => {
        i.style.borderColor = '#e1e5e9';
    });
}

// Запуск
document.addEventListener('DOMContentLoaded', initApp);
