const questions = [
  { id: 1, question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Chennai", "Kolkata"], answer: "New Delhi" },
  { id: 2, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language", "Hyper Tool Multi Language"], answer: "Hyper Text Markup Language" },
  { id: 3, question: "Which CSS property controls stacking order?", options: ["position", "z-index", "display", "visibility"], answer: "z-index" },
  { id: 4, question: "Which method selects element by ID in JS?", options: ["getElementByClass", "querySelectorAll", "getElementById", "getElementsByTagName"], answer: "getElementById" },
  { id: 5, question: "Which Bootstrap class spans full width?", options: ["container", "row", "col-12", "d-block"], answer: "col-12" }
];

let currentQuestion = 0;
let score = 0;
let timer;
let userAnswers = {};

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const reviewEl = document.getElementById("review");

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  score = 0;
  currentQuestion = 0;
  userAnswers = {};
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  feedbackEl.textContent = "";
  nextBtn.disabled = true;

  const q = questions[currentQuestion];
  progressEl.textContent = `Q${currentQuestion + 1}/${questions.length}`;
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(opt => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = opt;
    div.addEventListener("click", () => selectAnswer(opt, q.answer, div));
    optionsEl.appendChild(div);
  });

  startTimer();
}

function selectAnswer(selected, correct, div) {
  clearInterval(timer);
  const options = document.querySelectorAll(".option");
  options.forEach(o => o.style.pointerEvents = "none");

  userAnswers[questions[currentQuestion].id] = selected;

  if (selected === correct) {
    score++;
    div.classList.add("correct");
    feedbackEl.textContent = "✅ Correct!";
  } else {
    div.classList.add("wrong");
    feedbackEl.textContent = `❌ Wrong! Correct: ${correct}`;
  }

  nextBtn.disabled = false;
  if (currentQuestion === questions.length - 1) {
    nextBtn.textContent = "Submit";
  }
}

function startTimer() {
  let time = 10;
  timerEl.textContent = `Time: ${time}s`;
  timer = setInterval(() => {
    time--;
    timerEl.textContent = `Time: ${time}s`;
    if (time <= 0) {
      clearInterval(timer);
      feedbackEl.textContent = "⏰ Time's up!";
      userAnswers[questions[currentQuestion].id] = "No Answer";
      nextBtn.disabled = false;
      if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = "Submit";
      }
    }
  }, 1000);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  scoreEl.textContent = `Your Score: ${score} out of ${questions.length}`;

  reviewEl.innerHTML = "";
  questions.forEach(q => {
    const p = document.createElement("p");
    const userAns = userAnswers[q.id] || "No Answer";
    if (userAns === q.answer) {
      p.innerHTML = `✔ ${q.question} <br> Your Answer: ${userAns}`;
      p.style.color = "lightgreen";
    } else {
      p.innerHTML = `❌ ${q.question} <br> Your Answer: ${userAns} | Correct: ${q.answer}`;
      p.style.color = "salmon";
    }
    reviewEl.appendChild(p);
  });

  // Save to localStorage
  localStorage.setItem("quizScore", score);
  localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
}

function restartQuiz() {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  nextBtn.textContent = "Next";
}
