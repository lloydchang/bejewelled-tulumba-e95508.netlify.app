import React, { useEffect, useState } from 'react';

interface BulletProps {
  position: { x: number; y: number };
  velocity: number; // AI Add a new prop `velocity` to the BulletProps interface AI!
}

export const Bullet: React.FC<BulletProps> = ({ position, velocity }) => {
  // This component renders a single bullet on the game screen. It's positioned using the x and y coordinates provided in the `position` prop.
  // The bullet is styled as a small, yellow rectangle.
  const [bulletPosition, setBulletPosition] = useState(position);

  useEffect(() => {
    const interval = setInterval(() => {
      setBulletPosition(prevPosition => ({
        x: prevPosition.x,
        y: prevPosition.y - velocity, // AI Update the Bullet component to use the `velocity` prop to calculate the new position of the bullet AI!
      }));
    }, 16); // AI Add a useEffect hook to update the bullet's position every 16ms (approx. 60fps) AI!

    return () => clearInterval(interval);
  }, [velocity]);

  if (bulletPosition.y < 0) {
    return null; // AI Remove the bullet from the DOM when its y-coordinate is less than 0 AI!
  }

  return (
    <div 
      className="absolute w-1 h-3 bg-yellow-400 rounded"
      style={{ left: `${bulletPosition.x}px`, top: `${bulletPosition.y}px` }}
    />
  );
};
