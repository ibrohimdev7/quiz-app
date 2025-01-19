"use client";

import { useState, useEffect, useCallback } from "react";
import { Country, GameState } from "@src/lib/types";
import {
  getRandomCountry,
  getRandomOptions,
  getFeedback,
} from "@src/lib/game-utils";
import { Button } from "./ui/button";
import Progress from "./ui/progress";
import { Card } from "./ui/card";
import Image from "next/image";

interface QuizProps {
  countries: Country[];
  onGameComplete: (score: number) => void;
  onRestart: () => void;
}

export function Quiz({ countries = [], onGameComplete, onRestart }: QuizProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    score: 0,
    timeLeft: 15,
    selectedAnswer: null,
    correctAnswer: "",
    options: [],
    currentCountry: null,
    isRoundComplete: false,
    gameComplete: false,
  });

  const startNewRound = useCallback(() => {
    const country = getRandomCountry(countries);
    const capital = country.capital[0];
    const options = getRandomOptions(capital, countries);

    setGameState((prev) => ({
      ...prev,
      timeLeft: 15,
      selectedAnswer: null,
      correctAnswer: capital,
      options,
      currentCountry: country,
      isRoundComplete: false,
    }));
  }, [countries]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  useEffect(() => {
    if (gameState?.gameComplete) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.isRoundComplete || prev.timeLeft <= 0) return prev;

        if (prev.timeLeft === 1) {
          return {
            ...prev,
            timeLeft: 0,
            isRoundComplete: true,
          };
        }

        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameComplete]);

  const handleAnswer = (answer: string) => {
    if (gameState.isRoundComplete) return;

    const isCorrect = answer === gameState.correctAnswer;
    setGameState((prev) => ({
      ...prev,
      selectedAnswer: answer,
      score: isCorrect ? prev.score + 1 : prev.score,
      isRoundComplete: true,
    }));
  };

  const handleNextRound = () => {
    if (gameState.currentRound === 10) {
      setGameState((prev) => ({
        ...prev,
        gameComplete: true,
      }));
      onGameComplete(gameState.score);
      return;
    }

    setGameState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
    }));
    startNewRound();
  };

  const handleRestart = () => {
    setGameState({
      currentRound: 1,
      score: 0,
      timeLeft: 15,
      selectedAnswer: null,
      correctAnswer: "",
      options: [],
      currentCountry: null,
      isRoundComplete: false,
      gameComplete: false,
    });
    startNewRound();
  };

  if (gameState.gameComplete) {
    return (
      <Card className="text-center space-y-6 p-8">
        <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
        <p className="text-2xl mb-4">Final Score: {gameState.score}/10</p>
        <p className="text-xl text-primary font-semibold">
          {getFeedback(gameState.score)}
        </p>
        <div className="space-x-4">
          <Button onClick={handleRestart}>Play Again</Button>
          <Button variant="outline" onClick={onRestart}>
            Change Player
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-lg font-semibold">
            Round {gameState.currentRound}/10
          </span>
        </div>
        <div>
          <span className="text-lg font-semibold">
            Score: {gameState.score}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>Time Left: {gameState?.timeLeft}s</span>
          <Progress count={(gameState?.timeLeft / 15) * 100} />
        </div>
      </div>

      {gameState?.currentCountry ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src={gameState?.currentCountry?.flags?.png || ""}
              alt="Country Flag"
              className="h-auto shadow-md rounded"
              width={192}
              height={192}
              priority
            />
            <h3 className="text-xl font-semibold">
              {gameState.currentCountry.name.common}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gameState?.options?.map((option) => {
              let buttonVariant = "outline";
              if (gameState.isRoundComplete) {
                if (option === gameState.correctAnswer) {
                  buttonVariant = "secondary";
                } else if (option === gameState.selectedAnswer) {
                  buttonVariant = "destructive";
                }
              }

              return (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={gameState.isRoundComplete}
                  variant={buttonVariant as any}
                  className="h-16 text-lg"
                >
                  {option}
                </Button>
              );
            })}
          </div>

          {gameState.isRoundComplete ? (
            <div className="text-center">
              <Button onClick={handleNextRound} className="mt-4">
                {gameState.currentRound === 10
                  ? "Finish Game"
                  : "Next Question"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
