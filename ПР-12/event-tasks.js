// Переменные для работы таймера и создания новых элементов
let timerInterval;
let timerValue = 0;
let nextItemId = 4;

// Задание 1: Работа с кликами и движением мыши
function handleBasicClick(event) {
  const outputElement = document.getElementById('basic-output');
  const clickedButton = event.currentTarget;
  
  const eventType = event.type;
  const clientCoords = `(${event.clientX}, ${event.clientY})`;
  const pageCoords = `(${event.pageX}, ${event.pageY})`;
  const targetElement = event.target.tagName;
  
  outputElement.textContent = `Тип: ${eventType} | Экран: ${clientCoords} | Страница: ${pageCoords} | Элемент: ${targetElement}`;
  
  clickedButton.classList.add('pulse');
  setTimeout(() => {
    clickedButton.classList.remove('pulse');
  }, 500);
}

function handleMouseEvents(event) {
  const colorBox = event.currentTarget;
  const coordinatesOutput = document.getElementById('mouse-output');
  
  if (event.type === 'mouseenter') {
    colorBox.style.background = '#e74c3c';
  } else if (event.type === 'mouseleave') {
    colorBox.style.background = '#3498db';
    coordinatesOutput.textContent = 'Координаты мыши: —';
  } else if (event.type === 'mousemove') {
    coordinatesOutput.textContent = `Координаты мыши: ${event.offsetX}, ${event.offsetY}`;
  }
}

function setupBasicEvents() {
  const mainButton = document.getElementById('basic-btn');
  const interactiveBox = document.getElementById('color-box');
  
  mainButton.addEventListener('click', handleBasicClick);
  interactiveBox.addEventListener('mouseenter', handleMouseEvents);
  interactiveBox.addEventListener('mouseleave', handleMouseEvents);
  interactiveBox.addEventListener('mousemove', handleMouseEvents);
}

// Задание 2: Обработка нажатий клавиш
function handleKeyEvents(event) {
  const outputElement = document.getElementById('key-output');
  const keyName = event.key;
  const keyCode = event.code;
  const ctrlPressed = event.ctrlKey;
  const altPressed = event.altKey;
  const shiftPressed = event.shiftKey;
  const eventType = event.type;
  
  let message = `Событие: ${eventType} | Клавиша: ${keyName} | Код: ${keyCode}`;
  message += ` | Ctrl:${ctrlPressed} Alt:${altPressed} Shift:${shiftPressed}`;

  if (event.type === 'keydown') {
    if (ctrlPressed && keyName.toLowerCase() === 's') {
      event.preventDefault();
      message += ' — Сохранение заблокировано (Ctrl+S)';
    }
    if (altPressed && keyName.toLowerCase() === 'c') {
      event.preventDefault();
      message += ' — Комбинация Alt+C отключена';
    }
    if (shiftPressed && keyName.toLowerCase() === 'a') {
      event.preventDefault();
      message += ' — Нажатие Shift+A перехвачено';
    }
  }
  
  outputElement.textContent = message;
}

function setupKeyboardEvents() {
  const textInput = document.getElementById('key-input');
  
  textInput.addEventListener('keydown', handleKeyEvents);
  
  textInput.addEventListener('keyup', () => {
    const outputElement = document.getElementById('key-output');
    outputElement.textContent += ' | Клавиша отпущена';
  });
}

// Задание 3: Управление списком через делегирование
function handleDelegationClick(event) {
  const itemsContainer = document.getElementById('item-list');
  const statusOutput = document.getElementById('delegation-output');
  const clickedElement = event.target.closest('.item');
  
  if (!clickedElement || !itemsContainer.contains(clickedElement)) {
    return;
  }

  if (event.target.classList.contains('delete')) {
    clickedElement.remove();
  } else {
    clickedElement.classList.toggle('selected');
  }

  const selectedItems = Array.from(itemsContainer.querySelectorAll('.item.selected'));
  const selectedIds = selectedItems.map(item => item.dataset.id || item.textContent.trim());
  
  if (selectedIds.length > 0) {
    statusOutput.textContent = `Выбраны: ${selectedIds.join(', ')}`;
  } else {
    statusOutput.textContent = 'Выбраны: —';
  }
}

