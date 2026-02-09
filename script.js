const game = document.getElementById("game");

let startTime = null;
let timeoutId = null;
let waitingForGreen = false;

// Load best time from localStorage
let bestTime = localStorage.getItem("bestReactionTime");
bestTime = bestTime ? Number(bestTime) : null;

function updateText(text) {
  const bestText = bestTime
    ? `\nBest: ${bestTime} ms`
    : "\nBest: —";

  game.textContent = text + bestText;
}

game.addEventListener("click", () => {
  // False start
  if (waitingForGreen && !startTime) {
    clearTimeout(timeoutId);
    game.style.background = "#8e44ad";
    updateText("Too soon! Click to try again");
    waitingForGreen = false;
    return;
  }

  // Successful click
  if (startTime) {
    const reactionTime = Date.now() - startTime;

    // Update best time
    if (!bestTime || reactionTime < bestTime) {
      bestTime = reactionTime;
      localStorage.setItem("bestReactionTime", bestTime);
    }

    game.style.background = "#2c3e50";
    updateText(`Your reaction time: ${reactionTime} ms\nClick to try again`);
    startTime = null;
    return;
  }

  // Start new round
  game.style.background = "#c0392b";
  updateText("Wait for green...");
  waitingForGreen = true;

  const delay = Math.random() * 3000 + 1000; // 1–4 seconds

  timeoutId = setTimeout(() => {
    game.style.background = "#27ae60";
    updateText("CLICK!");
    startTime = Date.now();
  }, delay);
});
