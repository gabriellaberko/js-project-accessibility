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
declare const fetchQuizAPI: () => Promise<void>;
//# sourceMappingURL=script.d.ts.map