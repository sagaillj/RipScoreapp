import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Meet, Season, Team } from '@/types';

// Schema for the basic meet info
const meetFormSchema = z.object({
  name: z.string().min(1, "Meet name is required"),
  location: z.string().min(1, "Location is required"),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time is required"),
});

// Schema for team selection
const teamSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Team name is required"),
  coachName: z.string().optional(),
  coachEmail: z.string().email().optional(),
  divers: z.array(
    z.object({
      name: z.string().min(1, "Diver name is required"),
      email: z.string().email().optional(),
    })
  ).optional(),
});

// Schema for event setup
const eventSchema = z.object({
  oneMeter: z.boolean().default(true),
  threeMeter: z.boolean().default(true),
  tower: z.boolean().default(false),
  diveCount: z.enum(['6', '11']).default('6'),
  mens: z.boolean().default(true),
  womens: z.boolean().default(true),
});

// Schema for meet settings
const settingsSchema = z.object({
  judgeCount: z.enum(['1', '2', '3', '5', '7', '9']).default('3'),
  individualJudging: z.boolean().default(false),
  aiAnnouncing: z.boolean().default(false),
  liveScoring: z.boolean().default(true),
  liveUrl: z.string().optional(),
});

interface MeetWizardProps {
  season: Season;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function MeetWizard({ season, isOpen, onClose, onComplete }: MeetWizardProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [teams, setTeams] = useState<z.infer<typeof teamSchema>[]>([]);
  const [homeTeam, setHomeTeam] = useState<z.infer<typeof teamSchema> | null>(null);
  const [events, setEvents] = useState<z.infer<typeof eventSchema>>({
    oneMeter: true,
    threeMeter: true,
    tower: false,
    diveCount: '6',
    mens: true,
    womens: true,
  });
  const [settings, setSettings] = useState<z.infer<typeof settingsSchema>>({
    judgeCount: '3',
    individualJudging: false,
    aiAnnouncing: false,
    liveScoring: true,
    liveUrl: '',
  });
  
  // Form for the basic meet info
  const meetForm = useForm<z.infer<typeof meetFormSchema>>({
    resolver: zodResolver(meetFormSchema),
    defaultValues: {
      name: '',
      location: 'Home',
      date: new Date(),
      startTime: '13:00',
    }
  });

  // Form for adding a new team
  const teamForm = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      coachName: '',
      coachEmail: '',
      divers: [],
    }
  });

  // Form for adding a new diver to a team
  const diverForm = useForm({
    defaultValues: {
      name: '',
      email: '',
    }
  });

  // Form for event setup
  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: events
  });

  // Form for meet settings
  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings
  });

  // Create meet mutation
  const createMeetMutation = useMutation({
    mutationFn: async (data: any) => {
      // First create the base meet
      const response = await apiRequest('POST', '/api/meets', {
        name: data.name,
        location: data.location,
        date: data.date,
        status: 'upcoming',
        createdBy: user?.id,
      });
      return await response.json();
    },
    onSuccess: async (newMeet: Meet) => {
      // Create season-meet association
      await apiRequest('POST', '/api/season-meets', {
        seasonId: season.id,
        meetId: newMeet.id,
        opponent: teams[0]?.name || 'TBD',
        isHome: meetForm.getValues().location === 'Home',
        cycleType: 'regular', // Default to regular season
        startTime: meetForm.getValues().startTime,
      });
      
      // Add teams as participants
      for (const team of teams) {
        if (team.divers && team.divers.length > 0) {
          for (const diver of team.divers) {
            // Create diver if needed
            // TODO: Implement backend API for creating guest divers
          }
        }
      }
      
      // Save event settings
      // TODO: Implement backend API for event settings
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/seasons', season.id, 'meets'] });
      
      onComplete();
    },
  });

  // Load the coach's team data when the wizard opens
  useEffect(() => {
    const loadCoachTeam = async () => {
      if (user?.role === 'coach' && (user as any).teamId) {
        try {
          const response = await fetch(`/api/teams/${(user as any).teamId}`);
          const teamData = await response.json();
          
          const coachTeam: z.infer<typeof teamSchema> = {
            id: teamData.id,
            name: teamData.name,
            coachName: user.name,
            coachEmail: user.email,
            divers: [], // We'll load these separately
          };
          
          setHomeTeam(coachTeam);
          setTeams([coachTeam]);
        } catch (error) {
          console.error("Failed to load coach team:", error);
        }
      }
    };
    
    loadCoachTeam();
  }, [user]);

  const handleAddTeam = (data: z.infer<typeof teamSchema>) => {
    setTeams([...teams, data]);
    teamForm.reset();
  };

  const handleRemoveTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const handleAddDiverToTeam = (teamIndex: number, diver: any) => {
    const updatedTeams = [...teams];
    if (!updatedTeams[teamIndex].divers) {
      updatedTeams[teamIndex].divers = [];
    }
    updatedTeams[teamIndex].divers?.push(diver);
    setTeams(updatedTeams);
    diverForm.reset();
  };

  const handleRemoveDiverFromTeam = (teamIndex: number, diverIndex: number) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].divers = updatedTeams[teamIndex].divers?.filter((_, i) => i !== diverIndex);
    setTeams(updatedTeams);
  };

  const handleEventSetup = (data: z.infer<typeof eventSchema>) => {
    setEvents(data);
    nextStep();
  };

  const handleSettingsSetup = (data: z.infer<typeof settingsSchema>) => {
    setSettings(data);
    createMeet();
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const createMeet = () => {
    createMeetMutation.mutate(meetForm.getValues());
  };

  // Generate a live URL slug from the meet name
  const generateLiveUrl = (meetName: string) => {
    return meetName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            New Meet Creation Wizard - {step}/5
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Basic Meet Information</h2>
            <Form {...meetForm}>
              <form onSubmit={meetForm.handleSubmit(nextStep)} className="space-y-4">
                <FormField
                  control={meetForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Union College vs Vassar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={meetForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Away">Away</SelectItem>
                          <SelectItem value="Neutral">Neutral Site</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={meetForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={meetForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Team Selection</h2>
            <p className="text-sm text-gray-500">
              Select the teams that will be competing in this meet.
            </p>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Participating Teams</h3>
              {teams.length === 0 ? (
                <p className="text-sm text-gray-500">No teams added yet.</p>
              ) : (
                <div className="space-y-4">
                  {teams.map((team, teamIndex) => (
                    <div key={teamIndex} className="rounded-md border p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{team.name}</p>
                          {team.coachName && (
                            <p className="text-sm text-gray-500">
                              Coach: {team.coachName}
                            </p>
                          )}
                        </div>
                        {/* Only allow removing teams other than the coach's team */}
                        {(!team.id || team.id !== (user as any)?.teamId) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTeam(teamIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Divers for this team */}
                      <div className="pl-4 space-y-2">
                        <h4 className="text-sm font-medium">Divers</h4>
                        {(!team.divers || team.divers.length === 0) ? (
                          <p className="text-xs text-gray-500">No divers added.</p>
                        ) : (
                          <ul className="space-y-1">
                            {team.divers?.map((diver, diverIndex) => (
                              <li key={diverIndex} className="flex items-center justify-between">
                                <span className="text-sm">{diver.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleRemoveDiverFromTeam(teamIndex, diverIndex)}
                                >
                                  <Minus className="h-3 w-3 text-red-500" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {/* Add diver form */}
                        <div className="flex items-end gap-2 mt-2">
                          <div className="flex-1">
                            <Input 
                              placeholder="Diver name" 
                              className="text-sm h-8"
                              {...diverForm.register("name")}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              const data = diverForm.getValues();
                              if (data.name.trim()) {
                                handleAddDiverToTeam(teamIndex, data);
                              }
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-md font-medium">Add Opponent Team</h3>
              <Form {...teamForm}>
                <form onSubmit={teamForm.handleSubmit(handleAddTeam)} className="space-y-4">
                  <FormField
                    control={teamForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Opponent College" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={teamForm.control}
                      name="coachName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coach Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Coach name (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={teamForm.control}
                      name="coachEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coach Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" variant="outline" className="w-full">
                    Add Team
                  </Button>
                </form>
              </Form>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={teams.length === 0}>
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Event Setup</h2>
            <p className="text-sm text-gray-500">
              Configure which events will be included in this meet.
            </p>

            <Form {...eventForm}>
              <form onSubmit={eventForm.handleSubmit(handleEventSetup)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Diving Boards</h3>
                  <div className="flex flex-wrap gap-4">
                    <FormField
                      control={eventForm.control}
                      name="oneMeter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">1-meter</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={eventForm.control}
                      name="threeMeter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">3-meter</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={eventForm.control}
                      name="tower"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Tower</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Dive Count</h3>
                  <FormField
                    control={eventForm.control}
                    name="diveCount"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dive count" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="6">6-dive meet</SelectItem>
                            <SelectItem value="11">11-dive meet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Divisions</h3>
                  <div className="flex flex-wrap gap-4">
                    <FormField
                      control={eventForm.control}
                      name="mens"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Men's</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={eventForm.control}
                      name="womens"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Women's</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Event Order</h2>
            <p className="text-sm text-gray-500">
              Choose the order of events for your meet.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm">
                  Based on your selections, we recommend the following event order:
                </p>
                <ul className="mt-2 space-y-2">
                  {events.mens && events.threeMeter && (
                    <li className="flex items-center">
                      <span className="text-sm font-medium">1. Men's 3-meter</span>
                    </li>
                  )}
                  {events.womens && events.oneMeter && (
                    <li className="flex items-center">
                      <span className="text-sm font-medium">2. Women's 1-meter</span>
                    </li>
                  )}
                  {events.mens && events.oneMeter && (
                    <li className="flex items-center">
                      <span className="text-sm font-medium">3. Men's 1-meter</span>
                    </li>
                  )}
                  {events.womens && events.threeMeter && (
                    <li className="flex items-center">
                      <span className="text-sm font-medium">4. Women's 3-meter</span>
                    </li>
                  )}
                  {events.mens && events.tower && (
                    <li className="flex items-center">
                      <span className="text-sm font-medium">5. Men's Tower</span>
                    </li>
                  )}
                  {events.womens && events.tower && (
                    <li className="flex items-center">
                      <span className="text-sm font-medium">6. Women's Tower</span>
                    </li>
                  )}
                </ul>
                <p className="mt-4 text-xs text-gray-500">
                  Note: You can change the event order during the meet.
                </p>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Meet Settings</h2>
            <p className="text-sm text-gray-500">
              Configure judging and other meet options.
            </p>

            <Form {...settingsForm}>
              <form onSubmit={settingsForm.handleSubmit(handleSettingsSetup)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={settingsForm.control}
                    name="judgeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Judges</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of judges" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 judge</SelectItem>
                            <SelectItem value="2">2 judges</SelectItem>
                            <SelectItem value="3">3 judges</SelectItem>
                            <SelectItem value="5">5 judges</SelectItem>
                            <SelectItem value="7">7 judges</SelectItem>
                            <SelectItem value="9">9 judges</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="individualJudging"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Individual Judging Pads</FormLabel>
                          <FormDescription>
                            Judges will enter scores on their own devices via QR code
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="aiAnnouncing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">AI Announcing</FormLabel>
                          <FormDescription>
                            Enable AI voice to announce divers and scores
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="liveScoring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Live Scoring</FormLabel>
                          <FormDescription>
                            Enable public live scoring page for spectators
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {settingsForm.watch("liveScoring") && (
                    <FormField
                      control={settingsForm.control}
                      name="liveUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Live URL Slug</FormLabel>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-1">ripscore.app/live/</span>
                            <FormControl>
                              <Input 
                                placeholder={generateLiveUrl(meetForm.getValues().name)}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            The public URL for viewers to watch live results
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">
                    Begin Meet
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}