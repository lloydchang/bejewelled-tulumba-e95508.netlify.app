import React from 'react';

interface BulletProps {
  position: { x: number; y: number };
}

export const Bullet: React.FC<BulletProps> = ({ position }) => {
  // AI Add a comment to explain the purpose of the Bullet component AI!
  // AI Ensure the bullet is positioned correctly based on the position prop AI!
  return (
    <div 
      className="absolute w-1 h-3 bg-yellow-400 rounded"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};