function addNewItem() {
  const itemsContainer = document.getElementById('item-list');
  const newListItem = document.createElement('li');
  
  newListItem.className = 'item';
  newListItem.dataset.id = String(nextItemId);
  newListItem.innerHTML = `Модуль ${nextItemId} <button class="delete">✖</button>`;
  
  itemsContainer.appendChild(newListItem);
  nextItemId++;
}

function setupDelegationEvents() {
  const itemsContainer = document.getElementById('item-list');
  const addButton = document.getElementById('add-item-btn');
  
  itemsContainer.addEventListener('click', handleDelegationClick);
  addButton.addEventListener('click', addNewItem);
}

// Задание 4: Блокировка стандартного поведения
function preventLinkDefault(event) {
  event.preventDefault();
  const statusOutput = document.getElementById('prevention-output');
  const clickedLink = event.currentTarget;
  
  statusOutput.textContent = `Переход по ссылке заблокирован: ${clickedLink.href}`;
  
  clickedLink.classList.add('shake');
  setTimeout(() => {
    clickedLink.classList.remove('shake');
  }, 600);
}

function preventFormSubmit(event) {
  event.preventDefault();
  const statusOutput = document.getElementById('prevention-output');
  const submittedForm = event.currentTarget;
  const nameInput = submittedForm.querySelector('input[name="name"]');
  const enteredName = (nameInput.value || '').trim();
  
  if (!enteredName) {
    statusOutput.textContent = 'Ошибка: необходимо указать имя';
    return;
  }
  
  statusOutput.textContent = `Данные формы: имя=${enteredName}`;
}

function setupPreventionEvents() {
  const testLink = document.getElementById('prevent-link');
  const testForm = document.getElementById('prevent-form');
  
  testLink.addEventListener('click', preventLinkDefault);
  testForm.addEventListener('submit', preventFormSubmit);
}

// Задание 5: Создание и обработка пользовательских событий
function triggerCustomEvent() {
  const eventData = { 
    message: 'Привет от кастомного события!', 
    time: Date.now() 
  };
  
  const customEvent = new CustomEvent('customAction', { 
    detail: eventData, 
    bubbles: true, 
    cancelable: true 
  });
  
  document.dispatchEvent(customEvent);
}

function handleCustomEvent(event) {
  const outputElement = document.getElementById('custom-output');
  const triggerButton = document.getElementById('trigger-custom');
  const eventMessage = event.detail?.message;
  const eventTime = event.detail?.time;
  
  outputElement.textContent = `Получено: ${eventMessage} в ${new Date(eventTime).toLocaleTimeString()}`;
  
  triggerButton.classList.add('pulse');
  setTimeout(() => {
    triggerButton.classList.remove('pulse');
  }, 500);
}

function setupMultipleListeners() {
  function firstListener(event) { 
    console.log('Первый обработчик:', event.detail.message);
    document.getElementById('custom-output').textContent = 'Первый обработчик: ' + event.detail.message;
  }
  
  function secondListener(event) { 
    console.log('Второй обработчик:', event.detail.time);
  }
  
  function thirdListener(event) { 
    alert('Кастомное событие: ' + event.detail.message);
  }
  
  document.addEventListener('customAction', firstListener, { once: true });
  document.addEventListener('customAction', secondListener);
  document.addEventListener('customAction', thirdListener, { once: true });
}

function setupCustomEvents() {
  document.addEventListener('customAction', handleCustomEvent);
  document.getElementById('trigger-custom').addEventListener('click', triggerCustomEvent);
  document.getElementById('multiple-listeners').addEventListener('click', setupMultipleListeners);
}

