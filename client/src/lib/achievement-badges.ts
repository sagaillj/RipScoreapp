export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  icon: string; // Icon name from Lucide
  unlocked?: boolean;
  progress?: number;
  totalRequired?: number;
  unlockedDate?: string;
  category: 'competition' | 'training' | 'team' | 'personal';
}

// Define colors for each rarity level
export const BADGE_RARITY_COLORS: Record<BadgeRarity, { bg: string, text: string, border: string }> = {
  common: { 
    bg: 'bg-slate-200 dark:bg-slate-700', 
    text: 'text-slate-700 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-600'
  },
  uncommon: { 
    bg: 'bg-green-100 dark:bg-green-900/30', 
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-300 dark:border-green-800'
  },
  rare: { 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-300 dark:border-blue-800'
  },
  epic: { 
    bg: 'bg-purple-100 dark:bg-purple-900/30', 
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-300 dark:border-purple-800'
  },
  legendary: { 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-300 dark:border-amber-800'
  }
};

// Sample achievement badges data
export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // Team Badges
  {
    id: 'team-full-roster',
    name: 'Full Roster',
    description: 'Register a complete team with all positions filled',
    rarity: 'common',
    icon: 'Users',
    unlocked: true,
    unlockedDate: '2025-03-15',
    category: 'team'
  },
  {
    id: 'team-perfect-attendance',
    name: 'Perfect Attendance',
    description: 'Achieve 100% team attendance for an entire month',
    rarity: 'uncommon',
    icon: 'Calendar',
    unlocked: true,
    unlockedDate: '2025-04-02',
    category: 'team'
  },
  {
    id: 'team-unity',
    name: 'Team Unity',
    description: 'Have all team members complete their individual goals in the same week',
    rarity: 'rare',
    icon: 'Heart',
    unlocked: false,
    progress: 8,
    totalRequired: 12,
    category: 'team'
  },
  {
    id: 'team-all-state',
    name: 'All-State Team',
    description: 'Have at least three divers qualify for the state championship',
    rarity: 'epic',
    icon: 'Award',
    unlocked: false,
    progress: 2,
    totalRequired: 3,
    category: 'team'
  },
  {
    id: 'team-dynasty',
    name: 'Dynasty',
    description: 'Win three consecutive championship titles',
    rarity: 'legendary',
    icon: 'Crown',
    unlocked: false,
    progress: 1,
    totalRequired: 3,
    category: 'team'
  },
  
  // Competition Badges
  {
    id: 'competition-first-meet',
    name: 'First Meet',
    description: 'Successfully host or participate in your first diving meet',
    rarity: 'common',
    icon: 'Flag',
    unlocked: true,
    unlockedDate: '2025-02-20',
    category: 'competition'
  },
  {
    id: 'competition-podium',
    name: 'Podium Finish',
    description: 'Have a team member finish in the top 3 at a competition',
    rarity: 'uncommon',
    icon: 'Trophy',
    unlocked: true,
    unlockedDate: '2025-03-10',
    category: 'competition'
  },
  {
    id: 'competition-winning-streak',
    name: 'Winning Streak',
    description: 'Win five consecutive meets',
    rarity: 'rare',
    icon: 'Flame',
    unlocked: false,
    progress: 3,
    totalRequired: 5,
    category: 'competition'
  },
  {
    id: 'competition-clean-sweep',
    name: 'Clean Sweep',
    description: 'Win gold in all events at a single competition',
    rarity: 'epic',
    icon: 'Medal',
    unlocked: false,
    category: 'competition'
  },
  {
    id: 'competition-national-champions',
    name: 'National Champions',
    description: 'Win a national championship title',
    rarity: 'legendary',
    icon: 'Star',
    unlocked: false,
    category: 'competition'
  },
  
  // Training Badges
  {
    id: 'training-consistent',
    name: 'Consistency King',
    description: 'Complete all planned training sessions for a month',
    rarity: 'common',
    icon: 'CheckCircle',
    unlocked: true,
    unlockedDate: '2025-03-31',
    category: 'training'
  },
  {
    id: 'training-dive-variety',
    name: 'Dive Variety',
    description: 'Practice all dive categories in a single week',
    rarity: 'uncommon',
    icon: 'Layers',
    unlocked: true,
    unlockedDate: '2025-04-07',
    category: 'training'
  },
  {
    id: 'training-skill-mastery',
    name: 'Skill Mastery',
    description: 'Have all team members master a new dive in the same month',
    rarity: 'rare',
    icon: 'Zap',
    unlocked: false,
    progress: 7,
    totalRequired: 10,
    category: 'training'
  },
  {
    id: 'training-elite-program',
    name: 'Elite Training Program',
    description: 'Complete the advanced training program with all team members',
    rarity: 'epic',
    icon: 'Target',
    unlocked: false,
    progress: 60,
    totalRequired: 100,
    category: 'training'
  },
  {
    id: 'training-innovation',
    name: 'Training Innovation',
    description: 'Develop a unique training method that improves team performance by 25%',
    rarity: 'legendary',
    icon: 'Lightbulb',
    unlocked: false,
    category: 'training'
  },
  
  // Personal Badges
  {
    id: 'personal-first-steps',
    name: 'First Steps',
    description: 'Complete onboarding and set up your coach profile',
    rarity: 'common',
    icon: 'UserPlus',
    unlocked: true,
    unlockedDate: '2025-02-15',
    category: 'personal'
  },
  {
    id: 'personal-feedback',
    name: 'Valuable Feedback',
    description: 'Provide constructive feedback to divers 50 times',
    rarity: 'uncommon',
    icon: 'MessageSquare',
    unlocked: true,
    unlockedDate: '2025-04-01',
    category: 'personal'
  },
  {
    id: 'personal-mentor',
    name: 'Dive Mentor',
    description: 'Help a diver improve their score by 20% or more',
    rarity: 'rare',
    icon: 'TrendingUp',
    unlocked: false,
    progress: 15,
    totalRequired: 20,
    category: 'personal'
  },
  {
    id: 'personal-strategist',
    name: 'Master Strategist',
    description: 'Develop 10 successful competition strategies that lead to wins',
    rarity: 'epic',
    icon: 'Brain',
    unlocked: false,
    progress: 6,
    totalRequired: 10,
    category: 'personal'
  },
  {
    id: 'personal-legacy',
    name: 'Coaching Legacy',
    description: 'Have one of your divers become a professional or Olympic athlete',
    rarity: 'legendary',
    icon: 'Award',
    unlocked: false,
    category: 'personal'
  }
];

// Helper functions to filter badges
export function getBadgesByCategory(category: AchievementBadge['category']) {
  return ACHIEVEMENT_BADGES.filter(badge => badge.category === category);
}

export function getBadgesByRarity(rarity: BadgeRarity) {
  return ACHIEVEMENT_BADGES.filter(badge => badge.rarity === rarity);
}

export function getUnlockedBadges() {
  return ACHIEVEMENT_BADGES.filter(badge => badge.unlocked);
}

export function getLockedBadges() {
  return ACHIEVEMENT_BADGES.filter(badge => !badge.unlocked);
}