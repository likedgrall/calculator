var number_of_star = 150;

var random_number = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createStars = function () {
    var star_rotation = 'move_right;';
    for (var i = 0; i < number_of_star; i++) {
        rot = (star_rotation == 'move_right;' ? 'move_left;' : 'move_right;');
        var star_top = random_number(0, document.documentElement.clientHeight);
        var star_left = random_number(0, document.documentElement.clientWidth);
        var star_radius = random_number(0, 4);
        var star_duration = random_number(6, 16);

        document.body.innerHTML += "<div class='star' style='top: " + star_top + "px; left: " + star_left + "px; width: " + star_radius + "px; height: " + star_radius + "px; " +
            "animation-name:" + star_rotation + "; animation-duration: " + star_duration + "s;'></div>";
    }
};

createStars();

// Добавляем функционал калькулятора
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    memory: 0
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        
        if (!isFinite(result)) {
            calculator.displayValue = 'Error';
            calculator.firstOperand = null;
            calculator.waitingForSecondOperand = false;
            calculator.operator = null;
            return;
        }

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    let result;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                return Infinity;
            }
            result = firstOperand / secondOperand;
            break;
        default:
            return secondOperand;
    }
    
    return parseFloat(result.toFixed(8));
}

function handleSpecialOperator(value) {
    let currentValue = parseFloat(calculator.displayValue);
    
    switch (value) {
        case '+/-':
            calculator.displayValue = String(-currentValue);
            break;
        case '%':
            if (calculator.firstOperand !== null && calculator.operator) {
                currentValue = (calculator.firstOperand * currentValue) / 100;
            } else {
                currentValue = currentValue / 100;
            }
            calculator.displayValue = String(currentValue);
            break;
    }
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Обработчик событий
document.querySelector('.calculator').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    const { value } = target;

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'clear':
            resetCalculator();
            break;
        case '+/-':
        case '%':
            handleSpecialOperator(value);
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    // Обновляем дисплей
    const display = document.querySelector('.calculator__display');
    display.value = calculator.displayValue;
});