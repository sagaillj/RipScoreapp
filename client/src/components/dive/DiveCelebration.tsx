import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface DiveCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  dive: {
    number: string;
    name: string;
    rarity: string;
  };
}

export function DiveCelebration({ isOpen, onClose, dive }: DiveCelebrationProps) {
  const [showDialog, setShowDialog] = useState(false);

  // Show the celebration dialog after a short delay
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

      const fireConfetti = () => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(fireConfetti);
        }
      };
      
      // Start the confetti
      fireConfetti();
      
      // Show dialog after a short delay
      setTimeout(() => setShowDialog(true), 300);
    } else {
      setShowDialog(false);
    }
  }, [isOpen]);

  // Get rarity colors
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return { bg: 'bg-gradient-to-br from-yellow-300 to-amber-500', text: 'text-amber-900' };
      case 'epic': return { bg: 'bg-gradient-to-br from-purple-300 to-purple-600', text: 'text-purple-950' };
      case 'rare': return { bg: 'bg-gradient-to-br from-blue-300 to-blue-600', text: 'text-blue-950' };
      case 'uncommon': return { bg: 'bg-gradient-to-br from-green-300 to-green-600', text: 'text-green-950' };
      default: return { bg: 'bg-gradient-to-br from-gray-100 to-gray-300', text: 'text-gray-700' };
    }
  };

  const rarityColors = getRarityColor(dive.rarity);

  return (
    <Dialog open={showDialog} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative flex flex-col items-center p-6">
          {/* Background shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-primary animate-pulse"></div>
            <motion.div 
              className="absolute top-1/2 left-1/2 w-full h-[500px] bg-white opacity-20"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                transformOrigin: 'center',
                borderRadius: '100%',
              }}
            />
          </div>
          
          {/* Dive card content */}
          <div className="z-10 text-center">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full ${rarityColors.bg} flex items-center justify-center text-3xl font-bold ${rarityColors.text}`}>
                    {dive.number}
                  </div>
                  <motion.div
                    className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    ✓
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-1">Dive Unlocked!</h3>
              <p className="text-lg font-semibold">{dive.number}</p>
              <p className="text-sm text-gray-500 mb-4">{dive.name}</p>
              
              <div className="inline-block px-3 py-1 rounded-full mb-4 text-xs font-bold uppercase" 
                style={{
                  background: `linear-gradient(135deg, ${rarityColors.bg.split(' ')[1].slice(5)}, ${rarityColors.bg.split(' ')[3].slice(3)})`,
                  color: rarityColors.text.split('-')[1]
                }}
              >
                {dive.rarity}
              </div>
              
              <p className="text-sm text-gray-500">
                You've earned <span className="text-primary font-bold">+50</span> points for your team!
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}