/* ------ INTERFACES ------ */

interface fetchedObjectFormat {
  category: string,
  correct_answer: string
  difficulty: string,
  incorrect_answers: string[],
  question: string,
  type: string
}

interface questionObjectFormat {
  question: string,
  category: string,
  difficulty: string,
  allAnswers: string[],
  correctAnswer: string
}


/* ------ GLOBAL VARIABLES ------ */

const questionArray: questionObjectFormat[] = [];

let amount: Number = 10;
let category: Number = 9;
let difficulty: String = "medium";

// questions from local storage to use when testing, if we hit API limit
let storedQuestionArray: questionObjectFormat[] = [];  


/* ------ FETCH API DATA ------ */

const fetchQuizAPI = async () => {
  const APIUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
  
  try {
      
    const response = await fetch(APIUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    const fetchedQuizQuestions: fetchedObjectFormat[] = data.results;
      

    fetchedQuizQuestions.map(object => {

      // create an array with all answers, despite correct/incorrect
      const allAnswers: string[] = object.incorrect_answers;
      const correctAnswer: string = object.correct_answer
      allAnswers.push(correctAnswer);
    

      const questionObject: questionObjectFormat = {
        question: object.question,
        category: object.category,
        difficulty: object.difficulty,
        allAnswers: allAnswers,
        correctAnswer: object.correct_answer
      }

      questionArray.push(questionObject);
    });
  }
  
  catch(error) {
    console.error("Fetch error:", error);
    // add error message on start page
  }
  // save question array to local storage to have when testing
  localStorage.setItem("storedQuestionArray", JSON.stringify(questionArray));
  storedQuestionArray = JSON.parse(localStorage.getItem("storedQuestionArray"));  
};

/* ------ EVENT LISTENER ------ */

document.addEventListener("DOMContentLoaded", fetchQuizAPI);
