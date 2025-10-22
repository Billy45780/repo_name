// Простейшие тесты для ручного запуска из UI

console.log('Тесты Fetch API готовы');

async function testGetRequests() {
    console.log('Тест GET /posts/1');
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        console.log('OK:', data.title);
    } catch (err) {
        console.log('Ошибка GET:', err.message);
    }
}

async function testPostRequests() {
    console.log('Тест POST /posts');
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ title:'t', body:'b', userId:1 })
        });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        console.log('OK, created ID:', data.id);
    } catch (err) {
        console.log('Ошибка POST:', err.message);
    }
}

async function testErrorHandling() {
    console.log('Тест обработки ошибок');
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/invalid-endpoint');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
        console.log('Ожидаемая ошибка:', err.message);
    }
}

async function testParallelRequests() {
    console.log('Тест Promise.all');
    try {
        const [u,p,c] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json()),
            fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json()),
            fetch('https://jsonplaceholder.typicode.com/comments/1').then(r => r.json())
        ]);
        console.log('Пользователь:', u.name, 'Пост:', p.title.slice(0,20));
    } catch (err) {
        console.log('Ошибка параллельных запросов:', err.message);
    }
}

async function testPromiseRace() {
    console.log('Тест Promise.race');
    try {
        const winner = await Promise.race([
            fetch('https://jsonplaceholder.typicode.com/users/1').then(r => r.json()),
            fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json())
        ]);
        console.log('Победитель:', winner.id ? 'User' : 'Post');
    } catch (err) {
        console.log('Ошибка race:', err.message);
    }
}

async function testAbortController() {
    console.log('Тест AbortController');
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 100);
    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', { signal: controller.signal });
        console.log('Запрос не был отменён');
    } catch (err) {
        if (err.name === 'AbortError') console.log('Запрос успешно отменён');
        else console.log('Другая ошибка:', err.message);
    } finally {
        clearTimeout(id);
    }
}

async function runAllTests() {
    console.log('Запуск всех тестов...');
    await testGetRequests();
    await testPostRequests();
    await testErrorHandling();
    await testParallelRequests();
    await testPromiseRace();
    await testAbortController();
    console.log('Все тесты завершены');
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = '🧪 Запустить тесты Fetch API';
    btn.onclick = runAllTests;
    const container = document.querySelector('.container');
    if (container) container.appendChild(btn);
});

// Экспорт для Node / Jest, если понадобится
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testGetRequests,
        testPostRequests,
        testErrorHandling,
        testParallelRequests,
        testPromiseRace,
        testAbortController,
        runAllTests
    };
}
