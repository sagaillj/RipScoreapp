import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface CelebrationAnimationProps {
  title: string;
  message: string;
  buttonText: string;
  onComplete: () => void;
  type?: 'purchase' | 'meet' | 'milestone';
}

export function CelebrationAnimation({
  title,
  message,
  buttonText,
  onComplete,
  type = 'purchase'
}: CelebrationAnimationProps) {
  const [animationTriggered, setAnimationTriggered] = useState(false);
  
  // Color schemes based on celebration type
  const colors = {
    purchase: {
      primary: ["#FF5CB3", "#FF9CEE"], // Pink gradient
      secondary: ["#00F0FF", "#009CFF"], // Blue gradient
      highlight: "#FFFF00" // Yellow accent
    },
    meet: {
      primary: ["#00F0FF", "#009CFF"], // Blue gradient
      secondary: ["#6EE7B7", "#3B82F6"], // Teal to blue
      highlight: "#FFA500" // Orange accent
    },
    milestone: {
      primary: ["#8B5CF6", "#D946EF"], // Purple gradient
      secondary: ["#EC4899", "#F43F5E"], // Pink to red
      highlight: "#10B981" // Green accent
    }
  };
  
  const activeColors = colors[type];
  
  useEffect(() => {
    // Trigger the celebration animation when component mounts
    setAnimationTriggered(true);
    
    // Create a canvas-confetti instance
    const animationDuration = 3 * 1000; // Just 3 seconds total - then COMPLETE stop
    const animationEnd = Date.now() + animationDuration;
    
    // First big blast of confetti
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    // Center blast
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.6, x: 0.5 },
      colors: [...activeColors.primary, ...activeColors.secondary, activeColors.highlight],
      disableForReducedMotion: true
    });
    
    // Side blasts with slight delay
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: activeColors.primary,
        disableForReducedMotion: true
      });
      
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: activeColors.secondary,
        disableForReducedMotion: true
      });
    }, 500);
    
    // Create the confetti animation interval for just the short duration
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      // Stop confetti completely after animation duration
      if (timeLeft <= 0) {
        clearInterval(interval);
        confetti.reset(); // Completely clear any remaining particles
        return;
      }
      
      // Reduce intensity as animation progresses 
      const particleCount = 40 * (timeLeft / animationDuration);
      
      // Random confetti bursts with decreasing intensity
      confetti({
        particleCount: Math.floor(randomInRange(10, particleCount)),
        spread: randomInRange(50, 100),
        origin: { 
          y: randomInRange(0.4, 0.6), 
          x: randomInRange(0.2, 0.8)
        },
        colors: [
          activeColors.primary[Math.floor(Math.random() * activeColors.primary.length)],
          activeColors.secondary[Math.floor(Math.random() * activeColors.secondary.length)],
          activeColors.highlight
        ],
        disableForReducedMotion: true
      });
    }, 350);
    
    // Set a timeout to completely stop everything after animation duration
    setTimeout(() => {
      clearInterval(interval);
      confetti.reset(); // Force clear any remaining particles
    }, animationDuration);
    
    // Clean up if component unmounts
    return () => {
      clearInterval(interval);
      confetti.reset();
    };
  }, []);
  
  // Define the animation for floating elements
  const floatingAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: [-20, -5, -15, 0][i % 4],
      opacity: 1,
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          duration: 2.5,
          ease: "easeInOut",
          delay: i * 0.2
        },
        opacity: {
          duration: 0.8
        }
      }
    })
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 overflow-hidden">
      {/* Static background (no animation) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full blur-xl opacity-20" 
          style={{
            background: `radial-gradient(circle, ${activeColors.primary[0]}, ${activeColors.secondary[0]})`,
            width: "150%",
            height: "150%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: -1
          }}
        />
      </div>
      
      {/* Main celebration content */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
          times: [0, 0.6, 1]
        }}
        className="relative z-10 bg-[#0B1120]/90 backdrop-blur-lg p-10 md:p-16 rounded-2xl shadow-[0_0_60px_rgba(255,92,179,0.5)] max-w-lg w-full mx-4 text-center"
      >
        {/* Static star bursts (no animation) */}
        <div className="absolute -top-12 -left-12">
          <StarBurst size={80} color={activeColors.highlight} />
        </div>
        <div className="absolute -bottom-8 -right-8">
          <StarBurst size={60} color={activeColors.primary[0]} />
        </div>
        
        {/* Celebration icon */}
        <motion.div
          initial={{ rotateZ: 0, scale: 0 }}
          animate={{ 
            rotateZ: [0, 10, -10, 0],
            scale: [0, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            times: [0, 0.4, 0.6, 1],
            delay: 0.3
          }}
          className="mx-auto mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" 
            style={{ background: `linear-gradient(135deg, ${activeColors.primary[0]}, ${activeColors.primary[1]})` }}
          >
            <TrophyIcon size={60} />
          </div>
        </motion.div>
        
        {/* No animated particles */}
        
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] bg-clip-text text-transparent">
            {title}
          </h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-lg text-[#F4F6F8] mb-8"
          >
            {message}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <Button 
              onClick={onComplete}
              size="lg"
              className="px-8 py-6 text-lg bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
            >
              {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Static decoration instead of animated rings */}
        <div className="absolute inset-0 z-[-1] flex items-center justify-center">
          <div className="absolute rounded-full border-2 border-primary/20" 
            style={{ width: "200px", height: "200px" }} />
        </div>
      </motion.div>
    </div>
  );
}

// Star burst SVG component
function StarBurst({ size, color }: { size: number, color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 0L56.1233 43.8767L100 50L56.1233 56.1233L50 100L43.8767 56.1233L0 50L43.8767 43.8767L50 0Z" fill={color} />
    </svg>
  );
}

// Trophy icon component
function TrophyIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C8.67 15 6 12.33 6 9V1H18V9C18 12.33 15.33 15 12 15Z" fill="#FFD700" />
      <path d="M13 19.1V17H11V19.1C8.72 19.56 7 21.58 7 24H17C17 21.58 15.28 19.56 13 19.1Z" fill="#FFD700" />
      <path d="M9 9V4H6C6 5.61 6.67 7.19 8 8C8.35 8.23 8.68 8.39 9 8.5V9" stroke="#FF0000" strokeWidth="1" />
      <path d="M15 9V4H18C18 5.61 17.33 7.19 16 8C15.65 8.23 15.32 8.39 15 8.5V9" stroke="#FF0000" strokeWidth="1" />
      <path d="M12 15C8.67 15 6 12.33 6 9V1H18V9C18 12.33 15.33 15 12 15Z" stroke="#B8860B" strokeWidth="1" />
    </svg>
  );
}