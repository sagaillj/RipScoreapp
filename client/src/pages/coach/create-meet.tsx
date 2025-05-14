import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  UserPlus, 
  Users, 
  School, 
  Mail, 
  Plus, 
  Minus, 
  X, 
  Check, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Award,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { MeetData as MeetRunnerData } from './meet-runner';

// Types
interface Team {
  id: string;
  name: string;
  coach: {
    name: string;
    email: string;
  };
  isD1: boolean;
  isUserTeam?: boolean;
  athletes: Athlete[];
}

interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  gender?: 'male' | 'female';
}

interface MeetEvent {
  id: string;
  name: string;
  type: 'mens' | 'womens';
  board: '1m' | '3m' | 'platform';
  diveCount: 6 | 11;
  order: number;
}

export interface MeetData {
  name: string;
  location: string;
  date: Date;
  time: string;
  teams: Team[];
  events: MeetEvent[];
  judges: {
    count: number;
    useRemoteJudging: boolean;
  };
  settings: {
    useAIAnnouncing: boolean;
    liveScoring: boolean;
    liveUrl?: string;
    slug?: string;
  };
  eventCombinations: string[][];
}

// Sample user's team data (in real app, this would come from context or prop)
const sampleUserTeam: Team = {
  id: 'team-1',
  name: 'Central High School',
  coach: {
    name: 'John Smith',
    email: 'jsmith@centralhigh.edu'
  },
  isD1: false,
  isUserTeam: true,
  athletes: [
    { id: 'athlete-1', firstName: 'Emma', lastName: 'Johnson' },
    { id: 'athlete-2', firstName: 'Michael', lastName: 'Chen' },
    { id: 'athlete-3', firstName: 'Sophia', lastName: 'Rodriguez' },
    { id: 'athlete-4', firstName: 'Jacob', lastName: 'Williams' }
  ]
};

// Sample schools to search from (in real app, this would come from an API)
const sampleSchools = [
  { id: 'school-1', name: 'Westside Prep', isD1: false },
  { id: 'school-2', name: 'Oak Ridge Academy', isD1: false },
  { id: 'school-3', name: 'Union College', isD1: false },
  { id: 'school-4', name: 'Vassar College', isD1: false },
  { id: 'school-5', name: 'Stanford University', isD1: true },
  { id: 'school-6', name: 'UC Berkeley', isD1: true },
  { id: 'school-7', name: 'Harvard University', isD1: true },
  { id: 'school-8', name: 'Princeton University', isD1: true }
];

