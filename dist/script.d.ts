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
declare const fetchQuizAPI: () => Promise<void>;
//# sourceMappingURL=script.d.ts.map