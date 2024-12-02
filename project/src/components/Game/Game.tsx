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
  const [playerPos, setPlayerPos] = useState<Position>({ x: window.innerWidth / 2, y: 0 });
  const [bullets, setBullets] = useState<{ position: Position; velocity: number }[]>([]);
  const [aliens, setAliens] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [alienSpeed, setAlienSpeed] = useState(0.02);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);

  const increaseScoreMultiplier = useCallback(() => {
    if (score % 1000 === 0) {
      setScoreMultiplier(prevMultiplier => prevMultiplier + 1);
    }
  }, [score]);

  const decreasePlayerHealth = useCallback(() => {
    setPlayerHealth(prevHealth => prevHealth - 1);
    if (playerHealth <= 0) {
      setGameOver(true);
    }
  }, [playerHealth]);

  const resetGameState = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setPlayerPos({ x: window.innerWidth / 2, y: 0 });
    setBullets([]);
    setAliens(initializeAliens());
    setAlienSpeed(0.02);
    setPlayerHealth(3);
    setScoreMultiplier(1);
  }, [initializeAliens]);

  const handleBulletAlienCollision = useCallback((newBullets: { position: Position; velocity: number }[], newAliens: Position[]) => {
    const updatedAliens = newAliens.filter((alien: Position) => {
      const hit = newBullets.some((bullet: { position: Position; velocity: number }) => {
        return (
          Math.abs(bullet.position.x - alien.x) < 20 && Math.abs(bullet.position.y - alien.y) < 20
        );
      });
      if (hit) {
        setScore((prevScore: number) => prevScore + 100 * scoreMultiplier);
        increaseScoreMultiplier();
      }
      return !hit;
    });
    return updatedAliens;
  }, [scoreMultiplier, increaseScoreMultiplier]);

  const handleAlienPlayerCollision = useCallback((newAliens: Position[]) => {
    const playerHit = newAliens.some((alien: Position) => {
      return (
        Math.abs(alien.x - playerPos.x) < 20 && Math.abs(alien.y - playerPos.y) < 20
      );
    });
    if (playerHit) {
      decreasePlayerHealth();
    }
  }, [playerPos, decreasePlayerHealth]);

  const updateAlienSpeed = useCallback((deltaTime: number) => {
    setAlienSpeed((prevSpeed: number) => Math.min(0.1, prevSpeed + 0.0005 * deltaTime));
  }, []);

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
      setBullets((prev: { position: Position; velocity: number }[]) => [...prev, { position: { x: playerPos.x + 16, y: window.innerHeight - 80 }, velocity: 100 }]);
    }
  }, [playerPos, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((deltaTime: number) => {
    if (gameOver) return;

    const newBullets = bullets.map((bullet: { position: Position; velocity: number }) => ({
      ...bullet,
      position: {
        ...bullet.position,
        y: bullet.position.y - bullet.velocity * deltaTime,
      },
    })).filter((bullet: { position: Position; velocity: number }) => bullet.position.y > 0);

    const newAliens = aliens.map((alien: Position) => ({
      ...alien,
      y: alien.y + alienSpeed * deltaTime,
    }));

    const updatedAliens = handleBulletAlienCollision(newBullets, newAliens);
    handleAlienPlayerCollision(updatedAliens);

    if (updatedAliens.some((alien: Position) => alien.y > window.innerHeight - 100)) {
      decreasePlayerHealth();
    }

    setBullets(newBullets);
    setAliens(updatedAliens);
    updateAlienSpeed(deltaTime);
  }, [bullets, aliens, gameOver, alienSpeed, playerPos, playerHealth, scoreMultiplier, handleBulletAlienCollision, handleAlienPlayerCollision, decreasePlayerHealth, updateAlienSpeed]);

  useGameLoop(updateGame);

  const handleGameOver = useCallback(() => {
    if (gameOver) {
      // Handle game over logic
    }
  }, [gameOver]);

  const handleRestart = useCallback(() => {
    resetGameState();
  }, [resetGameState]);

  const renderGameComponents = () => {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden">
        <Score score={score} />
        <Player position={playerPos} />
        {bullets.map((bullet: { position: Position; velocity: number }, index: number) => (
          <Bullet key={index} position={bullet.position} velocity={bullet.velocity} />
        ))}
        {aliens.map((alien: Position, index: number) => (
          <Alien key={index} position={alien} />
        ))}
        {gameOver && <GameOver score={score} onRestart={handleRestart} />}
      </div>
    );
  };

  const handleGameLoop = useCallback(() => {
    useGameLoop(updateGame);
  }, [updateGame]);

  const handleGameOverScreen = useCallback(() => {
    if (gameOver) {
      return <GameOver score={score} onRestart={handleRestart} />;
    }
    return null;
  }, [gameOver, score, handleRestart]);

  const handleScoreDisplay = useCallback(() => {
    return <Score score={score} />;
  }, [score]);

  const handlePlayerDisplay = useCallback(() => {
    return <Player position={playerPos} />;
  }, [playerPos]);

  return renderGameComponents();
};
