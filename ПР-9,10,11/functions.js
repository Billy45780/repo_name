// Утилиты и функции высшего порядка

// curry: превращает функцию в каррированную
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) return fn.apply(this, args);
        return function(...more) { return curried.apply(this, args.concat(more)); };
    };
}

// memoize: кеширует результаты вызова
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const res = fn.apply(this, args);
        cache.set(key, res);
        return res;
    };
}

// debounce: задерживает вызов функции
function debounce(fn, wait) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

// throttle: ограничивает частоту вызова
function throttle(fn, interval) {
    let last = 0;
    return function(...args) {
        const now = Date.now();
        if (now - last >= interval) {
            fn.apply(this, args);
            last = now;
        }
    };
}

// compose: композиция функций (справа налево)
function compose(...fns) {
    return function(initial) {
        return fns.reduceRight((acc, fn) => fn(acc), initial);
    };
}

// Создает валидатор задач по заданным правилам
function createTaskValidator(rules = {}) {
    return function(task = {}) {
        const errors = {};
        if (rules.requiredTitle && (!task.title || task.title.trim() === '')) {
            errors.title = 'Название обязательно';
        }
        if (rules.minTitleLength && task.title && task.title.length < rules.minTitleLength) {
            errors.title = `Минимальная длина ${rules.minTitleLength}`;
        }
        if (rules.maxTitleLength && task.title && task.title.length > rules.maxTitleLength) {
            errors.title = `Максимальная длина ${rules.maxTitleLength}`;
        }
        if (rules.validPriority && task.priority && !['low','medium','high'].includes(task.priority)) {
            errors.priority = 'Неверный приоритет';
        }
        if (rules.validCategory && task.category && !['work','personal','study','health'].includes(task.category)) {
            errors.category = 'Неверная категория';
        }
        return Object.keys(errors).length ? errors : null;
    };
}

// Фабрика задач — возвращает функцию, создающую задачу с дефолтами
function createTaskFactory(defaults = {}) {
    return function(data = {}) {
        const now = new Date().toISOString();
        return {
            id: generateTaskId(),
            title: '',
            description: '',
            priority: 'medium',
            category: 'personal',
            completed: false,
            createdAt: now,
            updatedAt: now,
            ...defaults,
            ...data
        };
    };
}

// Применяет processor ко всем задачам (map)
function processTasks(tasks, processor) {
    if (!Array.isArray(tasks)) return [];
    return tasks.map(processor);
}

// Редюсер для операций со списком задач
function tasksReducer(state = [], action = {}) {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.task];
        case 'UPDATE_TASK':
            return state.map(t => t.id === action.taskId ? { ...t, ...action.updates, updatedAt: new Date().toISOString() } : t);
        case 'DELETE_TASK':
            return state.filter(t => t.id !== action.taskId);
        case 'TOGGLE_TASK':
            return state.map(t => t.id === action.taskId ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t);
        case 'CLEAR_COMPLETED':
            return state.filter(t => !t.completed);
        default:
            return state;
    }
}

// Счетчик с замыканием
function createCounter(initial = 0) {
    let count = initial;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count,
        reset: () => { count = initial; }
    };
}

// Пакетное обновление задач — возвращает массив обновлений с updatedAt
function bulkUpdateTasks(...updates) {
    return updates.map(u => ({ ...u, updatedAt: new Date().toISOString() }));
}

// Анализ одной задачи (пример использования деструктуризации)
function analyzeTask({ title, priority, completed, deadline } = {}) {
    const analysis = {
        hasTitle: !!title,
        isHighPriority: priority === 'high',
        isCompleted: !!completed,
        hasDeadline: !!deadline,
        isUrgent: priority === 'high' && deadline && (new Date(deadline) - Date.now() < 24 * 60 * 60 * 1000)
    };
    analysis.score = Object.values(analysis).filter(Boolean).length;
    return analysis;
}
