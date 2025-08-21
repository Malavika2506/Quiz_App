const questions = [
  {
    q: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks Text Management Language",
      "Hyper Transfer Markup Language",
    ],
    answer: 0,
  },
  {
    q: "Which CSS property changes text color?",
    options: ["font-style", "color", "text-decoration", "background"],
    answer: 1,
  },
  {
    q: "Inside which HTML element do we put JavaScript?",
    options: ["<js>", "<script>", "<javascript>", "<code>"],
    answer: 1,
  },
  {
    q: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "<!-- -->", "#"],
    answer: 0,
  },
  {
    q: "Which company developed JavaScript?",
    options: ["Google", "Microsoft", "Netscape", "Apple"],
    answer: 2,
  },
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const qaCard = document.getElementById("qa-card");

const scoreText = document.getElementById("score-text");
const percentageText = document.getElementById("percentage-text");
const reviewBtn = document.getElementById("review-btn");
const reviewEl = document.getElementById("review");
const restartBtn = document.getElementById("restart-btn");

document.getElementById("start-btn").addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
  clearInterval(timer);
  goNext();
});
reviewBtn.addEventListener("click", toggleReview);
restartBtn.addEventListener("click", restartQuiz);

let current = 0;
let score = 0;
let timer = null;
let userAnswers = [];

function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  current = 0;
  score = 0;
  userAnswers = [];
  loadQuestion();
}

function loadQuestion() {
  if (current >= questions.length) return finishQuiz();

  qaCard.classList.remove("slide-in");
  qaCard.classList.remove("slide-out");
  void qaCard.offsetWidth; // force reflow
  qaCard.classList.add("slide-in");

  feedbackEl.textContent = "";
  nextBtn.disabled = true;

  const q = questions[current];
  progressEl.textContent = `Q${current + 1}/${questions.length}`;
  questionEl.textContent = q.q;

  optionsEl.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.addEventListener("click", () => selectOption(idx, div));
    optionsEl.appendChild(div);
  });

  // start timer
  startTimer();
}

function selectOption(index, el) {
  document
    .querySelectorAll(".option")
    .forEach((o) => o.classList.remove("selected"));
  el.classList.add("selected");

  userAnswers[current] = index;
  nextBtn.disabled = false;
}

function startTimer() {
  let left = 10;
  timerEl.innerHTML = `<i class="fa-solid fa-hourglass-end"></i>: ${left}s`;
  clearInterval(timer);

  timer = setInterval(() => {
    left--;
    timerEl.innerHTML = `<i class="fa-solid fa-hourglass-end"></i>: ${left}s`;

    if (left <= 0) {
      clearInterval(timer);
      // if user didn't choose, mark as null and auto advance with slide
      if (userAnswers[current] === undefined) userAnswers[current] = null;
      qaCard.classList.add("slide-out");
      qaCard.addEventListener("animationend", () => goNext(), { once: true });
    }
  }, 1000);
}

function goNext() {
  // score the current question
  const q = questions[current];
  if (userAnswers[current] === q.answer) score++;

  // next
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(timer);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const pct = Math.round((score / questions.length) * 100);
  scoreText.textContent = `${score}/${questions.length}`;
  percentageText.textContent = `${pct}%`;

  // Save to localStorage
  localStorage.setItem(
    "quizResult",
    JSON.stringify({
      at: new Date().toISOString(),
      score,
      total: questions.length,
      percentage: pct,
      userAnswers,
      questions,
    })
  );

  // Reset review area state
  reviewEl.classList.add("hidden");
  reviewEl.innerHTML = "";
}

function escapeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toggleReview() {
  if (!reviewEl.classList.contains("hidden")) {
    reviewEl.classList.add("hidden");
    return;
  }

  // build review
  reviewEl.innerHTML = "";
  questions.forEach((q, i) => {
    const div = document.createElement("div");
    const user = userAnswers[i];
    const isCorrect = user === q.answer;

    div.className = `review-item ${isCorrect ? "correct" : "wrong"}`;
    div.innerHTML = `
      <div><strong>Q${i + 1}:</strong> ${escapeHTML(q.q)}</div>
      <div>Your Answer: ${
        user !== null && user !== undefined
          ? escapeHTML(q.options[user])
          : "Not answered"
      }</div>
      <div>Correct Answer: ${escapeHTML(q.options[q.answer])}</div>
    `;
    reviewEl.appendChild(div);
  });
  reviewEl.classList.remove("hidden");
}

function restartQuiz() {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

/***********************
 * Optional: Auto-show last result on reload
 ***********************/
window.addEventListener("load", () => {
  const saved = localStorage.getItem("quizResult");
  if (!saved) return;
  const data = JSON.parse(saved);
  startScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  scoreText.textContent = `${data.score}/${data.total}`;
  percentageText.textContent = `${data.percentage}%`;
  userAnswers = data.userAnswers || [];
  reviewEl.classList.add("hidden");
  reviewEl.innerHTML = "";
});
