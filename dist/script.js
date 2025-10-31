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
var _a, _b;
/* ------ GLOBAL VARIABLES ------ */
const questionArray = [];
// questions from local storage to use when testing, if we hit API limit
let storedQuestionArray = [];
/* ------ DOM ELEMENTS ------ */
const question = document.getElementById("question");
const answers = document.getElementById("answers");
/* ------ FETCH API DATA ------ */
const fetchQuizAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    const store = localStorage.getItem("quizSettings");
    const settings = JSON.parse(store);
    console.log(typeof store);
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
                question: object.question,
                category: object.category,
                difficulty: object.difficulty,
                allAnswers: allAnswers,
                correctAnswer: object.correct_answer
            };
            questionArray.push(questionObject);
        });
        console.log("Quiz questions fetched:", questionArray);
        incrementIndex();
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
// TO DO: create function that increments index for every question answered until reaching the length of the quiz questions (ex. 10)
const incrementIndex = () => {
    let index = 0;
    // What event listener should we have? When should we increment?
    // index++;
    insertQuestionsAndAnswers(questionArray, index);
};
const shuffleAnswers = (array) => {
    // swap each answer with a random answer, starting from the last answer in the list until i is equal to the first item
    for (let i = array.length - 1; i > 0; i--) {
        const randomAnswerInList = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomAnswerInList]] = [array[randomAnswerInList], array[i]];
    }
};
// TO DO: create a function that inserts the questions and the answers. Anwsers need to be shuffled before inserted. The function needs to take an index as argument
const insertQuestionsAndAnswers = (array, index) => {
    // empty elements before filling them
    question.innerHTML = "";
    answers.innerHTML = "";
    const answerList = array[index].allAnswers;
    // insert data for question and answers
    // question.innerHTML += `
    //   <h1>${array[index].question}</h1>
    // `;
    question.innerText = array[index].question; //instead of making 2 h1's as above
    // sort array items in a random order, so that the correct answer is not always the last item
    shuffleAnswers(answerList);
    console.log(answerList);
    answerList.forEach(answer => {
        answers.innerHTML += ` 
      <button class="answer-button rounded-xl p-4 text-black w-full md:w-1/2  border-2 border-grey-500">${answer}</button>
     `;
    });
};
// TO DO: create a function that checks if the users chosedn answer is the correct one or not
// TO DO: create a function for adding scores
/* ------ EVENT LISTENER ------ */
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield fetchQuizAPI();
    if (document.getElementById("score-list"))
        fetchScores();
}));
(_a = document.getElementById("startBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const category = parseInt((document === null || document === void 0 ? void 0 : document.getElementById("category")).value);
    const difficulty = ((document === null || document === void 0 ? void 0 : document.getElementById("difficulty")).value).toLowerCase();
    const player = (document === null || document === void 0 ? void 0 : document.getElementById("player-name")).value;
    //fix this one to pick up real value
    const amount = parseInt("20");
    // save the inputs from the user's filter options to local storage
    localStorage.setItem("quizSettings", JSON.stringify({
        category,
        difficulty,
        amount,
        player
    }));
    // navigate to quiz page
    window.location.href = "quiz.html";
});
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
      <li class="grid grid-cols-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs font-medium py-3 px-4 player-${i}">
        <span>${i + 1}</span>
        <span>${player.username}</span>
        <span>${player.score}</span>
        <span>${player.category}</span>
        <span>Amount</span>
        <span>${player.difficulty}</span>
      </li>
    `).join("");
        document.getElementById("score-list").innerHTML = html;
        result.forEach((element) => console.log(element));
    }
    catch (error) {
        console.error('Error:', error);
    }
});
/* ------ Post scores ------ */
// async function postScore(username, score) {
const postScore = (username, category, difficulty, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Posting new to scoreboard:", username);
    const response = yield fetch(SCORE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ username, score })
        body: JSON.stringify({
            username,
            score: 0,
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
(_b = document.getElementById("finishBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Finish button clicked");
    const stored = localStorage.getItem("quizSettings");
    if (!stored) {
        alert("⚠️ No player data found. Start a quiz first!");
        return;
    }
    const { player, category, difficulty, amount } = JSON.parse(stored);
    if (!player) {
        alert("⚠️ No player name found in local storage.");
        return;
    }
    try {
        console.log("📤 Posting score for:", player);
        // Example: here you could calculate score from quiz results
        const score = 0;
        yield postScore(player, category, difficulty, amount);
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
// TO DO: add an event listener on "Start game" button that triggers the function that inserts questions and answers from the first object in the questionArray
//# sourceMappingURL=script.js.map