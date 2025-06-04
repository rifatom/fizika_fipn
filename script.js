let pitanja = [];
let currentIndex = 0;
let score = 0;

const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const resultDiv = document.getElementById('result');
const quizContainer = document.getElementById('quiz-container');
const scoreText = document.getElementById('score-text');
const restartBtn = document.getElementById('restart-btn');
const ctx = document.getElementById('chart').getContext('2d');

let chart;

async function loadQuestions() {
  const response = await fetch('pitanja.json');
  pitanja = await response.json();
  startQuiz();
}

function startQuiz() {
  currentIndex = 0;
  score = 0;
  quizContainer.style.display = 'block';
  resultDiv.style.display = 'none';
  nextBtn.disabled = true;
  showQuestion();
}

function showQuestion() {
  const q = pitanja[currentIndex];
  questionNumberEl.textContent = `Pitanje ${currentIndex + 1} od ${pitanja.length}`;
  questionTextEl.textContent = q.pitanje;
  answersEl.innerHTML = '';
  nextBtn.disabled = true;

  q.odgovori.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.addEventListener('click', () => selectAnswer(index, btn));
    answersEl.appendChild(btn);
  });
}

function selectAnswer(selectedIndex, btn) {
  const q = pitanja[currentIndex];
  const buttons = answersEl.querySelectorAll('button');

  buttons.forEach(b => {
    b.disabled = true;
    b.classList.remove('correct', 'incorrect');
  });

  if (selectedIndex === q.tacan) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('incorrect');
    buttons[q.tacan].classList.add('correct');
  }

  nextBtn.disabled = false;
  updateProgress();
}

function updateProgress() {
  const procenat = ((score / (currentIndex + 1)) * 100).toFixed(2);
  questionNumberEl.textContent = `Pitanje ${currentIndex + 1} od ${pitanja.length} | Tačno: ${score} (${procenat}%)`;
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < pitanja.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizContainer.style.display = 'none';
  resultDiv.style.display = 'block';
  scoreText.textContent = `Ukupno tačnih odgovora: ${score} od ${pitanja.length} (${((score / pitanja.length) * 100).toFixed(2)}%)`;
  drawChart();
}

restartBtn.addEventListener('click', () => {
  startQuiz();
});

function drawChart() {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Tačni odgovori', 'Netačni odgovori'],
      datasets: [{
        label: 'Rezultat',
        data: [score, pitanja.length - score],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: pitanja.length
        }
      }
    }
  });
}

loadQuestions();
