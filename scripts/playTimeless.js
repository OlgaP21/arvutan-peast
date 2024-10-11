const chosenOption = sessionStorage.getItem('chosenOption');
const level = sessionStorage.getItem('level');
const posOnly = !chosenOption.includes('neg');
const dialog = document.getElementById('error-dialog');

// Game round rules -> level: [pointsRightAnswer, pointsWrongAnswer]
const gameRules = {
    1: [5, -1],
    2: [25, -5],
    3: [50, -10],
    4: [75, -10],
    5: [100, -30]
};
const [answerRightPoints, answerWrongPoints] = gameRules[level];

let userScore = 0;
let userAnswer = '';
let userError = '';

let min, max;
let firstNumber, secondNumber, actualAnswer;
let task;


document.getElementById('error-button').addEventListener('click', () => {
    dialog.showModal();
});

document.getElementById('back-button').addEventListener('click', () => {
    dialog.close();
});

// dialog.close();

document.getElementById('one').addEventListener('click', () => {
    userAnswer += '1';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('two').addEventListener('click', () => {
    userAnswer += '2';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('three').addEventListener('click', () => {
    userAnswer += '3';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('four').addEventListener('click', () => {
    userAnswer += '4';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('five').addEventListener('click', () => {
    userAnswer += '5';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('six').addEventListener('click', () => {
    userAnswer += '6';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('seven').addEventListener('click', () => {
    userAnswer += '7';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('eight').addEventListener('click', () => {
    userAnswer += '8';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('nine').addEventListener('click', () => {
    userAnswer += '9';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('zero').addEventListener('click', () => {
    userAnswer += '0';
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('minus').addEventListener('click', () => {
    if (userAnswer == '') {
        userAnswer = '-' + userAnswer;
        document.getElementById('answer').textContent = userAnswer;
    }
});

document.getElementById('erase').addEventListener('click', () => {
    userAnswer = userAnswer.slice(0, -1);
    document.getElementById('answer').textContent = userAnswer;
});

document.getElementById('check').addEventListener('click', () => {
    if (Number(userAnswer) == actualAnswer) {
        userScore += answerRightPoints;
    } else {
        userScore += answerWrongPoints;
        saveError();
    }
    showGameInfo();
    generateTask();
});


startGame();

function startGame() {
    setMinMax();
    showGameInfo();
    generateTask();
}

function setMinMax() {
    if (level == 1 && posOnly) {
        min = 0;
    } else if (posOnly) {
        min = 1;
    } else {
        min = -10;
    }
    max = 10;
    for (let i = 1; i < level; i++) {
        min *= posOnly ? 1 : 10;
        max *= 10;
    }
}

function saveError() {
    userError = task + actualAnswer + ' (' + userAnswer + ')';
    const paragraph = document.createElement('p');
    const text = document.createTextNode(userError);
    paragraph.appendChild(text);
    paragraph.classList.add('error')
    const button = document.getElementById('back-button');
    document.getElementById('error-dialog').insertBefore(paragraph, button);
}

function showGameInfo() {
    userAnswer = '';
    document.getElementById('user-score').textContent = userScore;
    document.getElementById('answer').textContent = '';
}

function generateTask() {
    if (chosenOption.includes('add')) { // addpos || addposneg
        generateTaskForAdd();
    } else if (chosenOption.includes('sub')) { // subpos || subposneg
        generateTaskForSub();
    } else if (chosenOption.includes('mul')) { // mulpos || mulposneg
        generateTaskForMul();
    } else if (chosenOption.includes('div')) { // divpos || divposneg
        generateTaskForDiv();
    } else { // allpos
        generateTaskForAll();
    }
}

// numbers within range [min, max] ; answers within range [mix, max]
function generateTaskForAdd() {
    firstNumber = getRandomInteger(min, max);
    secondNumber = posOnly ? getRandomInteger(min, max-firstNumber) : getRandomInteger(-max+Math.abs(firstNumber), max-firstNumber);
    actualAnswer = firstNumber + secondNumber;
    if (secondNumber < 0) {
        secondNumber = '(' + secondNumber + ')';
    }
    task = firstNumber + ' + ' + secondNumber + ' = ';
    document.getElementById('task').textContent = task;
}

// numbers within range [min, max] ; answers within range [min, max]
function generateTaskForSub() {
    firstNumber = getRandomInteger(min, max);
    if (posOnly) {
        secondNumber = getRandomInteger(min, firstNumber);
    } else if (firstNumber < 0) {
        secondNumber = getRandomInteger(-10, max+firstNumber);
    } else {
        secondNumber = getRandomInteger(min+firstNumber, max);
    }
    actualAnswer = firstNumber - secondNumber;
    if (secondNumber < 0) {
        secondNumber = '(' + secondNumber + ')';
    }
    task = firstNumber + ' - ' + secondNumber + ' = ';
    document.getElementById('task').textContent = task;
}

// numbers within range [min, max] ; answers within range [min, max]
function generateTaskForMul() {
    if (posOnly) {
        firstNumber = getRandomInteger(0, 10);
    } else {
        firstNumber = getRandomInteger(-10, 10);
    }
    if (firstNumber == 0) {
        secondNumber = getRandomInteger(min, max);
    } else if (posOnly) {
        secondNumber = getRandomInteger(min, Math.abs(Math.floor(max/firstNumber)));
    } else {
        secondNumber = getRandomInteger(-Math.abs(Math.floor(max/firstNumber)), Math.abs(Math.floor(max/firstNumber)));
    }
    actualAnswer = firstNumber * secondNumber;
    if (secondNumber < 0) {
        secondNumber = '(' + secondNumber + ')';
    }
    task = firstNumber + ' * ' + secondNumber + ' = ';
    document.getElementById('task').textContent = task;
}

// answers within range [min, max]
function generateTaskForDiv() {
    while (true) {
        firstNumber = getRandomInteger(min, max);
        if (firstNumber == 0 || !numberIsPrime(firstNumber)) {
            break;
        }
    }
    while (true) {
        secondNumber = getRandomInteger(min, max);
        if (secondNumber == 0) {
            continue;
        } else if (firstNumber % secondNumber == 0) {
            actualAnswer = firstNumber / secondNumber;
            if (secondNumber < 0) {
                secondNumber = '(' + secondNumber + ')';
            }
            task = firstNumber + ' / ' + secondNumber + ' = ';
            document.getElementById('task').textContent = task;
            break;
        } else if (secondNumber % firstNumber == 0) {
            actualAnswer = secondNumber / firstNumber;
            if (firstNumber < 0) {
                firstNumber = '(' + firstNumber + ')';
                task = secondNumber + ' / ' + firstNumber + ' = ';
                document.getElementById('task').textContent = task;
            }
            break;
        }
    }
}

function generateTaskForAll() {
    let option = getRandomInteger(0, 3);
    if (option == 0) {
        generateTaskForAdd();
    } else if (option == 1) {
        generateTaskForSub();
    } else if (option == 2) {
        generateTaskForMul();
    } else {
        generateTaskForDiv();
    }
}

function getRandomInteger(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function numberIsPrime(number) {
    if (Math.abs(number) == 1) {
        return true;
    } else {
        for (let i = 2; i < Math.abs(number)/2; i++) {
            if (number % i == 0) {
                return false;
            }
        }
    }
    return true;
}
