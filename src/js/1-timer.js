import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const timerBtn = document.querySelector('button[data-start]');
const timerInput = document.querySelector('#datetime-picker');

const daysData = document.querySelector('[data-days]');
const hoursData = document.querySelector('[data-hours]');
const minutesData = document.querySelector('[data-minutes]');
const secondsData = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timeInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: '"Please choose a date in the future"',
      });
      timerBtn.disabled = true;
    } else {
      timerBtn.disabled = false;
    }
  },
};

flatpickr(timerInput, options);

timerBtn.addEventListener(`click`, () => {
  startTimer();
  timerBtn.disabled = true;
  timerInput.disabled = true;
});

function startTimer() {
  timeInterval = setInterval(() => {
    const currentTime = new Date();
    const elapsedTime = userSelectedDate - currentTime;

    if (elapsedTime <= 0) {
      clearInterval(timeInterval);
      timerInput.disabled = false;
    } else {
      const { days, hours, minutes, seconds } = convertMs(elapsedTime);

      daysData.textContent = addLeadingZero(days);
      hoursData.textContent = addLeadingZero(hours);
      minutesData.textContent = addLeadingZero(minutes);
      secondsData.textContent = addLeadingZero(seconds);
    }
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = value => String(value).padStart(2, 0);
