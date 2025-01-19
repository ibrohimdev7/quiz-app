"use client";

import { useState, useEffect } from 'react';
import { Country, Player } from '@src/lib/types';
import { PlayerNameInput } from './player-name-input';
import { Quiz } from './quiz';
import { Leaderboard } from './leaderboard';
import { Button } from './ui/button';
import { useLocalStorage } from '@src/hooks/use-local-storage';

export function GameContainer() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [players, setPlayers] = useLocalStorage<Player[]>('quiz-players', []);
  const [currentPlayer, setCurrentPlayer] = useLocalStorage<string>('current-player', '');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data.filter((country: Country) => country.capital?.[0]));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load countries. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const updatePlayerScore = (score: number) => {
    setPlayers(prevPlayers => {
      const playerIndex = prevPlayers.findIndex(p => p.name === currentPlayer);
      if (playerIndex === -1) {
        return [...prevPlayers, { name: currentPlayer, bestScore: score }];
      }
      
      const updatedPlayers = [...prevPlayers];
      if (score > updatedPlayers[playerIndex].bestScore) {
        updatedPlayers[playerIndex].bestScore = score;
      }
      return updatedPlayers;
    });
  };

  const handleLogout = () => {
    setCurrentPlayer('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div>
        <Leaderboard players={players} />
        <Button 
          onClick={() => setShowLeaderboard(false)}
          className="mt-4 mx-auto block"
        >
          Back to Game
        </Button>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <PlayerNameInput
        onSubmit={setCurrentPlayer}
        players={players}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Player: {currentPlayer}</h2>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Button onClick={() => setShowLeaderboard(true)}>
          View Leaderboard
        </Button>
      </div>
      <Quiz
        countries={countries}
        onGameComplete={updatePlayerScore}
        onRestart={handleLogout}
      />
    </div>
  );
}