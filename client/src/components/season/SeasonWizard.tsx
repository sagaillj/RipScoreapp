import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, ChevronRight, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Season } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Schema for the base season info
const seasonFormSchema = z.object({
  name: z.string().min(1, "Season name is required"),
  startYear: z.number().int().min(2020).max(2050),
  endYear: z.number().int().min(2020).max(2050),
  teamId: z.number().optional(),
});

// Schema for season stage
const stageSchema = z.object({
  type: z.enum(["preseason", "regular", "postseason", "offseason"]),
  startDate: z.date(),
});

// Schema for meet
const meetSchema = z.object({
  opponent: z.string().min(1, "Opponent name is required"),
  isHome: z.boolean().default(true),
  cycleType: z.string().min(1, "Cycle is required"),
  date: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for practice schedule
const practiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  repeatDays: z.array(z.number().min(0).max(6)),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().optional(),
  endOption: z.enum(['never', 'on', 'after']).default('never'),
  endDate: z.date().optional(),
  endOccurrences: z.number().min(1).default(10).optional(),
  notes: z.string().optional(),
});

interface SeasonWizardProps {
  season?: Season | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function SeasonWizard({ season, isOpen, onClose, onComplete }: SeasonWizardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(2);  // Skip straight to stages
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Define stage, meet, and practice state
  // Pre-fill with default season stages
  const [stages, setStages] = useState<z.infer<typeof stageSchema>[]>([
    {
      type: 'preseason',
      startDate: new Date(new Date().getFullYear(), 8, 1) // September 1st
    },
    {
      type: 'regular',
      startDate: new Date(new Date().getFullYear(), 10, 1) // November 1st
    },
    {
      type: 'postseason',
      startDate: new Date(new Date().getFullYear() + 1, 1, 15) // February 15th
    },
    {
      type: 'offseason',
      startDate: new Date(new Date().getFullYear() + 1, 3, 1) // April 1st
    }
  ]);
  const [meets, setMeets] = useState<z.infer<typeof meetSchema>[]>([]);
  const [practices, setPractices] = useState<z.infer<typeof practiceSchema>[]>([]);

  // Form for basic season info
  const form = useForm<z.infer<typeof seasonFormSchema>>({
    resolver: zodResolver(seasonFormSchema),
    defaultValues: {
      name: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 1,
      teamId: user?.id,
    }
  });

  // Form for adding a new stage
  const stageForm = useForm<z.infer<typeof stageSchema>>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      type: 'preseason',
      startDate: new Date(),
    }
  });

  // Form for adding a new meet
  const meetForm = useForm<z.infer<typeof meetSchema>>({
    resolver: zodResolver(meetSchema),
    defaultValues: {
      opponent: '',
      isHome: true,
      cycleType: 'regular',
      date: new Date(),
      startTime: '12:00',
    }
  });

  // Form for adding a new practice
  const practiceForm = useForm<z.infer<typeof practiceSchema>>({
    resolver: zodResolver(practiceSchema),
    defaultValues: {
      name: 'Regular Practice',
      type: 'diving',
      repeatDays: [1, 3, 5], // Mon, Wed, Fri
      startTime: '15:00',
      endTime: '17:00',
      location: 'Pool',
      endOption: 'never',
    }
  });

  // Show confetti animation effect
  useEffect(() => {
    if (showConfetti) {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff49db', '#0099ff', '#ff7849', '#13b4ff']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff49db', '#0099ff', '#ff7849', '#13b4ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setShowConfetti(false);
        }
      }());
    }
  }, [showConfetti]);

  // Add stage created from form
  const handleAddStage = (data: z.infer<typeof stageSchema>) => {
    setStages([...stages, data]);
    stageForm.reset();
  };

  // Remove stage at index
  const handleRemoveStage = (index: number) => {
    setStages(stages.filter((_, i: number) => i !== index));
  };

  // Add meet created from form
  const handleAddMeet = (data: z.infer<typeof meetSchema>) => {
    setMeets([...meets, data]);
    meetForm.reset();
  };

  // Remove meet at index
  const handleRemoveMeet = (index: number) => {
    setMeets(meets.filter((_, i: number) => i !== index));
  };

  // Add practice created from form
  const handleAddPractice = (data: z.infer<typeof practiceSchema>) => {
    setPractices([...practices, data]);
    practiceForm.reset();
  };

  // Remove practice at index
  const handleRemovePractice = (index: number) => {
    setPractices(practices.filter((_, i: number) => i !== index));
  };

  // Create/update the season via API
  const createSeasonMutation = useMutation({
    mutationFn: async (data: z.infer<typeof seasonFormSchema>) => {
      // For the meets array, ensure the cycleType is included
      const preparedMeets = meets.map(meet => ({
        ...meet,
        cycleType: meet.cycleType || 'regular', // Default to regular if not specified
      }));
      
      console.log("Creating season with data:", {
        ...data,
        teamId: user?.id || 1, // Use user ID as teamId if activeTeamId doesn't exist
        createdBy: user?.id || 1, // Current user ID (must be valid, not 0)
        status: 'active', // Explicitly set status to active
        stages,
        meets: preparedMeets,
        practices,
      });
      
      const response = await apiRequest('POST', '/api/seasons', {
        ...data,
        teamId: user?.id || 1, // Use user ID as teamId if activeTeamId doesn't exist
        createdBy: user?.id || 1, // Current user ID (must be valid, not 0)
        status: 'active', // Explicitly set status to active
        stages,
        meets: preparedMeets,
        practices,
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate all relevant queries to ensure data is refreshed
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teams', user?.id, 'seasons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seasons'] });
      queryClient.invalidateQueries({ queryKey: ['/api/meets'] });
      
      // Force refetch
      queryClient.refetchQueries({ queryKey: ['/api/teams', user?.id, 'seasons'] });
    },
  });

  // Go to next wizard step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Go to previous wizard step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const submitSeason = async (data: z.infer<typeof seasonFormSchema>) => {
    try {
      await createSeasonMutation.mutateAsync(data);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Season created successfully!",
        description: `${data.name} has been created.`,
      });
      
      // Wait briefly to show the confetti before closing
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Failed to create season:", error);
      toast({
        title: "Failed to create season",
        description: "There was an error creating your season. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Get the day name from the day number
  const getDayName = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {season ? 'Edit Season' : 'Create New Season'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <p className="text-sm text-gray-500">
              Enter the basic details for your season.
            </p>
            
            <Separator className="my-4" />
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(nextStep)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season Name</FormLabel>
                      <FormControl>
                        <Input placeholder="2025 Diving Season" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Year</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Year</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
            <h2 className="text-lg font-semibold">Season Stages</h2>
            <p className="text-sm text-gray-500">
              Define the different periods of your season.
            </p>
            
            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Season Stages</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Create a new stage with default values
                    const newStage = {
                      type: 'preseason' as 'preseason' | 'regular' | 'postseason' | 'offseason',
                      startDate: new Date()
                    };
                    setStages([...stages, newStage]);
                  }}
                  className="h-8 px-2"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Stage
                </Button>
              </div>
              {stages.length === 0 ? (
                <p className="text-sm text-gray-500">No stages added yet.</p>
              ) : (
                <div className="space-y-2">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div>
                          <select
                            value={stage.type}
                            className="px-2 py-1 rounded border"
                            onChange={(e) => {
                              const updatedStages = [...stages];
                              updatedStages[index] = { 
                                ...updatedStages[index], 
                                type: e.target.value as "preseason" | "regular" | "postseason" | "offseason" 
                              };
                              setStages(updatedStages);
                            }}
                          >
                            <option value="preseason">Preseason</option>
                            <option value="regular">Regular Season</option>
                            <option value="postseason">Post Season</option>
                            <option value="offseason">Off Season</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Starting:</span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 text-sm text-gray-500 font-normal hover:bg-transparent"
                              >
                                {format(stage.startDate, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={stage.startDate}
                                onSelect={(date) => {
                                  if (date) {
                                    const updatedStages = [...stages];
                                    updatedStages[index] = { ...updatedStages[index], startDate: date };
                                    setStages(updatedStages);
                                  }
                                }}
                                initialFocus
                                className="rounded-md border shadow"
                                showOutsideDays
                                fixedWeeks
                                captionLayout="dropdown-buttons"
                                fromYear={2024}
                                toYear={2030}
                                ISOWeek={false}
                                disabled={false}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStage(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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

        {step === 3 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Meets Schedule</h2>
            <p className="text-sm text-gray-500">
              Add meets to your season calendar.
            </p>

            <div className="border rounded-lg p-4 bg-gray-50">
              <Form {...meetForm}>
                <form onSubmit={meetForm.handleSubmit(handleAddMeet)} className="space-y-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <FormField
                        control={meetForm.control}
                        name="opponent"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs">Opponent</FormLabel>
                            <FormControl>
                              <Input placeholder="Opposing team name" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={meetForm.control}
                      name="isHome"
                      render={({ field }) => (
                        <FormItem className="pt-5">
                          <div className="flex items-center justify-between space-x-2">
                            <FormLabel className="text-xs font-normal">{field.value ? 'Home' : 'Away'}</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={meetForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "justify-start text-left font-normal h-9",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "MMM d, yyyy")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  captionLayout="dropdown-buttons"
                                  fromYear={2024}
                                  toYear={2030}
                                  ISOWeek={false}
                                  disabled={false}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={meetForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs">Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={meetForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Location (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Meet location" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="h-8 px-3">
                      Add Meet
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-md font-medium">Added Meets</h3>
              {meets.length === 0 ? (
                <p className="text-sm text-gray-500">No meets added yet.</p>
              ) : (
                <div className="space-y-2">
                  {meets.map((meet, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <p className="font-medium flex items-center">
                          <span className={cn("inline-block w-2 h-2 rounded-full mr-2", 
                            meet.isHome ? "bg-green-500" : "bg-blue-500"
                          )}></span>
                          {meet.opponent}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(meet.date, "MMM d, yyyy")} at {meet.startTime}
                          {meet.location && ` • ${meet.location}`}
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          {meet.isHome ? 'Home' : 'Away'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMeet(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (meets.length === 0) {
                    toast({
                      title: "Add a meet first",
                      description: "Please add at least one meet before proceeding.",
                      variant: "destructive"
                    });
                  } else {
                    // Trigger confetti
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 }
                    });
                    
                    // Go to congratulations screen
                    setStep(3.5);
                  }
                }}
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3.5 && (
          <div className="space-y-6 py-4 flex flex-col items-center">
            <div className="text-center mt-2 mb-4">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce-slow">
                  <CheckCircle 
                    className="h-16 w-16 text-green-600 animate-appear" 
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You've successfully created your meet schedule for the season!
              </p>
            </div>
            
            <div className="my-8 p-6 bg-primary/5 rounded-xl w-full">
              <h3 className="text-lg font-medium mb-3">Your Schedule At A Glance</h3>
              <div className="space-y-2">
                {meets.length > 0 ? (
                  <div className="space-y-2">
                    {meets.map((meet, index) => (
                      <div key={index} className="flex items-center justify-between px-4 py-2 bg-white rounded-md border">
                        <div className="flex items-center">
                          <span className={cn("h-3 w-3 rounded-full mr-3", meet.isHome ? "bg-green-500" : "bg-blue-500")}></span>
                          <div>
                            <p className="font-medium">{meet.opponent}</p>
                            <p className="text-sm text-gray-500">{format(meet.date, "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium py-1 px-2 rounded bg-gray-100">
                          {meet.isHome ? 'Home' : 'Away'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No meets have been added yet.</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="min-w-[120px]"
              >
                Exit Wizard
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="min-w-[120px]"
              >
                Continue to Practices
              </Button>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="space-y-4 py-4">
            <h2 className="text-lg font-semibold">Practice Schedule</h2>
            <p className="text-sm text-gray-500">
              Set up your default practice schedule.
            </p>

            <Form {...practiceForm}>
              <form onSubmit={practiceForm.handleSubmit(handleAddPractice)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={practiceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Regular Practice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={practiceForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Type</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="diving">Diving</option>
                          <option value="weightroom">Weight Room</option>
                          <option value="dryland">Dryland</option>
                          <option value="video">Video Review</option>
                          <option value="team">Team Meeting</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={practiceForm.control}
                  name="repeatDays"
                  render={() => (
                    <FormItem>
                      <FormLabel>Repeat Days</FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day}`}
                              checked={practiceForm.watch('repeatDays').includes(day)}
                              onCheckedChange={(checked) => {
                                const currentDays = practiceForm.watch('repeatDays');
                                if (checked) {
                                  practiceForm.setValue('repeatDays', [...currentDays, day].sort());
                                } else {
                                  practiceForm.setValue('repeatDays', currentDays.filter(d => d !== day));
                                }
                              }}
                            />
                            <label
                              htmlFor={`day-${day}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {getDayName(day).substring(0, 3)}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={practiceForm.control}
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
                  
                  <FormField
                    control={practiceForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={practiceForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Pool" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>End Recurrence</FormLabel>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="end-never" 
                        value="never"
                        checked={practiceForm.watch('endOption') === 'never'}
                        onChange={() => practiceForm.setValue('endOption', 'never')}
                        className="w-4 h-4"
                      />
                      <label htmlFor="end-never">Never</label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="end-on" 
                        value="on"
                        checked={practiceForm.watch('endOption') === 'on'}
                        onChange={() => practiceForm.setValue('endOption', 'on')}
                        className="w-4 h-4"
                      />
                      <label htmlFor="end-on">On</label>
                      
                      {practiceForm.watch('endOption') === 'on' && (
                        <FormField
                          control={practiceForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="ml-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal h-9",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "MMM d, yyyy")
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
                                    disabled={(date) =>
                                      date < new Date()
                                    }
                                    initialFocus
                                    captionLayout="dropdown-buttons"
                                    fromYear={2024}
                                    toYear={2030}
                                    ISOWeek={false}
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="end-after" 
                        value="after"
                        checked={practiceForm.watch('endOption') === 'after'}
                        onChange={() => practiceForm.setValue('endOption', 'after')}
                        className="w-4 h-4"
                      />
                      <label htmlFor="end-after">After</label>
                      
                      {practiceForm.watch('endOption') === 'after' && (
                        <FormField
                          control={practiceForm.control}
                          name="endOccurrences"
                          render={({ field }) => (
                            <FormItem className="ml-2 flex items-center gap-2">
                              <FormControl>
                                <Input 
                                  type="number" 
                                  className="w-16 h-8"
                                  value={field.value || ''}
                                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <span className="text-sm">occurrences</span>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Add Practice Schedule
                </Button>
              </form>
            </Form>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-md font-medium">Added Practices</h3>
              {practices.length === 0 ? (
                <p className="text-sm text-gray-500">No practices added yet.</p>
              ) : (
                <div className="space-y-2">
                  {practices.map((practice, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{practice.name}</p>
                        <p className="text-sm text-gray-500">
                          {practice.repeatDays.map(d => getDayName(d).charAt(0)).join(', ')} • {practice.startTime}-{practice.endTime} • {practice.location || 'No location'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {practice.type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePractice(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
            <h2 className="text-lg font-semibold">Review & Create</h2>
            <p className="text-sm text-gray-500">
              Review your season information before creating.
            </p>

            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-md font-medium mb-2">Season Information</h3>
                <p><span className="font-medium">Name:</span> {form.getValues().name}</p>
                <p><span className="font-medium">Years:</span> {form.getValues().startYear}-{form.getValues().endYear}</p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-md font-medium mb-2">Season Stages</h3>
                {stages.length === 0 ? (
                  <p className="text-sm text-gray-500">No stages added.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {stages.map((stage, index) => (
                      <li key={index} className="text-sm">
                        <span className="capitalize">{stage.type}</span>: Starting {format(stage.startDate, "MMM d, yyyy")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-md font-medium mb-2">Meets ({meets.length})</h3>
                {meets.length === 0 ? (
                  <p className="text-sm text-gray-500">No meets added.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {meets.map((meet, index) => (
                      <li key={index} className="text-sm">
                        vs {meet.opponent} - {format(meet.date, "MMM d, yyyy")} ({meet.isHome ? 'Home' : 'Away'})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-md font-medium mb-2">Practices ({practices.length})</h3>
                {practices.length === 0 ? (
                  <p className="text-sm text-gray-500">No practices added.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {practices.map((practice, index) => (
                      <li key={index} className="text-sm">
                        {practice.name} - {practice.repeatDays.map(d => getDayName(d).charAt(0)).join(', ')} {practice.startTime}-{practice.endTime}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button 
                onClick={() => submitSeason(form.getValues())}
                disabled={createSeasonMutation.isPending}
              >
                {createSeasonMutation.isPending ? (
                  <>Creating Season...</>
                ) : (
                  <>Create Season</>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
