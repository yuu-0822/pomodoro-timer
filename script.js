const WORK_TIME = 25 * 60 * 1000;
const BREAK_TIME = 5 * 60 * 1000;

let mode = 'work';
let startTime = null;
let timerId = null;

const modeText = document.getElementById('mode');
const timeText = document.getElementById('time');
const alarm = document.getElementById('alarm');

function format(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${min}:${sec}`;
}
function  getDuration() {
    return mode === 'work' ? WORK_TIME : BREAK_TIME;
}

function update() {
    const elapsed = Date.now() - startTime;
    const remaining = getDuration() - elapsed;

    if (remaining <= 0) {
        alarm.play();
        switchMode();
        return;
    }

    timeText.textContent = format(remaining);
}

function switchMode() {
    mode = mode === 'work' ? 'break' : 'work';
    modeText.textContent = mode === 'work' ? '作業' : '休憩';
    start();
}

function start() {
    startTime = Date.now();
    timerId = setInterval(update, 500);
}

document.getElementById('start').onclick = () => {
    if (!timerId) start();
};

document.getElementById('pause').onclick = () => {
    clearInterval(timerId);
    timerId = null;
};

document.getElementById('reset').onclick = () => {
    clearInterval(timerId);
    timerId = null;
    mode = 'work';
    modeText.textContent = '作業';
    timeText.textContent = '25:00';
}