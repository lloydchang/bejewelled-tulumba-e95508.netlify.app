import React from 'react';
import { Ghost } from 'lucide-react';
import { gsap } from 'gsap';

interface AlienProps {
  position: { x: number; y: number };
}

export const Alien: React.FC<AlienProps> = ({ position }) => {
  const alienRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (alienRef.current) {
      gsap.fromTo(alienRef.current, { y: -50 }, { y: 0, duration: 1 });
    }
  }, [position]);

  return (
    <div 
      ref={alienRef}
      className="absolute"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <img src="/path/to/custom-alien-graphic.png" alt="Alien" className="w-6 h-6" />
    </div>
  );
};
