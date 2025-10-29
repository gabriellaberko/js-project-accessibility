/* ------ INTERFACES ------ */





/* ------ FETCH API DATA ------ */

const fetchQuizAPI = async () => {
  const APIUrl = `https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`;
  
  try {
      
    const response = await fetch(APIUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();

    console.log(data);

  }
  
  catch(error) {
    console.error("Fetch error:", error);
  }

};


/* ------ EVENT LISTENER ------ */

document.addEventListener("DOMContentLoaded", fetchQuizAPI);
