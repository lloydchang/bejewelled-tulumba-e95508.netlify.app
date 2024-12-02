import React from 'react';

interface ScoreProps {
  score: number;
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="absolute top-4 left-4 text-white text-xl font-bold bg-gray-800 p-2 rounded-lg shadow-lg">
      <div className="flex items-center">
        <img src="/path/to/custom-score-icon.png" alt="Score Icon" className="w-6 h-6 mr-2" />
        <span>Score: {score}</span>
      </div>
    </div>
  );
};
