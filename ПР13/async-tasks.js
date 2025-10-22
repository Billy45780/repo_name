// Асинхронные операции — основной набор функций

// --- Промисы и базовые утилиты ---
function createBasicPromise(shouldResolve = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve("Успех: задача выполнена");
            } else {
                reject("Ошибка: задача не выполнена");
            }
        }, 1000);
    });
}

function delayWithPromise(ms) {
    return new Promise(resolve => setTimeout(() => resolve(`Задержка ${ms}ms завершена`), ms));
}

// --- Задание 1: работа с промисами ---
function handleBasicPromise() {
    const out = document.getElementById('promise-output');
    out.innerHTML = '<span class="loading"></span> Обработка...';

    createBasicPromise(true)
        .then(result => out.innerHTML = `<span class="success">${result}</span>`)
        .catch(err => out.innerHTML = `<span class="error">${err}</span>`);
}

function createPromiseChain() {
    const out = document.getElementById('promise-output');
    out.innerHTML = '<span class="loading"></span> Запуск цепочки...';

    let step = 1;

    createBasicPromise(true)
        .then(res => {
            out.innerHTML += `\nШаг ${step++}: ${res}`;
            return createBasicPromise(true);
        })
        .then(res => {
            out.innerHTML += `\nШаг ${step++}: ${res}`;
            return createBasicPromise(true);
        })
        .then(res => {
            out.innerHTML += `\nШаг ${step++}: ${res}\nЦепочка завершена.`;
        })
        .catch(err => out.innerHTML += `\nОшибка в цепочке: ${err}`);
}

function handlePromiseError() {
    const out = document.getElementById('promise-output');
    out.innerHTML = '<span class="loading"></span> Проверка ошибки...';

    createBasicPromise(false)
        .then(res => out.innerHTML = `<span class="success">${res}</span>`)
        .catch(err => out.innerHTML = `<span class="error">${err}</span>`);
}

function setupPromiseEvents() {
    document.getElementById('basic-promise').addEventListener('click', handleBasicPromise);
    document.getElementById('promise-chain').addEventListener('click', createPromiseChain);
    document.getElementById('promise-error').addEventListener('click', handlePromiseError);
}

// --- Задание 2: async / await ---
async function basicAsyncAwait() {
    const out = document.getElementById('async-output');
    out.innerHTML = '<span class="loading"></span> Выполнение...';

    try {
        await delayWithPromise(800);
        const res = await createBasicPromise(true);
        out.innerHTML = `<span class="success">${res}</span>`;
    } catch (err) {
        out.innerHTML = `<span class="error">${err}</span>`;
    }
}

async function handleAsyncError() {
    const out = document.getElementById('async-output');
    out.innerHTML = '<span class="loading"></span> Проверка ошибок...';

    try {
        const res = await createBasicPromise(false);
        out.innerHTML = `<span class="success">${res}</span>`;
    } catch (err) {
        out.innerHTML = `<span class="error">Поймана ошибка: ${err}</span>`;
    }
}

async function parallelAsyncExecution() {
    const out = document.getElementById('async-output');
    out.innerHTML = '<span class="loading"></span> Параллельное выполнение...';

    const start = Date.now();
    try {
        const results = await Promise.all([
            createBasicPromise(true),
            createBasicPromise(true),
            createBasicPromise(true)
        ]);
        const duration = Date.now() - start;
        out.innerHTML = `Все задачи завершены.\nРезультаты:\n${results.join('\n')}\nВремя: ${duration}ms`;
    } catch (err) {
        out.innerHTML = `<span class="error">Ошибка: ${err}</span>`;
    }
}

function setupAsyncEvents() {
    document.getElementById('basic-async').addEventListener('click', basicAsyncAwait);
    document.getElementById('async-error').addEventListener('click', handleAsyncError);
    document.getElementById('async-parallel').addEventListener('click', parallelAsyncExecution);
}

