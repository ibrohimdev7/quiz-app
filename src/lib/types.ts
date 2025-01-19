export interface Country {
  name: {
    common: string;
  };
  capital: string[];
  flags: {
    png: string;
  };
}

export interface Player {
  name: string;
  bestScore: number;
}

export interface GameState {
  currentRound: number;
  score: number;
  timeLeft: number;
  selectedAnswer: string | null;
  correctAnswer: string;
  options: string[];
  currentCountry: Country | null;
  isRoundComplete: boolean;
  gameComplete: boolean;
}