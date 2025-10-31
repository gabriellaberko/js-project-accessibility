/* ------ INTERFACES ------ */

interface fetchedObjectFormat {
  category: string,
  correct_answer: string
  difficulty: string,
  incorrect_answers: string[[]],
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

let index = 0;




/* ------ DOM ELEMENTS ------ */

const question = document.getElementById("question") as HTMLElement;
const answers = document.getElementById("answers") as HTMLElement;
const submitAnswerButton = document.getElementById("submitAnswerBtn") as HTMLElement;
const nextQuestionBtn = document.getElementById("nextQuestionBtn") as HTMLElement;
const finishQuizBtn = document.getElementById ("finishQuizBtn") as HTMLElement; 




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
  if (index < questionArray.length - 1) {
    index++ 
    insertQuestionsAndAnswers(questionArray, index)
  } 
  else {
    index = 0
    // TO DO: show modal/prompt with final scores
    // TO DO: show finish quiz button, hide submit question button
  } 

  submitAnswerButton.addEventListener("click", () => { 
    if(index === questionArray.length - 1) {
      finishQuizBtn.classList.remove("hidden")
      nextQuestionBtn.classList.add("hidden")
    }
  });
  
  console.log(index)
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
        <span>${player.category}</span>
        <span>Amount</span>
        <span>${player.difficulty}</span>
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
const postScore = async(
  username: string,
  category: number,
  difficulty: string,
  amount: number
) => {
  console.log("Posting new to scoreboard:", username);
  const response = await fetch(SCORE_API_URL, {
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

finishQuizBtn.addEventListener("click", async () => {
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

    await postScore(player, category, difficulty, amount);
    console.log("✅ Score posted successfully!");

    // Optional: clear data or redirect
    // localStorage.removeItem("quizSettings");
    window.location.href = "scoreboard.html";
  } catch (error) {
    console.error("❌ Error posting score:", error);
    alert("Something went wrong while saving your score.");
  }
});




/* ------ EVENT LISTENER ------ */

document.addEventListener("DOMContentLoaded", async () => {
  await fetchQuizAPI();
  if (document.getElementById("score-list")) fetchScores();
});

document.getElementById("startBtn")?.addEventListener("click", () => {

  const category = parseInt((document?.getElementById("category")! as HTMLSelectElement).value);
  const difficulty = ((document?.getElementById("difficulty")! as HTMLSelectElement).value).toLowerCase();
  const player = (document?.getElementById("player-name")! as HTMLSelectElement).value;
  //fix this one to pick up real value
  const amount = parseInt("10");
  
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


// ## submitAnswerButton logic
// - Klicka för att valdera om svar är rätt eller fel
// - Om rätt/fel -> , visa rätta svaret/ljud pos neg? 
//  byt till knapp som visar Nästa fråga
// om rätt ++ poäng


submitAnswerButton.addEventListener("click", () => {
  console.log("Rätt svar i alla frågor:", questionArray[3].correctAnswer);

  submitAnswerButton.classList.add("hidden");
  nextQuestionBtn.classList.remove("hidden");

});


nextQuestionBtn.addEventListener("click", () => {
  submitAnswerButton.classList.remove("hidden");
  nextQuestionBtn.classList.add("hidden");
  incrementIndex();

})
