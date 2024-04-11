const darkModeToggle = document.querySelector("#chk");
const modalOpenBtn = document.getElementById("condition-modal-btn");
const modalContainer = document.querySelector(".quiz-modal-container");
const modalConditionBox = modalContainer.querySelector(".quiz-modal-condition");
const exitModal = modalConditionBox.querySelector(".exit-modal");
const startQuizBtn = modalConditionBox.querySelector(".start-quiz");
const questionSection = document.querySelector(".question-section");
const questionText = questionSection.querySelector(".question-text");
const questionOptionContainer =
  questionSection.querySelector(".question-options");
const questionProgressText = questionSection.querySelector(
  ".question-progress-text"
);
const timeText = questionSection.querySelector(".time-count");
const nextQuiz = questionSection.querySelector(".next-question");
const scoreElement = questionSection.querySelector(".score");
const timelineElement = questionSection.querySelector(".timeline");
const questionProgressbar = questionSection.querySelector(".question-progress");
const resultSection = document.querySelector(".result-section");
const canvas = document.getElementById("my-canvas");
const resultExpression = resultSection.querySelector(".result-expression");
const resultText = resultSection.querySelector(".result-text");
const resultFeedback = resultSection.querySelector(".feedback");
const restart = resultSection.querySelector(".restart");
const backHome = resultSection.querySelector(".back-to-home");
const loadingContainer = document.querySelector(".loading-container");


let questionIndex = 0;
let timeCount;
let userScore = 0;
let counter;
let timelineCounter;

const tick = document.createElement("div");
tick.classList.add("tick-icon");
tick.innerHTML = `<i class="fa-solid fa-check"></i>`;


const cross = document.createElement("div");
cross.classList.add("cross-icon");
cross.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

var confettiSettings = {
  target: "my-canvas",
  max: "250",
  size: "1.8",
  rotate: true,
  clock: "29",
  start_from_edge: true,
};
var confetti = new ConfettiGenerator(confettiSettings);

const modalFunc = (condition) => {
  if (condition === "open") {
    modalConditionBox.classList.add("active");
    document.body.style.overflow = "hidden";
    if (document.body.classList.contains("dark-mode")) {
      modalContainer.classList.add("active-dark");
    } else {
      modalContainer.classList.add("active");
    }
  } else {
    modalConditionBox.classList.remove("active");
    document.body.style.overflow = "auto";
    if (document.body.classList.contains("dark-mode")) {
      modalContainer.classList.remove("active-dark");
    } else {
      modalContainer.classList.remove("active");
    }
  }
};

const initialShowQuestion = () => {
  resultSection.classList.remove("active");
  canvas.style.display = "none";

  questionIndex = 0;
  userScore = 0;
  scoreElement.textContent = userScore;
};

const showQuestion = () => {
  questionSection.classList.add("active");

  timer();

  timelineFunc();

  if (document.querySelectorAll(".single-option")) {
    document
      .querySelectorAll(".single-option")
      .forEach((element) => element.remove());
  }

  questionText.textContent = `${questionIndex + 1}. ${
    quizArr[questionIndex].question
  }`;

  const options = quizArr[questionIndex].options;

  for (let option in options) {
    let singleQuestionElement = document.createElement("div");
    singleQuestionElement.classList.add("single-option");
    singleQuestionElement.innerHTML = `
    <span class="single-option-text"> ${option}.  ${options[option]}</span>`;
    singleQuestionElement.addEventListener("click", (e) =>
      selectedAnswer(option, e)
    );
    questionOptionContainer.append(singleQuestionElement);
  }

  questionProgress();

  nextQuiz.style.display = "none";
};

const timelineFunc = () => {
  timelineElement.style.width = `100%`;
  timeText.textContent = 10;

  timelineCounter = setInterval(() => {
    const getTime = Number(timeText.textContent);

    timelineElement.style.width = `${getTime * 10}%`;
  }, 1000);
};
const selectedAnswer = (option, e) => {
  clearInterval(counter);

  clearInterval(timelineCounter);

  const selectedOption = option;
  const correctOption = quizArr[questionIndex].answer;
  if (selectedOption === correctOption) {
    userScore += 5;
    scoreElement.textContent = userScore;
    showIconTick(e, true);
  } else {
    showIconTick(e, false);
    showCorrectAnswer();
  }

  const singleOption = document.querySelectorAll(".single-option");
  singleOption.forEach((element) => element.classList.add("disabled"));
  nextQuizBtnChange();
};

const showIconTick = (e, isTick) => {
  if (e.target.classList.contains("single-option")) {
    e.target.children[0].insertAdjacentElement(
      "afterend",
      isTick === true ? tick : cross
    );
    e.target.classList.add(isTick === true ? "correct" : "incorrect");
  } else {
    e.target.insertAdjacentElement("afterend", isTick === true ? tick : cross);
    e.target.parentNode.classList.add(
      isTick === true ? "correct" : "incorrect"
    );
  }
};

const showCorrectAnswer = () => {
  const singleOption = document.getElementsByClassName("single-option");

  const correctOption = quizArr[questionIndex].answer;

  for (let option of singleOption) {
    if (option.textContent.trim().slice(0, 1) == correctOption) {
      option.children[0].insertAdjacentElement("afterend", tick);
      option.classList.add("correct");
    }

    option.classList.add("disabled");
  }
};

