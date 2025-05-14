import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationConfettiProps {
  trigger?: boolean;
  delay?: number;
  duration?: number;
}

export function CelebrationConfetti({ 
  trigger = true, 
  delay = 0,
  duration = 3000
}: CelebrationConfettiProps) {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (!trigger) return;
    
    const timer = setTimeout(() => {
      setIsActive(true);
      
      // Create canvas element for confetti
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);
      
      // Create confetti instance
      const confettiInstance = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });
      
      // Fire confetti from left side
      confettiInstance({
        particleCount: 100,
        spread: 70,
        origin: { x: 0, y: 0.5 },
        colors: ['#FF5CB3', '#FF9CEE', '#8A9BA8', '#131C2E', '#ffffff'],
      });
      
      // Fire confetti from right side
      confettiInstance({
        particleCount: 100,
        spread: 70,
        origin: { x: 1, y: 0.5 },
        colors: ['#FF5CB3', '#FF9CEE', '#8A9BA8', '#131C2E', '#ffffff'],
      });
      
      // Fire confetti from top center
      setTimeout(() => {
        confettiInstance({
          particleCount: 150,
          spread: 120,
          origin: { x: 0.5, y: 0 },
          colors: ['#FF5CB3', '#FF9CEE', '#8A9BA8', '#131C2E', '#ffffff'],
        });
      }, 250);
      
      // Remove canvas after celebration
      const cleanupTimer = setTimeout(() => {
        document.body.removeChild(canvas);
        setIsActive(false);
      }, duration);
      
      return () => {
        clearTimeout(cleanupTimer);
        if (document.body.contains(canvas)) {
          document.body.removeChild(canvas);
        }
      };
    }, delay);
    
    return () => clearTimeout(timer);
  }, [trigger, delay, duration]);
  
  return null; // This component doesn't render anything visible
}