export default function CreateMeetPage() {
  const [, setLocation] = useLocation();
  const userTeam = sampleUserTeam;
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  
  // Meet data
  const [meetName, setMeetName] = useState('');
  const [meetLocation, setMeetLocation] = useState('');
  const [meetDate, setMeetDate] = useState<Date>(new Date());
  const [meetTime, setMeetTime] = useState('13:00');
  const [teams, setTeams] = useState<Team[]>([userTeam]);
  const [events, setEvents] = useState<MeetEvent[]>([]);
  const [eventOrder, setEventOrder] = useState<string[]>([]);
  const [judgeCount, setJudgeCount] = useState<number>(3);
  const [useRemoteJudging, setUseRemoteJudging] = useState<boolean>(false);
  const [useAIAnnouncing, setUseAIAnnouncing] = useState<boolean>(true);
  const [useLiveScoring, setUseLiveScoring] = useState<boolean>(true);
  const [meetSlug, setMeetSlug] = useState<string>('');
  const [eventCombinations, setEventCombinations] = useState<string[][]>([]);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual team entry form state
  const [newTeam, setNewTeam] = useState<Team>({
    id: `team-${Date.now()}`,
    name: '',
    coach: {
      name: '',
      email: ''
    },
    isD1: false,
    athletes: [{ id: `athlete-${Date.now()}`, firstName: '', lastName: '', gender: undefined }]
  });
  
  // Steps for the wizard
  const steps = [
    { name: 'Teams', description: 'Select competing teams' },
    { name: 'Events', description: 'Choose events & board types' },
    { name: 'Settings', description: 'Configure judging & features' },
  ];
  
  // Generate a default meet name and location based on the teams
  useEffect(() => {
    if (teams.length > 0) {
      const today = new Date();
      const dateStr = format(today, 'MMM d, yyyy');
      
      // Generate meet name from teams
      if (teams.length === 1) {
        setMeetName(`${teams[0].name} Diving Meet - ${dateStr}`);
        setMeetLocation(teams[0].name);
      } else if (teams.length > 1) {
        // Host team (user's team) vs other teams
        const hostTeam = teams.find(t => t.isUserTeam);
        const otherTeams = teams.filter(t => !t.isUserTeam);
        
        if (hostTeam && otherTeams.length > 0) {
          if (otherTeams.length === 1) {
            setMeetName(`${hostTeam.name} vs ${otherTeams[0].name} - ${dateStr}`);
          } else {
            setMeetName(`${hostTeam.name} Invitational - ${dateStr}`);
          }
          setMeetLocation(hostTeam.name);
        } else {
          setMeetName(`Diving Meet ${dateStr}`);
          setMeetLocation(teams[0].name);
        }
      }
    }
  }, [teams]);
  
  // Generate slug from meet name
  useEffect(() => {
    if (meetName) {
      // Create a slug from meet name - replacing spaces with dashes and removing special chars
      const slug = meetName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .concat(`-${new Date().getFullYear()}`); // Add year
      
      setMeetSlug(slug);
    }
  }, [meetName]);
  
  // Handle search for schools
  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const results = sampleSchools.filter(school => 
          school.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setShowSearchResults(true);
        setIsLoading(false);
      }, 500);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  // Handle adding a team from search results
  const handleAddTeam = (schoolId: string) => {
    const school = sampleSchools.find(s => s.id === schoolId);
    if (school && !teams.some(team => team.id === schoolId)) {
      const newTeam: Team = {
        id: schoolId,
        name: school.name,
        coach: {
          name: '',
          email: ''
        },
        isD1: school.isD1,
        athletes: []
      };
      
      setTeams([...teams, newTeam]);
      setSearchTerm('');
      setShowSearchResults(false);
    }
  };
  
  // Handle removing a team
  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };
  
  // Handle adding an athlete to manual team
  const handleAddAthlete = () => {
    setNewTeam({
      ...newTeam,
      athletes: [
        ...newTeam.athletes, 
        { id: `athlete-${Date.now()}`, firstName: '', lastName: '', gender: undefined }
      ]
    });
  };
  
  // Handle removing an athlete from manual team
  const handleRemoveAthlete = (athleteId: string) => {
    setNewTeam({
      ...newTeam,
      athletes: newTeam.athletes.filter(a => a.id !== athleteId)
    });
  };
  
  // Handle updating athlete data
  const handleAthleteChange = (athleteId: string, field: 'firstName' | 'lastName' | 'email', value: string) => {
    setNewTeam({
      ...newTeam,
      athletes: newTeam.athletes.map(a => 
        a.id === athleteId ? { ...a, [field]: value } : a
      )
    });
  };
  
  // Handle updating athlete gender
  const handleAthleteGenderChange = (athleteId: string, gender: 'male' | 'female') => {
    setNewTeam({
      ...newTeam,
      athletes: newTeam.athletes.map(a => 
        a.id === athleteId ? { ...a, gender } : a
      )
    });
  };
  
  // Handle saving manual team
  const handleSaveTeam = () => {
    if (newTeam.name && newTeam.coach.name) {
      setTeams([...teams, newTeam]);
      setNewTeam({
        id: `team-${Date.now()}`,
        name: '',
        coach: {
          name: '',
          email: ''
        },
        isD1: false,
        athletes: [{ id: `athlete-${Date.now()}`, firstName: '', lastName: '', gender: undefined }]
      });
      setShowManualEntryModal(false);
    }
  };
  
  // Handle toggling an event (add if not exists, remove if exists)
  const handleToggleEvent = (
    type: 'mens' | 'womens',
    board: '1m' | '3m' | 'platform',
    diveCount: 6 | 11
  ) => {
    const eventExists = events.some(e => 
      e.type === type && e.board === board && e.diveCount === diveCount
    );
    
    if (eventExists) {
      // Remove the event
      const eventToRemove = events.find(e => 
        e.type === type && e.board === board && e.diveCount === diveCount
      );
      if (eventToRemove) {
        setEvents(events.filter(e => e.id !== eventToRemove.id));
        setEventOrder(eventOrder.filter(id => id !== eventToRemove.id));
      }
    } else {
      // Add the event
      const eventName = `${type === 'mens' ? "Men's" : "Women's"} ${board} ${diveCount}-dive`;
      const newEvent: MeetEvent = {
        id: `event-${Date.now()}`,
        name: eventName,
        type,
        board,
        diveCount,
        order: events.length
      };
      
      setEvents([...events, newEvent]);
      setEventOrder([...eventOrder, newEvent.id]);
    }
  };
  
  // Handle removing an event
  const handleRemoveEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setEventOrder(eventOrder.filter(id => id !== eventId));
  };
  
  // Handle event order change
  const handleMoveEvent = (eventId: string, direction: 'up' | 'down') => {
    const currentIndex = eventOrder.indexOf(eventId);
    if (
      (direction === 'up' && currentIndex > 0) || 
      (direction === 'down' && currentIndex < eventOrder.length - 1)
    ) {
      const newOrder = [...eventOrder];
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Swap positions
      [newOrder[currentIndex], newOrder[swapIndex]] = 
        [newOrder[swapIndex], newOrder[currentIndex]];
      
      setEventOrder(newOrder);
    }
  };
  
  // Handle adding event combination
  const handleAddCombination = () => {
    setEventCombinations([...eventCombinations, []]);
  };
  
  // Handle removing event combination
  const handleRemoveCombination = (index: number) => {
    setEventCombinations(eventCombinations.filter((_, i) => i !== index));
  };
  
  // Handle toggling event in combination
  const handleToggleEventInCombination = (combinationIndex: number, eventId: string) => {
    const newCombinations = [...eventCombinations];
    const combination = [...newCombinations[combinationIndex]];
    
    const eventIndex = combination.indexOf(eventId);
    if (eventIndex === -1) {
      combination.push(eventId);
    } else {
      combination.splice(eventIndex, 1);
    }
    
    newCombinations[combinationIndex] = combination;
    setEventCombinations(newCombinations);
  };
  
  // Handle completion
  const handleComplete = () => {
    // Create meet data object
    const meetData: MeetData = {
      name: meetName,
      location: meetLocation,
      date: meetDate,
      time: meetTime,
      teams,
      events,
      judges: {
        count: judgeCount,
        useRemoteJudging
      },
      settings: {
        useAIAnnouncing,
        liveScoring: useLiveScoring,
        slug: meetSlug,
        liveUrl: useLiveScoring ? `ripscore.app/live/${meetSlug}` : undefined
      },
      eventCombinations
    };
    
    // Convert MeetData to MeetRunnerData for the runner page
    const newMeet: MeetRunnerData = {
      id: `meet-${Date.now()}`,
      name: meetData.name,
      location: meetData.location,
      date: meetData.date,
      events: meetData.events.map((event, index) => ({
        id: event.id,
        name: event.name,
        order: index,
        isSelected: true
      })),
      participants: meetData.teams.flatMap(team => 
        team.athletes.map(athlete => ({
          id: athlete.id,
          name: `${athlete.firstName} ${athlete.lastName}`,
          team: team.name,
          dives: []
        }))
      ),
      judges: {
        count: meetData.judges.count,
        names: Array(meetData.judges.count).fill(null).map((_, i) => `Judge ${i + 1}`),
      },
      settings: {
        useAIAnnouncing: meetData.settings.useAIAnnouncing,
        remoteJudging: meetData.judges.useRemoteJudging,
        autoAdvance: true,
        eventCombinations: meetData.eventCombinations,
        liveScoring: meetData.settings.liveScoring,
        liveUrl: meetData.settings.liveUrl
      }
    };
    
    // Store the meet in localStorage (in a real app, this would be sent to an API)
    const existingMeets = JSON.parse(localStorage.getItem('meets') || '[]');
    localStorage.setItem('meets', JSON.stringify([...existingMeets, newMeet]));
    
    // Navigate back to meet runner with created meet ID
    setLocation('/coach/meet-runner');
  };
  
  // Navigate to next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleComplete();
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      setLocation('/coach/meet-runner');
    }
  };
  
  // Cancel and return to meet runner
  const handleCancel = () => {
    setLocation('/coach/meet-runner');
  };
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Teams
        return teams.length > 0; // At least one team is needed
      case 1: // Events
        return events.length > 0; // At least one event is needed
      case 2: // Order
        return eventOrder.length === events.length; // All events must be ordered
      case 3: // Settings
        return true; // All settings have defaults
      default:
        return false;
    }
  };
  
  // Get event name by ID
  const getEventNameById = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : '';
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Competing Teams</h2>
            
            <div className="space-y-4">
              {/* Team Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                  Search for schools to add
                </label>
                <div className="flex items-center relative rounded-md shadow-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search schools..."
                    className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-3 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                  />
                </div>
                
                {/* Search Results */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-10 overflow-hidden rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] shadow-lg">
                    {isLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="max-h-60 overflow-auto">
                        {searchResults.map((school) => (
                          <li
                            key={school.id}
                            className="cursor-pointer px-4 py-3 hover:bg-[var(--color-background-post)] transition-colors"
                            onClick={() => handleAddTeam(school.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-[var(--color-text-post)]">{school.name}</div>
                                <div className="text-xs text-[var(--color-muted-post)]">
                                  {school.isD1 ? 'Division 1' : 'Non-Division 1'}
                                </div>
                              </div>
                              <Plus className="h-5 w-5 text-[var(--color-accent-post)]" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-[var(--color-muted-post)]">
                        No schools found. Try a different search term or add manually.
                      </div>
                    )}
                    
                    <div className="border-t border-[var(--color-border-post)] p-3">
                      <button
                        onClick={() => {
                          setShowSearchResults(false);
                          setShowManualEntryModal(true);
                        }}
                        className="w-full rounded-md bg-[var(--color-background-post)] px-3 py-2 text-sm text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors flex items-center justify-center"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Team Manually
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Teams List */}
              <div className="border border-[var(--color-border-post)] rounded-lg overflow-hidden">
                <div className="bg-[var(--color-background-post)] py-3 px-4 border-b border-[var(--color-border-post)]">
                  <div className="font-medium text-[var(--color-text-post)]">Competing Teams</div>
                </div>
                
                <ul className="divide-y divide-[var(--color-border-post)]">
                  {teams.map((team) => (
                    <li key={team.id} className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium text-[var(--color-text-post)] flex items-center">
                          {team.name}
                          {team.isUserTeam && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]">
                              Your Team
                            </span>
                          )}
                          {team.isD1 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)]">
                              D1
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[var(--color-muted-post)]">
                          Coach: {team.coach.name || 'Not specified'}
                        </div>
                        <div className="text-xs text-[var(--color-muted-post)]">
                          {team.athletes.length} athlete{team.athletes.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveTeam(team.id)}
                        className="rounded-full p-1.5 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                  
                  {teams.length === 0 && (
                    <li className="p-6 text-center text-[var(--color-muted-post)]">
                      No teams added yet. Search for schools or add teams manually.
                    </li>
                  )}
                </ul>
                
                {teams.length > 0 && (
                  <div className="bg-[var(--color-background-post)] p-3 border-t border-[var(--color-border-post)]">
                    <button
                      onClick={() => setShowManualEntryModal(true)}
                      className="w-full rounded-md bg-[var(--color-card-post)] px-3 py-2 text-sm text-[var(--color-text-post)] hover:bg-[var(--color-card-post)]/90 transition-colors flex items-center justify-center"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Another Team
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Event Selection</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-[var(--color-border-post)] overflow-hidden">
                  <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-[var(--color-text-post)]">Select Events</h3>
                      <div className="flex space-x-2">
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${
                            events.some(e => e.type === 'mens') 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-[var(--color-background-post)] border border-blue-500 text-blue-500'
                          }`}
                          onClick={() => {
                            // Toggle all men's events
                            const hasMensEvents = events.some(e => e.type === 'mens');
                            if (hasMensEvents) {
                              // Remove all men's events
                              setEvents(events.filter(e => e.type !== 'mens'));
                              setEventOrder(eventOrder.filter(id => !events.find(e => e.id === id)?.type === 'mens'));
                            } else {
                              // Add default men's events (1m and 3m, 6-dive)
                              const newEvents = [
                                {
                                  id: `event-${Date.now()}-1`,
                                  name: "Men's 1m 6-dive",
                                  type: 'mens',
                                  board: '1m',
                                  diveCount: 6,
                                  order: events.length
                                },
                                {
                                  id: `event-${Date.now()}-2`,
                                  name: "Men's 3m 6-dive",
                                  type: 'mens',
                                  board: '3m',
                                  diveCount: 6,
                                  order: events.length + 1
                                }
                              ];
                              setEvents([...events, ...newEvents]);
                              setEventOrder([...eventOrder, ...newEvents.map(e => e.id)]);
                            }
                          }}
                        >
                          Men {events.some(e => e.type === 'mens') && <Check className="inline-block ml-1 h-3 w-3" />}
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-full text-sm ${
                            events.some(e => e.type === 'womens') 
                              ? 'bg-pink-500 text-white' 
                              : 'bg-[var(--color-background-post)] border border-pink-500 text-pink-500'
                          }`}
                          onClick={() => {
                            // Toggle all women's events
                            const hasWomensEvents = events.some(e => e.type === 'womens');
                            if (hasWomensEvents) {
                              // Remove all women's events
                              setEvents(events.filter(e => e.type !== 'womens'));
                              setEventOrder(eventOrder.filter(id => !events.find(e => e.id === id)?.type === 'womens'));
                            } else {
                              // Add default women's events (1m and 3m, 6-dive)
                              const newEvents = [
                                {
                                  id: `event-${Date.now()}-3`,
                                  name: "Women's 1m 6-dive",
                                  type: 'womens',
                                  board: '1m',
                                  diveCount: 6,
                                  order: events.length
                                },
                                {
                                  id: `event-${Date.now()}-4`,
                                  name: "Women's 3m 6-dive",
                                  type: 'womens',
                                  board: '3m',
                                  diveCount: 6,
                                  order: events.length + 1
                                }
                              ];
                              setEvents([...events, ...newEvents]);
                              setEventOrder([...eventOrder, ...newEvents.map(e => e.id)]);
                            }
                          }}
                        >
                          Women {events.some(e => e.type === 'womens') && <Check className="inline-block ml-1 h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-6">
                      {/* Board Types */}
                      <div className="space-y-4">
                        <h4 className="text-md font-medium text-[var(--color-text-post)]">Board Types</h4>
                        
                        <div className="flex flex-wrap gap-3">
                  {/* 1m Events */}
                  <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-center text-[var(--color-text-post)]">1m Springboard</div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => handleToggleEvent('mens', '1m', 6)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'mens' && e.board === '1m' && e.diveCount === 6)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'mens' && e.board === '1m' && e.diveCount === 6)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '6-Dive Format'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleToggleEvent('mens', '1m', 11)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'mens' && e.board === '1m' && e.diveCount === 11)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'mens' && e.board === '1m' && e.diveCount === 11)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '11-Dive Format'
                        }
                      </button>
                    </div>
                  </div>
                  
                  {/* 3m Events */}
                  <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-center text-[var(--color-text-post)]">3m Springboard</div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => handleToggleEvent('mens', '3m', 6)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'mens' && e.board === '3m' && e.diveCount === 6)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'mens' && e.board === '3m' && e.diveCount === 6)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '6-Dive Format'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleToggleEvent('mens', '3m', 11)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'mens' && e.board === '3m' && e.diveCount === 11)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'mens' && e.board === '3m' && e.diveCount === 11)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '11-Dive Format'
                        }
                      </button>
                    </div>
                  </div>
                  

                </div>
              </div>
              
              {/* Women's Events */}
              <div>
                <h3 className="text-lg font-medium text-[var(--color-text-post)] mb-3">Women's Events</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1m Events */}
                  <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-center text-[var(--color-text-post)]">1m Springboard</div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => handleToggleEvent('womens', '1m', 6)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'womens' && e.board === '1m' && e.diveCount === 6)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'womens' && e.board === '1m' && e.diveCount === 6)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '6-Dive Format'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleToggleEvent('womens', '1m', 11)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'womens' && e.board === '1m' && e.diveCount === 11)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'womens' && e.board === '1m' && e.diveCount === 11)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '11-Dive Format'
                        }
                      </button>
                    </div>
                  </div>
                  
                  {/* 3m Events */}
                  <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-center text-[var(--color-text-post)]">3m Springboard</div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => handleToggleEvent('womens', '3m', 6)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'womens' && e.board === '3m' && e.diveCount === 6)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'womens' && e.board === '3m' && e.diveCount === 6)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '6-Dive Format'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleToggleEvent('womens', '3m', 11)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'womens' && e.board === '3m' && e.diveCount === 11)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                        }`}
                      >
                        {events.some(e => e.type === 'womens' && e.board === '3m' && e.diveCount === 11)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '11-Dive Format'
                        }
                      </button>
                    </div>
                  </div>
                  
                  {/* Platform Events - Only for D1 schools */}
                  <div className={`rounded-lg border bg-[var(--color-card-post)] overflow-hidden ${
                    teams.some(team => team.isD1)
                      ? 'border-[var(--color-border-post)]'
                      : 'border-[var(--color-border-post)]/30 opacity-50'
                  }`}>
                    <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-center text-[var(--color-text-post)] flex items-center justify-center">
                        Platform
                        {!teams.some(team => team.isD1) && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)]">
                            D1 Only
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => handleToggleEvent('womens', 'platform', 6)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'womens' && e.board === 'platform' && e.diveCount === 6)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : teams.some(team => team.isD1)
                              ? 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                              : 'bg-[var(--color-background-post)]/50 text-[var(--color-muted-post)] cursor-not-allowed'
                        }`}
                        disabled={!teams.some(team => team.isD1)}
                      >
                        {events.some(e => e.type === 'womens' && e.board === 'platform' && e.diveCount === 6)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '6-Dive Format'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleToggleEvent('womens', 'platform', 11)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'womens' && e.board === 'platform' && e.diveCount === 11)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : teams.some(team => team.isD1)
                              ? 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                              : 'bg-[var(--color-background-post)]/50 text-[var(--color-muted-post)] cursor-not-allowed'
                        }`}
                        disabled={!teams.some(team => team.isD1)}
                      >
                        {events.some(e => e.type === 'womens' && e.board === 'platform' && e.diveCount === 11)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '11-Dive Format'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selected Events */}
              {events.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[var(--color-text-post)] mb-3">Selected Events</h3>
                  
                  <div className="border border-[var(--color-border-post)] rounded-lg overflow-hidden">
                    <ul className="divide-y divide-[var(--color-border-post)]">
                      {events.map((event) => (
                        <li key={event.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              event.type === 'mens' 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                                : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                            }`}>
                              {event.type === 'mens' ? 'M' : 'W'}
                            </div>
                            <div>
                              <div className="font-medium text-[var(--color-text-post)]">{event.name}</div>
                              <div className="text-xs text-[var(--color-muted-post)]">
                                {event.board === 'platform' ? 'Platform' : `${event.board} Springboard`}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveEvent(event.id)}
                            className="rounded-full p-1.5 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
                          >
                            <Minus className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Event Order</h2>
            
            <div className="space-y-6">
              <div className="rounded-lg border border-[var(--color-border-post)] overflow-hidden">
                <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)]">
                  <h3 className="text-lg font-medium text-[var(--color-text-post)]">Arrange Order of Events</h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {eventOrder.map((eventId, index) => {
                      const event = events.find(e => e.id === eventId);
                      if (!event) return null;
                      
                      return (
                        <div 
                          key={eventId}
                          className="flex items-center justify-between p-3 bg-[var(--color-background-post)] rounded-md"
                        >
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              event.type === 'mens' ? 'bg-blue-500' : 'bg-pink-500'
                            } mr-3`}></div>
                            <span className="text-[var(--color-text-post)]">{event.name}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleMoveEvent(index, 'up')}
                              disabled={index === 0}
                              className={`rounded-full p-1.5 ${
                                index === 0 
                                  ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed' 
                                  : 'text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)]/80 hover:text-[var(--color-text-post)]'
                              } transition-colors`}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleMoveEvent(index, 'down')}
                              disabled={index === eventOrder.length - 1}
                              className={`rounded-full p-1.5 ${
                                index === eventOrder.length - 1
                                  ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed'
                                  : 'text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)]/80 hover:text-[var(--color-text-post)]'
                              } transition-colors`}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Event Order & Combinations</h2>
            
            <div className="space-y-6">
              {/* Event Order */}
              <div>
                <h3 className="text-lg font-medium text-[var(--color-text-post)] mb-3">Event Order</h3>
                
                <div className="border border-[var(--color-border-post)] rounded-lg overflow-hidden">
                  <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                    <div className="font-medium text-[var(--color-text-post)]">Arrange Events in Order</div>
                  </div>
                  
                  <ul className="divide-y divide-[var(--color-border-post)]">
                    {eventOrder.map((eventId, index) => {
                      const event = events.find(e => e.id === eventId);
                      if (!event) return null;
                      
                      return (
                        <li key={event.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                event.type === 'mens' 
                                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                                  : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                              }`}>
                                {event.type === 'mens' ? 'M' : 'W'}
                              </div>
                              <div>
                                <div className="font-medium text-[var(--color-text-post)]">{event.name}</div>
                                <div className="text-xs text-[var(--color-muted-post)]">
                                  {event.board === 'platform' ? 'Platform' : `${event.board} Springboard`}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <button
                              onClick={() => handleMoveEvent(event.id, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded-md ${
                                index === 0
                                  ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed'
                                  : 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] hover:bg-[var(--color-background-post)] transition-colors'
                              }`}
                            >
                              <ChevronUp className="h-5 w-5" />
                            </button>
                            
                            <button
                              onClick={() => handleMoveEvent(event.id, 'down')}
                              disabled={index === eventOrder.length - 1}
                              className={`p-1 rounded-md ${
                                index === eventOrder.length - 1
                                  ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed'
                                  : 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] hover:bg-[var(--color-background-post)] transition-colors'
                              }`}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              
              {/* Event Combinations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-[var(--color-text-post)]">Event Combinations</h3>
                  <button
                    onClick={handleAddCombination}
                    className="text-sm flex items-center text-[var(--color-accent-post)] hover:text-[var(--color-accent-post)]/80 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Combination
                  </button>
                </div>
                
                <div className="text-sm text-[var(--color-muted-post)] mb-4">
                  Select events to run simultaneously (e.g., Men's 3m and Women's 1m)
                </div>
                
                {eventCombinations.length > 0 ? (
                  <div className="space-y-4">
                    {eventCombinations.map((combination, index) => (
                      <div
                        key={index}
                        className="border border-[var(--color-border-post)] rounded-lg overflow-hidden"
                      >
                        <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)] flex justify-between items-center">
                          <div className="font-medium text-[var(--color-text-post)]">Combination {index + 1}</div>
                          <button
                            onClick={() => handleRemoveCombination(index)}
                            className="rounded-full p-1 text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {events.map((event) => (
                            <div 
                              key={event.id}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                id={`combo-${index}-event-${event.id}`}
                                checked={combination.includes(event.id)}
                                onChange={() => handleToggleEventInCombination(index, event.id)}
                                className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                              />
                              <label
                                htmlFor={`combo-${index}-event-${event.id}`}
                                className="ml-3 flex items-center"
                              >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${
                                  event.type === 'mens' 
                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                                    : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                                }`}>
                                  {event.type === 'mens' ? 'M' : 'W'}
                                </div>
                                <span className="text-[var(--color-text-post)]">{event.name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        
                        {combination.length > 0 && (
                          <div className="bg-[var(--color-background-post)] p-3 border-t border-[var(--color-border-post)]">
                            <div className="text-sm text-[var(--color-muted-post)]">
                              Selected events: {combination.map(id => getEventNameById(id)).join(' + ')}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--color-border-post)] rounded-lg p-6 text-center text-[var(--color-muted-post)]">
                    <p className="mb-2">No event combinations created yet.</p>
                    <button
                      onClick={handleAddCombination}
                      className="text-[var(--color-accent-post)] hover:underline inline-flex items-center"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Combination
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Meet Settings</h2>
            
            <div className="space-y-6">
              {/* Judging Settings */}
              <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                  <div className="font-medium text-[var(--color-text-post)]">Judging Configuration</div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Number of Judges */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-2">
                      Number of Judges
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                      {[1, 3, 5, 7, 9].map((count) => (
                        <button
                          key={count}
                          onClick={() => setJudgeCount(count)}
                          className={`py-2 rounded-md ${
                            judgeCount === count
                              ? 'bg-[var(--color-accent-post)] text-white'
                              : 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-[var(--color-muted-post)]">
                      {judgeCount > 3 ? 'High and low scores will be dropped.' : 'All scores will be counted.'}
                    </div>
                  </div>
                  
                  {/* Remote Judging */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remote-judging"
                        type="checkbox"
                        checked={useRemoteJudging}
                        onChange={() => setUseRemoteJudging(!useRemoteJudging)}
                        className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="remote-judging" className="font-medium text-[var(--color-text-post)]">
                        Enable Remote Judging
                      </label>
                      <p className="text-sm text-[var(--color-muted-post)]">
                        Judges will be able to score from their own devices using a QR code
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Meet Features */}
              <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                  <div className="font-medium text-[var(--color-text-post)]">Meet Features</div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* AI Announcing */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="ai-announcing"
                        type="checkbox"
                        checked={useAIAnnouncing}
                        onChange={() => setUseAIAnnouncing(!useAIAnnouncing)}
                        className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="ai-announcing" className="font-medium text-[var(--color-text-post)]">
                        Enable AI Meet Announcing
                      </label>
                      <p className="text-sm text-[var(--color-muted-post)]">
                        Automatically announce divers, dives, and scores using AI voice
                      </p>
                    </div>
                  </div>
                  
                  {/* Live Scoring */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="live-scoring"
                        type="checkbox"
                        checked={useLiveScoring}
                        onChange={() => setUseLiveScoring(!useLiveScoring)}
                        className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="live-scoring" className="font-medium text-[var(--color-text-post)]">
                        Enable Live Scoring
                      </label>
                      <p className="text-sm text-[var(--color-muted-post)]">
                        Share a public URL for spectators to view live scores
                      </p>
                    </div>
                  </div>
                  
                  {/* Live URL */}
                  {useLiveScoring && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-2">
                        Live Score URL
                      </label>
                      <div className="flex items-center bg-[var(--color-background-post)] rounded-md p-3 text-sm overflow-hidden">
                        <span className="text-[var(--color-muted-post)]">ripscore.app/live/</span>
                        <input
                          type="text"
                          value={meetSlug}
                          onChange={(e) => setMeetSlug(e.target.value)}
                          className="flex-1 bg-transparent border-none p-0 text-[var(--color-text-post)] focus:outline-none focus:ring-0"
                        />
                      </div>
                      <div className="mt-2 text-xs text-[var(--color-muted-post)]">
                        Anyone with this link will be able to see the live scoring.
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Meet Summary */}
              <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                  <div className="font-medium text-[var(--color-text-post)]">Meet Summary</div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Meet Name</div>
                      <div className="font-medium text-[var(--color-text-post)]">{meetName || '(Not specified)'}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Location</div>
                      <div className="font-medium text-[var(--color-text-post)]">{meetLocation || '(Not specified)'}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Date & Time</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {meetDate ? format(meetDate, 'MMMM d, yyyy') : '(Not specified)'} at {meetTime || '(Not specified)'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Teams</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {teams.length} team{teams.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Events</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {events.length} event{events.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Judging</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {judgeCount} judge{judgeCount !== 1 ? 's' : ''}, {useRemoteJudging ? 'remote scoring' : 'central scoring'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-[var(--color-background-post)]"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-post)]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-post)]">
              Create New Meet
            </h1>
            <p className="mt-1 text-lg text-[var(--color-muted-post)]">
              Set up a new diving competition
            </p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-6 sm:pr-8' : ''}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${stepIdx < currentStep ? 'bg-[var(--color-accent-post)]' : 'bg-[var(--color-border-post)]'}`}></div>
                </div>
                <button
                  onClick={() => stepIdx < currentStep && setCurrentStep(stepIdx)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full group"
                  disabled={stepIdx >= currentStep}
                >
                  {stepIdx < currentStep ? (
                    <>
                      <span className="h-8 w-8 rounded-full bg-[var(--color-accent-post)] flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                      <span className="absolute -bottom-8 whitespace-nowrap text-sm font-medium text-[var(--color-accent-post)]">
                        {step.name}
                      </span>
                    </>
                  ) : stepIdx === currentStep ? (
                    <>
                      <span className="relative h-8 w-8 flex items-center justify-center rounded-full border-2 border-[var(--color-accent-post)] bg-[var(--color-card-post)]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-post)]" />
                      </span>
                      <span className="absolute -bottom-8 whitespace-nowrap text-sm font-medium text-[var(--color-accent-post)]">
                        {step.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="group-hover:border-muted-foreground/50 h-8 w-8 rounded-full border-2 border-[var(--color-border-post)] bg-[var(--color-card-post)] flex items-center justify-center text-[var(--color-muted-post)]">
                        {stepIdx + 1}
                      </span>
                      <span className="absolute -bottom-8 whitespace-nowrap text-sm font-medium text-[var(--color-muted-post)]">
                        {step.name}
                      </span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        
        {/* Step Content */}
        <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
          {renderStepContent()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-6 pb-12">
          <button
            onClick={handleBack}
            className="rounded-md px-4 py-2 text-[var(--color-muted-post)] flex items-center hover:text-[var(--color-text-post)] transition-colors"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`rounded-md px-4 py-2 flex items-center ${
              isStepValid()
                ? 'bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90'
                : 'bg-[var(--color-accent2-post)]/50 text-white/80 cursor-not-allowed'
            } transition-colors`}
          >
            {currentStep === steps.length - 1 ? 'Create Meet' : 'Next'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Manual Team Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-[var(--color-card-post)] rounded-xl max-w-5xl w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowManualEntryModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-[var(--color-text-post)] mb-4">Add Team Manually</h3>
            
            <div className="space-y-4">
              {/* Team Info */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                  Team Name
                </label>
                <div className="flex items-center relative rounded-md shadow-sm">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Enter team name"
                    className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                  />
                </div>
              </div>
              
              {/* Coach Info */}
              <div className="pt-2 border-t border-[var(--color-border-post)]">
                <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                  Coach Information
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newTeam.coach.name}
                    onChange={(e) => setNewTeam({
                      ...newTeam,
                      coach: { ...newTeam.coach, name: e.target.value }
                    })}
                    placeholder="Coach name"
                    className="flex-1 rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 px-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                  />
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                    <input
                      type="email"
                      value={newTeam.coach.email}
                      onChange={(e) => setNewTeam({
                        ...newTeam,
                        coach: { ...newTeam.coach, email: e.target.value }
                      })}
                      placeholder="Coach email"
                      className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Athletes */}
              <div className="pt-2 border-t border-[var(--color-border-post)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-[var(--color-text-post)]">Athletes</h4>
                  <button
                    onClick={handleAddAthlete}
                    className="text-sm flex items-center text-[var(--color-accent-post)] hover:text-[var(--color-accent-post)]/80 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Athlete
                  </button>
                </div>
                
                {newTeam.athletes.map((athlete, index) => (
                  <div 
                    key={athlete.id} 
                    className={`mb-4 p-3 border border-[var(--color-border-post)] rounded-md ${
                      athlete.gender === 'male' 
                        ? 'bg-blue-50/30 dark:bg-blue-900/10' 
                        : athlete.gender === 'female'
                          ? 'bg-pink-50/30 dark:bg-pink-900/10'
                          : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-[var(--color-text-post)] flex items-center">
                        Athlete {index + 1}
                        {athlete.gender === 'male' && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400">♂</span>
                        )}
                        {athlete.gender === 'female' && (
                          <span className="ml-2 text-pink-600 dark:text-pink-400">♀</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveAthlete(athlete.id)}
                        disabled={newTeam.athletes.length === 1}
                        className={`rounded-full p-1 ${
                          newTeam.athletes.length === 1
                            ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed'
                            : 'text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-3">
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-[var(--color-muted-post)] mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={athlete.firstName}
                          onChange={(e) => handleAthleteChange(athlete.id, 'firstName', e.target.value)}
                          placeholder="First name"
                          className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 px-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                        />
                      </div>
                      
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-[var(--color-muted-post)] mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={athlete.lastName}
                          onChange={(e) => handleAthleteChange(athlete.id, 'lastName', e.target.value)}
                          placeholder="Last name"
                          className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 px-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-[var(--color-muted-post)] mb-1">
                          Gender
                        </label>
                        <div className="flex space-x-1 h-[38px]">
                          <button
                            type="button"
                            onClick={() => handleAthleteGenderChange(athlete.id, 'male')}
                            className={`flex-1 flex items-center justify-center rounded-md text-sm ${
                              athlete.gender === 'male'
                                ? 'bg-blue-500 text-white'
                                : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]'
                            }`}
                          >
                            ♂
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAthleteGenderChange(athlete.id, 'female')}
                            className={`flex-1 flex items-center justify-center rounded-md text-sm ${
                              athlete.gender === 'female'
                                ? 'bg-pink-500 text-white'
                                : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]'
                            }`}
                          >
                            ♀
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-[var(--color-muted-post)] mb-1">
                        Email (Optional)
                      </label>
                      <div className="flex items-center relative rounded-md shadow-sm">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-post)]" />
                        <input
                          type="email"
                          value={athlete.email || ''}
                          onChange={(e) => handleAthleteChange(athlete.id, 'email', e.target.value)}
                          placeholder="Email address (for results)"
                          className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowManualEntryModal(false)}
                className="rounded-md px-4 py-2 text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveTeam}
                disabled={!newTeam.name || !newTeam.coach.name}
                className={`rounded-md px-4 py-2 ${
                  newTeam.name && newTeam.coach.name
                    ? 'bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90'
                    : 'bg-[var(--color-accent2-post)]/50 text-white/80 cursor-not-allowed'
                } transition-colors`}
              >
                Add Team
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}