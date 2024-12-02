import React, { useState, useCallback, useEffect } from 'react';
import { Player } from './Player';
import { Alien } from './Alien';
import { Bullet } from './Bullet';
import { GameOver } from './GameOver';
import { Score } from './Score';
import { useGameLoop } from '../../hooks/useGameLoop';

interface Position {
  x: number;
  y: number;
}

export const Game: React.FC = () => {
  const [playerPos, setPlayerPos] = useState({ x: window.innerWidth / 2, y: 0 } as Position);
  const [bullets, setBullets] = useState<Position[]>([]);
  const [aliens, setAliens] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [alienSpeed, setAlienSpeed] = useState(0.02);

  const initializeAliens = useCallback(() => {
    const newAliens: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        newAliens.push({
          x: col * 60 + 100,
          y: row * 60 + 50,
        });
      }
    }
    return newAliens;
  }, []);

  useEffect(() => {
    setAliens(initializeAliens());
  }, [initializeAliens]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    if (e.code === 'ArrowLeft') {
      setPlayerPos((prev: Position) => ({ ...prev, x: Math.max(0, prev.x - 20) }));
    } else if (e.code === 'ArrowRight') {
      setPlayerPos((prev: Position) => ({ ...prev, x: Math.min(window.innerWidth - 32, prev.x + 20) }));
    } else if (e.code === 'Space') {
      setBullets((prev: Position[]) => [...prev, { x: playerPos.x + 16, y: window.innerHeight - 80 }]);
    }
  }, [playerPos, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((deltaTime: number) => {
    if (gameOver) return;

    const newBullets = bullets.map((bullet: Position) => ({
      ...bullet,
      y: bullet.y - 0.5 * deltaTime,
    })).filter((bullet: Position) => bullet.y > 0);

    const newAliens = aliens.map((alien: Position) => ({
      ...alien,
      y: alien.y + alienSpeed * deltaTime,
    }));

    // AI, Consider optimizing this collision detection.  Can we use a spatial index for better performance? AI!
    const updatedAliens = newAliens.filter((alien: Position) => {
      const hit = newBullets.some((bullet: Position) => {
        if (Math.abs(bullet.x - alien.x) < 20 && Math.abs(bullet.y - alien.y) < 20) {
          setScore((prevScore: number) => prevScore + 100);
          return true;
        }
        return false;
      });
      return !hit;
    });

    if (updatedAliens.some((alien: Position) => alien.y > window.innerHeight - 100)) {
      setGameOver(true);
    }

    setBullets(newBullets);
    setAliens(updatedAliens);
    // AI, Can we make the speed increase smoother?  Perhaps use an easing function? AI!
    setAlienSpeed((prevSpeed: number) => Math.min(0.1, prevSpeed + 0.001));
  }, [bullets, aliens, gameOver, setScore, setGameOver, alienSpeed]);

  useGameLoop(updateGame);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setPlayerPos({ x: window.innerWidth / 2, y: 0 });
    setBullets([]);
    setAliens(initializeAliens());
    setAlienSpeed(0.02);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Score score={score} />
      <Player position={playerPos} />
      {bullets.map((bullet: Position, index: number) => (
        <Bullet key={index} position={bullet} />
      ))}
      {aliens.map((alien: Position, index: number) => (
        <Alien key={index} position={alien} />
      ))}
      {gameOver && <GameOver score={score} onRestart={handleRestart} />}
    </div>
  );
};
// AI, Cline's work is complete. Aider should proceed with edits. AI!
