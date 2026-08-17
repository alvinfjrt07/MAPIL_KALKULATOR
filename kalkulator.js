(function () {
  const state = {
    firstNumber: null,
    operator: null,
    waitingForSecondNumber: false,
    displayValue: "0",
  };

  function formatResult(value) {
    if (!Number.isFinite(value)) {
      return "Error";
    }

    const fixedValue = Number.parseFloat(value.toFixed(10));
    return String(fixedValue);
  }

  function updateDisplay(value) {
    state.displayValue = value;

    if (typeof document !== "undefined") {
      const display = document.getElementById("display");
      if (display) {
        display.value = value;
      }
    }
  }

  function clearAll() {
    state.firstNumber = null;
    state.operator = null;
    state.waitingForSecondNumber = false;
    updateDisplay("0");
  }

  function deleteLastCharacter() {
    if (state.displayValue === "Error") {
      clearAll();
      return;
    }

    if (state.waitingForSecondNumber) {
      state.waitingForSecondNumber = false;
      updateDisplay(String(state.firstNumber ?? "0"));
      return;
    }

    if (state.displayValue.length <= 1) {
      updateDisplay("0");
      return;
    }

    const newValue = state.displayValue.slice(0, -1);
    updateDisplay(newValue);
  }

  function calculateExpression(numberOne, numberTwo, selectedOperator) {
    switch (selectedOperator) {
      case "+":
        return numberOne + numberTwo;
      case "-":
        return numberOne - numberTwo;
      case "*":
        return numberOne * numberTwo;
      case "/":
        if (numberTwo === 0) {
          return "Error";
        }
        return numberOne / numberTwo;
      default:
        return numberTwo;
    }
  }

  function handleNumber(value) {
    if (state.displayValue === "Error") {
      clearAll();
    }

    if (state.waitingForSecondNumber) {
      updateDisplay(value);
      state.waitingForSecondNumber = false;
      return;
    }

    if (state.displayValue === "0") {
      updateDisplay(value);
      return;
    }

    updateDisplay(state.displayValue + value);
  }

  function handleDecimal() {
    if (state.displayValue === "Error") {
      clearAll();
    }

    if (state.waitingForSecondNumber) {
      updateDisplay("0.");
      state.waitingForSecondNumber = false;
      return;
    }

    if (!state.displayValue.includes(".")) {
      updateDisplay(state.displayValue + ".");
    }
  }

  function handleOperator(nextOperator) {
    const currentValue = Number(state.displayValue);

    if (state.operator && state.waitingForSecondNumber) {
      state.operator = nextOperator;
      return;
    }

    if (state.firstNumber === null) {
      state.firstNumber = currentValue;
    } else if (state.operator) {
      const result = calculateExpression(
        state.firstNumber,
        currentValue,
        state.operator,
      );

      if (result === "Error") {
        clearAll();
        updateDisplay("Error");
        return;
      }

      state.firstNumber = result;
      updateDisplay(formatResult(result));
    }

    state.operator = nextOperator;
    state.waitingForSecondNumber = true;
  }

  function handleEqual() {
    if (state.operator === null || state.firstNumber === null) {
      return;
    }

    const currentValue = Number(state.displayValue);
    const result = calculateExpression(
      state.firstNumber,
      currentValue,
      state.operator,
    );

    if (result === "Error") {
      clearAll();
      updateDisplay("Error");
      return;
    }

    const formattedResult = formatResult(result);
    updateDisplay(formattedResult);
    state.firstNumber = Number(formattedResult);
    state.operator = null;
    state.waitingForSecondNumber = false;
  }

  if (typeof document !== "undefined") {
    const numberButtons = document.querySelectorAll(".number");
    const operatorButtons = document.querySelectorAll(".operator");
    const clearButton = document.querySelector('[data-action="clear"]');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const equalButton = document.querySelector('[data-action="calculate"]');
    const decimalButton = document.querySelector(".number[data-value='.' ]");

    numberButtons.forEach((button) => {
      button.addEventListener("click", () => {
        handleNumber(button.dataset.value);
      });
    });

    operatorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        handleOperator(button.dataset.value);
      });
    });

    clearButton.addEventListener("click", clearAll);
    deleteButton.addEventListener("click", deleteLastCharacter);
    equalButton.addEventListener("click", handleEqual);

    if (decimalButton) {
      decimalButton.addEventListener("click", handleDecimal);
    }
  }

  if (typeof module !== "undefined") {
    module.exports = {
      clearAll,
      deleteLastCharacter,
      calculateExpression,
      formatResult,
      handleNumber,
      handleDecimal,
      handleOperator,
      handleEqual,
      state,
    };
  }
})();
