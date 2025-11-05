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
const startButton = document.getElementById("startBtn");
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
const celebrationModal = () => {
    var _a, _b;
    (_a = document.getElementById("celebration-modal")) === null || _a === void 0 ? void 0 : _a.remove();
    const modal = document.createElement("dialog");
    modal.id = "celebration-modal";
    modal.classList.add("p-6", "rounded-xl", "backdrop:bg-black/50", "text-center", "my-auto", "mx-auto", "bg-[#101626]");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "celebration-title");
    const svg = `<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.875 18.75C15.3832 18.75 13.9524 19.3426 12.8975 20.3975C11.8426 21.4524 11.25 22.8832 11.25 24.375C11.25 25.8668 11.8426 27.2976 12.8975 28.3525C13.9524 29.4074 15.3832 30 16.875 30H22.5C24.5711 30 26.25 31.6789 26.25 33.75C26.25 35.8211 24.5711 37.5 22.5 37.5H16.875C13.394 37.5 10.0556 36.1172 7.59422 33.6558C5.13281 31.1944 3.75 27.856 3.75 24.375C3.75 20.894 5.13281 17.5556 7.59422 15.0942C10.0556 12.6328 13.394 11.25 16.875 11.25H22.5C24.5711 11.25 26.25 12.9289 26.25 15C26.25 17.0711 24.5711 18.75 22.5 18.75H16.875Z" fill="#E7E56E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M63.75 15C63.75 12.9289 65.4289 11.25 67.5 11.25H73.125C76.606 11.25 79.9444 12.6328 82.4058 15.0942C84.8672 17.5556 86.25 20.894 86.25 24.375C86.25 27.856 84.8672 31.1944 82.4058 33.6558C79.9444 36.1172 76.606 37.5 73.125 37.5H67.5C65.4289 37.5 63.75 35.8211 63.75 33.75C63.75 31.6789 65.4289 30 67.5 30H73.125C74.6168 30 76.0476 29.4074 77.1025 28.3525C78.1574 27.2976 78.75 25.8668 78.75 24.375C78.75 22.8832 78.1574 21.4524 77.1025 20.3975C76.0476 19.3426 74.6168 18.75 73.125 18.75H67.5C65.4289 18.75 63.75 17.0711 63.75 15Z" fill="#E7E56E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 82.5C11.25 80.4289 12.9289 78.75 15 78.75H75C77.0711 78.75 78.75 80.4289 78.75 82.5C78.75 84.5711 77.0711 86.25 75 86.25H15C12.9289 86.25 11.25 84.5711 11.25 82.5Z" fill="#E7E56E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.5 51.225C39.5711 51.225 41.25 52.9039 41.25 54.975V63.75C41.25 68.0635 37.7295 70.6364 35.4296 71.6943L35.423 71.6974C32.6963 72.9452 30 76.9192 30 82.5C30 84.5711 28.3211 86.25 26.25 86.25C24.1789 86.25 22.5 84.5711 22.5 82.5C22.5 74.8824 26.1771 67.6828 32.2982 64.8794C32.8694 64.6162 33.3123 64.284 33.5665 63.9945C33.6922 63.8513 33.7363 63.7632 33.75 63.7266V54.975C33.75 52.9039 35.4289 51.225 37.5 51.225ZM33.7553 63.707C33.7558 63.707 33.7551 63.7119 33.7517 63.7219C33.753 63.712 33.7547 63.7071 33.7553 63.707Z" fill="#E7E56E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M52.5 51.225C54.5711 51.225 56.25 52.9039 56.25 54.975V63.7266C56.2637 63.7632 56.3078 63.8513 56.4335 63.9945C56.6877 64.284 57.1306 64.6162 57.7018 64.8794C63.8229 67.6828 67.5 74.8824 67.5 82.5C67.5 84.5711 65.8211 86.25 63.75 86.25C61.6789 86.25 60 84.5711 60 82.5C60 76.9192 57.3037 72.9452 54.577 71.6974L54.5704 71.6943C52.2705 70.6364 48.75 68.0635 48.75 63.75V54.975C48.75 52.9039 50.4289 51.225 52.5 51.225ZM56.2447 63.707C56.2453 63.7071 56.247 63.712 56.2483 63.7219C56.2449 63.7119 56.2442 63.707 56.2447 63.707Z" fill="#E7E56E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 7.5C18.75 5.42893 20.4289 3.75 22.5 3.75H67.5C69.5711 3.75 71.25 5.42893 71.25 7.5V33.75C71.25 40.7119 68.4844 47.3887 63.5616 52.3116C58.6387 57.2344 51.9619 60 45 60C38.0381 60 31.3613 57.2344 26.4384 52.3116C21.5156 47.3887 18.75 40.7119 18.75 33.75V7.5ZM26.25 11.25V33.75C26.25 38.7228 28.2254 43.4919 31.7417 47.0083C35.2581 50.5246 40.0272 52.5 45 52.5C49.9728 52.5 54.7419 50.5246 58.2583 47.0083C61.7746 43.4919 63.75 38.7228 63.75 33.75V11.25H26.25Z" fill="#E7E56E"/>
</svg>`;
    modal.innerHTML = `
    <h2 id="celebration-title" class="text-3xl font-bold mb-2 text-center text-white">You did it!</h2>
    <p class="mb-2 text-center text-gray-500">Great job finishing the quiz!</p>
    <div class="bg-[#384152] p-8 flex align-center justify-center flex-col items-center rounded-md mt-8">
      ${svg}
      <div class="flex flex-col items-center mt-4">
        <h3 class="text-2xl font-bold text-white" id="score-heading">${accumulatedScore} points</h3>
      </div>
    </div>
    <button id="finishQuizBtn" class="rounded-md font-bold p-4 bg-[#6683b4] text-white text-xl w-full transition-colors duration-200 hover:bg-[#5875a5] h-14 flex items-center justify-center w-full flex mt-8">
      Submit to scoreboard
    </button>
  `;
    document.body.appendChild(modal);
    const previouslyFocused = document.activeElement;
    modal.showModal();
    (_b = modal.querySelector("button")) === null || _b === void 0 ? void 0 : _b.focus();
    modal.addEventListener("close", () => {
        previouslyFocused === null || previouslyFocused === void 0 ? void 0 : previouslyFocused.focus();
    });
    const focusable = modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    focusable === null || focusable === void 0 ? void 0 : focusable.focus();
    // Move the button in here as its rendered
    const finishButton = modal.querySelector("#finishQuizBtn");
    finishButton === null || finishButton === void 0 ? void 0 : finishButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Finish button clicked");
        modal.close();
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
};
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
            // finishQuizBtn.classList.remove("hidden");
            // alert(`You did it! Here we will show a modal later on with the player's score!`);
            celebrationModal();
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
      <li role="listitem" class="stepper-item ${i === index ? "text-white bg-[#6481B1]" : "text-gray-400 bg-[#4D5563]"} rounded-full w-2 h-2 flex items-center justify-center" aria-label="Question ${i + 1} of ${questionArray.length}">
        <span class="sr-only hidden">${i + 1} of ${questionArray.length}</span>
      </li>
    `)
        .join("");
    stepperEl.innerHTML = `
    <nav class="flex flex-col items-center gap-2 fixed top-4 left-0 right-0" role="navigation" aria-label="Question progress">
      <ul class="stepper flex gap-1" aria-live="polite">
        ${stepList}
      </ul>
      <p class="text-xs text-white opacity-50" aria-live="off">${index + 1} of ${questionArray.length}</p>
    </nav>`;
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
    answerList.forEach(answer => {
        answers.innerHTML += ` 
      <button class="answer-button hover:bg-[#5875a5] min-h-14 rounded-sm p-4 text-white w-full md:w-1/2 bg-[rgba(56,65,82,1)]">${answer}</button>
     `;
    });
    // set focus to first button as default
    const firstButton = answers.querySelector(".answer-button");
    if (firstButton) {
        firstButton.focus();
        firstButton.click();
    }
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
    <p class=" rounded-md text-sm p-2 px-3 text-center text-[rgba(150,231,110,1)] bg-[rgba(56,82,64,1)]">You chose ${chosenAnswer} - It's the right answer. Good job!</p>
  `;
    }
    else {
        conclusionDiv.innerHTML = `
    <p class="rounded-md p-2 px-3 text-center text-sm text-[rgba(231,110,110,1)] bg-[rgba(82,63,56,1)]">You chose ${chosenAnswer} - Unfortunately, it's the wrong answer. Bad job!</p>
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
      <li class="grid grid-cols-5 auto-cols-auto justify-center gap-x odd:bg-[rgba(56,65,82,1)] even:bg-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,1)] text-xs font-medium py-3 px-4 rounded-4"player-${i}">
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
/* ------ EVENT LISTENER ------ */
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield fetchQuizAPI();
    if (document.getElementById("score-list"))
        fetchScores();
    // set focus to first form element as default
    if (filterForm) {
        const firstFilterElement = filterForm.querySelector(".form-element");
        console.log("first element in focus");
        firstFilterElement.focus();
    }
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
/* ------ ACCESSIBILITY LOGIC ------ */
/*---- Keyboard Navigation ----*/
// start page:
filterForm === null || filterForm === void 0 ? void 0 : filterForm.addEventListener("keydown", (e) => {
    const el = e.target;
    // collect focusable elements
    const formElements = Array.from(filterForm.querySelectorAll('select, input:not([type="hidden"]), button, [tabindex]:not([tabindex="-1"])'));
    const formElementIndex = formElements.indexOf(document.activeElement);
    // 🧠 Handle <select> separately when user presses Enter
    if (el.tagName === "SELECT" && e.key === "Enter") {
        e.preventDefault(); // prevent accidental submit
        // find next element and move focus there
        if (formElementIndex >= 0 && formElementIndex < formElements.length - 1) {
            setTimeout(() => formElements[formElementIndex + 1].focus(), 50);
        }
        return; // done, don't run rest
    }
    // Move to the next focusable field if there is one
    if (i >= 0 && i < formElements.length - 1) {
        formElements[i + 1].focus();
    }
    switch (e.key) {
        case "Enter":
            // Allow Enter to activate radios, checkboxes, or buttons only
            if (el.type === "radio" || el.tagName === "BUTTON") {
                e.preventDefault();
                el.click();
            }
            else if (el.tagName === "INPUT" && el.type === "text") {
                // allow typing + pressing Enter to do nothing, not submit
                e.preventDefault();
            }
            break;
        case " ":
        case "Spacebar":
            e.preventDefault(); // safety check
            if (startButton) {
                startButton.click();
            }
            break;
        case "ArrowRight":
        case "ArrowDown":
            e.preventDefault(); // safety check
            if (formElementIndex < formElements.length - 1) {
                formElements[formElementIndex + 1].focus();
            }
            else {
                formElements[0].focus();
            }
            break;
        case "ArrowLeft":
        case "ArrowUp":
            e.preventDefault(); // safety check
            // go the other way around from arrow right and down
            if (formElementIndex > 0) {
                formElements[formElementIndex - 1].focus();
            }
            else {
                formElements[formElements.length - 1].focus();
            }
            break;
    }
});
// quiz page:
answers === null || answers === void 0 ? void 0 : answers.addEventListener("keydown", (e) => {
    const buttons = Array.from(answers.querySelectorAll(".answer-button"));
    const buttonIndex = buttons.indexOf(document.activeElement);
    switch (e.key) {
        case "Enter":
            e.preventDefault(); // safety check
            document.activeElement.click();
            break;
        case " ":
        case "Spacebar":
            e.preventDefault(); // safety check
            if (!submitAnswerButton.classList.contains("hidden")) {
                submitAnswerButton.click();
            }
            else if (!nextQuestionBtn.classList.contains("hidden")) {
                nextQuestionBtn.click();
            }
            else if (finishQuizBtn) {
                finishQuizBtn.click();
            }
            break;
        case "ArrowRight":
        case "ArrowDown":
            e.preventDefault(); // safety check
            if (buttonIndex < buttons.length - 1) {
                buttons[buttonIndex + 1].focus();
            }
            else {
                buttons[0].focus();
            }
            break;
        case "ArrowLeft":
        case "ArrowUp":
            e.preventDefault(); // safety check
            // go the other way around from arrow right and down
            if (buttonIndex > 0) {
                buttons[buttonIndex - 1].focus();
            }
            else {
                buttons[buttons.length - 1].focus();
            }
            break;
        case "Home":
            //move to first item
            break;
        case "End":
            //move to last item
            break;
    }
});
//# sourceMappingURL=script.js.map