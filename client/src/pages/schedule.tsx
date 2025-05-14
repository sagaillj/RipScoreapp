import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeasonWizard } from '@/components/season/SeasonWizard';
import { MeetWizard } from '@/components/meet/MeetWizard';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getQueryFn, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import type { Season, SeasonMeet } from '@/types';

export default function SchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMeetWizardOpen, setIsMeetWizardOpen] = useState(false);
  const [seasonToEdit, setSeasonToEdit] = useState<Season | null>(null);
  const [activeTab, setActiveTab] = useState('meets');

  // Get the current team ID from the user's context
  // For now, hardcode to team ID 1 if we can't find it in the user object
  const teamId = user?.role === 'coach' ? ((user as any).teamId || 1) : 1;
  console.log("Using teamId:", teamId);
  
  // Define team interface
  interface Team {
    id: number;
    name: string;
    mascot?: string;
    division?: string;
    address?: string;
    logoUrl?: string;
    bannerUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  }
  
  // Get the team data for the current user's team
  const { data: team } = useQuery<Team>({
    queryKey: ['/api/teams', teamId],
    queryFn: getQueryFn(`/api/teams/${teamId}`),
    enabled: !!teamId,
  });

  // Fetch seasons for the current team
  const { 
    data: seasons = [],
    isLoading,
    error,
    refetch
  } = useQuery<Season[]>({
    queryKey: ['/api/teams', teamId, 'seasons'],
    queryFn: getQueryFn(teamId ? `/api/teams/${teamId}/seasons` : null),
    enabled: !!teamId,
  });

  // Find the active season
  const activeSeason = seasons.find(season => season.status === 'active');
  console.log("All seasons:", seasons);
  console.log("Active season:", activeSeason);
  
  // Format season name with team name and years
  const formatSeasonTitle = (season: Season) => {
    // Handle empty or undefined season
    if (!season) return "Diving Season";
    
    // Set a default name if season name is empty
    const seasonName = season.name || "Diving Season";
    
    // Use provided start/end years or defaults
    const startYear = season.startYear || new Date().getFullYear();
    const endYear = season.endYear || (startYear + 1);
    
    // Use team name from query or default to "Union College"
    const teamName = team?.name || "Union College";
    
    if (startYear === endYear) {
      return `${teamName} ${startYear} ${seasonName}`;
    } else {
      return `${teamName} ${startYear}-${endYear} ${seasonName}`;
    }
  };
  
  // Fetch meets for the active season
  const {
    data: meets = [],
    isLoading: meetsLoading,
    refetch: refetchMeets
  } = useQuery<SeasonMeet[]>({
    queryKey: ['/api/seasons', activeSeason?.id, 'meets'],
    queryFn: getQueryFn(activeSeason ? `/api/seasons/${activeSeason.id}/meets` : null),
    enabled: !!activeSeason,
  });

  const handleCreateSeason = () => {
    setSeasonToEdit(null);
    setIsWizardOpen(true);
  };

  const handleEditSeason = (season: Season) => {
    setSeasonToEdit(season);
    setIsWizardOpen(true);
  };

  const handleWizardComplete = () => {
    setIsWizardOpen(false);
    
    // Force refetch to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId, 'seasons'] });
    queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
    
    // Slight delay to allow DB operations to complete
    setTimeout(() => {
      refetch().then(() => {
        console.log("Refetched seasons:", seasons);
        toast({
          title: seasonToEdit ? "Season Updated" : "Season Created",
          description: seasonToEdit 
            ? "Your season has been successfully updated."
            : "Your new season has been successfully created."
        });
      });
    }, 500);
  };
  
  const handleMeetWizardComplete = () => {
    setIsMeetWizardOpen(false);
    refetchMeets();
    toast({
      title: "Meet Created",
      description: "Your new meet has been successfully created."
    });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleArchiveSeason = (seasonId: number) => {
    // Archive season logic will be implemented here
    toast({
      title: "Season Archived",
      description: "The season has been archived successfully."
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-500">Error loading seasons</h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[var(--color-text-post)]" />
            {activeSeason ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <h1 className="text-2xl font-bold text-[var(--color-text-post)]">
                    {formatSeasonTitle(activeSeason)}
                  </h1>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-1">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="text-[var(--color-muted-post)]"
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {seasons.map((season) => (
                        <DropdownMenuItem key={season.id}>
                          <div className="flex items-center gap-2 w-full">
                            <span>
                              {season.name ? season.name : `${season.startYear}-${season.endYear} Season`}
                            </span>
                            {season.status === 'active' && (
                              <div className="ml-auto h-2 w-2 rounded-full bg-green-500"></div>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onClick={handleCreateSeason}>
                        <Plus className="h-4 w-4 mr-2" /> Add Season
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Settings className="h-4 w-4 text-[var(--color-muted-post)]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditSeason(activeSeason)}>
                        Edit Season
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchiveSeason(activeSeason.id)}>
                        Archive Season
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Custom tab buttons instead of TabsList/TabsTrigger */}
                <div className="ml-6">
                  <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    <button 
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'meets' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'}`}
                      onClick={() => setActiveTab('meets')}
                    >
                      Meets
                    </button>
                    <button 
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'practices' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'}`}
                      onClick={() => setActiveTab('practices')}
                    >
                      Practices
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-[var(--color-text-post)]">
                Schedule
              </h1>
            )}
          </div>
          
          {!activeSeason && (
            <Button 
              onClick={handleCreateSeason}
              className="bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Season
            </Button>
          )}
        </div>

        {activeSeason ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Tabs moved to the header section */}
            
            <TabsContent value="meets" className="pt-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Season Meets</h3>
                  <Button 
                    onClick={() => setIsMeetWizardOpen(true)}
                    className="bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90"
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Meet
                  </Button>
                </div>
                
                {meetsLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : meets.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <p className="text-[var(--color-muted-post)] mb-4">
                      No meets scheduled for this season yet.
                    </p>
                    <Button 
                      onClick={() => setIsMeetWizardOpen(true)}
                      className="bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create First Meet
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {meets.map((meet, index) => (
                      <div 
                        key={index} 
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => { 
                          window.location.href = `/meet/${meet.meetId}`; 
                        }}
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h4 className="font-semibold text-lg text-[var(--color-text-post)] mb-1">
                                {meet.meet && meet.meet.name ? 
                                  meet.meet.name : 
                                  meet.isHome ? 
                                    `${team?.name || 'Union College'} vs ${meet.opponent || 'Opponent'}` : 
                                    `${meet.opponent || 'Opponent'} vs ${team?.name || 'Union College'}`
                                }
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  meet.isHome 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                }`}>
                                  {meet.isHome ? 'Home' : 'Away'}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 font-medium capitalize">
                                  {meet.cycleType}
                                </span>
                                {meet.meet && meet.meet.status === 'completed' && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 font-medium">
                                    Completed
                                  </span>
                                )}
                                {meet.meet && meet.meet.status === 'upcoming' && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100 font-medium">
                                    Upcoming
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 md:mt-0 flex items-center gap-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center text-[var(--color-muted-post)]">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span className="text-sm font-medium">
                                    {meet.meet && meet.meet.date ? 
                                      format(new Date(meet.meet.date), "MMM d, yyyy") : 
                                      'Date TBD'}
                                  </span>
                                </div>
                                <div className="flex items-center text-[var(--color-muted-post)]">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span className="text-sm font-medium">
                                    {meet.startTime || 'Time TBD'}
                                  </span>
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    // Edit functionality here
                                  }}>
                                    Edit Meet
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Delete functionality here
                                    }}
                                    className="text-red-600"
                                  >
                                    Cancel Meet
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-750">
                          <div className="text-sm text-[var(--color-muted-post)]">
                            <span className="font-medium">Location:</span> {meet.meet && meet.meet.location ? 
                              meet.meet.location : 
                              (meet.isHome ? 'Home Pool' : 'Away Venue')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="practices" className="pt-2">
              <h3 className="text-xl font-semibold mb-4">Practice Schedule</h3>
              <p className="text-[var(--color-muted-post)]">
                Practice schedules will be displayed here.
              </p>
            </TabsContent>
            
            {/* Itineraries tab removed as requested */}
          </Tabs>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No Active Season</h3>
            <p className="text-[var(--color-muted-post)] mb-6">
              Create a new season to manage your meet schedule and team practices.
            </p>
            <Button 
              onClick={handleCreateSeason}
              className="bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Your First Season
            </Button>
          </div>
        )}
      </div>
      
      {isWizardOpen && (
        <SeasonWizard 
          teamId={teamId}
          initialData={seasonToEdit}
          onComplete={handleWizardComplete}
          onCancel={() => setIsWizardOpen(false)}
        />
      )}
      
      {isMeetWizardOpen && activeSeason && (
        <MeetWizard
          teamId={teamId}
          seasonId={activeSeason.id}
          onComplete={handleMeetWizardComplete}
          onCancel={() => setIsMeetWizardOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}