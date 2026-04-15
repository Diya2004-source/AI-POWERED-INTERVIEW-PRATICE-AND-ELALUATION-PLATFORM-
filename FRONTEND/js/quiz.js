/* js/quiz.js */
let allQuestions = [];
let filteredQuestions = [];
let currentIdx = 0;
let score = 0;
let timer;
const TIME_LIMIT = 15;

document.addEventListener('DOMContentLoaded', () => {
    const catId = localStorage.getItem('selectedCategory');
    if (!catId) {
        window.location.href = 'dashboard.html';
        return;
    }
    fetchQuestions(catId);
});

async function fetchQuestions(catId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/questions/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        // Ensure data is an array before filtering
        if (Array.isArray(data)) {
            allQuestions = data.filter(q => q.category == catId);
            console.log(`Loaded ${allQuestions.length} questions for category ${catId}`);
        } else {
            console.error("Unexpected API response format:", data);
        }
    } catch (err) {
        console.error("API Connection Error:", err);
    }
}

function beginQuiz(difficulty) {
    // If questions haven't loaded from the API yet, wait a moment
    if (allQuestions.length === 0) {
        alert("Questions are still loading or none were found. Please try again in a second.");
        return;
    }

    // Improved filter to handle case-sensitivity and whitespace from Django
    filteredQuestions = allQuestions.filter(q => 
        q.difficulty.toLowerCase().trim() === difficulty.toLowerCase().trim()
    );
    
    if (filteredQuestions.length === 0) {
        alert(`No questions found for "${difficulty}". Please check your Django Admin entries.`);
        return;
    }

    // Reset game state
    currentIdx = 0;
    score = 0;

    // UI Transitions
    document.getElementById('difficulty-section').classList.add('d-none');
    document.getElementById('result-section').classList.add('d-none');
    document.getElementById('quiz-active-section').classList.remove('d-none');
    
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    
    if (currentIdx >= filteredQuestions.length) {
        showResults();
        return;
    }

    const q = filteredQuestions[currentIdx];
    
    // Update Meta Information
    const meta = document.getElementById('question-meta');
    if (meta) meta.innerText = `QUESTION ${currentIdx + 1} OF ${filteredQuestions.length}`;
    
    document.getElementById('question-text').innerText = q.text;

    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';

    // Create buttons for each option
    [q.option1, q.option2, q.option3, q.option4].forEach(opt => {
        if (opt) { // Only create button if option text exists
            const btn = document.createElement('button');
            btn.className = 'option-btn animate__animated animate__fadeInUp';
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(opt, q.correct_answer);
            grid.appendChild(btn);
        }
    });

    startTimer();
}

function startTimer() {
    let timeLeft = TIME_LIMIT;
    const bar = document.getElementById('timer-bar');
    const text = document.getElementById('timer-text');

    timer = setInterval(() => {
        timeLeft--;
        if (text) text.innerText = timeLeft + "s";
        if (bar) bar.style.width = (timeLeft / TIME_LIMIT) * 100 + "%";
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            currentIdx++;
            loadQuestion();
        }
    }, 1000);
}

function checkAnswer(selected, correct) {
    clearInterval(timer);
    
    // Strict string normalization for accurate scoring
    if (selected.trim().toLowerCase() === correct.trim().toLowerCase()) {
        score++;
    }
    
    currentIdx++;
    loadQuestion();
}

function showResults() {
    document.getElementById('quiz-active-section').classList.add('d-none');
    const resultSection = document.getElementById('result-section');
    resultSection.classList.remove('d-none');

    const total = filteredQuestions.length;
    const percentage = (score / total) * 100;
    const rating = (score / total) * 10;
    
    document.getElementById('ai-rating').innerText = rating.toFixed(1) + "/10";

    const feedbackText = document.getElementById('ai-feedback');
    const tipsList = document.getElementById('ai-tips');
    const actionContainer = document.getElementById('result-actions');
    
    tipsList.innerHTML = ''; 
    actionContainer.innerHTML = '';

    let feedback = "";
    let tips = [];
    let showNextLevel = false;

    // AI Performance Logic
    if (percentage >= 90) {
        feedback = "Mastery Level! Your logic is sharp and you've demonstrated a deep understanding of these concepts.";
        tips = [
            "Challenge: Try to explain these concepts to a peer to solidify your knowledge.",
            "Optimization: Can you solve similar logic problems with better time complexity?",
            "Next Step: You're ready for industry-level projects in this module."
        ];
        showNextLevel = true;
    } else if (percentage >= 70) {
        feedback = "Great job! You have a solid foundation. Just a few technical nuances left to polish.";
        tips = [
            "Pro-Tip: Re-read the documentation on the specific methods you missed.",
            "Strategy: Use the process of elimination for difficult multiple-choice questions.",
            "Goal: Try to get a 10/10 on this level before moving up."
        ];
        showNextLevel = true;
    } else if (percentage >= 40) {
        feedback = "Good effort! Some core concepts are still a bit shaky. Consistency is key here.";
        tips = [
            "Technique: Try writing out the code execution flow on paper.",
            "Pacing: You have 15s per question; don't be afraid to take an extra 2 seconds to think.",
            "Review: Revisit your basic notes for this module before retrying."
        ];
        showNextLevel = false; 
    } else {
        feedback = "Knowledge Gap Detected. This topic seems challenging right now, but that's where the growth happens!";
        tips = [
            "Action: Spend 20 minutes watching a fundamental tutorial on this specific topic.",
            "Logic: Focus on 'Why' a certain method is used, not just 'How'.",
            "Support: Don't hesitate to go back to the 'Easy' level to build confidence."
        ];
        showNextLevel = false;
    }

    feedbackText.innerText = feedback;
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.className = "mb-2 animate__animated animate__fadeInLeft";
        li.innerText = tip;
        tipsList.appendChild(li);
    });

    // Progression Buttons Logic
    const currentDiff = filteredQuestions[0].difficulty.toLowerCase().trim();
    let nextDiff = currentDiff === "easy" ? "medium" : currentDiff === "medium" ? "hard" : null;

    if (showNextLevel && nextDiff) {
        const nextBtn = document.createElement('button');
        nextBtn.className = "btn btn-purple-gradient w-100 mb-3 rounded-pill py-3 fw-bold shadow-sm";
        nextBtn.innerText = `Unlock ${nextDiff.toUpperCase()} Mode`;
        nextBtn.onclick = () => beginQuiz(nextDiff);
        actionContainer.appendChild(nextBtn);
    } else {
        const retryBtn = document.createElement('button');
        retryBtn.className = "btn btn-outline-purple w-100 mb-3 rounded-pill py-3 fw-bold";
        retryBtn.innerText = "Retry This Level";
        retryBtn.onclick = () => beginQuiz(currentDiff);
        actionContainer.appendChild(retryBtn);
    }

    const dashboardBtn = document.createElement('button');
    dashboardBtn.className = "btn btn-light w-100 rounded-pill py-3 text-muted border";
    dashboardBtn.innerText = "Explore Other Topics";
    dashboardBtn.onclick = () => window.location.href = 'dashboard.html';
    actionContainer.appendChild(dashboardBtn);
}