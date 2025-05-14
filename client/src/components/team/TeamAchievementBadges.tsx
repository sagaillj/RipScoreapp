import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ACHIEVEMENT_BADGES, 
  AchievementBadge as BadgeType,
  getBadgesByCategory,
  getUnlockedBadges,
  getLockedBadges,
  BADGE_RARITY_COLORS
} from '@/lib/achievement-badges';
import { motion } from 'framer-motion';
import { Star, Award, Shield, Medal, Trophy, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

// This is a reusable achievement badge component for the dashboard
export function AchievementBadge({ badge, size = 'sm' }: { badge: BadgeType, size?: 'sm' | 'md' | 'lg' }) {
  const rarityColors = BADGE_RARITY_COLORS[badge.rarity];
  
  // Define sizes
  const sizes = {
    sm: { outer: 'w-12 h-12', inner: 'w-10 h-10', icon: 'w-5 h-5' },
    md: { outer: 'w-16 h-16', inner: 'w-14 h-14', icon: 'w-7 h-7' },
    lg: { outer: 'w-20 h-20', inner: 'w-18 h-18', icon: 'w-9 h-9' },
  };
  
  // Get the appropriate Lucide icon
  const IconComponent = (() => {
    const icons: { [key: string]: React.ElementType } = {
      Award: Award,
      Star: Star,
      Shield: Shield,
      Medal: Medal,
      Trophy: Trophy,
      Zap: Zap,
    };
    return icons[badge.icon] || Award;
  })();
  
  return (
    <div className="relative group">
      <div 
        className={cn(
          "relative rounded-full flex items-center justify-center transition-all duration-300",
          sizes[size].outer,
          badge.unlocked ? rarityColors.border : 'border-slate-200 dark:border-slate-800'
        )}
      >
        <div 
          className={cn(
            "rounded-full flex items-center justify-center",
            sizes[size].inner,
            badge.unlocked 
              ? rarityColors.bg 
              : 'bg-slate-100 dark:bg-slate-800'
          )}
        >
          <IconComponent 
            className={cn(
              sizes[size].icon,
              badge.unlocked 
                ? rarityColors.text 
                : 'text-slate-400 dark:text-slate-600'
            )} 
          />
        </div>
        
        {/* Rarity indicator dot */}
        {badge.unlocked && (
          <span 
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--color-card-post)]",
              rarityColors.bg
            )}
          ></span>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 bg-[var(--color-card-post)] border border-[var(--color-border-post)] rounded shadow-lg text-xs text-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
        <div className="font-semibold text-[var(--color-text-post)] truncate">{badge.name}</div>
        <div className="text-[var(--color-muted-post)] text-[10px] truncate">{badge.rarity}</div>
      </div>
    </div>
  );
}

// Main team achievements component - shows a grid of badges
export function TeamAchievementBadges() {
  const unlockedBadges = getUnlockedBadges().slice(0, 8);
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  
  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 justify-items-center">
        {unlockedBadges.map((badge) => (
          <div key={badge.id} onClick={() => setSelectedBadge(badge)} className="cursor-pointer">
            <AchievementBadge badge={badge} />
          </div>
        ))}
      </div>
      
      {/* Badge detail dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedBadge?.name}</DialogTitle>
            <DialogDescription>
              {selectedBadge?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center my-4">
            <AchievementBadge badge={selectedBadge!} size="lg" />
          </div>
          
          <div className="mt-2 text-center text-sm text-[var(--color-muted-post)]">
            {selectedBadge?.unlocked && selectedBadge?.unlockedDate && (
              <div>Unlocked: {new Date(selectedBadge.unlockedDate).toLocaleDateString()}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Demo component with a "See All" button for the dashboard
export function TeamAchievementBadgesDemo() {
  // Get the most recent unlocked badges
  const recentUnlockedBadges = getUnlockedBadges().slice(0, 4);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {recentUnlockedBadges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-2">
            <AchievementBadge badge={badge} size="md" />
            <span className="text-xs text-center text-[var(--color-text-post)] font-medium truncate max-w-[70px]">{badge.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Link href="/team-achievements">
          <Button 
            variant="outline" 
            className="border-[var(--color-border-post)] text-[var(--color-accent2-post)] hover:text-[var(--color-accent-post)]"
          >
            See All Achievements <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}