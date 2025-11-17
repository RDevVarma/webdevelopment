const display = document.getElementById('display');

function appendToDisplay(input) {
    if (display.value === 'Error') {
        display.value = '';
    }
    display.value += input;
}

function clearDisplay() {
    display.value = '';
}

function calculateResult() {
    try {
        let result = eval(display.value);
        
        if (result === Infinity || result === -Infinity || isNaN(result)) {
            display.value = 'Error';
        } else {
            display.value = result;
        }
        
    } catch (e) {
        display.value = 'Error';
    }
}