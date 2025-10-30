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
declare const question: HTMLElement;
declare const answers: HTMLElement;
declare const fetchQuizAPI: () => Promise<void>;
declare const incrementIndex: () => void;
declare const shuffleAnswers: (array: string[]) => void;
declare const insertQuestionsAndAnswers: (array: questionObjectFormat, index: Number) => void;
//# sourceMappingURL=script.d.ts.map