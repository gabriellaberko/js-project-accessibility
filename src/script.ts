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
  // question.innerHTML += `
  //   <h1>${array[index].question}</h1>
  // `;

  question.innerText = array[index].question; //instead of making 2 h1's as above
  
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
  await fetchScores();
});



/* ------ Logic to collect player pref and redirect to quiz.html ------ */

// document.getElementById("startBtn")?.addEventListener("click", () => {

//   const category = parseInt((document?.getElementById("category")! as HTMLSelectElement).value);
//   const difficulty = ((document?.getElementById("difficulty")! as HTMLSelectElement).value).toLowerCase();
//   const player = (document?.getElementById("player-name")! as HTMLSelectElement).value;
//   //fix this one to pick up real value
//   const amount = parseInt("20");
  
//   // save the inputs from the user's filter options to local storage
//   localStorage.setItem("quizSettings", JSON.stringify({
//     category,
//     difficulty,
//     amount,
//     player
//   }));

//   // navigate to quiz page
//   window.location.href = "quiz.html";
// });



/* ------ Fetch scores ------ */

const SCORE_API_URL = `https://postgres.daniellauding.se/quiz_scores`;

const fetchScores = async() => {
  
  try {
    const response = await fetch(SCORE_API_URL);
    const result = await response.json();
    
  // Sortera högst först (valfritt)
  result.sort((a, b) => b.score - a.score);
    
    if(!response.ok) {
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
        <span>CATEGORY</span>
        <span>Amount</span>
        <span>Difficulty</span>
      </li>
    `).join("");

    document.getElementById("score-list").innerHTML = html;
    
    result.forEach((element) => console.log(element));
    
  } catch(error) {
    console.error('Error:', error);
  }
}

/* ------ Post scores ------ */

// async function postScore(username, score) {
async function postScore(username: string) {
  console.log("Posting new to scoreboard:", username);
  const response = await fetch(SCORE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ username, score })
    body: JSON.stringify({ username, score: 0 })
  });

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  try {
    const result = await response.json();
    console.log("✅ Posted successfully:", result);
    return result;
  } catch {
    console.warn("⚠️ Server returned no JSON body");
    return {};
  }
}

const quizForm = document.getElementById("quiz-form");

if (quizForm) {
   quizForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🎯 Form submitted");

    // const score = Number(document.getElementById("player-score").value);
    const name = (document.getElementById("player-name") as HTMLInputElement).value.trim();
    const category = parseInt((document.getElementById("category") as HTMLSelectElement).value);
    const difficulty = (document.getElementById("difficulty") as HTMLSelectElement).value.toLowerCase();
    const amount = 20;

    // if (!name || isNaN(score)) {  
    if (!name) {
      alert("Write a name!");
      return;
    }

    try {
      const existing = await fetch(SCORE_API_URL).then(r => r.json());
      const alreadyExists = existing.some(p => p.username.toLowerCase() === name.toLowerCase());

      if (alreadyExists) {
        alert("That name already exists! Try another or add a number 😊");
        return;
      }

      // await postScore(name, score);
      localStorage.setItem("quizSettings", JSON.stringify({ category, difficulty, amount, player: name }));
      await postScore(name);
      // alert("Score added!");
      // await fetchScores(); // uppdatera listan

      console.log("✅ Score posted, now redirecting...");
      window.location.href = "quiz.html"; // move only AFTER postScore
    } catch (error) {
      console.error("Error:", error);
      // alert("Something went wrong 😢");
    }
  });
}



// TO DO: add an event listener on "Start game" button that triggers the function that inserts questions and answers from the first object in the questionArray