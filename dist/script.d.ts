interface fetchedObjectFormat {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}
interface questionObjectFormat {
    question: string;
    category: string;
    difficulty: string;
    allAnswers: string[];
    correctAnswer: string;
}
interface quizSettingsFormat {
    amount: number;
    category: number;
    difficulty: string;
    player: string;
}
declare const questionArray: questionObjectFormat[];
declare let storedQuestionArray: questionObjectFormat[];
declare let index: number;
declare const filterForm: HTMLElement;
declare const question: HTMLElement;
declare const answers: HTMLElement;
declare const submitAnswerButton: HTMLElement;
declare const nextQuestionBtn: HTMLElement;
declare const finishQuizBtn: HTMLElement;
declare const fetchQuizAPI: () => Promise<void>;
declare const incrementIndex: () => void;
declare const shuffleAnswers: (array: string[]) => void;
declare const insertQuestionsAndAnswers: (array: questionObjectFormat, index: number) => void;
declare const SCORE_API_URL = "https://postgres.daniellauding.se/quiz_scores";
declare const fetchScores: () => Promise<void>;
declare const postScore: (username: string, category: number, difficulty: string, amount: number) => Promise<any>;
//# sourceMappingURL=script.d.ts.map