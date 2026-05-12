import type { CodeLanguage, QuizKind } from "@/lessons/contracts";

export interface QuizSpec {
  kind: QuizKind;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LessonContent {
  whyItMatters: string;
  simpleExplanation: string;
  deepExplanation: string;
  realWorldUsage: string;
  explainLikeBeginner: string;
  interviewAnswer: string;
  commonMistakes: string[];
  bestPractices: string[];
  summary: string[];
  codeExample: {
    title: string;
    language?: CodeLanguage;
    code: string;
    output: string;
    walkthrough: string[];
  };
  practice: {
    prompt: string;
    expectedResult: string;
    hints: string[];
    solution: string;
  };
  quiz: QuizSpec[];
}

export type ModuleContent = Record<string, LessonContent>;
