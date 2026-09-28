const quizData = [
  {
    title: "世界上国土面积最大的国家是？",
    answers: ["中国", "俄罗斯", "加拿大", "美国"],
    correctAnswer: 1
  },
  {
    title: "法国的首都是哪里？",
    answers: ["伦敦", "柏林", "巴黎", "马德里"],
    correctAnswer: 2
  },
  {
    title: "HTML 的全称是什么？",
    answers: ["超文本标记语言", "高级文本语言", "超链接语言", "主页工具语言"],
    correctAnswer: 0
  },
  {
    title: "在JavaScript中，哪个关键字用于声明常量？",
    answers: ["var", "let", "const", "static"],
    correctAnswer: 2
  },
  {
    title: "CSS 的主要作用是什么？",
    answers: ["处理数据逻辑", "描述网页样式", "连接数据库", "编写后端接口"],
    correctAnswer: 1
  }
];

const dom = {
  homeView: document.getElementById("home-view"),
  questionView: document.getElementById("question-view"),
  endView: document.getElementById("end-view"),
  
  qTitle: document.getElementById("q-title"),
  qProgress: document.getElementById("q-progress"),
  scoreTracker: document.getElementById("score-tracker"),
  choicesContainer: document.getElementById("choices-container"),
  barFill: document.getElementById("bar-fill"),
  
  summaryScore: document.getElementById("summary-score"),
  summaryFeedback: document.getElementById("summary-feedback"),
  
  btnStart: document.getElementById("btn-start"),
  btnRetry: document.getElementById("btn-retry")
};

let currentQuesIndex = 0;
let userScore = 0;
let isClickLocked = false;

function switchView(targetView) {
  [dom.homeView, dom.questionView, dom.endView].forEach(view => {
    view.classList.remove("active");
  });
  targetView.classList.add("active");
}

function initQuiz() {
  currentQuesIndex = 0;
  userScore = 0;
  isClickLocked = false;
  switchView(dom.questionView);
  displayQuestion();
}

function displayQuestion() {
  const currentQ = quizData[currentQuesIndex];
  isClickLocked = false;

  dom.qTitle.textContent = currentQ.title;
  dom.qProgress.textContent = `题目: ${currentQuesIndex + 1} / ${quizData.length}`;
  dom.scoreTracker.textContent = `当前得分: ${userScore}`;

  const progressPercentage = ((currentQuesIndex + 1) / quizData.length) * 100;
  dom.barFill.style.width = `${progressPercentage}%`;

  dom.choicesContainer.innerHTML = "";
  currentQ.answers.forEach((ansText, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-item";
    btn.textContent = ansText;
    btn.onclick = () => handleChoiceSelection(i, btn);
    dom.choicesContainer.appendChild(btn);
  });
}

function handleChoiceSelection(selectedIndex, clickedBtn) {
  if (isClickLocked) return;
  isClickLocked = true;

  const currentQ = quizData[currentQuesIndex];
  const allChoiceBtns = dom.choicesContainer.querySelectorAll(".choice-item");
  
  allChoiceBtns.forEach(b => (b.disabled = true));

  if (selectedIndex === currentQ.correctAnswer) {
    clickedBtn.classList.add("is-correct");
    userScore++;
    dom.scoreTracker.textContent = `当前得分: ${userScore}`;
  } else {
    clickedBtn.classList.add("is-wrong");
    allChoiceBtns[currentQ.correctAnswer].classList.add("is-correct");
  }

  setTimeout(() => {
    currentQuesIndex++;
    if (currentQuesIndex < quizData.length) {
      displayQuestion();
    } else {
      displayEndScreen();
    }
  }, 1000);
}

function displayEndScreen() {
  dom.summaryScore.textContent = `最终成绩: ${userScore} / ${quizData.length}`;

  let feedbackTxt = "";
  if (userScore === quizData.length) {
    feedbackTxt = "完美！你是一个知识达人！";
  } else if (userScore >= quizData.length - 2) {
    feedbackTxt = "干得好！成绩很不错！";
  } else {
    feedbackTxt = "再接再厉，相信你可以做得更好！";
  }
  dom.summaryFeedback.textContent = feedbackTxt;

  switchView(dom.endView);
}

dom.btnStart.addEventListener("click", initQuiz);
dom.btnRetry.addEventListener("click", initQuiz);

switchView(dom.homeView);
