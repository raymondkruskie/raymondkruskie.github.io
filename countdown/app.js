const semicircles = document.querySelectorAll('.semicircle');
const timer = document.querySelector('.timer');

// input
const min = 15;
const sec = 0;
const msec = 0;

const minutes = min * 60000;
const seconds = sec * 1000;
const microseconds = msec * 6000;
const setTime = minutes + seconds + microseconds;
const starTime = Date.now();
const futureTime = starTime + setTime;
const timerLoop = setInterval(countDownTimer);
countDownTimer();

function countDownTimer() {
  const currentTime = Date.now();
  const remainingTime = futureTime - currentTime;
  const angle = (remainingTime / setTime) * 360;
  
  // progress indicator
  
  if(angle > 180) {
    semicircles[2].style.display = 'none';
    semicircles[0].style.transform = 'rotate(180deg)';
    semicircles[1].style.transform = `rotate(${angle}deg)`;
  } else {
    semicircles[2].style.display = 'block';
    semicircles[0].style.transform = `rotate(${angle}deg)`;
    semicircles[1].style.transform = `rotate(${angle}deg)`;
  }
  
  // timer
  const hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const mins = Math.floor((remainingTime / (1000 * 60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const secs = Math.floor((remainingTime / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  const msecs = Math.floor((remainingTime / (1000 / 60)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  
  timer.innerHTML = `
  <div class="time">${mins}</div>
  <div class="colon">:</div>
  <div class="time">${secs}</div>
  <div class="colon">:</div>
  <div class="time">${msecs}</div>
  `;

  // 5min condition
  if(remainingTime <= 300000){
    semicircles[0].style.backgroundColor = "#fbab1d";
    semicircles[1].style.backgroundColor = "#fbab1d";
    timer.style.color = "#fbab1d";
  }

  // 5sec condition
  if(remainingTime <= 6000){
    semicircles[0].style.backgroundColor = "red";
    semicircles[1].style.backgroundColor = "red";
    timer.style.color = "red";
  }
  
  // end
  if(remainingTime < 0) {
    clearInterval(timerLoop);
    semicircles[0].style.display = 'none';
    semicircles[1].style.display = 'none';
    semicircles[2].style.display = 'none';

    timer.innerHTML = `
    <div class="time">00</div>
    <div class="colon">:</div>
    <div class="time">00</div>
    <div class="colon">:</div>
    <div class="time">00</div>
    `;
    
    timer.style.color="lightgray";
  }
}