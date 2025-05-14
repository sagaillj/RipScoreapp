import { useState, useEffect } from 'react';
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
  PlusCircle
} from 'lucide-react';
import { format } from 'date-fns';

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
}

interface MeetEvent {
  id: string;
  name: string;
  type: 'mens' | 'womens';
  board: '1m' | '3m' | 'platform';
  diveCount: 6 | 11;
  order: number;
}

interface MeetCreationWizardProps {
  onCancel: () => void;
  onComplete: (meetData: MeetData) => void;
  userTeam?: Team;
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

export const MeetCreationWizard: React.FC<MeetCreationWizardProps> = ({ 
  onCancel, 
  onComplete,
  userTeam = sampleUserTeam
}) => {
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
    athletes: [{ id: `athlete-${Date.now()}`, firstName: '', lastName: '' }]
  });
  
  // Steps for the wizard
  const steps = [
    { name: 'Meet Info', description: 'Basic meet information' },
    { name: 'Teams', description: 'Select competing teams' },
    { name: 'Events', description: 'Choose events & board types' },
    { name: 'Order', description: 'Set event order & combinations' },
    { name: 'Settings', description: 'Configure judging & features' },
  ];
  
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
        { id: `athlete-${Date.now()}`, firstName: '', lastName: '' }
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
        athletes: [{ id: `athlete-${Date.now()}`, firstName: '', lastName: '' }]
      });
      setShowManualEntryModal(false);
    }
  };
  
  // Handle adding an event
  const handleAddEvent = (
    type: 'mens' | 'womens',
    board: '1m' | '3m' | 'platform',
    diveCount: 6 | 11
  ) => {
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
  
  // Navigate to next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish wizard and submit meet data
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
      
      onComplete(meetData);
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Meet Info
        return meetName && meetLocation && meetDate;
      case 1: // Teams
        return teams.length >= 2; // At least two teams are needed
      case 2: // Events
        return events.length > 0; // At least one event is needed
      case 3: // Order
        return eventOrder.length === events.length; // All events must be ordered
      case 4: // Settings
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
          <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Meet Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                  Meet Name
                </label>
                <div className="flex items-center relative rounded-md shadow-sm">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                  <input
                    type="text"
                    value={meetName}
                    onChange={(e) => setMeetName(e.target.value)}
                    placeholder="Enter meet name"
                    className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-3 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                  Location
                </label>
                <div className="flex items-center relative rounded-md shadow-sm">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                  <input
                    type="text"
                    value={meetLocation}
                    onChange={(e) => setMeetLocation(e.target.value)}
                    placeholder="Enter meet location"
                    className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-3 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                    Date
                  </label>
                  <div className="flex items-center relative rounded-md shadow-sm">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                    <input
                      type="date"
                      value={meetDate ? format(meetDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setMeetDate(new Date(e.target.value))}
                      className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-3 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                    Start Time
                  </label>
                  <div className="flex items-center relative rounded-md shadow-sm">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                    <input
                      type="time"
                      value={meetTime}
                      onChange={(e) => setMeetTime(e.target.value)}
                      className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-3 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6 p-4">
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
                      
                      {!team.isUserTeam && (
                        <button
                          onClick={() => handleRemoveTeam(team.id)}
                          className="rounded-full p-1.5 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                      )}
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
      
      case 2:
        return (
          <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Event Selection</h2>
            
            <div className="space-y-6">
              {/* Men's Events */}
              <div>
                <h3 className="text-lg font-medium text-[var(--color-text-post)] mb-3">Men's Events</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1m Events */}
                  <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-3 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-center text-[var(--color-text-post)]">1m Springboard</div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <button
                        onClick={() => handleAddEvent('mens', '1m', 6)}
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
                        onClick={() => handleAddEvent('mens', '1m', 11)}
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
                        onClick={() => handleAddEvent('mens', '3m', 6)}
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
                        onClick={() => handleAddEvent('mens', '3m', 11)}
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
                        onClick={() => handleAddEvent('mens', 'platform', 6)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'mens' && e.board === 'platform' && e.diveCount === 6)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : teams.some(team => team.isD1)
                              ? 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                              : 'bg-[var(--color-background-post)]/50 text-[var(--color-muted-post)] cursor-not-allowed'
                        }`}
                        disabled={!teams.some(team => team.isD1)}
                      >
                        {events.some(e => e.type === 'mens' && e.board === 'platform' && e.diveCount === 6)
                          ? <Check className="mx-auto h-4 w-4" />
                          : '6-Dive Format'
                        }
                      </button>
                      
                      <button
                        onClick={() => handleAddEvent('mens', 'platform', 11)}
                        className={`w-full rounded-md px-3 py-2 text-sm ${
                          events.some(e => e.type === 'mens' && e.board === 'platform' && e.diveCount === 11)
                            ? 'bg-[var(--color-accent-post)] text-white'
                            : teams.some(team => team.isD1)
                              ? 'bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-background-post)]/80 transition-colors'
                              : 'bg-[var(--color-background-post)]/50 text-[var(--color-muted-post)] cursor-not-allowed'
                        }`}
                        disabled={!teams.some(team => team.isD1)}
                      >
                        {events.some(e => e.type === 'mens' && e.board === 'platform' && e.diveCount === 11)
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
                        onClick={() => handleAddEvent('womens', '1m', 6)}
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
                        onClick={() => handleAddEvent('womens', '1m', 11)}
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
                        onClick={() => handleAddEvent('womens', '3m', 6)}
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
                        onClick={() => handleAddEvent('womens', '3m', 11)}
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
                        onClick={() => handleAddEvent('womens', 'platform', 6)}
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
                        onClick={() => handleAddEvent('womens', 'platform', 11)}
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
      
      case 3:
        return (
          <div className="space-y-6 p-4">
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
          <div className="space-y-6 p-4">
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
  
  // Render the wizard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="relative bg-[var(--color-card-post)] rounded-xl shadow-2xl max-w-4xl w-full mx-4 my-8">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full p-1 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Header with steps */}
        <div className="border-b border-[var(--color-border-post)] py-4 px-6">
          <div className="flex items-center justify-between">
            <ol className="flex items-center w-full">
              {steps.map((step, index) => (
                <li 
                  key={step.name}
                  className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`flex z-10 justify-center items-center ${
                      currentStep >= index
                        ? 'bg-[var(--color-accent-post)]'
                        : 'bg-[var(--color-background-post)]'
                    } rounded-full h-7 w-7 shrink-0 text-xs font-medium ${
                      currentStep >= index
                        ? 'text-white'
                        : 'text-[var(--color-muted-post)]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className={`hidden sm:flex sm:flex-col sm:ml-2 ${
                      index === currentStep 
                        ? '' 
                        : 'sm:hidden'
                    }`}>
                      <span className="text-xs sm:text-sm font-medium text-[var(--color-text-post)]">
                        {step.name}
                      </span>
                      <span className="text-xs text-[var(--color-muted-post)] hidden sm:inline">
                        {step.description}
                      </span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 ${
                      currentStep > index
                        ? 'bg-[var(--color-accent-post)]'
                        : 'bg-[var(--color-border-post)]'
                    }`}></div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="max-h-[60vh] overflow-auto">
          {renderStepContent()}
        </div>
        
        {/* Navigation */}
        <div className="border-t border-[var(--color-border-post)] p-4 flex justify-between">
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
          <div className="bg-[var(--color-card-post)] rounded-xl max-w-2xl w-full mx-4 p-6 relative">
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
              
              <div className="flex items-center">
                <input
                  id="is-d1"
                  type="checkbox"
                  checked={newTeam.isD1}
                  onChange={() => setNewTeam({ ...newTeam, isD1: !newTeam.isD1 })}
                  className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                />
                <label htmlFor="is-d1" className="ml-2 text-sm text-[var(--color-text-post)]">
                  This is a Division 1 team
                </label>
              </div>
              
              {/* Coach Info */}
              <div className="pt-2 border-t border-[var(--color-border-post)]">
                <h4 className="text-md font-medium text-[var(--color-text-post)] mb-3">Coach Information</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                      Coach Name
                    </label>
                    <input
                      type="text"
                      value={newTeam.coach.name}
                      onChange={(e) => setNewTeam({
                        ...newTeam,
                        coach: { ...newTeam.coach, name: e.target.value }
                      })}
                      placeholder="Full name"
                      className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 px-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted-post)] mb-1">
                      Coach Email
                    </label>
                    <div className="flex items-center relative rounded-md shadow-sm">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted-post)]" />
                      <input
                        type="email"
                        value={newTeam.coach.email}
                        onChange={(e) => setNewTeam({
                          ...newTeam,
                          coach: { ...newTeam.coach, email: e.target.value }
                        })}
                        placeholder="Email address"
                        className="w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] py-2 pl-10 pr-3 text-[var(--color-text-post)] placeholder-[var(--color-muted-post)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-post)]"
                      />
                    </div>
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
                  <div key={athlete.id} className="mb-4 p-3 border border-[var(--color-border-post)] rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-[var(--color-text-post)]">Athlete {index + 1}</div>
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
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
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
                      
                      <div>
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
    </div>
  );
};