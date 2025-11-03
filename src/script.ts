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

let index: number = 0;

let chosenAnswer: string = "";

let accumulatedScore: number = 0;


/* ------ DOM ELEMENTS ------ */

const filterForm = document.getElementById("filter-form") as HTMLElement;
const quizContainer = document.getElementById("quiz-container") as HTMLElement;
const question = document.getElementById("question") as HTMLElement;
const answers = document.getElementById("answers") as HTMLElement;
const conclusionDiv = document.getElementById("conclusion") as HTMLElement;
const submitAnswerButton = document.getElementById("submitAnswerBtn") as HTMLElement;
const nextQuestionBtn = document.getElementById("nextQuestionBtn") as HTMLElement;
const finishQuizBtn = document.getElementById ("finishQuizBtn") as HTMLElement; 




/* ------ FETCH API DATA ------ */

const fetchQuizAPI = async () => {

  const stored = localStorage.getItem("quizSettings")!;

  const settings = JSON.parse(stored);
  
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
    // incrementIndex(); fucks up stepper, starts at 2 all the time, fix below
    insertQuestionsAndAnswers(questionArray, index);
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
    index++;
    insertQuestionsAndAnswers(questionArray, index);
  } 

  // hide the nextQuestonBtn and show finishQuizBtn when clicking on submit answer on the last question
  if(index === questionArray.length - 1) {
    submitAnswerButton.addEventListener("click", () => { 
      nextQuestionBtn.classList.add("hidden");
      finishQuizBtn.classList.remove("hidden");
      alert(`You did it! Here we will show a modal later on with the player's score!`);
    });
  }
};


const renderStepper = () => {
  const oldStepper = document.querySelector(".stepper-container");
  if (oldStepper) oldStepper.remove();

  const stepperEl = document.createElement('div');
  stepperEl.classList.add("stepper-container", "flex", "items-center", "justify-center", "gap-2", "mb-4");

  const total = questionArray.length;
  const current = index >= 0 ? index + 1 : 1;
  
  const stepList = Array.from({ length: total }).map((question, i) => `
      <li class="stepper-item ${
        i === index ? "text-white bg-[#6481B1]" : "text-gray-400 bg-[#4D5563]"
      } rounded-full w-3 h-3 flex items-center justify-center">
        <span class="hidden">${i + 1} of ${questionArray.length}</span>
      </li>
    `)
    .join("");

  // Wrap in a <ul>
  stepperEl.innerHTML = `
    <div class="flex flex-col items-center gap-2 fixed top-4 left-0 right-0">
      <ul class="stepper flex gap-2">
        ${stepList}
      </ul>
      <p class="text-sm text-white">${index + 1} of ${questionArray.length}</p>
    </div>`;

  // Add to DOM before the question
  question.before(stepperEl);
}


const shuffleAnswers = (array: string[]) => {
  // swap each answer with a random answer, starting from the last answer in the list until i is equal to the first item
  for (let i = array.length - 1; i > 0; i--) {
    const randomAnswerInList = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomAnswerInList]] = [array[randomAnswerInList], array[i]];
  }
};



const insertQuestionsAndAnswers = (array: questionObjectFormat, index: number) => {

  renderStepper();
  // empty elements before filling them
  question.innerHTML = "";
  answers.innerHTML = "";
  conclusionDiv.innerHTML = "";

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
      <button class="answer-button rounded-xl p-4 text-black w-full md:w-1/2 border-2 border-grey-500">${answer}</button>
     `
  });
};



const checkAnswer = (chosenAnswer: string, index: number) => {
  if (chosenAnswer === questionArray[index]?.correctAnswer) {
    console.log("Your chose the right answer")
    // add score/update score
  } else {
    console.log("You chose the wrong answer")
  }

  document.querySelectorAll(".answer-button").forEach(btn => {
    // reset styling for borders/outlines on the buttons
    btn.className = "answer-button rounded-xl p-4 text-black w-full md:w-1/2"

    // change styling to display right/wrong answers
    if (btn.innerText === questionArray[index]?.correctAnswer) {
      btn.classList.add("bg-[rgba(56,82,64,1)]", "outline", "outline-3", "outline-[rgba(150,231,110,1)]");
      btn.classList.add("text-[rgba(150,231,110,1)]");
      btn.classList.add("outline", "outline-3", "outline-[rgba(150,231,110,1)]");
    } else {
      btn.classList.add("bg-[rgba(82,63,56,1)]");
      btn.classList.add("text-[rgba(231,110,110,1)]");
      btn.classList.add("outline", "outline-3", "outline-[rgba(231,110,110,1)]");
    }
  });

  // change message to display if right/wrong answer
  if(chosenAnswer === questionArray[index]?.correctAnswer) {
    conclusionDiv.innerHTML = `
    <p>Right answer. Good job!</p>
  `;
  } else {
    conclusionDiv.innerHTML = `
    <p>Wrong answer. Bad job!</p>
  `;
  }

};


// TO DO: add fast answer under 5 s = +5 extra
const countAndSaveScore = () => {
  if (chosenAnswer === questionArray[index]?.correctAnswer) {
    // update score
    let quizSettings = JSON.parse(localStorage.getItem("quizSettings")!);
    accumulatedScore = accumulatedScore + 10;
    quizSettings.score = accumulatedScore;
    // save it back to local storage
    localStorage.setItem("quizSettings", JSON.stringify(quizSettings));
  }
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
        <span>${player.score} PTS</span>
        <span>${player.category}</span>
        <span>${player.amount}</span>
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
  score: number,
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
      score,
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

finishQuizBtn?.addEventListener("click", async () => {
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

    await postScore(player, category, score, difficulty, amount);
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



filterForm?.addEventListener("submit", (e) => {

  e.preventDefault();


  const formData = new FormData(e.target);

  const category = formData.get("category");
  const difficulty = (formData.get("difficulty") as string).toLowerCase();
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


// ## submitAnswerButton logic
// - Klicka för att valdera om svar är rätt eller fel
// - Om rätt/fel -> , visa rätta svaret/ljud pos neg? 
//  byt till knapp som visar Nästa fråga
// om rätt ++ poäng


submitAnswerButton?.addEventListener("click", () => {
  submitAnswerButton.classList.add("hidden");
  nextQuestionBtn.classList.remove("hidden");

  checkAnswer(chosenAnswer, index);
  countAndSaveScore();
});


nextQuestionBtn?.addEventListener("click", () => {
  submitAnswerButton.classList.remove("hidden");
  nextQuestionBtn.classList.add("hidden");
  incrementIndex();

})


answers?.addEventListener("click", (e) => {
  const clickedAnswerButton = e?.target?.closest(".answer-button");
  chosenAnswer = clickedAnswerButton.innerText;

  document.querySelectorAll(".answer-button").forEach(btn => {
    // btn.classList.remove("border", "border-3", "border-[rgba(110,157,231,1)]");
    btn.className = "answer-button rounded-xl p-4 text-black w-full md:w-1/2 border-2 border-grey-500";
  })
  
  clickedAnswerButton.classList.toggle("outline");
  clickedAnswerButton.classList.toggle("outline-3");
  clickedAnswerButton.classList.toggle("outline-[rgba(110,157,231,1)]");
  
  console.log(chosenAnswer);
  
});