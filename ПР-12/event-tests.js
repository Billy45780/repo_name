// Простые тесты для проверки работы функций обработки событий
// Тесты запускаются автоматически и показывают результаты в консоли

// Функция для проверки условий и вывода результатов
function checkCondition(condition, description) {
  if (!condition) {
    console.error('❌ ОШИБКА:', description);
  } else {
    console.log('✅ УСПЕХ:', description);
  }
}

// Основная функция запуска тестов
function runAllTests() {
  console.group('🧪 Тестирование функций обработки событий');
  
  // Проверяем, что все основные функции доступны
  checkCondition(
    window._eventTasks && typeof window._eventTasks.setupBasicEvents === 'function',
    'Функция setupBasicEvents доступна для использования'
  );
  
  checkCondition(
    typeof window._eventTasks.createDebounce === 'function',
    'Функция createDebounce доступна для использования'
  );
  
  checkCondition(
    typeof window._eventTasks.createThrottle === 'function',
    'Функция createThrottle доступна для использования'
  );

  // Тестируем добавление новых элементов в список
  const itemsContainer = document.getElementById('item-list');
  const startItemsCount = itemsContainer.querySelectorAll('.item').length;
  window._eventTasks.addNewItem();
  const newItemsCount = itemsContainer.querySelectorAll('.item').length;
  
  checkCondition(
    newItemsCount === startItemsCount + 1,
    `Добавление элемента: было ${startItemsCount}, стало ${newItemsCount}`
  );

  // Тестируем работу функции debounce
  let debounceCounter = 0;
  const debounceTest = window._eventTasks.createDebounce(() => {
    debounceCounter++;
  }, 50);
  
  // Вызываем функцию несколько раз подряд
  debounceTest();
  debounceTest();
  debounceTest();
  
  // Проверяем результат после задержки
  setTimeout(() => {
    checkCondition(
      debounceCounter === 1,
      `Debounce: функция вызвана ${debounceCounter} раз вместо множественных вызовов`
    );
  }, 200);

  // Тестируем работу функции throttle
  let throttleCounter = 0;
  const throttleTest = window._eventTasks.createThrottle(() => {
    throttleCounter++;
  }, 80);
  
  // Вызываем функцию несколько раз подряд
  throttleTest();
  throttleTest();
  throttleTest();
  
  // Проверяем результат после небольшой задержки
  setTimeout(() => {
    checkCondition(
      throttleCounter >= 1 && throttleCounter <= 3,
      `Throttle: функция вызвана ${throttleCounter} раз (ожидается 1-3 вызова)`
    );
  }, 200);

  console.groupEnd();
}

// Запускаем тесты после полной загрузки страницы
window.addEventListener('load', () => {
  // Даем странице немного времени на полную загрузку
  setTimeout(runAllTests, 500);
});