const questionProgress = () => {
  questionProgressbar.style.width = `${
    ((questionIndex + 1) / quizArr.length) * 100
  }%`;

  questionProgressText.innerHTML = `<span class="bold">${
    questionIndex + 1
  } </span> of  <span class="bold">${quizArr.length}</span> Questions`;
};

const timer = () => {
  timeCount = 10;
  timeText.textContent = timeCount;
  counter = setInterval(() => {
    timeCount--;
    timeText.textContent = timeCount;
    if (timeCount == 0) {
      timeText.textContent = "0" + timeCount;
      timelineElement.style.width = `0%`;

      // Clear the time counter and timeline counter
      clearInterval(timelineCounter);

      showCorrectAnswer();

      nextQuizBtnChange();
    } else {
      timeText.textContent = "0" + timeCount;
    }
  }, 1000);
};

const nextQuizBtnChange = () => {
  nextQuiz.style.display = "block";
  if (questionIndex === quizArr.length - 1) {
    nextQuiz.textContent = "Natijani ko'rish";
  } else {
    nextQuiz.textContent = "Keyingisi";
  }
};

const showResult = () => {
  questionSection.classList.remove("active");
  resultSection.classList.add("active");
  canvas.style.display = "block";

  resultText.textContent = `Sizning ballingiz: ${userScore} `;

  scoreFeedback(userScore);
};

/*
! - Score Feedback Function
*/
const scoreFeedback = (userScore) => {
  // the result will show according to the score
  if (userScore >= 80 && userScore <= 100) {
    confettiStart();
    resultFeedback.textContent = `Yaxshi ishlashda davom eting va o'z mahoratingizni namoyish etishda davom eting.`;
  } else if (userScore >= 60 && userScore < 80) {
    confettiStart();
    resultFeedback.textContent = `Siz geometriyani yaxshi tushunasiz, o'z mahoratingiz va tushunchangizni yaxshilash uchun ishlashda davom eting. Sizning ishlashingiz yaxshi, lekin qo'shimcha mashg'ulot va diqqat bilan siz ushbu mavzuda muvaffaqiyat qozonishingiz mumkin. `;
  } else if (userScore >= 40 && userScore < 60) {
    confettiStart();
    resultFeedback.textContent = `Siz geometriyani adolatli tushunasiz, lekin yaxshilash uchun joy bor. Tushunish va ko'nikmalaringizni mustahkamlash uchun mashq qilish va materialni ko'rib chiqishni davom ettirish muhimdir. Men ushbu mavzuni yaxshilashga yordam beradigan qo'shimcha manbalar va yordam izlashni taklif qilaman.`;
  } else {
    confetti.clear();
    resultExpression.textContent = `Yaxshilash kerak!!!`;
    resultFeedback.textContent = `Bu viktorina natijasi qoniqarli emas, siz Geometriya bo'yicha cheklangan tushunchaga ega ekanligingiz aniq. Ushbu mavzu bo'yicha tushuncha va ko'nikmalaringizni yaxshilash uchun qo'shimcha kuch sarflash va yordam so'rash muhimdir. Ishingizni yaxshilash uchun materialni ko'rib chiqishni va muntazam ravishda mashq qilishni taklif qilaman.`;
  }
};

/*
! - Confetti Start Functionality
*/
const confettiStart = () => {
  setTimeout(() => confetti.render(), 500);
};

/* ==========================
! - Event Listeners
============================*/

// Switch dark mode event listener
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Modal Open Button Event listener
modalOpenBtn.addEventListener("click", () => {
  modalFunc("open");
});

// Exit Modal Button Event Listener
exitModal.addEventListener("click", () => {
  modalFunc("close");
});

//When Click on the modal container, the modal will be closed
modalContainer.addEventListener("click", (e) => {
  if (e.target == modalContainer) {
    modalFunc("close");
  }
});

// Start Quiz Event Listener
startQuizBtn.addEventListener("click", () => {
  // Close the modal
  modalFunc("close");

  // before question start, there will be a loading state, after the first question, the loading option will not be shown
  if (questionIndex === 0) {
    loadingContainer.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      loadingContainer.style.display = "none";
      showQuestion();
    }, 2500);
  } else {
    //   Show the question
    showQuestion();
  }

  // From the beginning the score will be 0
  scoreElement.textContent = 0;
});

// Next Quiz Event listener
nextQuiz.addEventListener("click", () => {
  // Increasing the question index
  questionIndex++;

  // if the question completed then the result will show
  if (questionIndex > quizArr.length - 1) {
    showResult();
  } else {
    // Show the Question
    showQuestion();
  }
});

// Restart Event functionality
restart.addEventListener("click", () => {
  // some initial task will show before shoing question
  // like - removing the result section, and reset the time and score as well
  initialShowQuestion();

  // before question start, there will be a loading state, after the first question, the loading option will not be shown
  if (questionIndex === 0) {
    loadingContainer.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      loadingContainer.style.display = "none";
      showQuestion();
    }, 2500);
  } else {
    //   Show the question
    showQuestion();
  }
});

// Back To Home Event listner
backHome.addEventListener("click", () => {
  // some initial task will show before shoing question
  // like - removing the result section, and reset the time and score as well
  initialShowQuestion();
});

window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker register success", reg);
    } catch (e) {
      console.log("Service worker register fail");
    }
  }

  await loadPosts();
});
