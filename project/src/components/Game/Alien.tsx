import React from 'react';
import { Ghost } from 'lucide-react';

interface AlienProps {
  position: { x: number; y: number };
}

export const Alien: React.FC<AlienProps> = ({ position }) => {
  return (
    <div 
      className="absolute"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <Ghost size={24} className="text-purple-500" />
    </div>
  );
};