var timeElapsed = 0;
var runningTime;

var timeIsRunning = false;
const time = document.getElementById("time");

function start() {
    if (!timeIsRunning) {
        runningTime = setInterval(updateTime, 10);
        timeIsRunning = true;
    }
}

function stop() {
    if (timeIsRunning) {
        timeIsRunning = false;
        clearInterval(runningTime);
    }
}

function reset() {
    timeIsRunning = false;
    timeElapsed = 0;
    time.textContent = "00:00:00:00";
    clearInterval(runningTime);
}

function updateTime() {
    timeElapsed++;

    let hours = Math.floor(timeElapsed / 100 / 60 / 60) % 24;
    let minutes = Math.floor(timeElapsed / 100 / 60) % 60;
    let seconds = Math.floor(timeElapsed / 100) % 60;
    let deciSecond = Math.floor(timeElapsed % 100)
        .toString()
        .padStart(2, "0");

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    time.textContent = `${hours}:${minutes}:${seconds}:${deciSecond}`;
}