// Задание 6: Отслеживание загрузки ресурсов
function loadImageWithEvents() {
  const statusOutput = document.getElementById('loading-output');
  const imageContainer = document.getElementById('image-wrap');
  
  imageContainer.innerHTML = '';
  const newImage = new Image();
  
  newImage.addEventListener('loadstart', () => {
    statusOutput.textContent = 'loadstart: начинаем загрузку...';
  });
  
  newImage.addEventListener('load', () => {
    statusOutput.textContent = 'load: изображение загружено';
    imageContainer.appendChild(newImage);
  });
  
  newImage.addEventListener('error', () => {
    statusOutput.textContent = 'error: не удалось загрузить изображение';
  });
  
  newImage.addEventListener('loadend', () => {
    statusOutput.textContent += ' | loadend';
  });
  
  newImage.src = 'https://picsum.photos/300/200?random=' + Date.now();
}

function simulateLoadError() {
  const statusOutput = document.getElementById('loading-output');
  const imageContainer = document.getElementById('image-wrap');
  
  imageContainer.innerHTML = '';
  const testImage = new Image();
  
  testImage.addEventListener('error', () => {
    statusOutput.textContent = 'Симуляция: ошибка загрузки подтверждена';
  });
  
  testImage.src = 'https://example.com/this-image-does-not-exist-' + Date.now() + '.png';
}

function setupLoadingEvents() {
  document.getElementById('load-image').addEventListener('click', loadImageWithEvents);
  document.getElementById('load-error').addEventListener('click', simulateLoadError);
}

// Задание 7: Таймеры и оптимизация производительности
function startTimer() {
  const timerDisplay = document.getElementById('timer-output');
  
  if (timerInterval) {
    return;
  }
  
  timerInterval = setInterval(() => {
    timerValue++;
    const minutes = String(Math.floor(timerValue / 60)).padStart(2, '0');
    const seconds = String(timerValue % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerValue = 0;
  document.getElementById('timer-output').textContent = '00:00';
}

function createDebounce(func, delay) {
  let timeoutId = null;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function createThrottle(func, interval) {
  let lastExecution = 0;
  
  return function(...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecution >= interval) {
      lastExecution = currentTime;
      func.apply(this, args);
    }
  };
}

function testDebounce() {
  const outputElement = document.getElementById('async-output');
  outputElement.textContent = 'Тест debounce: ';
  let executionCount = 0;
  
  function countExecution() {
    executionCount++;
    outputElement.textContent = 'Debounced calls: ' + executionCount;
  }
  
  const debouncedFunction = createDebounce(countExecution, 500);
  
  for (let i = 0; i < 6; i++) {
    setTimeout(debouncedFunction, i * 100);
  }
}

function testThrottle() {
  const outputElement = document.getElementById('async-output');
  outputElement.textContent = 'Тест throttle: ';
  let executionCount = 0;
  
  function countExecution() {
    executionCount++;
    outputElement.textContent = 'Throttled calls: ' + executionCount;
  }
  
  const throttledFunction = createThrottle(countExecution, 400);
  
  for (let i = 0; i < 8; i++) {
    setTimeout(throttledFunction, i * 100);
  }
}

function setupTimerEvents() {
  document.getElementById('start-timer').addEventListener('click', startTimer);
  document.getElementById('stop-timer').addEventListener('click', stopTimer);
  document.getElementById('debounce-btn').addEventListener('click', testDebounce);
  document.getElementById('throttle-btn').addEventListener('click', testThrottle);
}

// Инициализация приложения
function initializeApplication() {
  setupBasicEvents();
  setupKeyboardEvents();
  setupDelegationEvents();
  setupPreventionEvents();
  setupCustomEvents();
  setupLoadingEvents();
  setupTimerEvents();
}

document.addEventListener('DOMContentLoaded', initializeApplication);

// Экспорт функций для тестирования
window._eventTasks = {
  handleBasicClick,
  handleMouseEvents,
  setupBasicEvents,
  handleKeyEvents,
  setupKeyboardEvents,
  handleDelegationClick,
  addNewItem,
  setupDelegationEvents,
  preventLinkDefault,
  preventFormSubmit,
  setupPreventionEvents,
  triggerCustomEvent,
  handleCustomEvent,
  setupCustomEvents,
  setupMultipleListeners,
  loadImageWithEvents,
  simulateLoadError,
  setupLoadingEvents,
  startTimer,
  stopTimer,
  createDebounce,
  createThrottle,
  testDebounce,
  testThrottle,
  setupTimerEvents
};