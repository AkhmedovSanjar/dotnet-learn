export type Difficulty = "Beginner" | "Junior" | "Intermediate";

export type CodeLanguage =
  | "csharp"
  | "bash"
  | "json"
  | "sql"
  | "yaml"
  | "plaintext"
  | "typescript";

export interface CodeExample {
  title: string;
  language: CodeLanguage;
  code: string;
  output: string;
  walkthrough: string[];
}

export interface PracticeTask {
  id: string;
  lessonId: string;
  title: string;
  prompt: string;
  expectedResult: string;
  hints: string[];
  solution: string;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  slug: string;
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  order: number;
  moduleOrder: number;
  tags: string[];
  outcomes: string[];
  whyItMatters: string;
  simpleExplanation: string;
  deepExplanation: string;
  realWorldUsage: string;
  explainLikeBeginner: string;
  interviewAnswer: string;
  commonMistakes: string[];
  bestPractices: string[];
  summary: string[];
  diagram?: string;
  codeExamples: CodeExample[];
  practiceTasks: PracticeTask[];
  quiz: QuizQuestion[];
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  order: number;
}

export interface ModuleSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  expectedOutcomes: string[];
  lessonCount: number;
  lessons: LessonSummary[];
}

export interface Curriculum {
  modules: ModuleSummary[];
  lessons: Lesson[];
}

export interface ProgressRecord {
  lessonId: string;
  completed: boolean;
  quizScore: number | null;
  lastOpenedAt?: string | null;
}

export interface DashboardModuleProgress extends ModuleSummary {
  completedLessons: number;
  completionPercentage: number;
}

export interface DashboardState {
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  currentLesson: Lesson | null;
  recommendedLesson: Lesson | null;
  modules: DashboardModuleProgress[];
}
