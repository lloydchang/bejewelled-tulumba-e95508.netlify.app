import React from 'react';
import { Ship } from 'lucide-react';

interface PlayerProps {
  position: { x: number };
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
  return (
    <div 
      className="absolute bottom-8"
      style={{ left: `${position.x}px` }}
    >
      <Ship size={32} className="text-blue-500" />
    </div>
  );
};