document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  let currentDisplay = "0";
  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;

  function clearDisplay() {
    currentDisplay = "0";
    updateDisplay();
  }

  function updateDisplay() {
    display.value = parseFloat(currentDisplay).toLocaleString();
  }

  function appendNumber(number) {
    if (waitingForSecondOperand) {
      currentDisplay = number;
      waitingForSecondOperand = false;
    } else {
      currentDisplay = currentDisplay === "0" ? number : currentDisplay + number;
    }
    limitDigits(10);
    updateDisplay();
  }

  function appendOperator(op) {
    operator = op;
    firstOperand = parseFloat(currentDisplay);
    waitingForSecondOperand = true;
  }

  function appendDecimal() {
    if (!currentDisplay.includes(".")) {
      currentDisplay += ".";
    }
    limitDigits(10);
    updateDisplay();
  }

  function calculate() {
    if (operator === null || waitingForSecondOperand) {
      return;
    }

    const secondOperand = parseFloat(currentDisplay);
    let result = 0;

    switch (operator) {
      case "+":
        result = firstOperand + secondOperand;
        break;
      case "-":
        result = firstOperand - secondOperand;
        break;
      case "*":
        result = firstOperand * secondOperand;
        break;
      case "/":
        result = firstOperand / secondOperand;
        break;
      case "%":
        result = firstOperand % secondOperand;
        break;
      default:
        return;
    }

    currentDisplay = result.toString();
    operator = null;
    firstOperand = result;
    waitingForSecondOperand = false;
    updateDisplay();
  }

  function toggleSign() {
    currentDisplay = (parseFloat(currentDisplay) * -1).toString();
    limitDigits(10);
    updateDisplay();
  }

  function limitDigits(maxDigits) {
    if (currentDisplay.length > maxDigits) {
      currentDisplay = currentDisplay.slice(0, maxDigits);
    }
  }

  function handleButtonAction(button) {
    const buttonValue = button.dataset.value;
    const buttonType = button.dataset.type;

    if (buttonType === "number") {
      appendNumber(buttonValue);
    } else if (buttonType === "operator" && buttonValue === "+/-") {
      toggleSign();
    } else if (buttonType === "operator") {
      appendOperator(buttonValue);
    } else if (buttonType === "decimal") {
      appendDecimal();
    } else if (buttonType === "calculate") {
      calculate();
    } else if (buttonType === "clear") {
      clearDisplay();
    }
  }

  document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", () => {
      handleButtonAction(button);
    });
  });

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  function handleKeyDown(event) {
    const key = event.key;

    if (key === "Backspace") {
      event.preventDefault(); // Impede o comportamento padrão do Backspace
      clearDisplay();
    } else if (/^\d/.test(key)) {
      appendNumber(key);
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) {
        button.classList.add("active");
      }
    } else if (/[\+\-\*\/]/.test(key)) {
      appendOperator(key);
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) {
        button.classList.add("active");
      }
    } else if (key === ".") {
      appendDecimal();
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) {
        button.classList.add("active");
      }
    } else if (key === "Enter" || key === "=") {
      event.preventDefault(); // Impede o comportamento padrão do Enter
      calculate();
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) {
        button.classList.add("active");
      }
    } else if (key === "Escape" || key === "Esc") {
      clearDisplay();
      const button = document.querySelector(`button[data-value="${key}"]`);
      if (button) {
        button.classList.add("active");
      }
    }
  }

  function handleKeyUp(event) {
    const key = event.key;
    const button = document.querySelector(`button[data-value="${key}"]`);
    if (button) {
      button.classList.remove("active");
    }
  }
});
