const game = document.getElementById("game");

let startTime = null;
let timeoutId = null;
let waitingForGreen = false;

let bestTime = localStorage.getItem("bestReactionTime");
bestTime = bestTime ? Number(bestTime) : null;

let attempts = JSON.parse(localStorage.getItem("reactionAttempts")) || [];

function recordAttempt(time) {
  attempts.unshift(time);
  attempts = attempts.slice(0, 5);
  localStorage.setItem("reactionAttempts", JSON.stringify(attempts));

  if (!bestTime || time < bestTime) {
    bestTime = time;
    localStorage.setItem("bestReactionTime", bestTime);
  }
}

function getAverage() {
  if (attempts.length === 0) return null;
  const sum = attempts.reduce((a, b) => a + b, 0);
  return Math.round(sum / attempts.length);
}

function updateText(mainText) {
  const bestText = bestTime ? `Best: ${bestTime} ms` : "Best: —";
  const avg = getAverage();
  const avgText = avg ? `Avg (last ${attempts.length}): ${avg} ms` : "Avg: —";

  game.textContent = `${mainText}\n\n${bestText}\n${avgText}`;
}

function handleInput() {

  if (waitingForGreen && !startTime) {
    clearTimeout(timeoutId);
    game.style.background = "#8e44ad";
    updateText("Too soon! Click or press space to try again");
    waitingForGreen = false;
    return;
  }

  if (startTime) {
    const reactionTime = Date.now() - startTime;
    recordAttempt(reactionTime);

    game.style.background = "#2c3e50";
    updateText(`Your reaction time: ${reactionTime} ms\nClick or press space to try again`);
    startTime = null;
    return;
  }


  game.style.background = "#c0392b";
  updateText("Wait for green...");
  waitingForGreen = true;

  const delay = Math.random() * 3000 + 1000; // 1–4 seconds

  timeoutId = setTimeout(() => {
    game.style.background = "#27ae60";
    updateText("CLICK!");
    startTime = Date.now();
  }, delay);
}

game.addEventListener("click", handleInput);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    handleInput();
  }
});
