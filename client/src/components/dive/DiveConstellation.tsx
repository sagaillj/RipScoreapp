import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Dive rarity types
type DiveRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Interface for a dive in the constellation
interface ConstellationDive {
  id: number;
  name: string;
  code: string;
  difficulty: number;
  rarity: DiveRarity;
  unlocked: boolean;
  position: { x: number; y: number };
  connections: number[];  // IDs of connected dives
}

// Mapping of rarity to color
const rarityColors: Record<DiveRarity, string> = {
  common: 'bg-slate-400 text-white',
  uncommon: 'bg-green-500 text-white',
  rare: 'bg-blue-500 text-white',
  epic: 'bg-purple-500 text-white',
  legendary: 'bg-amber-500 text-white',
};

// Mapping of rarity to glow effect
const rarityGlow: Record<DiveRarity, string> = {
  common: 'shadow-sm',
  uncommon: 'shadow-md shadow-green-300',
  rare: 'shadow-md shadow-blue-300',
  epic: 'shadow-lg shadow-purple-300',
  legendary: 'shadow-xl shadow-amber-300 animate-pulse',
};

// Shimmer effect for legendary dives
const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Mock data for the constellation
const mockDives: ConstellationDive[] = [
  {
    id: 1,
    name: 'Forward Dive',
    code: '101A',
    difficulty: 1.4,
    rarity: 'common',
    unlocked: true,
    position: { x: 50, y: 50 },
    connections: [2, 3]
  },
  {
    id: 2,
    name: 'Forward 1.5 Somersault',
    code: '103C',
    difficulty: 1.7,
    rarity: 'uncommon',
    unlocked: true,
    position: { x: 70, y: 30 },
    connections: [1, 4, 5]
  },
  {
    id: 3,
    name: 'Forward 2.5 Somersault',
    code: '105C',
    difficulty: 2.4,
    rarity: 'rare',
    unlocked: false,
    position: { x: 30, y: 70 },
    connections: [1, 6]
  },
  {
    id: 4,
    name: 'Forward 3.5 Somersault',
    code: '107C',
    difficulty: 2.8,
    rarity: 'epic',
    unlocked: false,
    position: { x: 85, y: 15 },
    connections: [2]
  },
  {
    id: 5,
    name: 'Reverse 1.5 Somersault',
    code: '303C',
    difficulty: 2.0,
    rarity: 'uncommon',
    unlocked: true,
    position: { x: 80, y: 60 },
    connections: [2, 7]
  },
  {
    id: 6,
    name: 'Inward 1.5 Somersault',
    code: '403C',
    difficulty: 2.1,
    rarity: 'rare',
    unlocked: false,
    position: { x: 20, y: 85 },
    connections: [3]
  },
  {
    id: 7,
    name: 'Reverse 2.5 Somersault',
    code: '305C',
    difficulty: 2.6,
    rarity: 'legendary',
    unlocked: false,
    position: { x: 70, y: 80 },
    connections: [5]
  }
];

interface DiveConstellationProps {
  className?: string;
}

