import { GameContainer } from "@src/components/game-container";
import { ThemeToggle } from "@src/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            World Capitals Quiz
          </h1>
          <ThemeToggle />
        </div>
        <GameContainer />
      </div>
    </div>
  );
}
