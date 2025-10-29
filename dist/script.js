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
/* ------ FETCH API DATA ------ */
const fetchQuizAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`;
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
    }
    catch (error) {
        console.error("Fetch error:", error);
    }
});
/* ------ EVENT LISTENER ------ */
document.addEventListener("DOMContentLoaded", fetchQuizAPI);
//# sourceMappingURL=script.js.map