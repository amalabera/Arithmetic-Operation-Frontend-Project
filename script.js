let numQuestions = 5;
let numberRange = 10;
let operation = "add";
let timerDuration = 10; // in seconds
let currentQuestion = 0;
let correctAnswers = 0;
let startTime;
let questions = [];
let timerInterval;

document.getElementById("startBtn").addEventListener("click", startQuiz);

function startQuiz() {
    numQuestions = parseInt(document.getElementById("numQuestions").value);
    numberRange = parseInt(document.getElementById("numberRange").value);
    operation = document.getElementById("operations").value;
    timerDuration = parseInt(document.getElementById("timer").value);

    generateQuestions();
    document.getElementById("settings").style.display = "none";
    document.getElementById("questionnaire").style.display = "block";
    document.getElementById("totalQuestions").textContent = numQuestions;
    showQuestion();
    startTime = new Date();
}

function generateQuestions() {
    questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const num1 = Math.floor(Math.random() * numberRange) + 1;
        const num2 = Math.floor(Math.random() * numberRange) + 1;
        questions.push({ num1, num2 });
    }
}

function showQuestion() {
    if (currentQuestion >= numQuestions) {
        endQuiz();
        return;
    }

    const { num1, num2 } = questions[currentQuestion];
    let questionText =` ${num1} + ${num2}`;
    if (operation === "subtract") questionText = `${num1} - ${num2}`;
    if (operation === "multiply") questionText =`${num1} * ${num2}`;
    if (operation === "divide") questionText = `${num1} ÷ ${num2}`;

    document.getElementById("questionText").textContent = questionText;
    document.getElementById("currentQuestion").textContent = currentQuestion + 1;

    startTimer();
}

function startTimer() {
    let timeLeft = timerDuration;
    document.getElementById("timeRemaining").textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timeRemaining").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(true); // Automatically move to the next question if time runs out
        }
    }, 1000);
}

document.getElementById("submitAnswerBtn").addEventListener("click", () => checkAnswer(false));

function checkAnswer(timeOut) {
    const userAnswer = parseFloat(document.getElementById("answerInput").value);
    const { num1, num2 } = questions[currentQuestion];
    let correctAnswer;

    if (operation === "add") correctAnswer = num1 + num2;
    if (operation === "subtract") correctAnswer = num1 - num2;
    if (operation === "multiply") correctAnswer = num1 * num2;
    if (operation === "divide") correctAnswer = (num1 / num2).toFixed(2);

    if (!timeOut && userAnswer == correctAnswer) {
        correctAnswers++;
        document.getElementById("feedback").textContent = "Correct!";
    } else {
        document.getElementById("feedback").textContent = `Wrong! The correct answer is ${correctAnswer}.`;
    }

    currentQuestion++;
    clearInterval(timerInterval);
    setTimeout(() => {
        document.getElementById("feedback").textContent = "";
        document.getElementById("answerInput").value = "";
        showQuestion();
    }, 1000);
}

function endQuiz() {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    document.getElementById("questionnaire").style.display = "none";
    document.getElementById("result").style.display = "block";

    const percentage = ((correctAnswers / numQuestions) * 100).toFixed(2);

    document.getElementById("score").textContent = `You answered ${correctAnswers} out of ${numQuestions} questions correctly (${percentage}%).`;
    document.getElementById("timeTaken").textContent = `Time taken: ${timeTaken} seconds.`;

    renderChart(percentage);
}

function renderChart(percentage) {
    const ctx = document.getElementById("resultChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Correct Answers", "Incorrect Answers"],
            datasets: [
                {
                    data: [percentage, 100 - percentage],
                    backgroundColor: ["#4CAF50", "#F44336"],
                },
            ],
        },
    });
}