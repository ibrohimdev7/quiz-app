"use client";

import { Player } from '@src/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card } from './ui/card';

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.bestScore - a.bestScore);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Leaderboard</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Best Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow key={player.name}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell className="text-right">{player.bestScore}/10</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {players.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">
          No players yet. Be the first to play!
        </p>
      )}
    </Card>
  );
}