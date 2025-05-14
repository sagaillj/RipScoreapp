import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/Button";
import { 
  Award, 
  Medal, 
  Filter, 
  FilterX,
  CheckCircle,
  Circle,
  Clock,
  Target
} from "lucide-react";
import { diveData, DiveGroup } from "@/lib/dive-data";
import { DiveCelebration } from "./DiveCelebration";
import { DiveDetailModal } from "./DiveDetailModal";

interface DiveProgressMatrixProps {
  completedDives?: { number: string; letter: string; }[];
  currentLevel?: string;
  className?: string;
}

type FilterType = 'all' | 'completed' | 'featured';
type BoardType = '1m' | '3m';

export function DiveProgressMatrix({ 
  completedDives = [], 
  currentLevel = 'intermediate',
  className 
}: DiveProgressMatrixProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [boardType, setBoardType] = useState<BoardType>('1m');
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [unlockedDive, setUnlockedDive] = useState<{number: string; name: string; rarity: string} | null>(null);
  const [selectedDive, setSelectedDive] = useState<any>(null);
  
  // Mock data for development - in production this would come from the user's profile
  const mockCompletedDives = useMemo(() => {
    if (completedDives.length > 0) return completedDives;
    
    return [
      { number: "101", letter: "A" },
      { number: "101", letter: "B" },
      { number: "101", letter: "C" },
      { number: "103", letter: "B" },
      { number: "201", letter: "A" },
      { number: "301", letter: "A" }
    ];
  }, [completedDives]);
  
  // Helper to check if a dive is completed
  const isDiveCompleted = (number: string, letter: string) => {
    return mockCompletedDives.some(dive => 
      dive.number === number && dive.letter === letter
    );
  };
  
  // Featured/recommended dives
  const featuredDives = useMemo(() => {
    return ["101", "103", "201", "301", "303", "403", "5132"];
  }, []);
  
  // Filter dives based on current filter type
  const getFilteredDives = (dives: any[]) => {
    if (filterType === 'all') return dives;
    
    return dives.filter(dive => {
      if (filterType === 'completed') {
        return isDiveCompleted(dive.number, dive.position);
      }
      if (filterType === 'featured') {
        return featuredDives.includes(dive.number);
      }
      return true;
    });
  };
  
  // Get DD value based on board type
  const getDiveDD = (dive: any) => {
    return boardType === '1m' 
      ? dive.difficulty?.oneMeter || dive.dd1m || "-"
      : dive.difficulty?.threeMeter || dive.dd3m || "-";
  };
  
  // Get dive rarity based on difficulty
  const getDiveRarity = (dd: number | string) => {
    const difficulty = typeof dd === 'string' ? parseFloat(dd) : dd;
    
    if (isNaN(difficulty)) return 'common';
    
    if (difficulty >= 3.5) return 'legendary';
    if (difficulty >= 3.0) return 'epic';
    if (difficulty >= 2.5) return 'rare';
    if (difficulty >= 2.0) return 'uncommon';
    return 'common';
  };
  
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
  
  // Handle clicking on a dive position - simulates unlocking a dive
  const handleUnlockDive = (dive: { number: string; name: string; position: string; dd1m: string | number; dd3m: string | number }) => {
    // In a real app, this would send a request to the server to mark the dive as completed
    
    // Get the relevant difficulty based on board type
    const dd = boardType === '1m' ? dive.dd1m : dive.dd3m;
    const rarity = getDiveRarity(dd);
    
    // Set the unlocked dive data
    setUnlockedDive({
      number: `${dive.number}${dive.position}`,
      name: dive.name,
      rarity: rarity,
    });
    
    // Show celebration
    setCelebrationOpen(true);
  };
  
  return (
    <div className={cn("w-full", className)}>
      {/* Celebration popup component */}
      {unlockedDive && (
        <DiveCelebration 
          isOpen={celebrationOpen}
          onClose={() => setCelebrationOpen(false)}
          dive={unlockedDive}
        />
      )}
      
      {/* Dive detail modal */}
      {selectedDive && (
        <DiveDetailModal
          isOpen={!!selectedDive}
          onClose={() => setSelectedDive(null)}
          dive={selectedDive}
          boardType={boardType}
          completedPositions={selectedDive.positions.filter((pos: string) => 
            isDiveCompleted(selectedDive.number, pos)
          )}
        />
      )}
      
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Dives Unlocked</p>
                <h3 className="text-2xl font-bold">{mockCompletedDives.length}</h3>
              </div>
              <Award className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
                <h3 className="text-2xl font-bold">
                  {Math.round((mockCompletedDives.length / (diveData.length * 0.5)) * 100)}%
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Last Dive Unlocked</p>
                <h3 className="text-lg font-bold">101C</h3>
                <p className="text-xs text-muted-foreground">May 4, 2025</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Goal Dive</p>
                <h3 className="text-lg font-bold">403B</h3>
                <p className="text-xs text-muted-foreground">Inward 1½ Somersault Pike</p>
              </div>
              <Target className="h-8 w-8 text-emerald-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl">Dive Collection</CardTitle>
            
            <div className="flex flex-wrap gap-2">
              
              <Tabs 
                defaultValue="1m" 
                className="w-auto"
                onValueChange={(value) => setBoardType(value as BoardType)}
              >
                <TabsList className="grid w-[180px] grid-cols-2">
                  <TabsTrigger value="1m">1-meter</TabsTrigger>
                  <TabsTrigger value="3m">3-meter</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={filterType === 'all' ? "default" : "outline"}
                      size="icon"
                      onClick={() => setFilterType('all')}
                    >
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show all dives</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={filterType === 'completed' ? "default" : "outline"}
                      size="icon"
                      onClick={() => setFilterType('completed')}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show completed dives</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={filterType === 'featured' ? "default" : "outline"}
                      size="icon"
                      onClick={() => setFilterType('featured')}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show featured dives</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              // Group dives by their dive group
              diveData.reduce((groups, dive) => {
                const group = dive.group;
                if (!groups[group]) groups[group] = [];
                groups[group].push({
                  number: dive.code.slice(0, -1),
                  position: dive.code.slice(-1),
                  name: dive.name.split(",")[0], // Get base name without position
                  dd1m: dive.difficulty.oneMeter,
                  dd3m: dive.difficulty.threeMeter,
                });
                return groups;
              }, {} as Record<string, any[]>)
            ).map(([group, dives]) => {
              // First, let's combine dives with the same number
              const uniqueDiveNumbers = Array.from(new Set(dives.map(dive => dive.number)));
              const combinedDives = uniqueDiveNumbers.map(diveNumber => {
                const divesWithThisNumber = dives.filter(dive => dive.number === diveNumber);
                const baseName = divesWithThisNumber[0].name;
                const positions = divesWithThisNumber.map(dive => dive.position);
                
                return {
                  number: diveNumber,
                  positions: positions,
                  name: baseName,
                  dd1m: divesWithThisNumber[0].dd1m, // Use first position's DD as reference
                  dd3m: divesWithThisNumber[0].dd3m,
                  divesDetail: divesWithThisNumber
                };
              });
              
              const filteredDives = filterType === 'all' 
                ? combinedDives 
                : combinedDives.filter(dive => {
                    if (filterType === 'completed') {
                      return dive.positions.some(pos => isDiveCompleted(dive.number, pos));
                    }
                    if (filterType === 'featured') {
                      return featuredDives.includes(dive.number);
                    }
                    return true;
                  });
                
              if (filteredDives.length === 0) return null;
              
              // Get group color
              const groupColors = {
                'Forward': '#00F0FF',
                'Back': '#FFB038', 
                'Reverse': '#FF5CB3',
                'Inward': '#23D18B',
                'Twisting': '#8B5CF6'
              };
              const groupColor = groupColors[group as keyof typeof groupColors] || '#999';
              
              return (
                <div key={group} className="mb-1">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Award className="h-4 w-4" style={{ color: groupColor }} />
                    {group}
                  </h3>
                  
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
                    {filteredDives.map((dive) => {
                      const completedPositions = dive.positions.filter(pos => 
                        isDiveCompleted(dive.number, pos)
                      );
                      const isPartiallyCompleted = completedPositions.length > 0;
                      const isFullyCompleted = completedPositions.length === dive.positions.length;
                      const isFeatured = featuredDives.includes(dive.number);
                      
                      let bgColor = "bg-gray-100 dark:bg-gray-800";
                      let borderColor = "border-gray-200 dark:border-gray-700";
                      
                      if (isFullyCompleted) {
                        bgColor = "bg-primary/10";
                        borderColor = "border-primary/30";
                      } else if (isPartiallyCompleted) {
                        bgColor = "bg-primary/5";
                        borderColor = "border-primary/20";
                      } else if (isFeatured) {
                        bgColor = "bg-orange/10";
                        borderColor = "border-orange/30";
                      }
                      
                      return (
                        <TooltipProvider key={dive.number}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={cn(
                                  "relative p-2 rounded-lg border transition-all",
                                  bgColor, borderColor,
                                  "hover:shadow-md cursor-pointer overflow-hidden"
                                )}
                                onClick={() => setSelectedDive(dive)}
                              >
                                {/* Get DD and rarity */}
                                {(() => {
                                  const dd = boardType === '1m' ? dive.dd1m : dive.dd3m;
                                  const rarity = getDiveRarity(dd);
                                  const rarityColors = getRarityColor(rarity);
                                  
                                  return (
                                    <>
                                      {/* Rarity badge */}
                                      <div className="absolute right-0 top-0">
                                        <div 
                                          className={cn(
                                            "text-[8px] uppercase font-bold py-0.5 px-1 rounded-bl",
                                            rarityColors.bg, rarityColors.text
                                          )}
                                        >
                                          {rarity}
                                        </div>
                                      </div>
                                      
                                      <div className="text-sm font-medium">
                                        {dive.number}
                                      </div>
                                      <div className="text-xs text-muted-foreground mb-1">
                                        DD: {dd}
                                      </div>
                                    </>
                                  );
                                })()}
                                
                                {/* Position badges */}
                                <div className="flex gap-1">
                                  {['A', 'B', 'C', 'D'].map(pos => {
                                    if (!dive.positions.includes(pos)) return null;
                                    
                                    const isCompleted = isDiveCompleted(dive.number, pos);
                                    return (
                                      <div 
                                        key={pos}
                                        className={cn(
                                          "h-4 w-4 flex items-center justify-center rounded-full text-[10px] font-bold cursor-pointer",
                                          isCompleted 
                                            ? "bg-primary text-white" 
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                        )}
                                        onClick={() => {
                                          if (!isCompleted) {
                                            // Find the matching dive detail
                                            const diveDetail = dive.divesDetail.find(d => d.position === pos);
                                            if (diveDetail) {
                                              handleUnlockDive({
                                                ...diveDetail,
                                                name: dive.name
                                              });
                                            }
                                          }
                                        }}
                                      >
                                        {pos}
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Completion icon */}
                                {isFullyCompleted && (
                                  <div className="absolute -top-1.5 -left-1.5">
                                    <Award className="h-4 w-4 text-primary drop-shadow-md" />
                                  </div>
                                )}
                                
                                {/* Featured icon */}
                                {isFeatured && !isFullyCompleted && (
                                  <div className="absolute -top-1.5 -left-1.5">
                                    <Circle className="h-4 w-4 text-orange drop-shadow-md" />
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="w-64 max-w-sm">
                              {(() => {
                                const dd = boardType === '1m' ? dive.dd1m : dive.dd3m;
                                const rarity = getDiveRarity(dd);
                                const rarityColors = getRarityColor(rarity);
                                
                                // Mock nationwide stats - in production this would come from an API
                                const totalDivers = 8742;
                                const completionRates = {
                                  'legendary': 0.05,
                                  'epic': 0.15,
                                  'rare': 0.30,
                                  'uncommon': 0.55,
                                  'common': 0.85
                                };
                                const completionRate = completionRates[rarity as keyof typeof completionRates] || 0.5;
                                const nationwideCompletions = Math.floor(totalDivers * completionRate);
                                
                                return (
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-bold">Dive {dive.number}</p>
                                        <p className="text-xs text-muted-foreground">{dive.name}</p>
                                      </div>
                                      <div 
                                        className={cn(
                                          "text-[10px] uppercase font-bold py-0.5 px-2 rounded",
                                          rarityColors.bg, rarityColors.text
                                        )}
                                      >
                                        {rarity}
                                      </div>
                                    </div>
                                    
                                    <div className="text-xs space-y-1 border-t pt-1">
                                      {dive.positions.map(pos => {
                                        const isCompleted = isDiveCompleted(dive.number, pos);
                                        const diveDetail = dive.divesDetail.find(d => d.position === pos);
                                        return (
                                          <div key={pos} className="flex items-center mt-1">
                                            <span className={isCompleted ? "text-primary font-medium" : "text-muted-foreground"}>
                                              Position {pos}: {isCompleted ? "✓ Completed" : "Not completed"}
                                            </span>
                                            <span className="ml-2 text-muted-foreground">
                                              DD: {boardType === '1m' ? diveDetail?.dd1m : diveDetail?.dd3m}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    
                                    <div className="text-xs border-t pt-1">
                                      <div className="text-muted-foreground">
                                        <span className="text-primary font-medium">{nationwideCompletions}</span> divers nationwide have unlocked this dive
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
                                        <div 
                                          className="bg-primary h-1.5 rounded-full" 
                                          style={{width: `${completionRate * 100}%`}}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}