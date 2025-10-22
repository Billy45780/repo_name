// TaskFlow — демонстрация Fetch API (чистый, понятный код)

const API_BASE = 'https://jsonplaceholder.typicode.com';

// ----------------- Утилиты -----------------
function el(id) { return document.getElementById(id); }

function show(targetId, html, type = '') {
    const node = el(targetId);
    if (!node) return;
    node.innerHTML = `<span class="${type}">${html}</span>`;
}

async function safeJson(response) {
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return response.json();
}

// ----------------- Задание 1: GET -----------------
async function fetchGetRequest() {
    show('get-output', 'Выполняется GET запрос... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/posts/1`);
        const data = await safeJson(res);
        show('get-output', `
            ✅ GET успешен
            ID: ${data.id}
            Заголовок: ${data.title}
            Тело: ${data.body}
            UserId: ${data.userId}
        `, 'success');
    } catch (err) {
        show('get-output', `Ошибка GET: ${err.message}`, 'error');
    }
}

async function fetchJsonData() {
    const out = el('get-output');
    const container = el('get-data');
    out.innerHTML = 'Загрузка пользователей... <span class="loading"></span>';
    container.innerHTML = '';
    try {
        const res = await fetch(`${API_BASE}/users`);
        const users = await safeJson(res);
        out.innerHTML = `✅ Загружено ${users.length} пользователей`;
        users.forEach(u => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <h3>👤 ${u.name}</h3>
                <div><strong>${u.username}</strong> — ${u.email}</div>
                <div>${u.company?.name} • ${u.website}</div>
                <div>${u.address?.city}, ${u.address?.street}</div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        out.innerHTML = `<span class="error">Ошибка: ${err.message}</span>`;
    }
}

async function fetchWithError() {
    show('get-output', 'Тест ошибки... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/invalid-endpoint`);
        const data = await safeJson(res);
        show('get-output', JSON.stringify(data, null, 2), 'success');
    } catch (err) {
        show('get-output', `Ошибка запроса: ${err.message}`, 'error');
    }
}

function setupGetRequests() {
    el('fetch-get').addEventListener('click', fetchGetRequest);
    el('fetch-json').addEventListener('click', fetchJsonData);
    el('fetch-error').addEventListener('click', fetchWithError);
}

// ----------------- Задание 2: CRUD -----------------
async function fetchPostRequest() {
    show('crud-output', 'Отправка POST... <span class="loading"></span>');
    try {
        const payload = { title: 'Новый пост', body: 'Тело поста', userId: 1 };
        const res = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await safeJson(res);
        show('crud-output', `✅ Создан пост ID: ${data.id}`, 'success');
    } catch (err) {
        show('crud-output', `Ошибка POST: ${err.message}`, 'error');
    }
}

async function fetchPutRequest() {
    show('crud-output', 'Отправка PUT... <span class="loading"></span>');
    try {
        const payload = { id: 1, title: 'Обновлённый заголовок', body: 'Новое тело', userId: 1 };
        const res = await fetch(`${API_BASE}/posts/1`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await safeJson(res);
        show('crud-output', `✅ PUT выполнен: ${data.title}`, 'success');
    } catch (err) {
        show('crud-output', `Ошибка PUT: ${err.message}`, 'error');
    }
}

async function fetchPatchRequest() {
    show('crud-output', 'Отправка PATCH... <span class="loading"></span>');
    try {
        const payload = { title: 'Частичное обновление' };
        const res = await fetch(`${API_BASE}/posts/1`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await safeJson(res);
        show('crud-output', `✅ PATCH: ${data.title}`, 'success');
    } catch (err) {
        show('crud-output', `Ошибка PATCH: ${err.message}`, 'error');
    }
}

async function fetchDeleteRequest() {
    show('crud-output', 'Отправка DELETE... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/posts/1`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        show('crud-output', `✅ DELETE выполнен. Статус: ${res.status}`, 'success');
    } catch (err) {
        show('crud-output', `Ошибка DELETE: ${err.message}`, 'error');
    }
}

function setupCrudRequests() {
    el('fetch-post').addEventListener('click', fetchPostRequest);
    el('fetch-put').addEventListener('click', fetchPutRequest);
    el('fetch-patch').addEventListener('click', fetchPatchRequest);
    el('fetch-delete').addEventListener('click', fetchDeleteRequest);
}

// ----------------- Задание 3: Заголовки и параметры -----------------
async function fetchWithHeaders() {
    show('headers-output', 'Отправка с заголовками... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/posts`, {
            headers: {
                'X-App-Name': 'TaskFlow',
                'Accept': 'application/json'
            }
        });
        const data = await safeJson(res);
        show('headers-output', `✅ Получено постов: ${data.length}`, 'success');
    } catch (err) {
        show('headers-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchWithAuth() {
    show('headers-output', 'Тест авторизации... <span class="loading"></span>');
    try {
        const token = btoa('user:pass');
        const res = await fetch(`${API_BASE}/posts/1`, {
            headers: { 'Authorization': `Basic ${token}` }
        });
        const data = await safeJson(res);
        show('headers-output', `✅ Авторизовано. Пост: ${data.title}`, 'success');
    } catch (err) {
        show('headers-output', `Ошибка авторизации: ${err.message}`, 'error');
    }
}

async function fetchWithParams() {
    show('headers-output', 'Запрос с параметрами... <span class="loading"></span>');
    try {
        const url = new URL(`${API_BASE}/posts`);
        url.search = new URLSearchParams({ _limit: 5, _sort: 'id', _order: 'desc' }).toString();
        const res = await fetch(url);
        const posts = await safeJson(res);
        show('headers-output', `✅ Получено ${posts.length} постов. URL: ${url}`, 'success');
    } catch (err) {
        show('headers-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchWithTimeout() {
    const out = el('headers-output');
    out.innerHTML = 'Таймаут 3s... <span class="loading"></span>';
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);

    try {
        const res = await fetch(`${API_BASE}/posts`, { signal: controller.signal });
        clearTimeout(id);
        await safeJson(res);
        out.innerHTML = '✅ Запрос завершён до таймаута';
    } catch (err) {
        clearTimeout(id);
        if (err.name === 'AbortError') out.innerHTML = '⏰ Запрос отменён (таймаут)';
        else out.innerHTML = `<span class="error">Ошибка: ${err.message}</span>`;
    }
}

function setupHeadersAndParams() {
    el('fetch-headers').addEventListener('click', fetchWithHeaders);
    el('fetch-auth').addEventListener('click', fetchWithAuth);
    el('fetch-params').addEventListener('click', fetchWithParams);
    el('fetch-timeout').addEventListener('click', fetchWithTimeout);
}

// ----------------- Задание 4: Ответы -----------------
async function fetchAndCheckStatus() {
    show('response-output', 'Проверка статуса... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/invalid-endpoint-123`);
        await safeJson(res);
    } catch (err) {
        show('response-output', `Ошибка статуса: ${err.message}`, 'error');
    }
}

async function fetchAndReadHeaders() {
    show('response-output', 'Чтение заголовков... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/posts/1`);
        const headers = [];
        res.headers.forEach((v, k) => headers.push(`${k}: ${v}`));
        show('response-output', `Заголовки:\n${headers.join('\n')}`, 'success');
    } catch (err) {
        show('response-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchBlobData() {
    show('response-output', 'Загрузка изображения... <span class="loading"></span>');
    const imgContainer = el('image-container');
    imgContainer.innerHTML = '';
    try {
        const res = await fetch('https://picsum.photos/300/200');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        show('response-output', `Изображение загружено. Тип: ${blob.type}`, 'success');
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'preview';
        img.className = 'image-preview';
        imgContainer.appendChild(img);
    } catch (err) {
        show('response-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchWithFormData() {
    show('response-output', 'Отправка FormData... <span class="loading"></span>');
    try {
        const fd = new FormData();
        fd.append('title','From FormData');
        fd.append('body','Sample body');
        fd.append('userId','1');
        const blob = new Blob(['test'], { type: 'text/plain' });
        fd.append('file', blob, 'test.txt');

        const res = await fetch(`${API_BASE}/posts`, { method: 'POST', body: fd });
        const data = await safeJson(res);
        show('response-output', `✅ Ответ сервера ID: ${data.id}`, 'success');
    } catch (err) {
        show('response-output', `Ошибка: ${err.message}`, 'error');
    }
}

function setupResponseHandling() {
    el('fetch-status').addEventListener('click', fetchAndCheckStatus);
    el('fetch-response-headers').addEventListener('click', fetchAndReadHeaders);
    el('fetch-blob').addEventListener('click', fetchBlobData);
    el('fetch-formdata').addEventListener('click', fetchWithFormData);
}

// ----------------- Задание 5: Ошибки -----------------
async function fetchNetworkError() {
    show('error-output', 'Тест сетевой ошибки... <span class="loading"></span>');
    try {
        await fetch('https://this-domain-does-not-exist-12345.com/');
        show('error-output', 'Выполнено', 'success');
    } catch (err) {
        show('error-output', `Сетевая ошибка: ${err.message}`, 'error');
    }
}

async function fetchHttpError() {
    show('error-output', 'Тест HTTP ошибки... <span class="loading"></span>');
    try {
        const res = await fetch(`${API_BASE}/posts/9999`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await res.json();
    } catch (err) {
        show('error-output', `HTTP ошибка: ${err.message}`, 'error');
    }
}

async function fetchWithAbort() {
    const out = el('error-output');
    out.innerHTML = 'Демонстрация AbortController...';
    const controller = new AbortController();
    const btn = document.createElement('button');
    btn.className = 'abort-btn';
    btn.textContent = 'Отменить';
    btn.onclick = () => controller.abort();
    out.appendChild(btn);

    try {
        const res = await fetch(`${API_BASE}/posts`, { signal: controller.signal });
        await safeJson(res);
        out.innerHTML = 'Запрос завершён', 'success';
    } catch (err) {
        if (err.name === 'AbortError') out.innerHTML = 'Запрос отменён';
        else out.innerHTML = `<span class="error">Ошибка: ${err.message}</span>`;
    }
}

async function fetchWithRetry(url, options = {}, retries = 3) {
    let last;
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            last = err;
            await new Promise(r => setTimeout(r, 100 * Math.pow(2, i)));
        }
    }
    throw last;
}

function setupErrorHandling() {
    el('fetch-network-error').addEventListener('click', fetchNetworkError);
    el('fetch-http-error').addEventListener('click', fetchHttpError);
    el('fetch-abort').addEventListener('click', fetchWithAbort);
    el('fetch-retry').addEventListener('click', async () => {
        const out = el('error-output');
        out.innerHTML = 'Повторные попытки...';
        try {
            const data = await fetchWithRetry(`${API_BASE}/posts/1`, {}, 3);
            out.innerHTML = `✅ Успех: ${JSON.stringify(data)}`;
        } catch (err) {
            out.innerHTML = `<span class="error">Все попытки не удались: ${err.message}</span>`;
        }
    });
}

// ----------------- Задание 6: Параллельно -----------------
async function fetchWithPromiseAll() {
    show('parallel-output', 'Promise.all — выполняется... <span class="loading"></span>');
    try {
        const start = Date.now();
        const [user, post, comment] = await Promise.all([
            fetch(`${API_BASE}/users/1`).then(r => r.json()),
            fetch(`${API_BASE}/posts/1`).then(r => r.json()),
            fetch(`${API_BASE}/comments/1`).then(r => r.json())
        ]);
        const elapsed = Date.now() - start;
        show('parallel-output', `✅ Готово за ${elapsed}ms\nПользователь: ${user.name}\nПост: ${post.title}`, 'success');
    } catch (err) {
        show('parallel-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchWithPromiseRace() {
    show('parallel-output', 'Promise.race — выполняется... <span class="loading"></span>');
    try {
        const winner = await Promise.race([
            fetch(`${API_BASE}/users/1`).then(r => r.json()),
            fetch(`${API_BASE}/posts/1`).then(r => r.json()),
            fetch(`${API_BASE}/comments/1`).then(r => r.json())
        ]);
        show('parallel-output', `Победитель: ${JSON.stringify(winner).slice(0,120)}...`, 'success');
    } catch (err) {
        show('parallel-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchSequentialRequests() {
    const out = el('parallel-output');
    out.innerHTML = 'Последовательные запросы...';
    try {
        const user = await (await fetch(`${API_BASE}/users/1`)).json();
        out.innerHTML += `\nПользователь: ${user.name}`;
        const posts = await (await fetch(`${API_BASE}/posts?userId=${user.id}`)).json();
        out.innerHTML += `\nПостов: ${posts.length}`;
        const comments = await (await fetch(`${API_BASE}/comments?postId=${posts[0]?.id}`)).json();
        out.innerHTML += `\nКомментарии: ${comments.length}`;
    } catch (err) {
        out.innerHTML += `\nОшибка: ${err.message}`;
    }
}

function setupParallelRequests() {
    el('fetch-promise-all').addEventListener('click', fetchWithPromiseAll);
    el('fetch-promise-race').addEventListener('click', fetchWithPromiseRace);
    el('fetch-sequential').addEventListener('click', fetchSequentialRequests);
}

// ----------------- Задание 7: Сценарии -----------------
async function fetchUserWithPosts() {
    show('scenario-output', 'Загрузка пользователя и постов... <span class="loading"></span>');
    try {
        const user = await (await fetch(`${API_BASE}/users/1`)).json();
        const posts = await (await fetch(`${API_BASE}/posts?userId=${user.id}`)).json();
        let html = `<strong>${user.name}</strong>\nEmail: ${user.email}\nПостов: ${posts.length}\n\n`;
        posts.slice(0,5).forEach((p,i) => html += `${i+1}. ${p.title}\n`);
        show('scenario-output', html, 'success');
    } catch (err) {
        show('scenario-output', `Ошибка: ${err.message}`, 'error');
    }
}

async function fetchWithSearch() {
    show('scenario-output', 'Поиск по постам... <span class="loading"></span>');
    try {
        const posts = await (await fetch(`${API_BASE}/posts`)).json();
        const term = 'qui';
        const found = posts.filter(p => p.title.includes(term) || p.body.includes(term));
        show('scenario-output', `Найдено: ${found.length} постов по "${term}"`, 'success');
    } catch (err) {
        show('scenario-output', `Ошибка поиска: ${err.message}`, 'error');
    }
}

async function simulateFileUpload() {
    const out = el('scenario-output');
    const progress = el('upload-progress');
    out.innerHTML = 'Симуляция загрузки...';
    progress.style.width = '0%';

    try {
        for (let pct=0; pct<=100; pct+=10) {
            progress.style.width = pct + '%';
            out.innerHTML = `Загрузка: ${pct}%`;
            await new Promise(r => setTimeout(r, 150));
        }

        const fd = new FormData();
        fd.append('file', new Blob(['test content'], { type: 'text/plain' }), 'file.txt');
        fd.append('description', 'simulated upload');

        const res = await fetch(`${API_BASE}/posts`, { method: 'POST', body: fd });
        const data = await safeJson(res);
        out.innerHTML = `Файл отправлен. Ответ ID: ${data.id}`;
        setTimeout(() => { progress.style.width = '0%'; }, 1200);
    } catch (err) {
        out.innerHTML = `Ошибка загрузки: ${err.message}`;
        progress.style.width = '0%';
    }
}

function createFetchCache() {
    const cache = new Map();
    const TTL = 5 * 60 * 1000;
    return async (url, opts = {}, ttl = TTL) => {
        const key = url + JSON.stringify(opts);
        const entry = cache.get(key);
        if (entry && (Date.now() - entry.ts) < ttl) return entry.data;
        const res = await fetch(url, opts);
        const data = await safeJson(res);
        cache.set(key, { data, ts: Date.now() });
        return data;
    };
}

function setupRealScenarios() {
    const cachedFetch = createFetchCache();
    el('fetch-user-posts').addEventListener('click', fetchUserWithPosts);
    el('fetch-search').addEventListener('click', fetchWithSearch);
    el('fetch-file-upload').addEventListener('click', simulateFileUpload);
    el('fetch-cache').addEventListener('click', async () => {
        const out = el('scenario-output');
        out.innerHTML = 'Тест кэша...';
        try {
            const a = await cachedFetch(`${API_BASE}/users/1`);
            out.innerHTML += `\nПервый: ${a.name}`;
            const b = await cachedFetch(`${API_BASE}/users/1`);
            out.innerHTML += `\nВторой (кэш): ${b.name}`;
        } catch (err) {
            out.innerHTML += `\nОшибка: ${err.message}`;
        }
    });
}

// ----------------- Инициализация -----------------
function init() {
    setupGetRequests();
    setupCrudRequests();
    setupHeadersAndParams();
    setupResponseHandling();
    setupErrorHandling();
    setupParallelRequests();
    setupRealScenarios();
}

document.addEventListener('DOMContentLoaded', init);
