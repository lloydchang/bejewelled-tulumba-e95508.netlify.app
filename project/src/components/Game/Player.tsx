import React from 'react';

interface PlayerProps {
  position: { x: number };
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div 
      className="absolute bottom-8"
      style={{ left: `${position.x}px` }}
    >
      <img src="/path/to/custom-player-graphic.png" alt="Player" className="w-8 h-8 animate-bounce" />
    </div>
  );
};
