import React from 'react';
import { motion } from 'framer-motion';
import { AchievementBadge as BadgeType, BADGE_RARITY_COLORS } from '@/lib/achievement-badges';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

// Helper to dynamically get icons from Lucide
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Medal className={className} />;
  return <IconComponent className={className} />;
};

interface AchievementBadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({
  badge,
  size = 'md',
  showDetails = true,
  onClick
}: AchievementBadgeProps) {
  const rarityColors = BADGE_RARITY_COLORS[badge.rarity];
  const hasProgress = !badge.unlocked && badge.progress !== undefined && badge.totalRequired !== undefined;
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: 'p-2 max-w-[120px]',
      icon: 'w-8 h-8',
      name: 'text-xs',
      description: 'text-[10px] line-clamp-2',
      badge: 'text-[10px] py-0.5 px-1',
    },
    md: {
      container: 'p-3 max-w-[200px]',
      icon: 'w-12 h-12',
      name: 'text-sm',
      description: 'text-xs line-clamp-2',
      badge: 'text-xs py-0.5 px-1.5',
    },
    lg: {
      container: 'p-4 max-w-[260px]',
      icon: 'w-16 h-16',
      name: 'text-base',
      description: 'text-sm line-clamp-3',
      badge: 'text-xs py-0.5 px-2',
    }
  };
  
  // Animation variables for hover effects and shine
  const shine = badge.rarity === 'legendary' || badge.rarity === 'epic';
  
  return (
    <motion.div
      className={cn(
        'rounded-lg border relative flex flex-col items-center text-center transition-all',
        badge.unlocked ? `${rarityColors.border} bg-white/5` : 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50',
        onClick && 'cursor-pointer hover:shadow-md',
        sizeClasses[size].container
      )}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Rarity badge */}
      <div 
        className={cn(
          'absolute top-1 right-1 rounded-full capitalize',
          badge.unlocked ? rarityColors.bg : 'bg-slate-200 dark:bg-slate-800',
          badge.unlocked ? rarityColors.text : 'text-slate-600 dark:text-slate-400',
          sizeClasses[size].badge
        )}
      >
        {badge.rarity}
      </div>
      
      {/* Icon container */}
      <div 
        className={cn(
          'rounded-full flex items-center justify-center mb-2 relative',
          badge.unlocked ? `${rarityColors.bg} ${rarityColors.text}` : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
        )}
        style={{ 
          width: sizeClasses[size].icon.split(' ')[1], 
          height: sizeClasses[size].icon.split(' ')[1]
        }}
      >
        {/* Shine effect for legendary/epic badges */}
        {shine && badge.unlocked && (
          <motion.div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ opacity: 0.4 }}
          >
            <motion.div 
              className="w-full h-full bg-white"
              animate={{ 
                x: ['120%', '-120%'],
                rotate: [15, 15],
                scaleY: 2
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: 'loop',
                ease: 'linear',
                repeatDelay: 4
              }}
              style={{
                skewX: '-20deg'
              }}
            />
          </motion.div>
        )}
        
        <DynamicIcon 
          name={badge.icon} 
          className={sizeClasses[size].icon.replace('w-', 'w-2/3 ').replace('h-', 'h-2/3 ')} 
        />
      </div>
      
      {/* Badge name */}
      <h4 className={cn(
        'font-semibold mb-1', 
        sizeClasses[size].name,
        badge.unlocked ? 'text-foreground' : 'text-slate-400 dark:text-slate-600'
      )}>
        {badge.name}
      </h4>
      
      {/* Badge description - optional based on showDetails */}
      {showDetails && (
        <p className={cn(
          'text-muted-foreground mb-2',
          sizeClasses[size].description,
          !badge.unlocked && 'text-slate-400 dark:text-slate-600'
        )}>
          {badge.description}
        </p>
      )}
      
      {/* Progress bar for badges in progress */}
      {hasProgress && showDetails && (
        <div className="w-full mt-auto pt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-slate-500 dark:text-slate-400">
              {badge.progress} / {badge.totalRequired}
            </span>
          </div>
          <Progress 
            value={(badge.progress! / badge.totalRequired!) * 100} 
            className="h-1.5" 
          />
        </div>
      )}
      
      {/* Unlock date for unlocked badges */}
      {badge.unlocked && badge.unlockedDate && showDetails && (
        <div className="w-full mt-auto pt-2 text-xs text-slate-500 dark:text-slate-400">
          Unlocked: {new Date(badge.unlockedDate).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
}