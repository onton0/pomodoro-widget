// Timer durations in seconds for each slide
const defaultTimes = [1500, 300, 900, 0]; // Pomodoro, Short, Long, Custom
const timers = [...defaultTimes];
const isRunning = [false, false, false, false];
const intervalIds = [null, null, null, null];

const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const leftBtn = document.querySelector('.nav.left');
const rightBtn = document.querySelector('.nav.right');
const startButtons = document.querySelectorAll('.start');
const resetButtons = document.querySelectorAll('.reset');
const timerDisplays = document.querySelectorAll('.timer');

let currentIndex = 0;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay(index) {
  timerDisplays[index].textContent = formatTime(timers[index]);
}

function updateSlide() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + 4) % 4;
  updateSlide();
});

rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % 4;
  updateSlide();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    currentIndex = i;
    updateSlide();
  });
});

startButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (isRunning[i]) {
      clearInterval(intervalIds[i]);
      isRunning[i] = false;
      btn.textContent = 'Start';
    } else {
      isRunning[i] = true;
      btn.textContent = 'Pause';
      intervalIds[i] = setInterval(() => {
        if (timers[i] > 0) {
          timers[i]--;
          updateDisplay(i);
        } else {
          clearInterval(intervalIds[i]);
          isRunning[i] = false;
          btn.textContent = 'Start';
        }
      }, 1000);
    }
  });
});

resetButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    clearInterval(intervalIds[i]);
    isRunning[i] = false;
    timers[i] = defaultTimes[i];
    updateDisplay(i);
    startButtons[i].textContent = 'Start';
  });
});

// Custom timer editable input (Slide 3 - index 3)
const editableTimer = document.querySelector('.timer.editable');
editableTimer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const input = editableTimer.textContent.trim();
    const parts = input.split(':');
    let totalSeconds = 0;

    if (parts.length === 1) {
      const mins = parseInt(parts[0]);
      if (!isNaN(mins)) totalSeconds = mins * 60;
    } else if (parts.length === 2) {
      const mins = parseInt(parts[0]);
      const secs = parseInt(parts[1]);
      if (!isNaN(mins) && !isNaN(secs)) {
        totalSeconds = mins * 60 + secs;
      }
    }

    if (totalSeconds > 0) {
      timers[3] = totalSeconds;
      updateDisplay(3);
      editableTimer.blur();
    } else {
      editableTimer.textContent = formatTime(timers[3]);
    }
  }
});

// Settings button logic
const settingsButtons = document.querySelectorAll('.settings-btn');
const settingsPanels = document.querySelectorAll('.settings-panel');

settingsButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    settingsPanels[i].classList.toggle('hidden');
  });
});

// Color pickers
settingsPanels.forEach((panel, i) => {
  const textInput = panel.querySelector('input[type="text"]#hexText');
  const bgInput = panel.querySelector('input[type="text"]#hexBg');
  const colorText = panel.querySelector('input[type="color"]#colorText');
  const colorBg = panel.querySelector('input[type="color"]#colorBg');
  const slide = panel.closest('.slide');

  if (!panel || !slide) return;

  // Sync hex with picker
  colorText.addEventListener('input', () => {
    slide.style.color = colorText.value;
    textInput.value = colorText.value;
  });

  colorBg.addEventListener('input', () => {
    slide.style.backgroundColor = colorBg.value;
    bgInput.value = colorBg.value;
  });

  textInput.addEventListener('change', () => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(textInput.value)) {
      slide.style.color = textInput.value;
      colorText.value = textInput.value;
    }
  });

  bgInput.addEventListener('change', () => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(bgInput.value)) {
      slide.style.backgroundColor = bgInput.value;
      colorBg.value = bgInput.value;
    }
  });
});

// Init
for (let i = 0; i < 4; i++) updateDisplay(i);
updateSlide();
