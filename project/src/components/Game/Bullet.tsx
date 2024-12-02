import React from 'react';

interface BulletProps {
  position: { x: number; y: number };
}

export const Bullet: React.FC<BulletProps> = ({ position }) => {
  // This component renders a single bullet on the game screen.  It's positioned using the x and y coordinates provided in the `position` prop.
  // The bullet is styled as a small, yellow rectangle.
  return (
    <div 
      className="absolute w-1 h-3 bg-yellow-400 rounded"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};