// --- Задание 3: Работа с API ---
async function fetchUsers() {
    const out = document.getElementById('api-output');
    const container = document.getElementById('api-data');

    out.innerHTML = '<span class="loading"></span> Загрузка пользователей...';
    container.innerHTML = '';

    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const users = await resp.json();

        out.innerHTML = `<span class="success">Загружено ${users.length} пользователей</span>`;
        users.forEach(u => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <h3>${u.name}</h3>
                <p><strong>Email:</strong> ${u.email}</p>
                <p><strong>Тел:</strong> ${u.phone}</p>
                <p><strong>Компания:</strong> ${u.company.name}</p>
                <p><strong>Город:</strong> ${u.address.city}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        out.innerHTML = `<span class="error">Ошибка загрузки: ${err.message}</span>`;
    }
}

async function createPost() {
    const out = document.getElementById('api-output');
    out.innerHTML = '<span class="loading"></span> Отправка поста...';

    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Новый пост',
                body: 'Тестовый пост',
                userId: 1
            })
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const post = await resp.json();
        out.innerHTML = `Пост создан.\nID: ${post.id}\nЗаголовок: ${post.title}`;
    } catch (err) {
        out.innerHTML = `<span class="error">Ошибка: ${err.message}</span>`;
    }
}

async function testApiError() {
    const out = document.getElementById('api-output');
    out.innerHTML = '<span class="loading"></span> Тест ошибки API...';
    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/invalid-url');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        const data = await resp.json();
        out.innerHTML = JSON.stringify(data, null, 2);
    } catch (err) {
        out.innerHTML = `<span class="error">Ошибка: ${err.message}\nВремя: ${new Date().toLocaleTimeString()}</span>`;
    }
}

function setupApiEvents() {
    document.getElementById('fetch-users').addEventListener('click', fetchUsers);
    document.getElementById('fetch-post').addEventListener('click', createPost);
    document.getElementById('fetch-error').addEventListener('click', testApiError);
}

// --- Задание 4: Таймеры и интервалы ---
let intervalId = null;
let intervalCounter = 0;

async function startAsyncInterval() {
    const out = document.getElementById('interval-output');
    out.innerHTML = 'Интервал запущен';
    intervalCounter = 0;

    intervalId = setInterval(async () => {
        intervalCounter++;
        out.innerHTML = `Счетчик: ${intervalCounter}`;

        if (intervalCounter % 5 === 0) {
            out.innerHTML += `\nВыполняется асинхронная задача...`;
            await delayWithPromise(100);
            out.innerHTML += `\nЗадача завершена`;
        }
    }, 1000);
}

function stopAsyncInterval() {
    const out = document.getElementById('interval-output');
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        out.innerHTML = `Интервал остановлен. Значение: ${intervalCounter}`;
    } else {
        out.innerHTML = 'Интервал не был запущен';
    }
}

async function testDelay() {
    const out = document.getElementById('timer-output');
    out.innerHTML = '<span class="loading"></span> Тест задержек...';

    try {
        out.innerHTML += '\nНачало:';
        for (let i = 1; i <= 3; i++) {
            const res = await delayWithPromise(i * 500);
            out.innerHTML += `\n${i}. ${res}`;
        }
        out.innerHTML += '\nВсе задержки выполнены';
    } catch (err) {
        out.innerHTML += `\nОшибка: ${err}`;
    }
}

function setupTimerEvents() {
    document.getElementById('start-interval').addEventListener('click', startAsyncInterval);
    document.getElementById('stop-interval').addEventListener('click', stopAsyncInterval);
    document.getElementById('delay-promise').addEventListener('click', testDelay);
}

// --- Задание 5: Обработка ошибок ---
async function asyncTryCatch() {
    const out = document.getElementById('error-output');
    out.innerHTML = '<span class="loading"></span> Демонстрация try/catch...';

    try {
        out.innerHTML += '\n1. Успешная операция';
        const r1 = await createBasicPromise(true);
        out.innerHTML += `\n${r1}`;

        out.innerHTML += '\n2. Операция с ошибкой';
        await createBasicPromise(false);
        out.innerHTML += '\nЭта строка не должна отобразиться';
    } catch (err) {
        out.innerHTML += `\nПоймана ошибка: ${err}`;

        try {
            out.innerHTML += '\nПопытка восстановления';
            const recovery = await createBasicPromise(true);
            out.innerHTML += `\nВосстановление: ${recovery}`;
        } catch (recErr) {
            out.innerHTML += `\nКритическая ошибка восстановления: ${recErr}`;
        }
    }
}

