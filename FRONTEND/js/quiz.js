let allQuestions = [];
let filteredQuestions = [];
let currentIndex = 0;

let answers = [];
let score = 0;

let currentLevel = "easy";
let timer;
let timeLeft = 15;

const categoryId = parseInt(localStorage.getItem("selectedCategory"));
const token = localStorage.getItem("token");

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", async () => {
  if (!token || !categoryId) {
    window.location.href = "dashboard.html";
    return;
  }

  await loadQuestions();
  showDifficultyUI();
});

// ---------------- FETCH QUESTIONS ----------------
async function loadQuestions() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/questions/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    allQuestions = data.filter(q =>
      Number(q.category) === categoryId
    );

    console.log("FILTERED CATEGORY QUESTIONS:", allQuestions);

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// ---------------- DIFFICULTY UI ----------------
function showDifficultyUI() {
  document.getElementById("difficulty-section").style.display = "block";
  document.getElementById("quiz-section").style.display = "none";
  document.getElementById("result-section").style.display = "none";
}

// ---------------- START LEVEL ----------------
function startQuiz(level) {
  currentLevel = level;
  currentIndex = 0;
  score = 0;
  answers = [];

  filteredQuestions = allQuestions.filter(q =>
    q.difficulty.toLowerCase() === level
  );

  if (filteredQuestions.length === 0) {
    alert("No questions for " + level);
    return;
  }

  document.getElementById("difficulty-section").style.display = "none";
  document.getElementById("quiz-section").style.display = "block";

  loadQuestion();
}

// ---------------- LOAD QUESTION ----------------
function loadQuestion() {
  clearInterval(timer);

  if (currentIndex >= filteredQuestions.length) {
    return showResult();
  }

  const q = filteredQuestions[currentIndex];

  document.getElementById("question-count").innerText =
    `Question ${currentIndex + 1} / ${filteredQuestions.length}`;

  document.getElementById("question").innerText = q.text;

  const optionsBox = document.getElementById("options");
  optionsBox.innerHTML = "";

  [q.option1, q.option2, q.option3, q.option4].forEach(opt => {
    if (!opt) return;

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;

    btn.onclick = () => selectAnswer(opt, q);

    optionsBox.appendChild(btn);
  });

  startTimer();
}

// ---------------- TIMER ----------------
function startTimer() {
  timeLeft = 15;
  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      skipQuestion();
    }
  }, 1000);
}

// ---------------- ANSWER ----------------
function selectAnswer(selected, q) {
  clearInterval(timer);

  answers.push({
    question_id: q.id,
    selected_answer: selected
  });

  if (selected === q.correct_answer) {
    score++;
  }

  currentIndex++;
  loadQuestion();
}

// ---------------- SKIP ----------------
function skipQuestion() {
  answers.push({
    question_id: filteredQuestions[currentIndex].id,
    selected_answer: null
  });

  currentIndex++;
  loadQuestion();
}

// ---------------- RESULT ----------------
async function showResult() {

  document.getElementById("quiz-section").style.display = "none";
  document.getElementById("result-section").style.display = "block";

  const total = filteredQuestions.length;
  const percentage = (score / total) * 100;

  let levelText = "";
  let feedback = "";
  let tips = [];

  if (percentage < 40) {
    levelText = "Beginner";
    feedback = "You need strong practice on basics.";
    tips = [
      "Revise fundamentals",
      "Practice daily MCQs",
      "Focus on concepts"
    ];
  } else if (percentage <= 70) {
    levelText = "Intermediate";
    feedback = "Good, but needs improvement.";
    tips = [
      "Improve speed",
      "Practice medium questions",
      "Analyze mistakes"
    ];
  } else {
    levelText = "Advanced";
    feedback = "Excellent performance!";
    tips = [
      "Try mock interviews",
      "Solve hard problems",
      "Focus on optimization"
    ];
  }

  document.getElementById("score").innerText =
    `Score: ${score} / ${total} (${percentage.toFixed(1)}%)`;

  document.getElementById("feedback").innerText =
    `${levelText} - ${feedback}`;

  const tipBox = document.getElementById("tips");
  tipBox.innerHTML = "";

  tips.forEach(t => {
    const li = document.createElement("li");
    li.innerText = t;
    tipBox.appendChild(li);
  });

  // NEXT LEVEL BUTTON LOGIC
  const nextBtn = document.createElement("button");
  nextBtn.innerText =
    currentLevel === "easy"
      ? "Start Medium Level"
      : currentLevel === "medium"
      ? "Start Hard Level"
      : "Go Dashboard";

  nextBtn.className = "primary";

  nextBtn.onclick = () => {
    if (currentLevel === "easy") startQuiz("medium");
    else if (currentLevel === "medium") startQuiz("hard");
    else window.location.href = "dashboard.html";
  };

  tipBox.appendChild(nextBtn);
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}