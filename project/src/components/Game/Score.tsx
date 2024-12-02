import React from 'react';

interface ScoreProps {
  score: number;
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="absolute top-4 left-4 text-green-500 text-xl font-bold">
      Score: {score}
    </div>
  );
};