export function DiveConstellation({ className = '' }: DiveConstellationProps) {
  const [dives, setDives] = useState<ConstellationDive[]>(mockDives);
  const [selectedDive, setSelectedDive] = useState<ConstellationDive | null>(null);
  const [animated, setAnimated] = useState(false);
  const constellationRef = useRef<HTMLDivElement>(null);
  
  // Animation delay stagger for initial load
  useEffect(() => {
    // Delay to ensure smooth initial animation
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to unlock a dive
  const unlockDive = (diveId: number) => {
    setDives(prevDives => 
      prevDives.map(dive => 
        dive.id === diveId ? { ...dive, unlocked: true } : dive
      )
    );
    
    // Select the newly unlocked dive
    const newlyUnlocked = dives.find(dive => dive.id === diveId);
    if (newlyUnlocked) {
      setSelectedDive({ ...newlyUnlocked, unlocked: true });
    }
  };
  
  // Check if a dive can be unlocked
  const canUnlock = (dive: ConstellationDive) => {
    if (dive.unlocked) return false;
    
    // Check if at least one connected dive is unlocked
    return dive.connections.some(id => 
      dives.find(d => d.id === id)?.unlocked
    );
  };
  
  return (
    <div className={`relative h-[600px] rounded-xl bg-[var(--color-background-post)] ${className}`}>
      {/* Add the shimmer animation styles */}
      <style>{shimmerAnimation}</style>
      {/* Starry background with subtle animation */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-[#020817] opacity-90"></div>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.2
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            style={{ 
              width: `${Math.random() * 3 + 1}px`, 
              height: `${Math.random() * 3 + 1}px` 
            }}
          />
        ))}
      </div>
      
      {/* Constellation container */}
      <div ref={constellationRef} className="relative h-full w-full">
        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
          {dives.map(dive => 
            dive.connections.map(connId => {
              const connectedDive = dives.find(d => d.id === connId);
              if (!connectedDive) return null;
              
              // Only show connections if at least one of the dives is unlocked
              const bothLocked = !dive.unlocked && !connectedDive.unlocked;
              if (bothLocked) return null;
              
              const isHighlighted = selectedDive && 
                (selectedDive.id === dive.id || selectedDive.id === connId);
              
              return (
                <motion.line
                  key={`${dive.id}-${connId}`}
                  x1={`${dive.position.x}%`}
                  y1={`${dive.position.y}%`}
                  x2={`${connectedDive.position.x}%`}
                  y2={`${connectedDive.position.y}%`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: animated ? 1 : 0,
                    opacity: animated ? (isHighlighted ? 0.8 : 0.3) : 0,
                    stroke: isHighlighted ? '#f471b5' : '#64748b'
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: animated ? 0.2 : 0.5,
                    ease: "easeInOut" 
                  }}
                  className={`${isHighlighted ? 'stroke-[var(--color-accent2-post)]' : 'stroke-slate-500'}`}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray="5,5"
                />
              );
            })
          )}
        </svg>
        
        {/* Dive nodes */}
        {dives.map(dive => {
          const canBeUnlocked = canUnlock(dive);
          return (
            <motion.div
              key={dive.id}
              style={{
                left: `${dive.position.x}%`,
                top: `${dive.position.y}%`,
                zIndex: 2
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: animated ? 1 : 0,
                opacity: animated ? 1 : 0
              }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: animated ? dive.id * 0.1 : 0.5 + dive.id * 0.1
              }}
            >
              <motion.div
                className={`
                  relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full
                  ${dive.unlocked ? rarityColors[dive.rarity] : 'bg-gray-800 text-gray-500 border border-gray-700'}
                  ${dive.unlocked ? rarityGlow[dive.rarity] : ''}
                  ${canBeUnlocked ? 'ring-2 ring-[var(--color-accent2-post)] animate-pulse' : ''}
                  transition-all duration-300 hover:scale-110
                `}
                style={
                  dive.unlocked && dive.rarity === 'legendary' 
                    ? { 
                        background: 'linear-gradient(45deg, #f59e0b, #f59e0b, #eab308, #facc15, #eab308, #f59e0b)',
                        backgroundSize: '400% 100%',
                        animation: 'shimmer 3s ease-in-out infinite'
                      } 
                    : undefined
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (dive.unlocked) {
                    setSelectedDive(selectedDive?.id === dive.id ? null : dive);
                  } else if (canBeUnlocked) {
                    unlockDive(dive.id);
                  }
                }}
              >
                <span className="text-xs font-bold">{dive.code}</span>
                
                {/* Difficulty badge */}
                <Badge 
                  className={`
                    absolute -bottom-2 -right-2 text-[10px] py-0 px-1.5
                    ${dive.unlocked ? 'bg-black/80 text-white' : 'bg-gray-700 text-gray-400'}
                  `}
                >
                  DD {dive.difficulty}
                </Badge>
                
                {/* Unlock indicator for unlockable dives */}
                {canBeUnlocked && !dive.unlocked && (
                  <motion.div 
                    className="absolute -right-1 -top-1 rounded-full bg-[var(--color-accent2-post)] p-1 text-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
        
        {/* Selected dive details */}
        <AnimatePresence>
          {selectedDive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-6 left-6 right-6 z-10"
            >
              <Card className="bg-[var(--color-card-post)]/90 backdrop-blur border-[var(--color-border-post)]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--color-text-post)]">{selectedDive.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={`${rarityColors[selectedDive.rarity]}`}>
                          {selectedDive.rarity.charAt(0).toUpperCase() + selectedDive.rarity.slice(1)}
                        </Badge>
                        <span className="text-sm text-[var(--color-muted-post)]">Code: {selectedDive.code}</span>
                        <span className="text-sm text-[var(--color-muted-post)]">DD: {selectedDive.difficulty}</span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--color-muted-post)]">
                        You've mastered this dive. Connected dives become available to unlock as you progress.
                      </p>
                    </div>
                    <Badge 
                      className="ml-4 bg-[var(--color-accent2-post)] text-white" 
                      variant="outline"
                    >
                      Unlocked
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}