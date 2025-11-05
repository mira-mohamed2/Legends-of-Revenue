// Quiz question types for combat system

export interface QuizAnswer {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  explanation: string;
  points: number;
  bonusTime: number;
  category: string;
}

export interface QuizCategory {
  weight: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
}

export interface QuizData {
  categories: {
    gst_basics: QuizCategory;
    filing_deadline: QuizCategory;
    input_tax: QuizCategory;
    compliance: QuizCategory;
    mira_services: QuizCategory;
  };
  metadata: {
    totalQuestions: number;
    lastUpdated: string;
    version: string;
  };
}

export type CategoryName = keyof QuizData['categories'];

export interface SpecialAttack {
  id: string;
  name: string;
  description: string;
  damage: number;
  category: CategoryName;
  difficulty: 'easy' | 'medium' | 'hard';
  effect?: {
    type: 'heal' | 'debuff' | 'buff';
    value: number;
    description: string;
  };
  icon: string;
}

export interface CombatQuizState {
  currentQuestion: QuizQuestion | null;
  selectedAttack: SpecialAttack | null;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  usedQuestionIds: Set<string>;
  canUseSpecialAttack: boolean;
}
