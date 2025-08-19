document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".startquizbtn")
    .addEventListener("click", function (e) {
      e.preventDefault();

      // Hide start screen
      document.querySelector(".startquizbtn").closest(".row").style.display =
        "none";

      // Show question card
      document.getElementById("questionCard").style.display = "flex";
    });

  //Questionss
  document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      id: 1,
      question: "What is the capital of India?",
      options: ["Mumbai", "New Delhi", "Chennai", "Kolkata"],
      answer: "New Delhi",
    },
    {
      id: 2,
      question: "What does HTML stand for?",
      options: [
        "Hyper Trainer Marking Language",
        "Hyper Text Marketing Language",
        "Hyper Text Markup Language",
        "Hyper Tool Multi Language",
      ],
      answer: "Hyper Text Markup Language",
    },
    {
      id: 3,
      question:
        "Which CSS property is used to control the stacking order of elements?",
      options: ["position", "z-index", "display", "visibility"],
      answer: "z-index",
    },
    {
      id: 4,
      question:
        "Which JavaScript method is used to select an element by its ID?",
      options: [
        "getElementByClass",
        "querySelectorAll",
        "getElementById",
        "getElementsByTagName",
      ],
      answer: "getElementById",
    },
    {
      id: 5,
      question:
        "Which Bootstrap class makes an element span the full width of its parent?",
      options: ["container", "row", "col-12", "d-block"],
      answer: "col-12",
    },
  ];

  let currentQuestionIndex = 0;
  let timerInterval;

  const questionText = document.getElementById("questionText");
  const optionsContainer = document.querySelector(".d-grid");
  const feedbackBox = document.getElementById("feedbackBox");
  const timerDisplay = document.getElementById("timerDisplay");

  function startTimer() {
    let timeLeft = 10;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time left: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        feedbackBox.textContent = "⏰ Time's up!";
        setTimeout(() => nextQuestion(), 1000);
      }
    }, 1000);
  }

  function showQuestion(index) {
    clearInterval(timerInterval);
    feedbackBox.textContent = "";
    const questionObj = questions[index];
    questionText.textContent = questionObj.question;
    optionsContainer.innerHTML = "";

    questionObj.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-light";
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option, questionObj.answer);
      optionsContainer.appendChild(btn);
    });

    startTimer();
  }

  function checkAnswer(selected, correct) {
    clearInterval(timerInterval);
    if (selected === correct) {
      feedbackBox.textContent = "✅ Correct! 🎉";
    } else {
      feedbackBox.textContent = `❌ Incorrect. Correct answer: ${correct}`;
    }

    setTimeout(() => nextQuestion(), 1500);
  }

  function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(currentQuestionIndex);
    } else {
      questionText.textContent = "🎉 Quiz complete!";
      optionsContainer.innerHTML = "";
      feedbackBox.textContent = "";
      timerDisplay.textContent = "";
    }
  }

  document.querySelector(".startquizbtn").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".startquizbtn").closest(".row").style.display = "none";
    document.getElementById("questionCard").style.display = "flex";
    showQuestion(currentQuestionIndex);
  });
});

});