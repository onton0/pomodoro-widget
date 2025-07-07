let timeLeft = 25 * 60;
let timerRunning = false;
let timerInterval;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
  if (!timerRunning) {
    timerRunning = true;
    timerInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
      }
    }, 1000);
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timeLeft = 25 * 60;
  updateDisplay();
});

updateDisplay();
