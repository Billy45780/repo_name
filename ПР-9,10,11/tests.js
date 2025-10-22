// Набор простых тестов, проверяющих основные функции

function runTests() {
    console.log('Тесты: запускаю...');

    testAlgorithms();
    testFunctions();
    testDOMLogic();

    console.log('Тесты: готово');
}

function testAlgorithms() {
    console.log(' — тестируем algorithms.js');

    const sample = [
        { title: 'a', priority: 'low', createdAt: '2024-01-01', description: '' },
        { title: 'b', priority: 'high', createdAt: '2024-01-03', description: 'x' },
        { title: 'c', priority: 'medium', createdAt: '2024-01-02', description: 'y' }
    ];

    const sorted = sortTasks(sample, 'priority');
    console.assert(sorted[0].priority === 'high', 'сортировка по приоритету');

    const found = searchTasks(sample, 'a');
    console.assert(found.length === 1, 'поиск');

    const stats = calculateTaskStats(sample);
    console.assert(stats.total === 3, 'статистика');

    console.log(' — algorithms.js OK');
}

function testFunctions() {
    console.log(' — тестируем functions.js');

    const add = (a,b,c) => a + b + c;
    const cur = curry(add);
    console.assert(cur(1)(2)(3) === 6, 'curry');

    let count = 0;
    const memoFn = memoize(x => { count++; return x * 2; });
    memoFn(5); memoFn(5);
    console.assert(count === 1, 'memoize');

    const validator = createTaskValidator({ requiredTitle: true, minTitleLength: 3 });
    const errs = validator({ title: 'ab' });
    console.assert(errs && errs.title, 'валидатор');

    console.log(' — functions.js OK');
}

function testDOMLogic() {
    console.log(' — тестируем логику задач (редьюсер и др.)');

    const init = [];
    const state1 = tasksReducer(init, { type: 'ADD_TASK', task: { id: '1', title: 'T' } });
    console.assert(state1.length === 1, 'добавление');

    const state2 = tasksReducer(state1, { type: 'TOGGLE_TASK', taskId: '1' });
    console.assert(state2[0].completed === true, 'переключение');

    console.log(' — dom logic OK');
}

// В браузере сделать глобальную функцию для запуска вручную
if (typeof window !== 'undefined') {
    window.runTests = runTests;
} else {
    runTests();
}
