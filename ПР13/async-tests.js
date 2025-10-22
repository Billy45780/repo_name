// Набор простых тестов для основных функций асинхронности

async function testBasicPromise() {
    console.log('Тест 1: базовые промисы');
    try {
        const ok = await createBasicPromise(true);
        console.log('createBasicPromise(true):', ok);
        await createBasicPromise(false);
        console.log('Ошибка: ожидалась ошибка, но промис выполнился');
    } catch (err) {
        console.log('createBasicPromise(false): поймана ошибка:', err);
    }
}

async function testPromiseChains() {
    console.log('Тест 2: цепочки промисов');
    let chain = '';
    await createBasicPromise(true)
        .then(r => { chain += '1:' + r + ' '; return createBasicPromise(true); })
        .then(r => { chain += '2:' + r + ' '; return createBasicPromise(true); })
        .then(r => { chain += '3:' + r; console.log('Результат цепочки:', chain); })
        .catch(err => console.log('Ошибка в цепочке:', err));
}

async function testErrorHandling() {
    console.log('Тест 3: обработка ошибок');
    try {
        await createBasicPromise(false);
        console.log('Ожидалась ошибка');
    } catch (err) {
        console.log('Ошибка перехвачена:', err);
    }

    const results = await Promise.allSettled([
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true)
    ]);
    const fulfilled = results.filter(r => r.status === 'fulfilled').length;
    const rejected = results.filter(r => r.status === 'rejected').length;
    console.log(`allSettled: выполнено ${fulfilled}, ошибок ${rejected}`);
}

async function testParallelExecution() {
    console.log('Тест 4: параллельное выполнение');
    const start = Date.now();
    await Promise.all([delayWithPromise(100), delayWithPromise(200), delayWithPromise(150)]);
    console.log('Время выполнения (ms):', Date.now() - start);

    const race = await Promise.race([
        delayWithPromise(300).then(() => 'медленно'),
        delayWithPromise(100).then(() => 'быстро')
    ]);
    console.log('Победитель race:', race);
}

async function testRetryLogic() {
    console.log('Тест 5: логика повторных попыток');
    let attempts = 0;
    const failingOp = () => {
        attempts++;
        return createBasicPromise(attempts >= 3);
    };

    try {
        const res = await retryWithBackoff(failingOp, 3);
        console.log(`Retry успешен после ${res.attempts} попыток:`, res.result);
    } catch (err) {
        console.log('Retry не удался:', err);
    }
}

async function testApiOperations() {
    console.log('Тест 6: работа с API');
    try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!resp.ok) throw new Error('HTTP error');
        const user = await resp.json();
        console.log('Пользователь получен:', user.name);
    } catch (err) {
        console.log('API тест не пройден:', err.message);
    }
}

async function runAllTests() {
    console.log('Запуск всех тестов');
    await testBasicPromise();
    await testPromiseChains();
    await testErrorHandling();
    await testParallelExecution();
    await testRetryLogic();
    await testApiOperations();
    console.log('Все тесты завершены');
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Запустить тесты';
    btn.className = 'btn';
    btn.style.marginTop = '20px';
    btn.addEventListener('click', runAllTests);
    document.querySelector('.container').appendChild(btn);
});

// Для CommonJS окружения экспортируем функции (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createBasicPromise,
        delayWithPromise,
        retryWithBackoff,
        runAllTests
    };
}
