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
  const [playerPos, setPlayerPos] = useState({ x: window.innerWidth / 2 });
  const [bullets, setBullets] = useState<Position[]>([]);
  const [aliens, setAliens] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
      setPlayerPos(prev => ({
        x: Math.max(0, prev.x - 20)
      }));
    } else if (e.code === 'ArrowRight') {
      setPlayerPos(prev => ({
        x: Math.min(window.innerWidth - 32, prev.x + 20)
      }));
    } else if (e.code === 'Space') {
      setBullets(prev => [...prev, { x: playerPos.x + 16, y: window.innerHeight - 80 }]);
    }
  }, [playerPos.x, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((deltaTime: number) => {
    if (gameOver) return;

    // Update bullets
    setBullets(prev => prev.map(bullet => ({
      ...bullet,
      y: bullet.y - 0.5 * deltaTime
    })).filter(bullet => bullet.y > 0));

    // Update aliens
    setAliens(prev => prev.map(alien => ({
      ...alien,
      y: alien.y + 0.02 * deltaTime
    })));

    // Check collisions
    setBullets(prev => {
      const newBullets = [...prev];
      setAliens(prevAliens => {
        const newAliens = prevAliens.filter(alien => {
          const hitByBullet = newBullets.some((bullet, bulletIndex) => {
            if (
              Math.abs(bullet.x - alien.x) < 20 &&
              Math.abs(bullet.y - alien.y) < 20
            ) {
              newBullets.splice(bulletIndex, 1);
              setScore(s => s + 100);
              return true;
            }
            return false;
          });
          return !hitByBullet;
        });

        // Check if aliens reached the bottom
        if (newAliens.some(alien => alien.y > window.innerHeight - 100)) {
          setGameOver(true);
        }

        return newAliens;
      });
      return newBullets;
    });
  }, [gameOver]);

  useGameLoop(updateGame);

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setPlayerPos({ x: window.innerWidth / 2 });
    setBullets([]);
    setAliens(initializeAliens());
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Score score={score} />
      <Player position={playerPos} />
      {bullets.map((bullet, index) => (
        <Bullet key={index} position={bullet} />
      ))}
      {aliens.map((alien, index) => (
        <Alien key={index} position={alien} />
      ))}
      {gameOver && <GameOver score={score} onRestart={handleRestart} />}
    </div>
  );
};