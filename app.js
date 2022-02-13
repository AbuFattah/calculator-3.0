function Calculator(topDisplayElement, bottomDisplayElement) {
  this.topDisplayElement = topDisplayElement;
  this.bottomDisplayElement = bottomDisplayElement;
  this.previousOperand = "";
  this.currentOperand = "";
  this.operator = null;
  this.displayPreviousCalculation = "";
  this.isEqualsBtnClicked = false;
  this.previousCalculations = [];
  this.powerOfXOperation = new Set(["1/x", "x^2", "x^1/2"]);
}

Calculator.prototype = {
  appendNumber: function (number) {
    if (this.currentOperand.includes(".") && number == ".") return;
    this.currentOperand = this.currentOperand + number;
  },
  updateDisplay: function () {
    if (this.isEqualsBtnClicked) {
      this.topDisplayElement.innerText = this.displayPreviousCalculation;
    } else if (this.operator == null) {
      this.topDisplayElement.innerText = "";
    } else {
      this.topDisplayElement.innerText = `${this.previousOperand} ${this.operator}`;
    }
    this.bottomDisplayElement.innerText = this.currentOperand;
  },
  chooseOperation: function (operator) {
    if (this.currentOperand == "") {
      this.operator = operator;
      return;
    }
    if (this.previousOperand) {
      this.compute();
    }
    this.previousOperand = this.currentOperand;
    this.operator = operator;
    this.currentOperand = "";
  },
  choosePowerOfXOperation(operator) {
    if (this.currentOperand == "") return;
    // this.computePowerOfX();
  },
  compute() {
    if (this.previousOperand == "" || this.currentOperand == "") return;

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(current) || isNaN(prev)) throw new Error("invalid parsing");

    let result;
    switch (this.operator) {
      case "+": {
        result = prev + current;
        break;
      }
      case "-": {
        result = prev - current;
        break;
      }
      case "/": {
        result = prev / current;
        break;
      }
      case "*": {
        result = prev * current;
        break;
      }
    }
    if (this.isEqualsBtnClicked) {
      this.displayPreviousCalculation = `${this.previousOperand} ${this.operator} ${this.currentOperand} =`;
    }
    this.currentOperand = result;
    this.operator = null;
    this.previousOperand = "";
  },
  computePowerOfX() {},

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operator = null;
  },
  clearEvent() {
    this.currentOperand = "";
  },
  delete() {},
};

//All selectors

const numberBtns = document.querySelectorAll("[data-number]");
const operationBtns = document.querySelectorAll("[data-operator]");

const powerOfXOperationBtns = document.querySelectorAll("[data-power-of-x]");
const deleteBtn = document.querySelector("[data-delete]");
const clearBtn = document.querySelector("[data-clear]");
const clearEventBtn = document.querySelector("[data-clear-event]");
const topDisplayElement = document.querySelector(".display-top");
const bottomDisplayElement = document.querySelector(".display-bottom");
const equalsBtn = document.querySelector("[data-equals]");

const calculator = new Calculator(topDisplayElement, bottomDisplayElement);
numberBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    calculator.appendNumber(btn.innerText);
    calculator.updateDisplay();
  });
});

operationBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    calculator.chooseOperation(btn.innerText);
    calculator.updateDisplay();
  });
});
powerOfXOperationBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    calculator.choosePowerOfXOperation(btn.innerText);
    calculator.computePowerOfX();
    calculator.updateDisplay();
  });
});

equalsBtn.addEventListener("click", (e) => {
  calculator.isEqualsBtnClicked = true;
  calculator.compute();
  calculator.updateDisplay();
  calculator.isEqualsBtnClicked = false;
});

clearBtn.addEventListener("click", (e) => {
  calculator.clear();
  calculator.updateDisplay();
});

clearEventBtn.addEventListener("click", (e) => {
  calculator.clearEvent();
  calculator.updateDisplay();
});
