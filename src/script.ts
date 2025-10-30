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

interface quizSettingsFormat {
  amount: number,
  category: number,
  difficulty: string,
  player: string
}


/* ------ GLOBAL VARIABLES ------ */

const questionArray: questionObjectFormat[] = [];

// questions from local storage to use when testing, if we hit API limit
let storedQuestionArray: questionObjectFormat[] = [];  




/* ------ DOM ELEMENTS ------ */

const question = document.getElementById("question") as HTMLElement;
const answers = document.getElementById("answers") as HTMLElement;


/* ------ FETCH API DATA ------ */

const fetchQuizAPI = async () => {

  const store = localStorage.getItem("quizSettings")!;
  const settings = JSON.parse(store);
  
  console.log(typeof store);
  console.log("Loaded quiz settings:", settings);

  const APIUrl = `https://opentdb.com/api.php?amount=${settings.amount}&category=${settings.category}&difficulty=${settings.difficulty}&type=multiple`;
 
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

    console.log("Quiz questions fetched:", questionArray);
    incrementIndex();
  }
  
  catch(error) {
    console.error("Fetch error:", error);
    // add error message on start page
  }
  // save question array to local storage to have when testing
  localStorage.setItem("storedQuestionArray", JSON.stringify(questionArray));
  storedQuestionArray = JSON.parse(localStorage.getItem("storedQuestionArray"));  
};



/* ------ LOGIC ------ */


// TO DO: create function that increments index for every question answered until reaching the length of the quiz questions (ex. 10)

const incrementIndex = () => {
  let index = 0;
  // What event listener should we have? When should we increment?

  // index++;
  insertQuestionsAndAnswers(questionArray, index)
};


const shuffleAnswers = (array: string[]) => {
  // swap each answer with a random answer, starting from the last answer in the list until i is equal to the first item
  for (let i = array.length - 1; i > 0; i--) {
    const randomAnswerInList = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomAnswerInList]] = [array[randomAnswerInList], array[i]];
  }
};

// TO DO: create a function that inserts the questions and the answers. Anwsers need to be shuffled before inserted. The function needs to take an index as argument

const insertQuestionsAndAnswers = (array: questionObjectFormat, index: Number) => {

  // empty elements before filling them
  question.innerHTML = "";
  answers.innerHTML = "";

  const answerList: string[] = array[index].allAnswers;
  
  // insert data for question and answers
  question.innerHTML += `
    <h1>${array[index].question}</h1>
  `;
  
  // sort array items in a random order, so that the correct answer is not always the last item
  shuffleAnswers(answerList);

  console.log(answerList)

  answerList.forEach(answer => {
    
     answers.innerHTML += ` 
      <button class="answer-button rounded-xl p-4 text-black w-full md:w-1/2  border-2 border-grey-500">${answer}</button>
     `
  });
};

// TO DO: create a function that checks if the users chosedn answer is the correct one or not

// TO DO: create a function for adding scores



/* ------ EVENT LISTENER ------ */

document.addEventListener("DOMContentLoaded", async () => {
  await fetchQuizAPI();
});



/* ------ Logic to collect player pref and redirect to quiz.html ------ */

document.getElementById("startBtn")?.addEventListener("click", () => {

  const category = parseInt((document?.getElementById("category")! as HTMLSelectElement).value);
  const difficulty = ((document?.getElementById("difficulty")! as HTMLSelectElement).value).toLowerCase();
  const player = (document?.getElementById("player-name")! as HTMLSelectElement).value;
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





// TO DO: add an event listener on "Start game" button that triggers the function that inserts questions and answers from the first object in the questionArray