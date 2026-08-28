// Navigasi Tab (Kalkulator, Pengonversi, BMI)
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`view-${tabName}`).classList.add('active');
    
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.getAttribute('onclick').includes(tabName)
    );
    if (activeBtn) activeBtn.classList.add('active');
}

// Fitur Kalkulator Standard
let expression = "12 + 24 × 3";
let result = "84";

function updateCalcDisplay() {
    document.getElementById('calc-expression').innerText = expression;
    document.getElementById('calc-result').innerText = result;
}

function appendNum(num) {
    if (expression === "0") expression = "";
    expression += num;
    updateCalcDisplay();
}

function appendOperator(op) {
    expression += ` ${op} `;
    updateCalcDisplay();
}

function clearCalc() {
    expression = "";
    result = "0";
    updateCalcDisplay();
}

function toggleSign() {
    if (expression.startsWith('-')) {
        expression = expression.slice(1);
    } else {
        expression = '-' + expression;
    }
    updateCalcDisplay();
}

function calculateResult() {
    try {
        let parsedExp = expression.replace(/×/g, '*').replace(/÷/g, '/');
        result = eval(parsedExp);
    } catch (e) {
        result = "Error";
    }
    updateCalcDisplay();
}

// Fitur BMI
function calculateBMI() {
    const heightCm = parseFloat(document.getElementById('height-input').value);
    const weightKg = parseFloat(document.getElementById('weight-input').value);

    if (heightCm > 0 && weightKg > 0) {
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);
        
        document.getElementById('bmi-value').innerText = bmi;

        const statusEl = document.getElementById('bmi-status');
        const descEl = document.getElementById('bmi-desc');

        if (bmi < 18.5) {
            statusEl.innerText = "Kurus";
            statusEl.className = "result-status label-kurus";
            descEl.innerText = "Berat badan Anda kurang.";
        } else if (bmi <= 24.9) {
            statusEl.innerText = "Normal";
            statusEl.className = "result-status status-green";
            descEl.innerText = "Berat badan Anda ideal.";
        } else if (bmi <= 29.9) {
            statusEl.innerText = "Overweight";
            statusEl.className = "result-status label-overweight";
            descEl.innerText = "Berat badan Anda berlebih.";
        } else {
            statusEl.innerText = "Obesitas";
            statusEl.className = "result-status label-obesitas";
            descEl.innerText = "Anda berada dalam kategori obesitas.";
        }
    }
}

// Fitur Pengonversi Mata Uang
const rateUsdToIdr = 17649.80;

function convInput(val) {
    const usdInput = document.getElementById('usd-val');
    if (usdInput.value === "0") usdInput.value = "";
    usdInput.value += val;
    updateCurrency();
}

function convBackspace() {
    const usdInput = document.getElementById('usd-val');
    usdInput.value = usdInput.value.slice(0, -1);
    if (usdInput.value === "") usdInput.value = "0";
    updateCurrency();
}

function updateCurrency() {
    const usdVal = parseFloat(document.getElementById('usd-val').value) || 0;
    const idrVal = usdVal * rateUsdToIdr;
    document.getElementById('idr-val').value = idrVal.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Fitur Popup Modal Log In / Sign Up
function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function toggleAuthForm(mode) {
    if (mode === 'signup') {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('signup-section').classList.remove('hidden');
    } else {
        document.getElementById('signup-section').classList.add('hidden');
        document.getElementById('login-section').classList.remove('hidden');
    }
}

function handleAuthSubmit(event) {
    event.preventDefault();
    alert("Berhasil!");
    closeAuthModal();
}