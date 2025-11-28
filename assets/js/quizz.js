const questionElem = document.getElementById("question");
const answersElem = document.getElementById("answers");
const nextBtn = document.getElementById("next");
const menuElem = document.getElementById("menu");

let questions = [];
let current = 0;
let correctCount = 0;

init();

// Initialize quiz: load JSON, create menu, show first question
function init() {
    const quiz = new URLSearchParams(window.location.search).get("quiz") || "1";

    fetch(`quizzes/quizzes.json`)
        .then(res => res.json())
        .then(data => {
            questions = data[`quiz${quiz}`];

            if (!questions) {
                questionElem.textContent = "Quiz not found.";
                return;
            }

            createMenu();
            showQuestion();
        })
        .catch(() => {
            questionElem.textContent = "Loading error.";
        });
}

// Create side menu items for all questions
function createMenu() {
    menuElem.innerHTML = "";

    questions.forEach((_, index) => {
        const li = document.createElement("li");
        li.textContent = `Question ${index + 1}`;

        li.addEventListener("click", () => {
            current = index;
            showQuestion();
        });

        menuElem.appendChild(li);
    });
}

// Display current question and answer buttons
function showQuestion() {
    const q = questions[current];

    questionElem.textContent = q.text;
    answersElem.innerHTML = "";

    // Highlight
    menuElem.querySelectorAll("li").forEach((li, idx) => {
        li.classList.toggle("active", idx === current);
    });

     // Create buttons for each answer option
    q.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;

        btn.addEventListener("click", () => handleAnswer(btn, index === q.correct));

        answersElem.appendChild(btn);
    });
}

// Handle answer selection: color buttons, count correct answers
function handleAnswer(btn, isCorrect) {
    btn.style.background = isCorrect ? "lightgreen" : "lightcoral";

    if (isCorrect) correctCount++;

    answersElem.querySelectorAll("button").forEach(b => (b.disabled = true));
}

// Next button handler: move to next question or show result
nextBtn.addEventListener("click", () => {
    current++;
    if (current >= questions.length) {
        localStorage.setItem("quizScore", correctCount);
        localStorage.setItem("quizTotal", questions.length);
        window.location.href = "result.html";
        return;
    }
    showQuestion();
});
