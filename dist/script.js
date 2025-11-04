"use strict";
/* ------ INTERFACES ------ */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* ------ GLOBAL VARIABLES ------ */
const questionArray = [];
// questions from local storage to use when testing, if we hit API limit
let storedQuestionArray = [];
let index = 0;
let chosenAnswer = "";
let accumulatedScore = 0;
/* ------ DOM ELEMENTS ------ */
const filterForm = document.getElementById("filter-form");
const quizContainer = document.getElementById("quiz-container");
const question = document.getElementById("question");
const answers = document.getElementById("answers");
const conclusionDiv = document.getElementById("conclusion");
const submitAnswerButton = document.getElementById("submitAnswerBtn");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const finishQuizBtn = document.getElementById("finishQuizBtn");
/* ------ FETCH API DATA ------ */
const fetchQuizAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    const stored = localStorage.getItem("quizSettings");
    const settings = JSON.parse(stored);
    console.log("Loaded quiz settings:", settings);
    const APIUrl = `https://opentdb.com/api.php?amount=${settings.amount}&category=${settings.category}&difficulty=${settings.difficulty}&type=multiple`;
    try {
        const response = yield fetch(APIUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        const fetchedQuizQuestions = data.results;
        fetchedQuizQuestions.map(object => {
            // create an array with all answers, despite correct/incorrect
            const allAnswers = object.incorrect_answers;
            const correctAnswer = object.correct_answer;
            allAnswers.push(correctAnswer);
            const questionObject = {
                question: decodeString(object.question),
                category: object.category,
                difficulty: object.difficulty,
                allAnswers: allAnswers.map(answer => decodeString(answer)),
                correctAnswer: decodeString(object.correct_answer)
            };
            questionArray.push(questionObject);
        });
        console.log("Quiz questions fetched:", questionArray);
        // incrementIndex(); fucks up stepper, starts at 2 all the time, fix below
        insertQuestionsAndAnswers(questionArray, index);
    }
    catch (error) {
        console.error("Fetch error:", error);
        // add error message on start page
    }
    // save question array to local storage to have when testing
    localStorage.setItem("storedQuestionArray", JSON.stringify(questionArray));
    storedQuestionArray = JSON.parse(localStorage.getItem("storedQuestionArray"));
});
/* ------ LOGIC ------ */
// decode strings with with symbol coding (ampersands etc.) for special characters
const decodeString = (string) => {
    // create a HTML textarea element with the string
    const textarea = document.createElement('textarea');
    textarea.innerHTML = string;
    // when the browser sees the symbol coding in the HTML text area it will automatically transform it into real letters
    const decodedString = textarea.value;
    return decodedString;
};
const incrementIndex = () => {
    if (index < questionArray.length - 1) {
        index++;
        insertQuestionsAndAnswers(questionArray, index);
    }
    // hide the nextQuestonBtn and show finishQuizBtn when clicking on submit answer on the last question
    if (index === questionArray.length - 1) {
        submitAnswerButton.addEventListener("click", () => {
            nextQuestionBtn.classList.add("hidden");
            finishQuizBtn.classList.remove("hidden");
            alert(`You did it! Here we will show a modal later on with the player's score!`);
        });
    }
};
const renderStepper = () => {
    const oldStepper = document.querySelector(".stepper-container");
    if (oldStepper)
        oldStepper.remove();
    const stepperEl = document.createElement('div');
    stepperEl.classList.add("stepper-container", "flex", "items-center", "justify-center", "gap-2", "mb-4");
    const total = questionArray.length;
    const stepList = Array.from({ length: total }).map((question, i) => `
      <li class="stepper-item ${i === index ? "text-white bg-[#6481B1]" : "text-gray-400 bg-[#4D5563]"} rounded-full w-3 h-3 flex items-center justify-center">
        <span class="hidden">${i + 1} of ${questionArray.length}</span>
      </li>
    `)
        .join("");
    stepperEl.innerHTML = `
    <div class="flex flex-col items-center gap-2 fixed top-4 left-0 right-0">
      <ul class="stepper flex gap-2">
        ${stepList}
      </ul>
      <p class="text-sm text-white">${index + 1} of ${questionArray.length}</p>
    </div>`;
    question.before(stepperEl);
};
const shuffleAnswers = (array) => {
    // swap each answer with a random answer, starting from the last answer in the list until i is equal to the first item
    for (let i = array.length - 1; i > 0; i--) {
        const randomAnswerInList = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomAnswerInList]] = [array[randomAnswerInList], array[i]];
    }
};
const insertQuestionsAndAnswers = (array, index) => {
    renderStepper();
    // empty elements before filling them
    question.innerHTML = "";
    answers.innerHTML = "";
    conclusionDiv.innerHTML = "";
    const answerList = array[index].allAnswers;
    // insert data for question and answers
    question.innerHTML += `
    <h1 class="text-center">${array[index].question}</h1>
  `;
    // sort array items in a random order, so that the correct answer is not always the last item
    shuffleAnswers(answerList);
    console.log(answerList);
    answerList.forEach(answer => {
        answers.innerHTML += ` 
      <button class="answer-button rounded-sm p-4 text-white w-full md:w-1/2 bg-[rgba(56,65,82,1)]">${answer}</button>
     `;
    });
};
const checkAnswer = (chosenAnswer, index) => {
    var _a;
    document.querySelectorAll(".answer-button").forEach(btn => {
        var _a;
        // reset styling for borders/outlines on the buttons
        btn.className = "answer-button rounded-sm p-4 w-full md:w-1/2";
        // change styling of buttons to showcase right/wrong answers
        if (btn.innerText === ((_a = questionArray[index]) === null || _a === void 0 ? void 0 : _a.correctAnswer)) {
            btn.classList.add("bg-[rgba(56,82,64,1)]", "outline", "outline-3", "outline-[rgba(150,231,110,1)]");
            btn.classList.add("text-[rgba(150,231,110,1)]");
            btn.classList.add("outline", "outline-3", "outline-[rgba(150,231,110,1)]");
        }
        else {
            btn.classList.add("bg-[rgba(82,63,56,1)]");
            btn.classList.add("text-[rgba(231,110,110,1)]");
            btn.classList.add("outline", "outline-3", "outline-[rgba(231,110,110,1)]");
        }
    });
    // display message of choice and right/wrong answer
    if (chosenAnswer === ((_a = questionArray[index]) === null || _a === void 0 ? void 0 : _a.correctAnswer)) {
        conclusionDiv.innerHTML = `
    <p class="p-4 text-[rgba(150,231,110,1)] bg-[rgba(56,82,64,1)]">You chose ${chosenAnswer} - It's the right answer. Good job!</p>
  `;
    }
    else {
        conclusionDiv.innerHTML = `
    <p class="p-4 text-[rgba(231,110,110,1)] bg-[rgba(82,63,56,1)]">You chose ${chosenAnswer} - Unfortunately, it's the wrong answer. Bad job!</p>
  `;
    }
};
// TO DO: add fast answer under 5 s = +5 extra
const countAndSaveScore = () => {
    var _a;
    if (chosenAnswer === ((_a = questionArray[index]) === null || _a === void 0 ? void 0 : _a.correctAnswer)) {
        // update score
        let quizSettings = JSON.parse(localStorage.getItem("quizSettings"));
        accumulatedScore = accumulatedScore + 10;
        quizSettings.score = accumulatedScore;
        // save it back to local storage
        localStorage.setItem("quizSettings", JSON.stringify(quizSettings));
    }
};
/* ------ Fetch scores ------ */
const SCORE_API_URL = `https://postgres.daniellauding.se/quiz_scores`;
const fetchScores = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(SCORE_API_URL);
        const result = yield response.json();
        // Sortera högst först (valfritt)
        result.sort((a, b) => b.score - a.score);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        console.log(result);
        // html.innerHTML = result;
        console.log(result.length);
        /* result.map((player, i) => {
          console.log(player.username);
          return html.innerHTML += player.username;
        }); */
        const html = result.map((player, i) => `
      <li class="grid grid-cols-5 justify-center gap-x odd:bg-[rgba(56,65,82,1)] even:bg-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,1)] text-xs font-medium py-3 px-4 rounded-4 player-${i}">
        <span>${i + 1}</span>
        <span>${player.username}</span>
        <span>${player.score} points</span>
        <span>${player.amount}</span>
        <span>${player.difficulty}</span>
      </li>
    `).join("");
        document.getElementById("user-scores").innerHTML = html;
        result.forEach((element) => console.log(element));
    }
    catch (error) {
        console.error('Error:', error);
    }
});
/* ------ Post scores ------ */
// async function postScore(username, score) {
const postScore = (username, category, score, difficulty, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Posting new to scoreboard:", username);
    const response = yield fetch(SCORE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ username, score })
        body: JSON.stringify({
            username,
            score,
            category: String(category),
            difficulty: difficulty.toLowerCase(),
            amount,
        })
    });
    if (!response.ok)
        throw new Error(`Server error: ${response.status}`);
    try {
        const result = yield response.json();
        console.log("✅ Posted successfully:", result);
        return result;
    }
    catch (_a) {
        console.warn("⚠️ Server returned no JSON body");
        return {};
    }
});
finishQuizBtn === null || finishQuizBtn === void 0 ? void 0 : finishQuizBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Finish button clicked");
    const stored = localStorage.getItem("quizSettings");
    if (!stored) {
        alert("⚠️ No player data found. Start a quiz first!");
        return;
    }
    const { player, category, difficulty, amount, score } = JSON.parse(stored);
    if (!player) {
        alert("⚠️ No player name found in local storage.");
        return;
    }
    try {
        console.log("📤 Posting score for:", player);
        // Example: here you could calculate score from quiz results
        // const score = 0;
        yield postScore(player, category, score, difficulty, amount);
        console.log("✅ Score posted successfully!");
        // Optional: clear data or redirect
        // localStorage.removeItem("quizSettings");
        window.location.href = "scoreboard.html";
    }
    catch (error) {
        console.error("❌ Error posting score:", error);
        alert("Something went wrong while saving your score.");
    }
}));
/* ------ EVENT LISTENER ------ */
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield fetchQuizAPI();
    if (document.getElementById("score-list"))
        fetchScores();
}));
filterForm === null || filterForm === void 0 ? void 0 : filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const category = formData.get("category");
    const difficulty = formData.get("difficulty").toLowerCase();
    const amount = formData.get("number-of-questions");
    const player = formData.get("player-name");
    const score = accumulatedScore;
    // save the inputs from the submitted filter form to local storage
    localStorage.setItem("quizSettings", JSON.stringify({
        category,
        difficulty,
        amount,
        player,
        score,
    }));
    // navigate to quiz page
    window.location.href = "quiz.html";
});
submitAnswerButton === null || submitAnswerButton === void 0 ? void 0 : submitAnswerButton.addEventListener("click", () => {
    submitAnswerButton.classList.add("hidden");
    nextQuestionBtn.classList.remove("hidden");
    checkAnswer(chosenAnswer, index);
    countAndSaveScore();
});
nextQuestionBtn === null || nextQuestionBtn === void 0 ? void 0 : nextQuestionBtn.addEventListener("click", () => {
    submitAnswerButton.classList.remove("hidden");
    nextQuestionBtn.classList.add("hidden");
    incrementIndex();
});
answers === null || answers === void 0 ? void 0 : answers.addEventListener("click", (e) => {
    const target = e.target || null;
    const clickedAnswerButton = (target === null || target === void 0 ? void 0 : target.closest(".answer-button")) || null;
    if (clickedAnswerButton) {
        chosenAnswer = clickedAnswerButton.innerText;
    }
    // reset styling (outline) on all buttons
    document.querySelectorAll(".answer-button").forEach(btn => {
        btn.classList.remove("outline", "outline-3", "outline-[rgba(110,157,231,1)]");
    });
    // highlight chosen button with outline
    clickedAnswerButton.classList.toggle("outline");
    clickedAnswerButton.classList.toggle("outline-3");
    clickedAnswerButton.classList.toggle("outline-[rgba(110,157,231,1)]");
});
//# sourceMappingURL=script.js.map