import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let clearButton = document.getElementById('clear');
let equalsButton = document.getElementById('equals');

let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

buttons.forEach(button => {
    if (button.classList.contains('num') || button.classList.contains('op')) {
        button.addEventListener('click', () => {
            handleButtonClick(button.textContent);
        });
    }
});

clearButton.addEventListener('click', clearDisplay);
equalsButton.addEventListener('click', calculate);

function handleButtonClick(value) {
    if (value === '.' && currentValue.includes('.')) return;

    if ('+-*/'.includes(value)) {
        operator = value;
        waitingForSecondOperand = true;
    } else {
        if (waitingForSecondOperand) {
            currentValue += ' ' + operator + ' ' + value;
            waitingForSecondOperand = false;
        } else {
            currentValue += value;
        }
    }
    display.value = currentValue;
}

function clearDisplay() {
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
    display.value = '';
}

async function calculate() {
    let parts = currentValue.split(' ');
    if (parts.length !== 3) return;

    let x = parseFloat(parts[0]);
    let op = parts[1];
    let y = parseFloat(parts[2]);

    let result;
    try {
        switch (op) {
            case '+':
                result = await backend.add(x, y);
                break;
            case '-':
                result = await backend.subtract(x, y);
                break;
            case '*':
                result = await backend.multiply(x, y);
                break;
            case '/':
                let divResult = await backend.divide(x, y);
                result = divResult[0] !== null ? divResult[0] : 'Error';
                break;
        }
        display.value = result;
        currentValue = result.toString();
        operator = '';
        waitingForSecondOperand = false;
    } catch (error) {
        console.error('Error:', error);
        display.value = 'Error';
    }
}
