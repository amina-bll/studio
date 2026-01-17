
export type ViewState = 'home' | 'games' | 'dashboard' | 'feedback' | 'playing';

export interface Game {
  id: string;
  title: string;
  description: string;
  subject: 'science' | 'technology' | 'engineering' | 'math';
  difficulty: 'easy' | 'medium' | 'hard';
  thumbnail: string;
  quiz: Quiz;
  is3D?: boolean;
}

export interface Quiz {
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
}

export interface UserStats {
  name: string;
  level: number;
  xp: number;
  badges: Badge[];
  completedGames: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  dateEarned: string;
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  avatar: string;
}

export interface FeedbackEntry {
  userName: string;
  rating: number;
  comment: string;
}
