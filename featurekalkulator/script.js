/* --- Konstanta & Variabel --- */
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    expression: ''
};

// Referensi DOM
const currentDisplay = document.getElementById('current-display');
const expressionDisplay = document.getElementById('expression-display');
const menuToggle = document.getElementById('menu-toggle');
const sidenav = document.getElementById('sidenav');
const overlay = document.getElementById('overlay');
const closeMenu = document.getElementById('close-menu');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const bodyElement = document.body;

/* ==============================
   Logika Navigasi Sidenav & Tema
   ============================== */

// Buka Menu
menuToggle.addEventListener('click', toggleMenu);
// Tutup Menu (X atau Overlay)
closeMenu.addEventListener('click', closeSidenav);
overlay.addEventListener('click', closeSidenav);

function toggleMenu() {
    sidenav.classList.toggle('active');
    overlay.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

function closeSidenav() {
    sidenav.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
}

// Inisialisasi Tema (cek localStorage)
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    bodyElement.classList.add(savedTheme);
    updateThemeButtonText(savedTheme);
});

// Ganti Tema
themeToggleBtn.addEventListener('click', () => {
    if (bodyElement.classList.contains('light-mode')) {
        changeTheme('dark-mode');
    } else {
        changeTheme('light-mode');
    }
});

function changeTheme(themeName) {
    bodyElement.classList.remove('light-mode', 'dark-mode');
    bodyElement.classList.add(themeName);
    localStorage.setItem('theme', themeName); // Simpan pilihan user
    updateThemeButtonText(themeName);
}

function updateThemeButtonText(themeName) {
    themeToggleBtn.innerText = (themeName === 'light-mode') ? 'Mode Gelap' : 'Mode Terang';
}

/* ==============================
   Logika Kalkulator
   ============================== */

// Menangani klik pada tombol
document.querySelector('.button-grid').addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button') && !target.closest('button')) {
        return;
    }

    // Jika target adalah span/icon di dalam tombol, ambil tombolnya
    const button = target.matches('button') ? target : target.closest('button');
    const { action } = button.dataset;

    if (button.classList.contains('btn-num')) {
        inputDigit(button.innerText);
        updateDisplay();
        return;
    }

    if (button.classList.contains('btn-operator')) {
        handleOperator(action);
        updateDisplay();
        return;
    }

    if (action === 'all-clear') {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (action === 'pos-neg') {
        togglePositiveNegative();
        updateDisplay();
        return;
    }

    if (action === 'percent') {
        handlePercent();
        updateDisplay();
        return;
    }

    if (action === 'equals') {
        calculateResult();
        updateDisplay();
        return;
    }
});

function updateDisplay() {
    currentDisplay.innerText = calculator.displayValue;
    expressionDisplay.innerText = calculator.expression;
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.expression = `${firstOperand} ${getOperatorSign(nextOperator)}`;
        return;
    }

    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    calculator.expression = `${calculator.firstOperand} ${getOperatorSign(nextOperator)}`;
}

// Map simbol operator untuk display
function getOperatorSign(opAction) {
    const signs = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '/'
    };
    return signs[opAction];
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
};

function calculateResult() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && !calculator.waitingForSecondOperand) {
        const result = performCalculation[operator](firstOperand, inputValue);
        
        calculator.expression = `${firstOperand} ${getOperatorSign(operator)} ${inputValue}`;
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
    }
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.expression = '';
}

function togglePositiveNegative() {
    calculator.displayValue = (parseFloat(calculator.displayValue) * -1).toString();
}

function handlePercent() {
    calculator.displayValue = (parseFloat(calculator.displayValue) / 100).toString();
}