async function handleMultipleErrors() {
    const out = document.getElementById('error-output');
    out.innerHTML = '<span class="loading"></span> Проверка нескольких ошибок...';

    const promises = [
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true)
    ];

    try {
        const results = await Promise.allSettled(promises);
        out.innerHTML = 'Результаты allSettled:\n';
        let ok = 0, fail = 0;
        results.forEach((r, i) => {
            if (r.status === 'fulfilled') {
                out.innerHTML += `${i + 1}. Успех: ${r.value}\n`;
                ok++;
            } else {
                out.innerHTML += `${i + 1}. Ошибка: ${r.reason}\n`;
                fail++;
            }
        });
        out.innerHTML += `Статистика: Успехи ${ok}, Ошибки ${fail}, Всего ${results.length}`;
    } catch (err) {
        out.innerHTML = `Неожиданная ошибка: ${err}`;
    }
}

async function retryWithBackoff(operation, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const r = await operation();
            return { success: true, result: r, attempts: attempt };
        } catch (err) {
            lastError = err;
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 100;
                await delayWithPromise(delay);
            }
        }
    }
    throw { success: false, error: lastError, attempts: maxRetries };
}

function setupErrorEvents() {
    document.getElementById('try-catch').addEventListener('click', asyncTryCatch);
    document.getElementById('multiple-errors').addEventListener('click', handleMultipleErrors);
    document.getElementById('retry-pattern').addEventListener('click', async () => {
        const out = document.getElementById('error-output');
        out.innerHTML = '<span class="loading"></span> Повторные попытки...';

        try {
            const res = await retryWithBackoff(() => createBasicPromise(false), 3);
            out.innerHTML = `Успех после ${res.attempts} попыток: ${res.result}`;
        } catch (err) {
            out.innerHTML = `Все попытки не удались (${err.attempts}): ${err.error}`;
        }
    });
}

// --- Задание 6: Параллельные операции ---
async function demonstratePromiseAll() {
    const out = document.getElementById('parallel-output');
    out.innerHTML = '<span class="loading"></span> Promise.all...';
    const start = Date.now();

    try {
        const promises = [
            delayWithPromise(1000).then(() => 'Задача 1'),
            delayWithPromise(1500).then(() => 'Задача 2'),
            delayWithPromise(800).then(() => 'Задача 3'),
            delayWithPromise(1200).then(() => 'Задача 4'),
            delayWithPromise(2000).then(() => 'Задача 5')
        ];
        const results = await Promise.all(promises);
        const duration = Date.now() - start;
        out.innerHTML = `Promise.all завершён.\nРезультаты:\n${results.join('\n')}\nВремя: ${duration}ms`;
    } catch (err) {
        out.innerHTML = `Ошибка: ${err}`;
    }
}

async function demonstratePromiseRace() {
    const out = document.getElementById('parallel-output');
    out.innerHTML = '<span class="loading"></span> Promise.race...';
    const start = Date.now();

    try {
        const promises = [
            delayWithPromise(2000).then(() => 'Медленная (2000ms)'),
            delayWithPromise(1000).then(() => 'Средняя (1000ms)'),
            delayWithPromise(500).then(() => 'Быстрая (500ms)'),
            delayWithPromise(1500).then(() => 'Еще (1500ms)')
        ];
        const winner = await Promise.race(promises);
        const duration = Date.now() - start;
        out.innerHTML = `Победитель: ${winner}\nВремя: ${duration}ms\nОстальные задачи завершаются в фоне...`;

        Promise.all(promises).then(all => {
            out.innerHTML += `\nВсе завершены:\n${all.join('\n')}`;
        });
    } catch (err) {
        out.innerHTML = `Ошибка: ${err}`;
    }
}

async function demonstratePromiseAllSettled() {
    const out = document.getElementById('parallel-output');
    out.innerHTML = '<span class="loading"></span> Promise.allSettled...';

    try {
        const promises = [
            createBasicPromise(true),
            createBasicPromise(false),
            delayWithPromise(800).then(() => 'Успешная задержка'),
            createBasicPromise(true),
            createBasicPromise(false)
        ];
        const results = await Promise.allSettled(promises);
        out.innerHTML = 'Результаты allSettled:\n';
        results.forEach((r, i) => {
            if (r.status === 'fulfilled') out.innerHTML += `${i + 1}. Fulfilled: ${r.value}\n`;
            else out.innerHTML += `${i + 1}. Rejected: ${r.reason}\n`;
        });
        const stats = {
            fulfilled: results.filter(r => r.status === 'fulfilled').length,
            rejected: results.filter(r => r.status === 'rejected').length
        };
        out.innerHTML += `Статистика: Выполнено ${stats.fulfilled}, Ошибок ${stats.rejected}`;
    } catch (err) {
        out.innerHTML = `Ошибка: ${err}`;
    }
}

