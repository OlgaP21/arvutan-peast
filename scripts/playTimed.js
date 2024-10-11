// Game round rules -> level: [pointsRightAnswer, pointsWrongAnswer, neededScore, timeInSeconds]
const gameRules = {
    1: [5, -1, 50, 30],
    2: [25, -5, 350, 45],
    3: [50, -10, 750, 75],
    4: [75, -20, 1350, 105],
    5: [100, -30, 2350, 135]
};
const chosenOption = sessionStorage.getItem('chosenOption');
const dialog = document.getElementById('game-end-dialog');
const posOnly = !chosenOption.includes('neg');

let currentLevel = 0;
let userAnswer = '';
let userScore = 0;
let userError = '';

let timer;
let min, max;
let firstNumber, secondNumber, actualAnswer;
let answerRightPoints, answerWrongPoints, neededScore, timeGiven;
let task;


document.getElementById('quit-button').addEventListener('click', () => {
    if (confirm('Kui praegu ära lähed su progress kaob! Oled kindel?') == true) {
        window.location.href = '../index.html';
    }
});

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
    checkGameState();
    generateTask();
});


startGame();

function startGame() {
    setRoundRules();
    showGameInfo();
    generateTask();
}

function endGame() {
    clearInterval(timer);
    document.getElementById('stats-level').textContent = `Jõudsid tasemeni ${currentLevel}`;
    document.getElementById('stats-points').textContent = `Sinu punktide arv on ${userScore}`;
    dialog.showModal();
}

function saveError() {
    userError = task + actualAnswer + ' (' + userAnswer + ')';
    const paragraph = document.createElement('p');
    const text = document.createTextNode(userError);
    paragraph.appendChild(text);
    paragraph.classList.add('error');
    const link = document.getElementById('link');
    document.getElementById('game-end-dialog').insertBefore(paragraph, link);
}

function showGameInfo() {
    userAnswer = '';
    document.getElementById('user-score').textContent = userScore;
    document.getElementById('needed-score').textContent = neededScore;
    document.getElementById('answer').textContent = '';
}

function checkGameState() {
    if (timeGiven < 0) {
        endGame();
    } else if (userScore >= neededScore) {
        setRoundRules();
    }
}

function setRoundRules() {
    currentLevel++;
    [answerRightPoints, answerWrongPoints, neededScore, timeGiven] = gameRules[currentLevel];
    setMinMax();
    showGameInfo();
    clearInterval(timer);
    setTimer();
}

function setTimer() {
    timer = setInterval(() => {
        let minutes = '0' + Math.floor(timeGiven/60);
        let seconds = timeGiven - 60 * minutes;
        let timeRemaining = minutes + ':';
        timeRemaining += seconds < 10 ? '0' + seconds : seconds;
        document.getElementById('timer').textContent = timeRemaining;
        timeGiven -= 1;
        if (timeGiven < 0) {
            endGame();
        }
    }, 1000);
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
    } else { // allposneg
        generateTaskForAll();
    }
}

function setMinMax() {
    if (currentLevel == 1 && posOnly) {
        min = 0;
    } else if (posOnly) {
        min = 1;
    } else {
        min = -10;
    }
    max = 10;
    for (let i = 1; i < currentLevel; i++) {
        min *= 10;
        max *= 10;
    }
}

// numbers within range [min, max] ; answers within range [min, max]
function generateTaskForAdd() {
    firstNumber = getRandomInteger(min, max);
    secondNumber = posOnly ? getRandomInteger(min, max-firstNumber) : getRandomInteger(-max+Math.abs(firstNumber), max-firstNumber);
    actualAnswer = firstNumber + secondNumber;
    if (secondNumber < 0) {
        secondNumber = '(' + secondNumber + ')';
    }
    task = firstNumber + ' + ' + secondNumber + ' = '
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

// numbers within range [mix, max] ; answers within range [min, max]
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
    task = firstNumber + ' * ' + secondNumber + ' = '
    document.getElementById('task').textContent = task;
}

// not so good
// a lot of same number divisions e.g. 25/25, 9/9, 8/8 going immediately one after another
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
            task = firstNumber + ' / ' + secondNumber + ' = '
            document.getElementById('task').textContent = task;
            break;
        } else if (secondNumber % firstNumber == 0) {
            actualAnswer = secondNumber / firstNumber;
            if (firstNumber < 0) {
                firstNumber = '(' + firstNumber + ')';
                task = secondNumber + ' / ' + firstNumber + ' = '
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

// maybe -> somehow show if the answer was correct or not
