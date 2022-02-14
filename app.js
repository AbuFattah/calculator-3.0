function Calculator(
  topDisplayElement,
  bottomDisplayElement,
  historyItemsElement
) {
  this.topDisplayElement = topDisplayElement;
  this.bottomDisplayElement = bottomDisplayElement;
  this.historyItemsElement = historyItemsElement;
  this.clear();
  // this.isEqualsBtnClicked = false;
  // this.isPowerOfXOperationBtnClicked = false;
  this.previousCalculations = [];
  this.powerOfXOperation = new Set(["1/x", "x^2", "x^1/2"]);
}

Calculator.prototype = {
  appendNumber: function (number) {
    if (this.currentOperand.includes(".") && number == ".") return;
    this.currentOperand = this.currentOperand + number;
  },
  updateDisplay: function () {
    if (this.displayPreviousCalculation != "") {
      this.topDisplayElement.innerText = this.displayPreviousCalculation;
      this.displayPreviousCalculation = "";
    } else if (this.normalOperator == null) {
      this.topDisplayElement.innerText = "";
    } else {
      this.topDisplayElement.innerText = `${this.displayNumber(
        this.previousOperand
      )} ${this.normalOperator}`;
    }
    this.bottomDisplayElement.innerText = this.displayNumber(
      this.currentOperand
    );
  },
  chooseOperation: function (operator) {
    if (this.currentOperand == "") {
      this.normalOperator = operator;
      return;
    }
    if (this.previousOperand) {
      this.compute();
    }
    this.previousOperand = this.currentOperand;
    this.normalOperator = operator;
    this.currentOperand = "";
  },
  chooseSingleOperandOperation(operator) {
    if (this.currentOperand == "") return;
    this.singleOperandOperator = operator;
    this.computeSinglOperand();
    // this.normalOperator = null;
  },
  addExpressionToHistory(expressionObj) {
    const historyItem = document.createElement("div");
    historyItem.className = "history__item";
    if (expressionObj.expression.includes("=")) {
      historyItem.innerText = `${expressionObj.expression} ${expressionObj.result}`;
    } else {
      historyItem.innerText = `${expressionObj.expression} = ${expressionObj.result}`;
    }
    this.historyItemsElement.appendChild(historyItem);
    if (
      this.historyItemsElement.clientHeight >
      this.historyItemsElement.parentElement.clientHeight / 1.3
    ) {
      this.historyItemsElement.style.scrollbarWidth = "thin";
      this.historyItemsElement.style.overflowY = "scroll";
      console.log("hello");
    }
  },
  computeSinglOperand() {
    let result;
    let current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    let previous = parseFloat(this.previousOperand);
    switch (this.singleOperandOperator) {
      case "1/x": {
        result = 1 / current;
        this.displayPreviousCalculation = `1/${current} =`;
        if (previous) {
          result = eval(`${previous} ${this.normalOperator} ${result}`);
          this.displayPreviousCalculation = `${previous} ${this.normalOperator} 1/${current} =`;
        }
        break;
      }
      case "%": {
        result = current / 100;
        this.displayPreviousCalculation = `${current}% =`;
        if (previous) {
          result = eval(`${previous} ${this.normalOperator} ${result}`);
          this.displayPreviousCalculation = `${previous} ${this.normalOperator} ${current}% =`;
        }
        break;
      }
      case "x^2": {
        result = current ** 2;
        this.displayPreviousCalculation = `sqr(${current}) =`;
        if (previous) {
          result = eval(`${previous} ${this.normalOperator} ${result}`);
          this.displayPreviousCalculation = `${previous} ${this.normalOperator} sqr(${current}) =`;
        }
        break;
      }
      case "x^1/2": {
        result = Math.sqrt(current);
        this.displayPreviousCalculation = `sqrt(${current}) =`;
        if (previous) {
          result = eval(`${previous} ${this.normalOperator} ${result}`);
          this.displayPreviousCalculation = `${previous} ${this.normalOperator} sqrt(${current}) =`;
        }
        break;
      }
      default: {
        return;
      }
    }
    this.currentOperand = result.toString();
    this.previousOperand = "";
    this.singleOperandOperator = null;
    this.normalOperator = null;
    this.addExpressionToHistory({
      expression: this.displayPreviousCalculation,
      result: result.toString(),
    });
  },
  displayNumber(num) {
    if (num == "") return "";
    let integerDigitsStr = num.split(".")[0];
    let decimalDigits = num.split(".")[1];
    let integerDigits = parseInt(integerDigitsStr).toLocaleString("en");
    if (decimalDigits == undefined) return integerDigits;
    return `${integerDigits}.${decimalDigits}`;
  },
  compute() {
    if (this.previousOperand == "" || this.currentOperand == "") return;

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(current) || isNaN(prev)) throw new Error("invalid parsing");

    let result;
    switch (this.normalOperator) {
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
      this.displayPreviousCalculation = `${this.displayNumber(
        this.previousOperand
      )} ${this.normalOperator} ${this.displayNumber(this.currentOperand)} =`;
      this.addExpressionToHistory({
        expression: this.displayPreviousCalculation,
        result: result.toString(),
      });
    }
    this.currentOperand = result.toString();
    this.normalOperator = null;
    this.previousOperand = "";
  },

  clear() {
    this.previousOperand = "";
    this.currentOperand = "";
    this.normalOperator = null;
    this.singleOperandOperator = null;
    this.displayPreviousCalculation = "";
  },
  clearEvent() {
    this.currentOperand = "";
  },
  delete() {
    this.currentOperand = this.currentOperand.slice(0, -1);
  },
};

//All selectors

const numberBtns = document.querySelectorAll("[data-number]");
const operationBtns = document.querySelectorAll("[data-operator]");

const singleOperandOperationBtns = document.querySelectorAll(
  "[data-operator-single-operand]"
);
const deleteBtn = document.querySelector("[data-delete]");
const clearBtn = document.querySelector("[data-clear]");
const clearEventBtn = document.querySelector("[data-clear-event]");
const topDisplayElement = document.querySelector(".display-top");
const bottomDisplayElement = document.querySelector(".display-bottom");
const equalsBtn = document.querySelector("[data-equals]");
const historyItemsElement = document.querySelector(".history-items");

const calculator = new Calculator(
  topDisplayElement,
  bottomDisplayElement,
  historyItemsElement
);

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
singleOperandOperationBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log("hell");
    calculator.isPowerOfXOperationBtnClicked = true;
    calculator.chooseSingleOperandOperation(btn.innerText);
    // calculator.computePowerOfX();
    calculator.updateDisplay();
    calculator.isPowerOfXOperationBtnClicked = false;
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
deleteBtn.addEventListener("click", (e) => {
  calculator.delete();
  calculator.updateDisplay();
});

clearEventBtn.addEventListener("click", (e) => {
  calculator.clearEvent();
  calculator.updateDisplay();
});

historyItemsElement.addEventListener("click", (e) => {
  let expression = e.target.innerText.split("=");
  let leftHandSide = expression[0];
  let rightHandSide = expression[1];
  calculator.currentOperand = rightHandSide;
  calculator.displayPreviousCalculation = `${leftHandSide} =`;
  calculator.updateDisplay();
  // console.log(e.target);
});

deleteBtn.addEventListener("click", (e) => {
  historyItemsElement.innerHTML = "";

  console.log("dfdf");
});
