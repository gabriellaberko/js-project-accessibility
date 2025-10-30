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


/* ------ FETCH API DATA ------ */

const fetchQuizAPI = async () => {
  const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`;

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
  }

};

/* ------ EVENT LISTENER ------ */

document.addEventListener("DOMContentLoaded", fetchQuizAPI);

/* ------ Logic to collect player pref and redirect to quiz.html ------ */

document.getElementById("startBtn")?.addEventListener("click", () => {

  const category = (document?.getElementById("category")! as HTMLSelectElement).value;
  const difficulty = (document?.getElementById("difficulty")! as HTMLSelectElement).value;
  const player = (document?.getElementById("player-name")! as HTMLSelectElement).value;
  
  localStorage.setItem("quizSettings", JSON.stringify({
    category,
    difficulty,
    player
  }));

  console.log("Saved quiz settings:", { category, difficulty, player });

  window.location.href = "quiz.html";
});

const stored = localStorage.getItem("quizSettings");
console.log(stored);