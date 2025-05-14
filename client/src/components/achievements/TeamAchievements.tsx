import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AchievementBadge } from './AchievementBadge';
import { 
  ACHIEVEMENT_BADGES, 
  AchievementBadge as BadgeType,
  getBadgesByCategory,
  getUnlockedBadges,
  getLockedBadges
} from '@/lib/achievement-badges';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Trophy, Medal, Zap, LightbulbIcon, Crown } from 'lucide-react';

export function TeamAchievements() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  
  // Filter badges by category for each tab
  const competitionBadges = getBadgesByCategory('competition');
  const trainingBadges = getBadgesByCategory('training');
  const teamBadges = getBadgesByCategory('team');
  const personalBadges = getBadgesByCategory('personal');
  
  // Get unlocked and locked badges for the overview
  const unlockedBadges = getUnlockedBadges();
  const lockedBadges = getLockedBadges();
  
  // Handler for badge click
  const handleBadgeClick = (badge: BadgeType) => {
    setSelectedBadge(badge);
  };
  
  // Close badge detail dialog
  const closeBadgeDetail = () => {
    setSelectedBadge(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Achievements</h2>
          <p className="text-muted-foreground">
            Track your team's progress and earn badges for completing challenges together.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground text-right">
            <div>Unlocked: <span className="font-medium text-foreground">{unlockedBadges.length}</span></div>
            <div>Total: <span className="font-medium text-foreground">{ACHIEVEMENT_BADGES.length}</span></div>
          </div>
        </div>
      </div>
      
      {/* Overall achievement stats cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unlocked Badges
            </CardTitle>
            <CardDescription>
              {((unlockedBadges.length / ACHIEVEMENT_BADGES.length) * 100).toFixed(0)}% Complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedBadges.length} / {ACHIEVEMENT_BADGES.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Keep going, your team is making progress!
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Competition Achievements
            </CardTitle>
            <CardDescription>
              Meet and event related
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-amber-500" />
            <div>
              <div className="text-2xl font-bold">
                {competitionBadges.filter(b => b.unlocked).length} / {competitionBadges.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Earned through competitions
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Training Achievements
            </CardTitle>
            <CardDescription>
              Practice and learning related
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <Zap className="h-8 w-8 mr-3 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">
                {trainingBadges.filter(b => b.unlocked).length} / {trainingBadges.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Earned through team practice
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Legendary Badges
            </CardTitle>
            <CardDescription>
              Rare and difficult to earn
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <Crown className="h-8 w-8 mr-3 text-amber-400" />
            <div>
              <div className="text-2xl font-bold">
                {ACHIEVEMENT_BADGES.filter(b => b.rarity === 'legendary' && b.unlocked).length} / {ACHIEVEMENT_BADGES.filter(b => b.rarity === 'legendary').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                The highest team honors
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievement badge tabs by category */}
      <Card>
        <CardHeader>
          <CardTitle>Team Achievement Badges</CardTitle>
          <CardDescription>
            Earn these badges by working together as a team. Click on a badge to see more details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-6">
              <TabsTrigger value="all">All Badges</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="competition">Competition</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {ACHIEVEMENT_BADGES.map((badge) => (
                  <AchievementBadge 
                    key={badge.id} 
                    badge={badge} 
                    onClick={() => handleBadgeClick(badge)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="m-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {teamBadges.map((badge) => (
                  <AchievementBadge 
                    key={badge.id} 
                    badge={badge} 
                    onClick={() => handleBadgeClick(badge)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="competition" className="m-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {competitionBadges.map((badge) => (
                  <AchievementBadge 
                    key={badge.id} 
                    badge={badge} 
                    onClick={() => handleBadgeClick(badge)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="training" className="m-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {trainingBadges.map((badge) => (
                  <AchievementBadge 
                    key={badge.id} 
                    badge={badge} 
                    onClick={() => handleBadgeClick(badge)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="m-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {personalBadges.map((badge) => (
                  <AchievementBadge 
                    key={badge.id} 
                    badge={badge} 
                    onClick={() => handleBadgeClick(badge)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Badge detail dialog */}
      <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && closeBadgeDetail()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Achievement Badge Details</DialogTitle>
            <DialogDescription>
              Information about this team achievement badge.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBadge && (
            <div className="flex flex-col items-center py-4">
              <AchievementBadge 
                badge={selectedBadge} 
                size="lg"
                showDetails={false}
              />
              
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">{selectedBadge.name}</h3>
                <p className="text-muted-foreground mt-1">{selectedBadge.description}</p>
                
                {selectedBadge.unlocked ? (
                  <div className="mt-4 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                    <div className="font-medium">Badge Unlocked!</div>
                    {selectedBadge.unlockedDate && (
                      <div className="text-sm">
                        Earned on {new Date(selectedBadge.unlockedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="font-medium">Badge Locked</div>
                    {selectedBadge.progress !== undefined && selectedBadge.totalRequired !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            {selectedBadge.progress} / {selectedBadge.totalRequired}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{width: `${(selectedBadge.progress / selectedBadge.totalRequired) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-center">
                  <div className="border rounded-lg p-2">
                    <div className="text-muted-foreground">Rarity</div>
                    <div className="font-medium capitalize">{selectedBadge.rarity}</div>
                  </div>
                  <div className="border rounded-lg p-2">
                    <div className="text-muted-foreground">Category</div>
                    <div className="font-medium capitalize">{selectedBadge.category}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}