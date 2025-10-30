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
var _a;
/* ------ GLOBAL VARIABLES ------ */
const questionArray = [];
// questions from local storage to use when testing, if we hit API limit
let storedQuestionArray = [];
// const quizSettings = JSON.parse(localStorage.getItem("quizSettings"));  
// let category: Number = parseInt(quizSettings.category);
// let difficulty: String = quizSettings.difficulty;
// let amount: Number = parseInt(quizSettings.amount);
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
// TO DO: create a function that inserts the questions and the answers. Anwsers need to be shuffled before inserted. The function needs to take an index as argument
const insertQuestionsAndAnswers = (array, index) => {
    // empty elements before filling them
    question.innerHTML = "";
    answers.innerHTML = "";
    // insert data for question and answers
    question.innerHTML += `

  `;
    answers.innerHTML += `

  `;
};
// TO DO: create a function that checks if the users chosedn answer is the correct one or not
// TO DO: create a function for adding scores
/* ------ EVENT LISTENER ------ */
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield fetchQuizAPI();
}));
// TO DO: add an event listener on "Start game" button that triggers the function that inserts questions and answers from the first object in the questionArray
/* ------ Logic to collect player pref and redirect to quiz.html ------ */
(_a = document.getElementById("startBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const category = parseInt((document === null || document === void 0 ? void 0 : document.getElementById("category")).value);
    const difficulty = ((document === null || document === void 0 ? void 0 : document.getElementById("difficulty")).value).toLowerCase();
    const player = (document === null || document === void 0 ? void 0 : document.getElementById("player-name")).value;
    //fix this one to pick up real value
    const amount = parseInt("20");
    localStorage.setItem("quizSettings", JSON.stringify({
        category,
        difficulty,
        amount,
        player
    }));
    console.log("Saved quiz settings:", { category, difficulty, player });
    window.location.href = "quiz.html";
});
// TO DO: add an event listener on "Start game" button that triggers the function that inserts questions and answers from the first object in the questionArray
//# sourceMappingURL=script.js.map