function setupParallelEvents() {
    document.getElementById('promise-all').addEventListener('click', demonstratePromiseAll);
    document.getElementById('promise-race').addEventListener('click', demonstratePromiseRace);
    document.getElementById('promise-allSettled').addEventListener('click', demonstratePromiseAllSettled);
}

// --- Задание 7: Практические сценарии ---
async function sequentialApiRequests() {
    const out = document.getElementById('scenario-output');
    out.innerHTML = '<span class="loading"></span> Последовательные запросы...';

    try {
        out.innerHTML += '\n1. Получаем пользователя';
        const userResp = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await userResp.json();
        out.innerHTML += `\nПользователь: ${user.name}`;

        out.innerHTML += '\n2. Получаем посты пользователя';
        const postsResp = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        const posts = await postsResp.json();
        out.innerHTML += `\nНайдено постов: ${posts.length}`;

        if (posts.length > 0) {
            out.innerHTML += '\n3. Получаем комментарии к первому посту';
            const commResp = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${posts[0].id}`);
            const comments = await commResp.json();
            out.innerHTML += `\nКомментариев: ${comments.length}`;
        }

        out.innerHTML += '\nГотово';
    } catch (err) {
        out.innerHTML += `\nОшибка: ${err.message}`;
    }
}

async function simulateFileUpload() {
    const out = document.getElementById('scenario-output');
    const progress = document.getElementById('progress-fill');
    out.innerHTML = 'Симуляция загрузки...';
    progress.style.width = '0%';

    try {
        for (let p = 0; p <= 100; p += 10) {
            await delayWithPromise(200);
            progress.style.width = `${p}%`;
            out.innerHTML = `Загрузка: ${p}%`;

            if (p === 50) {
                out.innerHTML += '\nОптимизация данных...';
                await delayWithPromise(500);
            }
        }
        out.innerHTML = 'Загрузка завершена';
        await delayWithPromise(1000);
        progress.style.width = '0%';
    } catch (err) {
        out.innerHTML = `Ошибка загрузки: ${err}`;
        progress.style.width = '0%';
    }
}

function createRequestCache() {
    const cache = new Map();

    return async function cachedRequest(url) {
        const out = document.getElementById('scenario-output');

        if (cache.has(url)) {
            out.innerHTML = `Данные из кэша: ${url}`;
            return cache.get(url);
        }

        out.innerHTML = `Загрузка: ${url}`;
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error('Network error');
            const data = await resp.json();
            cache.set(url, data);
            out.innerHTML += '\nСохранено в кэш';
            return data;
        } catch (err) {
            out.innerHTML += `\nОшибка: ${err.message}`;
            throw err;
        }
    };
}

function setupRealScenarioEvents() {
    const cachedFetch = createRequestCache();

    document.getElementById('sequential-requests').addEventListener('click', sequentialApiRequests);
    document.getElementById('upload-simulation').addEventListener('click', simulateFileUpload);
    document.getElementById('cache-requests').addEventListener('click', async () => {
        const out = document.getElementById('scenario-output');
        out.innerHTML = 'Тест кэша...';
        try {
            await cachedFetch('https://jsonplaceholder.typicode.com/users/1');
            await delayWithPromise(1000);
            await cachedFetch('https://jsonplaceholder.typicode.com/users/1');
        } catch (err) {
            out.innerHTML += `\nОшибка: ${err.message}`;
        }
    });
}

// --- Инициализация ---
function initializeApp() {
    setupPromiseEvents();
    setupAsyncEvents();
    setupApiEvents();
    setupTimerEvents();
    setupErrorEvents();
    setupParallelEvents();
    setupRealScenarioEvents();
    console.log('TaskFlow инициализирован');
}

document.addEventListener('DOMContentLoaded', initializeApp);
