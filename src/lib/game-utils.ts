import { Country } from './types';

export const getRandomCountry = (countries: Country[]): Country => {
  return countries[Math.floor(Math.random() * countries.length)];
};

export const getRandomOptions = (
  correctCapital: string,
  countries: Country[],
): string[] => {
  const options = [correctCapital];
  const usedIndexes = new Set<number>();

  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const capital = countries[randomIndex]?.capital?.[0];

    if (
      !usedIndexes.has(randomIndex) &&
      capital &&
      !options.includes(capital)
    ) {
      options.push(capital);
      usedIndexes.add(randomIndex);
    }
  }

  return shuffleArray(options);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getFeedback = (score: number): string => {
  if (score === 10) return "You're a Geography Genius! 🏆";
  if (score >= 8) return "Outstanding Performance! 🌟";
  if (score >= 6) return "Well Done! 👏";
  if (score >= 4) return "Good Try! Keep Learning! 📚";
  return "Practice Makes Perfect! 💪";
};