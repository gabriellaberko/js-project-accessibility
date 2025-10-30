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
declare const questionArray: questionObjectFormat[];
declare let amount: Number;
declare let category: Number;
declare let difficulty: String;
declare let storedQuestionArray: questionObjectFormat[];
declare const question: HTMLElement;
declare const answers: HTMLElement;
declare const fetchQuizAPI: () => Promise<void>;
declare const insertQuestionsAndAnswers: (array: questionObjectFormat, index: Number) => void;
declare const stored: string | null;
//# sourceMappingURL=script.d.ts.map