// Валидация формы регистрации
let form = null;
let submitBtn = null;
let successMsg = null;

// Кэшируем элементы формы
function initForm() {
    form = document.getElementById('registrationForm');
    submitBtn = document.getElementById('submitBtn');
    successMsg = document.getElementById('successMessage');
    
    if (!form) {
        console.log('Форма не найдена');
        return;
    }
    
    // Навешиваем обработчики
    form.addEventListener('submit', handleFormSubmit);
    
    // Валидация на лету
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const birthInput = document.getElementById('birthDate');
    
    if (nameInput) nameInput.addEventListener('input', validateName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);
    if (phoneInput) phoneInput.addEventListener('input', validatePhone);
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword();
            updatePassMeter();
        });
    }
    if (confirmInput) confirmInput.addEventListener('input', validateConfirmPass);
    if (birthInput) birthInput.addEventListener('change', validateBirthDate);
    
    // Обработчики для радио и чекбоксов
    const courseRadios = document.querySelectorAll('input[name="course"]');
    courseRadios.forEach(radio => {
        radio.addEventListener('change', validateCourse);
    });
    
    const agreeCheckbox = document.querySelector('input[name="agreement"]');
    if (agreeCheckbox) {
        agreeCheckbox.addEventListener('change', validateAgreement);
    }
    
    // Переключение видимости пароля
    setupPassToggle();
    
    // Форматирование телефона
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneInput);
    }
}

// Отправка формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    const isValid = checkAllFields();
    
    if (isValid) {
        showSuccessState();
        disableForm();
        
        // Эмуляция отправки
        setTimeout(() => {
            form.reset();
            resetFormState();
        }, 2500);
    } else {
        focusErrorField();
    }
}

// Проверка всех полей
function checkAllFields() {
    return validateName() && 
           validateEmail() && 
           validatePhone() && 
           validatePassword() && 
           validateConfirmPass() && 
           validateCourse() && 
           validateBirthDate() && 
           validateAgreement();
}

// Валидация имени
function validateName() {
    const input = document.getElementById('fullName');
    const error = document.getElementById('fullNameError');
    const value = input.value.trim();
    
    const isValid = value.length >= 2;
    updateFieldState(input, error, isValid, 'Имя должно содержать минимум 2 символа');
    
    return isValid;
}

// Валидация email
function validateEmail() {
    const input = document.getElementById('email');
    const error = document.getElementById('emailError');
    const value = input.value.trim();
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(value);
    updateFieldState(input, error, isValid, 'Введите корректный email');
    
    return isValid;
}

// Валидация телефона
function validatePhone() {
    const input = document.getElementById('phone');
    const error = document.getElementById('phoneError');
    const value = input.value.trim();
    
    const phonePattern = /^\+7\s?[\(]?\d{3}[\)]?\s?\d{3}[\-]?\d{2}[\-]?\d{2}$/;
    const isValid = phonePattern.test(value);
    updateFieldState(input, error, isValid, 'Формат: +7 (999) 123-45-67');
    
    return isValid;
}

// Валидация пароля
function validatePassword() {
    const input = document.getElementById('password');
    const error = document.getElementById('passwordError');
    const value = input.value;
    
    const hasMinLength = value.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isValid = hasMinLength && hasLetter && hasNumber;
    
    updateFieldState(input, error, isValid, 'Минимум 8 символов, буквы и цифры');
    
    return isValid;
}

// Подтверждение пароля
function validateConfirmPass() {
    const input = document.getElementById('confirmPassword');
    const error = document.getElementById('confirmPasswordError');
    const password = document.getElementById('password').value;
    const confirm = input.value;
    
    const isValid = password === confirm && password.length > 0;
    updateFieldState(input, error, isValid, 'Пароли не совпадают');
    
    return isValid;
}

// Проверка выбора курса
function validateCourse() {
    const error = document.getElementById('courseError');
    const selected = document.querySelector('input[name="course"]:checked');
    const isValid = !!selected;
    
    if (error) {
        if (!isValid) {
            error.textContent = 'Выберите направление обучения';
            error.classList.add('show');
        } else {
            error.classList.remove('show');
        }
    }
    
    return isValid;
}

// Проверка даты рождения
function validateBirthDate() {
    const input = document.getElementById('birthDate');
    const error = document.getElementById('birthDateError');
    const value = input.value;
    
    if (!value) return true; // необязательное поле
    
    const birthDate = new Date(value);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 14);
    const isValid = birthDate <= minDate;
    
    updateFieldState(input, error, isValid, 'Минимальный возраст - 14 лет');
    
    return isValid;
}

