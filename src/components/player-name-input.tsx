"use client";

import { useState } from 'react';
import { Player } from '@src/lib/types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
  players: Player[];
}

export function PlayerNameInput({ onSubmit, players }: PlayerNameInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    onSubmit(name.trim());
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Enter Your Name</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Your name"
            className="w-full"
          />
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
        <Button type="submit" className="w-full">
          Start Game
        </Button>
      </form>
    </Card>
  );
}