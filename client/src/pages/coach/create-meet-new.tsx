import { useState } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Info, 
  Mail, Minus, Plus, PlusCircle, School, Search, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GenderToggle } from '@/components/GenderToggle';

// Define interface for team and athlete
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

// Main component
export default function CreateMeetPage() {
  // Sample user team for demonstration
  const sampleUserTeam: Team = {
    id: 'user-team-1',
    name: 'Tennessee Volunteers',
    coach: {
      name: 'John Smith',
      email: 'john.smith@tennessee.edu'
    },
    isD1: true,
    isUserTeam: true,
    athletes: [
      { id: 'athlete-1', firstName: 'Jane', lastName: 'Doe', gender: 'female' },
      { id: 'athlete-2', firstName: 'John', lastName: 'Smith', gender: 'male' }
    ]
  };

  // State variables
  const [currentStep, setCurrentStep] = useState(0);
  const [teams, setTeams] = useState<Team[]>([sampleUserTeam]);
  const [events, setEvents] = useState<MeetEvent[]>([]);
  const [eventOrder, setEventOrder] = useState<string[]>([]);
  const [eventCombinations, setEventCombinations] = useState<string[][]>([]);
  const [meetName, setMeetName] = useState('Tennessee Invitational');
  const [meetLocation, setMeetLocation] = useState('Knoxville, TN');
  const [meetDate, setMeetDate] = useState<Date>(new Date());
  const [meetTime, setMeetTime] = useState('12:00');
  
  const [judgeCount, setJudgeCount] = useState(5);
  const [useRemoteJudging, setUseRemoteJudging] = useState(false);
  const [useAIAnnouncing, setUseAIAnnouncing] = useState(false);
  const [liveScoring, setLiveScoring] = useState(true);
  const [liveUrl, setLiveUrl] = useState('');
  const [meetSlug, setMeetSlug] = useState('');
  
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
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
    'Teams',
    'Events',
    'Order',
    'Settings',
    'Review'
  ];

  // Handler for adding new athlete to the team
  const handleAddAthlete = () => {
    setNewTeam({
      ...newTeam,
      athletes: [
        ...newTeam.athletes, 
        { id: `athlete-${Date.now()}`, firstName: '', lastName: '', gender: undefined }
      ]
    });
  };

  // Handle removing athlete from the team form
  const handleRemoveAthlete = (athleteId: string) => {
    if (newTeam.athletes.length > 1) {
      setNewTeam({
        ...newTeam,
        athletes: newTeam.athletes.filter(a => a.id !== athleteId)
      });
    }
  };

  // Handle updating athlete form fields
  const handleAthleteChange = (athleteId: string, field: string, value: string) => {
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

  // Handle removing team from the meet
  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  // Handle toggling an event in the meet
  const handleToggleEvent = (type: 'mens' | 'womens', board: '1m' | '3m' | 'platform', diveCount: 6 | 11) => {
    // Check if event already exists
    const eventExists = events.some(e => 
      e.type === type && e.board === board && e.diveCount === diveCount
    );
    
    if (eventExists) {
      // Remove event if it exists
      const updatedEvents = events.filter(e => 
        !(e.type === type && e.board === board && e.diveCount === diveCount)
      );
      setEvents(updatedEvents);
      
      // Also remove from order
      const event = events.find(e => 
        e.type === type && e.board === board && e.diveCount === diveCount
      );
      if (event) {
        setEventOrder(eventOrder.filter(id => id !== event.id));
      }
    } else {
      // Add event if it doesn't exist
      const boardName = board === 'platform' ? 'Platform' : `${board}`;
      const newEvent: MeetEvent = {
        id: `event-${Date.now()}`,
        name: `${type === 'mens' ? "Men's" : "Women's"} ${boardName} ${diveCount}-dive`,
        type,
        board,
        diveCount,
        order: events.length
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setEventOrder([...eventOrder, newEvent.id]);
    }
  };

  // Handle adding all events of a specific gender
  const handleToggleGenderEvents = (gender: 'mens' | 'womens') => {
    const hasEvents = events.some(e => e.type === gender);
    
    if (hasEvents) {
      // Remove all events of this gender
      const filteredEvents = events.filter(e => e.type !== gender);
      setEvents(filteredEvents);
      setEventOrder(eventOrder.filter(id => 
        !events.find(e => e.id === id)?.type === gender
      ));
    } else {
      // Add default events for this gender (1m and 3m, 6-dive)
      const newEvents = [
        {
          id: `event-${Date.now()}-1`,
          name: `${gender === 'mens' ? "Men's" : "Women's"} 1m 6-dive`,
          type: gender,
          board: '1m',
          diveCount: 6,
          order: events.length
        },
        {
          id: `event-${Date.now()}-2`,
          name: `${gender === 'mens' ? "Men's" : "Women's"} 3m 6-dive`,
          type: gender,
          board: '3m',
          diveCount: 6,
          order: events.length + 1
        }
      ] as MeetEvent[];
      
      setEvents([...events, ...newEvents]);
      setEventOrder([...eventOrder, ...newEvents.map(e => e.id)]);
    }
  };

  // Handle removing event from the meet
  const handleRemoveEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setEventOrder(eventOrder.filter(id => id !== eventId));
  };

  // Render the team entry modal UI
  const renderTeamEntryModal = () => {
    return (
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
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-[var(--color-muted-post)] mb-1">
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
                        <div className="flex-1">
                          <label className="block text-xs text-[var(--color-muted-post)] mb-1">
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
                      
                      <div className="flex gap-4 items-start">
                        <div className="flex-1">
                          <label className="block text-xs text-[var(--color-muted-post)] mb-1">
                            Gender
                          </label>
                          <GenderToggle 
                            gender={athlete.gender} 
                            onChange={(gender) => handleAthleteGenderChange(athlete.id, gender)}
                          />
                        </div>
                        <div className="flex-1 relative">
                          <label className="block text-xs text-[var(--color-muted-post)] mb-1">
                            Email (Optional)
                          </label>
                          <div className="relative">
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
                    </div>
                    
                    {newTeam.athletes.length > 1 && (
                      <button
                        onClick={() => handleRemoveAthlete(athlete.id)}
                        className="ml-2 p-1 rounded-full text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
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
    );
  };
  
  // Render the event selection panel
  const renderEventSelectionPanel = () => {
    return (
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
                  onClick={() => handleToggleGenderEvents('mens')}
                >
                  Men {events.some(e => e.type === 'mens') && <Check className="inline-block ml-1 h-3 w-3" />}
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${
                    events.some(e => e.type === 'womens') 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-[var(--color-background-post)] border border-pink-500 text-pink-500'
                  }`}
                  onClick={() => handleToggleGenderEvents('womens')}
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
                  <button
                    className={`px-4 py-2 rounded-md ${
                      events.some(e => e.board === '1m')
                        ? 'bg-[var(--color-accent-post)] text-white'
                        : 'bg-[var(--color-background-post)] text-[var(--color-text-post)]'
                    }`}
                    onClick={() => {
                      // Toggle all 1m events
                      const has1mEvents = events.some(e => e.board === '1m');
                      if (has1mEvents) {
                        // Remove all 1m events
                        setEvents(events.filter(e => e.board !== '1m'));
                        setEventOrder(eventOrder.filter(id => 
                          events.find(e => e.id === id)?.board !== '1m'
                        ));
                      } else {
                        // Add 1m events for enabled genders
                        const newEvents: MeetEvent[] = [];
                        if (events.some(e => e.type === 'mens')) {
                          newEvents.push({
                            id: `event-${Date.now()}-m1m`,
                            name: "Men's 1m 6-dive",
                            type: 'mens',
                            board: '1m',
                            diveCount: 6,
                            order: events.length
                          });
                        }
                        if (events.some(e => e.type === 'womens')) {
                          newEvents.push({
                            id: `event-${Date.now()}-w1m`,
                            name: "Women's 1m 6-dive",
                            type: 'womens',
                            board: '1m',
                            diveCount: 6,
                            order: events.length + (events.some(e => e.type === 'mens') ? 1 : 0)
                          });
                        }
                        
                        if (newEvents.length > 0) {
                          setEvents([...events, ...newEvents]);
                          setEventOrder([...eventOrder, ...newEvents.map(e => e.id)]);
                        }
                      }
                    }}
                  >
                    1m Springboard {events.some(e => e.board === '1m') && <Check className="inline-block ml-1 h-4 w-4" />}
                  </button>
                  
                  <button
                    className={`px-4 py-2 rounded-md ${
                      events.some(e => e.board === '3m')
                        ? 'bg-[var(--color-accent-post)] text-white'
                        : 'bg-[var(--color-background-post)] text-[var(--color-text-post)]'
                    }`}
                    onClick={() => {
                      // Toggle all 3m events
                      const has3mEvents = events.some(e => e.board === '3m');
                      if (has3mEvents) {
                        // Remove all 3m events
                        setEvents(events.filter(e => e.board !== '3m'));
                        setEventOrder(eventOrder.filter(id => 
                          events.find(e => e.id === id)?.board !== '3m'
                        ));
                      } else {
                        // Add 3m events for enabled genders
                        const newEvents: MeetEvent[] = [];
                        if (events.some(e => e.type === 'mens')) {
                          newEvents.push({
                            id: `event-${Date.now()}-m3m`,
                            name: "Men's 3m 6-dive",
                            type: 'mens',
                            board: '3m',
                            diveCount: 6,
                            order: events.length
                          });
                        }
                        if (events.some(e => e.type === 'womens')) {
                          newEvents.push({
                            id: `event-${Date.now()}-w3m`,
                            name: "Women's 3m 6-dive",
                            type: 'womens',
                            board: '3m',
                            diveCount: 6,
                            order: events.length + (events.some(e => e.type === 'mens') ? 1 : 0)
                          });
                        }
                        
                        if (newEvents.length > 0) {
                          setEvents([...events, ...newEvents]);
                          setEventOrder([...eventOrder, ...newEvents.map(e => e.id)]);
                        }
                      }
                    }}
                  >
                    3m Springboard {events.some(e => e.board === '3m') && <Check className="inline-block ml-1 h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Dive Counts */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-[var(--color-text-post)]">Dive Format</h4>
                
                <div className="flex gap-3">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      events.some(e => e.diveCount === 6)
                        ? 'bg-[var(--color-accent-post)] text-white'
                        : 'bg-[var(--color-background-post)] text-[var(--color-text-post)]'
                    }`}
                    onClick={() => {
                      const has6DiveEvents = events.some(e => e.diveCount === 6);
                      
                      if (has6DiveEvents) {
                        // Remove all 6-dive events
                        const filteredEvents = events.filter(e => e.diveCount !== 6);
                        setEvents(filteredEvents);
                        setEventOrder(eventOrder.filter(id => 
                          events.find(e => e.id === id)?.diveCount !== 6
                        ));
                      } else {
                        // Convert all events to 6-dive
                        const updatedEvents = events.map(event => ({
                          ...event,
                          diveCount: 6,
                          name: event.name.replace(/\d+-dive/, '6-dive')
                        }));
                        setEvents(updatedEvents);
                      }
                    }}
                  >
                    6-Dive Format {events.some(e => e.diveCount === 6) && <Check className="inline-block ml-1 h-4 w-4" />}
                  </button>
                  
                  <button
                    className={`px-4 py-2 rounded-md ${
                      events.some(e => e.diveCount === 11)
                        ? 'bg-[var(--color-accent-post)] text-white'
                        : 'bg-[var(--color-background-post)] text-[var(--color-text-post)]'
                    }`}
                    onClick={() => {
                      const has11DiveEvents = events.some(e => e.diveCount === 11);
                      
                      if (has11DiveEvents) {
                        // Remove all 11-dive events
                        const filteredEvents = events.filter(e => e.diveCount !== 11);
                        setEvents(filteredEvents);
                        setEventOrder(eventOrder.filter(id => 
                          events.find(e => e.id === id)?.diveCount !== 11
                        ));
                      } else {
                        // Convert all events to 11-dive
                        const updatedEvents = events.map(event => ({
                          ...event,
                          diveCount: 11,
                          name: event.name.replace(/\d+-dive/, '11-dive')
                        }));
                        setEvents(updatedEvents);
                      }
                    }}
                  >
                    11-Dive Format {events.some(e => e.diveCount === 11) && <Check className="inline-block ml-1 h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Events Summary */}
        {events.length > 0 && (
          <div className="rounded-lg border border-[var(--color-border-post)] overflow-hidden">
            <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)]">
              <h3 className="text-lg font-medium text-[var(--color-text-post)]">Selected Events</h3>
            </div>
            
            <ul className="divide-y divide-[var(--color-border-post)]">
              {events.map((event) => (
                <li key={event.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'mens' ? 'bg-blue-500' : 'bg-pink-500'
                    } mr-3`}></div>
                    <span className="text-[var(--color-text-post)]">{event.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(event.id)}
                    className="rounded-full p-1.5 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <DashboardLayout>
      <div className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="rounded-full p-2 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-[var(--color-text-post)]">Create New Meet</h1>
          </div>
          
          {/* Steps Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center"
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      currentStep === index
                        ? 'border-[var(--color-accent-post)] bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                        : currentStep > index
                          ? 'border-[var(--color-accent-post)] bg-[var(--color-accent-post)] text-white'
                          : 'border-[var(--color-border-post)] text-[var(--color-muted-post)]'
                    }`}
                  >
                    {currentStep > index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep === index 
                        ? 'text-[var(--color-accent-post)]' 
                        : currentStep > index
                          ? 'text-[var(--color-text-post)]'
                          : 'text-[var(--color-muted-post)]'
                    }`}>
                      {step}
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-24 h-[2px] mx-2 ${
                      currentStep > index 
                        ? 'bg-[var(--color-accent-post)]' 
                        : 'bg-[var(--color-border-post)]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Step Content */}
          <div className="mb-8">
            {/* Teams Step */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Select Teams</h2>
                
                <div className="space-y-6">
                  {/* Add Teams */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-[var(--color-text-post)]">Add Teams to Meet</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setShowManualEntryModal(true)}
                          className="px-3 py-1.5 rounded-md text-sm flex items-center bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Team Manually
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Teams List */}
                  <div className="border border-[var(--color-border-post)] rounded-lg overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)]">
                      <div className="font-medium text-[var(--color-text-post)]">Competing Teams</div>
                    </div>
                    
                    <ul className="divide-y divide-[var(--color-border-post)]">
                      {teams.map((team) => (
                        <li 
                          key={team.id} 
                          className="flex items-center justify-between p-4"
                        >
                          <div className="flex items-center">
                            {team.isUserTeam && (
                              <div className="mr-3 px-2 py-0.5 rounded-md bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] text-xs">
                                Your Team
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-[var(--color-text-post)]">
                                {team.name}
                              </div>
                              <div className="text-sm text-[var(--color-muted-post)]">
                                Coach: {team.coach.name || 'Not specified'}
                              </div>
                              <div className="text-xs text-[var(--color-muted-post)]">
                                {team.athletes.length} athlete{team.athletes.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveTeam(team.id)}
                            className="rounded-full p-2 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
                            disabled={team.isUserTeam}
                          >
                            <X className={`h-5 w-5 ${team.isUserTeam ? 'opacity-50 cursor-not-allowed' : ''}`} />
                          </button>
                        </li>
                      ))}
                      
                      {teams.length === 0 && (
                        <li className="py-8 text-center text-[var(--color-muted-post)]">
                          No teams added yet. Add your first team to continue.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Events Step */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-post)]">Event Selection</h2>
                {renderEventSelectionPanel()}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`rounded-md px-4 py-2 flex items-center ${
                  currentStep > 0
                    ? 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors'
                    : 'opacity-0 cursor-default'
                }`}
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className={`rounded-md px-4 py-2 flex items-center ${
                  (currentStep === 0 && teams.length === 0) || (currentStep === 1 && events.length === 0)
                    ? 'bg-[var(--color-accent-post)]/50 text-white cursor-not-allowed'
                    : 'bg-[var(--color-accent-post)] text-white hover:bg-[var(--color-accent-post)]/90 transition-colors'
                }`}
                disabled={(currentStep === 0 && teams.length === 0) || (currentStep === 1 && events.length === 0)}
              >
                {currentStep === steps.length - 1 ? 'Create Meet' : 'Next'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Manual Team Entry Modal */}
      {showManualEntryModal && renderTeamEntryModal()}
    </DashboardLayout>
  );
}