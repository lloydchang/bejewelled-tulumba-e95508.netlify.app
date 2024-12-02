import React, { useState, useCallback, useEffect } from 'react';
import { Player } from './Player';
import { Alien } from './Alien';
import { Bullet } from './Bullet';
import { GameOver } from './GameOver';
import { Score } from './Score';
import { useGameLoop } from '../../hooks/useGameLoop';
import * as ReactJsxRuntime from 'react/jsx-runtime';

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
  }, [playerPos, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((deltaTime: number) => {
    if (gameOver) return;

    // AI, Refactor bullet updates for better performance AI!
    setBullets(prevBullets => prevBullets.map((bullet) => ({
      ...bullet,
      y: bullet.y - 0.5 * deltaTime,
    })).filter((bullet) => bullet.y > 0));

    // AI, Optimize alien movement for smoother animation AI!
    setAliens(prevAliens => prevAliens.map((alien) => ({
      ...alien,
      y: alien.y + 0.02 * deltaTime,
    })));

    // AI, Improve collision detection efficiency AI!
    setBullets(prevBullets => {
      const newBullets = [...prevBullets];
      setAliens(prevAliens => {
        const newAliens = prevAliens.filter((alien) => {
          const hitByBullet = newBullets.some((bullet, bulletIndex) => {
            if (
              Math.abs(bullet.x - alien.x) < 20 &&
              Math.abs(bullet.y - alien.y) < 20
            ) {
              newBullets.splice(bulletIndex, 1);
              setScore(prevScore => prevScore + 100);
              return true;
            }
            return false;
          });
          return !hitByBullet;
        });

        // AI, Add a game over condition if player is hit AI!
        if (newAliens.some(alien => alien.y > window.innerHeight - 100)) {
          setGameOver(true);
        }

        return newAliens;
      });
      return newBullets;
    });
  }, [gameOver, setAliens, setBullets, setScore, setGameOver]);

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
        ReactJsxRuntime.jsx(Bullet, { key: index, position: bullet }, index)
      ))}
      {aliens.map((alien, index) => (
        ReactJsxRuntime.jsx(Alien, { key: index, position: alien }, index)
      ))}
      {gameOver && ReactJsxRuntime.jsx(GameOver, { score: score, onRestart: handleRestart })}
    </div>
  );
};
