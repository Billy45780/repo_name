// Набор функций — алгоритмы для работы со списком задач

// Проверяет силу пароля — возвращает 'weak' | 'medium' | 'strong'
function checkPasswordStrength(password) {
    if (!password || password.length < 8) return 'weak';

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let score = 0;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasDigit) score++;
    if (hasSpecial) score++;

    if (score >= 4 && password.length >= 12) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}

// Сортирует массив задач по критерию
function sortTasks(tasks, criteria) {
    const list = Array.isArray(tasks) ? tasks.slice() : [];
    switch (criteria) {
        case 'newest':
            return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'priority': {
            const order = { high: 3, medium: 2, low: 1 };
            return list.sort((a, b) => (order[b.priority] || 0) - (order[a.priority] || 0));
        }
        case 'deadline':
            return list.sort((a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
        default:
            return list;
    }
}

// Поиск задач по полям title, description, category (регистронезависимо)
function searchTasks(tasks, query) {
    if (!Array.isArray(tasks)) return [];
    if (!query || !String(query).trim()) return tasks;
    const q = String(query).toLowerCase();
    return tasks.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
    );
}

// Фильтрует задачи по типу
function filterTasks(tasks, filterType) {
    if (!Array.isArray(tasks)) return [];
    switch (filterType) {
        case 'active': return tasks.filter(t => !t.completed);
        case 'completed': return tasks.filter(t => !!t.completed);
        case 'high': return tasks.filter(t => t.priority === 'high');
        case 'work': return tasks.filter(t => t.category === 'work');
        case 'personal': return tasks.filter(t => t.category === 'personal');
        case 'study': return tasks.filter(t => t.category === 'study');
        case 'health': return tasks.filter(t => t.category === 'health');
        case 'all':
        default: return tasks;
    }
}

// Возвращает статистику по списку задач
function calculateTaskStats(tasks) {
    if (!Array.isArray(tasks)) return { total: 0, completed: 0, active: 0, highPriority: 0 };
    const total = tasks.length;
    const completed = tasks.filter(t => !!t.completed).length;
    const active = total - completed;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    return { total, completed, active, highPriority };
}

// Проверяет данные задачи и возвращает объект ошибок или null
function validateTask(taskData) {
    const errors = {};

    if (!taskData || typeof taskData !== 'object') {
        errors.general = 'Неверные данные';
        return errors;
    }

    if (!taskData.title || String(taskData.title).trim().length < 3) {
        errors.title = 'Название должно быть не менее 3 символов';
    }

    if (taskData.deadline) {
        const dl = new Date(taskData.deadline);
        if (isNaN(dl.getTime())) {
            errors.deadline = 'Неверная дата';
        } else if (dl < new Date().setHours(0,0,0,0)) {
            errors.deadline = 'Срок не может быть в прошлом';
        }
    }

    return Object.keys(errors).length ? errors : null;
}

// Генератор уникального id для задачи
function generateTaskId() {
    const time = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 9);
    return `task_${time}_${rand}`;
}

// Форматирует дату в человекочитаемый вид
function formatDate(dateString) {
    if (!dateString) return 'Не указан';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Не указан';
    const today = new Date();
    const diffMs = d.setHours(0,0,0,0) - (new Date().setHours(0,0,0,0));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    if (diffDays === -1) return 'Вчера';
    if (diffDays < 0) return 'Просрочено';
    if (diffDays < 7) return `Через ${diffDays} дней`;
    return d.toLocaleDateString('ru-RU');
}

// Считает процент выполненных задач
function calculateProgress(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    const done = tasks.filter(t => !!t.completed).length;
    return Math.round((done / tasks.length) * 100);
}

// Ищет дубликаты по title + category
function findDuplicateTasks(tasks) {
    if (!Array.isArray(tasks)) return [];
    const seen = new Set();
    const duplicates = [];
    tasks.forEach(t => {
        const key = `${(t.title || '').toLowerCase()}|${t.category || ''}`;
        if (seen.has(key)) duplicates.push(t);
        else seen.add(key);
    });
    return duplicates;
}