// Соглашение
function validateAgreement() {
    const error = document.getElementById('agreementError');
    const checkbox = document.querySelector('input[name="agreement"]');
    const isValid = checkbox ? checkbox.checked : false;
    
    if (error) {
        if (!isValid) {
            error.textContent = 'Необходимо принять соглашение';
            error.classList.add('show');
        } else {
            error.classList.remove('show');
        }
    }
    
    return isValid;
}

// Обновление состояния поля
function updateFieldState(field, errorElement, isValid, errorMessage) {
    if (!field) return;
    
    // Убираем предыдущие классы
    field.classList.remove('correct', 'wrong');
    
    if (field.value.trim() === '') {
        // Поле пустое - ничего не делаем
    } else if (isValid) {
        field.classList.add('correct');
    } else {
        field.classList.add('wrong');
    }
    
    // Обновляем сообщение об ошибке
    if (errorElement) {
        if (!isValid && field.value.trim() !== '') {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            errorElement.classList.remove('show');
        }
    }
}

// Индикатор сложности пароля
function updatePassMeter() {
    const meter = document.getElementById('passwordStrength');
    const password = document.getElementById('password').value;
    
    if (!meter) return;
    
    if (!password) {
        meter.className = 'meter-fill';
        return;
    }
    
    let strength = 'low';
    if (password.length >= 12 && /[!@#$%^&*]/.test(password)) {
        strength = 'high';
    } else if (password.length >= 8) {
        strength = 'medium';
    }
    
    meter.className = `meter-fill ${strength}`;
}

// Переключение видимости пароля
function setupPassToggle() {
    const toggleBtns = document.querySelectorAll('.eye-toggle');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const wrapper = e.target.closest('.password-wrapper');
            if (!wrapper) return;
            
            const input = wrapper.querySelector('input');
            if (!input) return;
            
            // Меняем тип поля
            if (input.type === 'password') {
                input.type = 'text';
                e.target.textContent = '👁️‍🗨️';
            } else {
                input.type = 'password';
                e.target.textContent = '👁️';
            }
        });
    });
}

// Форматирование телефона
function formatPhoneInput(e) {
    const input = e.target;
    let numbers = input.value.replace(/\D/g, '');
    
    // Нормализуем начало номера
    if (numbers.startsWith('7')) {
        numbers = '+7' + numbers.substring(1);
    } else if (numbers.startsWith('8')) {
        numbers = '+7' + numbers.substring(1);
    } else if (!numbers.startsWith('+7')) {
        numbers = '+7' + numbers;
    }
    
    // Добавляем форматирование
    if (numbers.length > 2) {
        numbers = numbers.substring(0, 2) + ' (' + numbers.substring(2);
    }
    if (numbers.length > 7) {
        numbers = numbers.substring(0, 7) + ') ' + numbers.substring(7);
    }
    if (numbers.length > 12) {
        numbers = numbers.substring(0, 12) + '-' + numbers.substring(12);
    }
    if (numbers.length > 15) {
        numbers = numbers.substring(0, 15) + '-' + numbers.substring(15);
    }
    
    input.value = numbers;
}

// Показать успех
function showSuccessState() {
    if (successMsg) {
        successMsg.classList.add('show');
    }
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправлено!';
    }
}

// Отключить форму
function disableForm() {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = true;
    });
    // Кнопку отправки оставляем активной для визуала
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

// Фокус на первую ошибку
function focusErrorField() {
    const firstError = form.querySelector('.wrong');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

// Сброс состояния формы
function resetFormState() {
    // Сбрасываем классы полей
    const fields = form.querySelectorAll('.text-input, .select-input, .textarea-input');
    fields.forEach(field => {
        field.classList.remove('correct', 'wrong');
    });
    
    // Скрываем сообщения об ошибках
    const errors = form.querySelectorAll('.problem-text');
    errors.forEach(error => {
        error.classList.remove('show');
    });
    
    // Сбрасываем успешное сообщение
    if (successMsg) {
        successMsg.classList.remove('show');
    }
    
    // Восстанавливаем кнопку
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зарегистрироваться на курс';
    }
    
    // Сбрасываем индикатор пароля
    const passMeter = document.getElementById('passwordStrength');
    if (passMeter) {
        passMeter.className = 'meter-fill';
    }
    
    // Включаем все поля обратно
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initForm);