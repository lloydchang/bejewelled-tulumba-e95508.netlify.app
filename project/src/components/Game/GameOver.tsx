import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Game Over</h2>
        <p className="text-2xl mb-4 text-gray-800">Final Score: {score}</p>
        <button
          onClick={onRestart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};