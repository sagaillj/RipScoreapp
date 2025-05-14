import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock,
  Award,
  User,
  Users,
  SkipForward
} from 'lucide-react';
import { format } from 'date-fns';
import { MeetData, MeetParticipant, MeetDive } from '@/pages/coach/meet-runner';

interface MeetRunnerProps {
  meet: MeetData;
  onPrevious: () => void;
  onFinalize: () => void;
}

// Helper types for meet runner
type CurrentState = 
  | 'setup' 
  | 'running' 
  | 'paused' 
  | 'completed';

type CurrentEventState = {
  eventId: string;
  eventName: string;
  divers: MeetParticipant[];
  currentDiverIndex: number;
  currentDiveIndex: number;
};

export function MeetRunner({ meet, onPrevious, onFinalize }: MeetRunnerProps) {
  const [meetState, setMeetState] = useState<CurrentState>('setup');
  const [activeEvents, setActiveEvents] = useState<string[]>([]);
  const [eventStates, setEventStates] = useState<Record<string, CurrentEventState>>({});
  
  const [isAnnouncing, setIsAnnouncing] = useState<boolean>(meet.settings.useAIAnnouncing);
  const [announcerVolume, setAnnouncerVolume] = useState<boolean>(true);
  
  const [currentScores, setCurrentScores] = useState<number[]>([]);
  const [showScoreEntry, setShowScoreEntry] = useState<boolean>(false);
  
  // Start the meet
  const startMeet = () => {
    setMeetState('running');
    if (isAnnouncing) {
      // Play welcome announcement
      announceWelcome();
    }
  };
  
  // Pause the meet
  const pauseMeet = () => {
    setMeetState('paused');
  };
  
  // Resume the meet
  const resumeMeet = () => {
    setMeetState('running');
  };
  
  // Finalize the meet
  const completeMeet = () => {
    setMeetState('completed');
    // Short delay before moving to results
    setTimeout(() => {
      onFinalize();
    }, 1500);
  };
  
  // Toggle announcer
  const toggleAnnouncer = () => {
    setIsAnnouncing(!isAnnouncing);
  };
  
  // Toggle announcer volume
  const toggleAnnouncerVolume = () => {
    setAnnouncerVolume(!announcerVolume);
  };
  
  // Mock function for welcome announcement
  const announceWelcome = () => {
    console.log(`Welcome to the ${meet.name} at ${meet.location}`);
    // In real implementation, this would trigger the announcer
  };
  
  // Mock function for announcing current diver and dive
  const announceCurrentDiverAndDive = (diver: MeetParticipant, dive: MeetDive) => {
    console.log(`${diver.name} will now perform ${dive.number} ${dive.name} with a difficulty of ${dive.difficulty}`);
    // In real implementation, this would trigger the announcer
  };
  
  // Mock function for announcing scores
  const announceScores = (scores: number[], total: number) => {
    console.log(`The scores are ${scores.join(', ')} for a total of ${total}`);
    // In real implementation, this would trigger the announcer
  };
  
  // Initialize mock participant data
  useEffect(() => {
    // For this prototype, we'll populate some mock data
    // In a real implementation, this would come from the meet data
    const mockEventStates: Record<string, CurrentEventState> = {};
    
    meet.events.forEach(event => {
      if (event.isSelected) {
        // Create mock divers for this event
        const mockDivers: MeetParticipant[] = [
          {
            id: `diver-${event.id}-1`,
            name: 'Emma Johnson',
            team: 'Central High School',
            dives: [
              { id: 'dive-1', number: '101C', name: 'Forward Dive, Tuck', difficulty: 1.2, isCompleted: false },
              { id: 'dive-2', number: '201C', name: 'Back Dive, Tuck', difficulty: 1.5, isCompleted: false },
              { id: 'dive-3', number: '301C', name: 'Reverse Dive, Tuck', difficulty: 1.6, isCompleted: false },
            ]
          },
          {
            id: `diver-${event.id}-2`,
            name: 'Michael Chen',
            team: 'Westside Prep',
            dives: [
              { id: 'dive-1', number: '103B', name: 'Forward 1½ Somersaults, Pike', difficulty: 1.5, isCompleted: false },
              { id: 'dive-2', number: '203B', name: 'Back 1½ Somersaults, Pike', difficulty: 1.6, isCompleted: false },
              { id: 'dive-3', number: '303B', name: 'Reverse 1½ Somersaults, Pike', difficulty: 1.7, isCompleted: false },
            ]
          },
          {
            id: `diver-${event.id}-3`,
            name: 'Sophia Rodriguez',
            team: 'Oak Ridge Academy',
            dives: [
              { id: 'dive-1', number: '105C', name: 'Forward 2½ Somersaults, Tuck', difficulty: 2.2, isCompleted: false },
              { id: 'dive-2', number: '205C', name: 'Back 2½ Somersaults, Tuck', difficulty: 2.3, isCompleted: false },
              { id: 'dive-3', number: '305C', name: 'Reverse 2½ Somersaults, Tuck', difficulty: 2.4, isCompleted: false },
            ]
          }
        ];
        
        mockEventStates[event.id] = {
          eventId: event.id,
          eventName: event.name,
          divers: mockDivers,
          currentDiverIndex: 0,
          currentDiveIndex: 0
        };
      }
    });
    
    setEventStates(mockEventStates);
    
    // Set the first event as active for now
    const firstEventId = Object.keys(mockEventStates)[0];
    if (firstEventId) {
      setActiveEvents([firstEventId]);
    }
  }, [meet]);
  
  // Get current and on-deck divers
  const getCurrentDiver = () => {
    if (activeEvents.length === 0) return null;
    
    const eventState = eventStates[activeEvents[0]];
    if (!eventState) return null;
    
    return {
      diver: eventState.divers[eventState.currentDiverIndex],
      dive: eventState.divers[eventState.currentDiverIndex]?.dives[eventState.currentDiveIndex],
      eventName: eventState.eventName
    };
  };
  
  const getOnDeckDiver = () => {
    if (activeEvents.length === 0) return null;
    
    const eventState = eventStates[activeEvents[0]];
    if (!eventState) return null;
    
    // Get next diver (same diver, next dive, or next diver first dive)
    let nextDiverIndex = eventState.currentDiverIndex;
    let nextDiveIndex = eventState.currentDiveIndex + 1;
    
    if (nextDiveIndex >= eventState.divers[nextDiverIndex]?.dives.length) {
      nextDiverIndex++;
      nextDiveIndex = 0;
    }
    
    if (nextDiverIndex >= eventState.divers.length) {
      return null; // No more divers on deck
    }
    
    return {
      diver: eventState.divers[nextDiverIndex],
      dive: eventState.divers[nextDiverIndex]?.dives[nextDiveIndex],
      eventName: eventState.eventName
    };
  };
  
  // Handle score submission
  const submitScores = (scores: number[]) => {
    if (activeEvents.length === 0) return;
    
    const activeEventId = activeEvents[0];
    const eventState = eventStates[activeEventId];
    if (!eventState) return;
    
    const { currentDiverIndex, currentDiveIndex } = eventState;
    const updatedEventStates = { ...eventStates };
    
    // Mark the dive as completed
    updatedEventStates[activeEventId].divers[currentDiverIndex].dives[currentDiveIndex] = {
      ...updatedEventStates[activeEventId].divers[currentDiverIndex].dives[currentDiveIndex],
      isCompleted: true,
      scores,
      totalScore: calculateTotalScore(scores)
    };
    
    // Announce scores if announcer is on
    if (isAnnouncing && announcerVolume) {
      announceScores(scores, calculateTotalScore(scores));
    }
    
    // Move to next dive or diver
    advanceToNextDiver(activeEventId);
    
    setEventStates(updatedEventStates);
    setCurrentScores([]);
    setShowScoreEntry(false);
  };
  
  // Calculate total score (removing highest and lowest if 5+ judges)
  const calculateTotalScore = (scores: number[]) => {
    if (scores.length < 3) return 0;
    
    let total = 0;
    
    if (scores.length >= 5) {
      // Remove highest and lowest scores
      const sortedScores = [...scores].sort((a, b) => a - b);
      sortedScores.shift(); // Remove lowest
      sortedScores.pop(); // Remove highest
      
      total = sortedScores.reduce((sum, score) => sum + score, 0);
    } else {
      // Use all scores
      total = scores.reduce((sum, score) => sum + score, 0);
    }
    
    return total;
  };
  
  // Advance to next diver/dive
  const advanceToNextDiver = (eventId: string) => {
    const eventState = eventStates[eventId];
    if (!eventState) return;
    
    let nextDiverIndex = eventState.currentDiverIndex;
    let nextDiveIndex = eventState.currentDiveIndex + 1;
    
    // Check if we need to move to the next diver
    if (nextDiveIndex >= eventState.divers[nextDiverIndex]?.dives.length) {
      nextDiverIndex++;
      nextDiveIndex = 0;
    }
    
    // Check if event is complete
    if (nextDiverIndex >= eventState.divers.length) {
      // Event is complete
      const remainingEvents = activeEvents.filter(id => id !== eventId);
      setActiveEvents(remainingEvents);
      
      if (remainingEvents.length === 0) {
        // All events are complete
        completeMeet();
      }
      
      return;
    }
    
    // Update event state
    const updatedEventStates = { ...eventStates };
    updatedEventStates[eventId].currentDiverIndex = nextDiverIndex;
    updatedEventStates[eventId].currentDiveIndex = nextDiveIndex;
    setEventStates(updatedEventStates);
    
    // Announce next diver if announcer is on
    if (isAnnouncing && announcerVolume) {
      const nextDiver = eventState.divers[nextDiverIndex];
      const nextDive = nextDiver?.dives[nextDiveIndex];
      if (nextDiver && nextDive) {
        announceCurrentDiverAndDive(nextDiver, nextDive);
      }
    }
  };
  
  // Current diver and on-deck diver
  const currentDiverInfo = getCurrentDiver();
  const onDeckDiverInfo = getOnDeckDiver();
  
  // Handle mock score entry
  const handleScoreEntry = () => {
    setShowScoreEntry(true);
  };
  
  // Submit random scores for demo
  const submitRandomScores = () => {
    // Generate 3 random scores between 5 and 10 (0.5 increments)
    const randomScores = Array.from({ length: 3 }, () => 
      Math.floor(Math.random() * 11) / 2 + 5
    );
    submitScores(randomScores);
  };
  
  return (
    <div className="space-y-8">
      <button
        onClick={onPrevious}
        className="flex items-center text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Settings
      </button>
      
      {/* Meet Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-post)]">
            {meet.name}
          </h2>
          <div className="mt-1 text-[var(--color-muted-post)] flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(new Date(meet.date), 'MMMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Announcer controls */}
          <button
            onClick={toggleAnnouncer}
            className={`p-2 rounded-full ${
              isAnnouncing 
                ? 'bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)]' 
                : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)]'
            }`}
            title={isAnnouncing ? 'Disable Announcer' : 'Enable Announcer'}
          >
            {isAnnouncing ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          
          {isAnnouncing && (
            <button
              onClick={toggleAnnouncerVolume}
              className={`p-2 rounded-full ${
                announcerVolume 
                  ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]' 
                  : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)]'
              }`}
              title={announcerVolume ? 'Mute Announcer' : 'Unmute Announcer'}
            >
              {announcerVolume ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          )}
          
          {/* Meet state controls */}
          {meetState === 'setup' && (
            <button
              onClick={startMeet}
              className="bg-[var(--color-accent2-post)] text-white px-4 py-2 rounded-md flex items-center"
            >
              <Play className="h-4 w-4 mr-2" />
              Begin Meet
            </button>
          )}
          
          {meetState === 'running' && (
            <button
              onClick={pauseMeet}
              className="bg-[var(--color-background-post)] text-[var(--color-text-post)] px-4 py-2 rounded-md flex items-center"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </button>
          )}
          
          {meetState === 'paused' && (
            <button
              onClick={resumeMeet}
              className="bg-[var(--color-accent2-post)] text-white px-4 py-2 rounded-md flex items-center"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </button>
          )}
        </div>
      </div>
      
      {meetState === 'setup' ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-[var(--color-text-post)] mb-4">Ready to Begin</h3>
          <p className="text-[var(--color-muted-post)] max-w-md mx-auto mb-8">
            Click "Begin Meet" to start the competition. Make sure all judges and participants are ready.
          </p>
          <button
            onClick={startMeet}
            className="bg-[var(--color-accent2-post)] text-white px-6 py-3 rounded-md flex items-center mx-auto"
          >
            <Play className="h-5 w-5 mr-2" />
            Begin Meet
          </button>
        </div>
      ) : meetState === 'completed' ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-[var(--color-text-post)] mb-4">Meet Completed</h3>
          <p className="text-[var(--color-muted-post)] max-w-md mx-auto mb-8">
            All events have been completed. Proceeding to results...
          </p>
          <div className="animate-spin h-10 w-10 border-4 border-[var(--color-accent2-post)] border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event and judging info */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-[var(--color-card-post)] border border-[var(--color-border-post)] p-6 space-y-6">
              <div>
                <h3 className="flex items-center text-lg font-semibold text-[var(--color-text-post)]">
                  <Award className="mr-2 h-5 w-5 text-[var(--color-accent-post)]" />
                  Current Event
                </h3>
                {activeEvents.length > 0 ? (
                  <div className="mt-3 p-3 rounded-md bg-[var(--color-background-post)]">
                    <div className="font-medium text-[var(--color-text-post)]">
                      {eventStates[activeEvents[0]]?.eventName}
                    </div>
                    <div className="text-sm text-[var(--color-muted-post)] mt-1">
                      {eventStates[activeEvents[0]]?.divers.length} Divers • 
                      {eventStates[activeEvents[0]]?.divers[0]?.dives.length} Rounds
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-[var(--color-muted-post)] text-center py-4">
                    No active events
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="flex items-center text-lg font-semibold text-[var(--color-text-post)]">
                  <Users className="mr-2 h-5 w-5 text-[var(--color-accent-post)]" />
                  Judges
                </h3>
                {meet.judges.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {meet.judges.map(judge => (
                      <div key={judge.id} className="flex justify-between items-center p-3 rounded-md bg-[var(--color-background-post)]">
                        <span className="font-medium text-[var(--color-text-post)]">{judge.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          judge.isRemote 
                            ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                            : 'bg-[var(--color-muted-post)]/10 text-[var(--color-muted-post)]'
                        }`}>
                          {judge.isRemote ? 'Remote' : 'Local'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4 mt-3 rounded-md border border-dashed border-[var(--color-border-post)]">
                    <p className="text-[var(--color-muted-post)]">
                      No judges assigned
                    </p>
                  </div>
                )}
                
                {/* Prototype - Auto-generate judges */}
                <div className="mt-4 text-center">
                  <button className="text-sm text-[var(--color-accent-post)] hover:underline">
                    Add Mock Judges
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current diver */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-[var(--color-card-post)] border border-[var(--color-border-post)] p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
                Current Diver
              </h3>
              
              {currentDiverInfo ? (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)] flex items-center justify-center text-xl font-bold mr-4">
                        {currentDiverInfo.diver.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-[var(--color-text-post)]">
                          {currentDiverInfo.diver.name}
                        </h4>
                        <p className="text-[var(--color-muted-post)]">
                          {currentDiverInfo.diver.team}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="px-3 py-1 rounded-md bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] text-sm font-medium">
                        {currentDiverInfo.eventName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="rounded-md bg-[var(--color-background-post)] p-4">
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Dive Number</div>
                      <div className="text-2xl font-bold text-[var(--color-text-post)]">
                        {currentDiverInfo.dive.number}
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-[var(--color-background-post)] p-4">
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Dive Name</div>
                      <div className="text-lg font-medium text-[var(--color-text-post)]">
                        {currentDiverInfo.dive.name}
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-[var(--color-background-post)] p-4">
                      <div className="text-sm text-[var(--color-muted-post)] mb-1">Difficulty</div>
                      <div className="text-2xl font-bold text-[var(--color-text-post)]">
                        {currentDiverInfo.dive.difficulty.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score entry */}
                  {showScoreEntry ? (
                    <div className="bg-[var(--color-background-post)] rounded-lg p-6 mt-6">
                      <h4 className="text-lg font-medium text-[var(--color-text-post)] mb-4">
                        Enter Scores
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3].map(judgeNum => (
                          <div key={judgeNum} className="space-y-2">
                            <label className="text-sm text-[var(--color-muted-post)]">
                              Judge {judgeNum}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              placeholder="0.0"
                              className="w-full px-3 py-2 rounded-md border border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-text-post)]"
                              value={currentScores[judgeNum - 1] || ''}
                              onChange={(e) => {
                                const newScores = [...currentScores];
                                newScores[judgeNum - 1] = parseFloat(e.target.value);
                                setCurrentScores(newScores);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setShowScoreEntry(false)}
                          className="px-4 py-2 rounded-md text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
                        >
                          Cancel
                        </button>
                        
                        <div className="flex gap-2">
                          {/* For prototype - generate random scores */}
                          <button
                            onClick={submitRandomScores}
                            className="px-4 py-2 rounded-md bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/20 transition-colors"
                          >
                            Random Scores
                          </button>
                          
                          <button
                            onClick={() => submitScores(currentScores)}
                            disabled={currentScores.filter(Boolean).length < 3}
                            className={`px-4 py-2 rounded-md ${
                              currentScores.filter(Boolean).length < 3
                              ? 'bg-[var(--color-accent2-post)]/50 text-white cursor-not-allowed'
                              : 'bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors'
                            }`}
                          >
                            Submit Scores
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleScoreEntry}
                        className="px-6 py-3 rounded-md bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors"
                      >
                        Enter Scores
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center">
                    <User className="h-12 w-12 text-[var(--color-muted-post)]" />
                  </div>
                  <h4 className="mt-4 text-lg font-medium text-[var(--color-text-post)]">
                    No current diver
                  </h4>
                  <p className="mt-1 text-[var(--color-muted-post)]">
                    All dives have been completed
                  </p>
                  
                  <button
                    onClick={completeMeet}
                    className="mt-6 px-6 py-3 rounded-md bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors"
                  >
                    Finalize Meet
                  </button>
                </div>
              )}
              
              {/* On Deck Diver */}
              {onDeckDiverInfo && (
                <div className="mt-8 border-t border-[var(--color-border-post)] pt-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
                    On Deck
                  </h3>
                  
                  <div className="flex justify-between items-center rounded-md bg-[var(--color-background-post)] p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] flex items-center justify-center text-lg font-bold mr-3">
                        {onDeckDiverInfo.diver.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--color-text-post)]">
                          {onDeckDiverInfo.diver.name}
                        </h4>
                        <p className="text-xs text-[var(--color-muted-post)]">
                          {onDeckDiverInfo.dive.number} • {onDeckDiverInfo.dive.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-2 py-1 rounded-md bg-[var(--color-background-post)]/80 text-[var(--color-muted-post)] text-xs">
                      DD: {onDeckDiverInfo.dive.difficulty.toFixed(1)}
                    </div>
                  </div>
                  
                  {/* Skip current diver button - for demo purposes */}
                  {currentDiverInfo && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (activeEvents.length > 0) {
                            advanceToNextDiver(activeEvents[0]);
                          }
                        }}
                        className="flex items-center text-sm text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
                      >
                        <SkipForward className="mr-1 h-4 w-4" />
                        Skip Current Diver
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 mt-8 border-t border-[var(--color-border-post)]">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </button>
        
        {meetState !== 'setup' && meetState !== 'completed' && (
          <button
            onClick={completeMeet}
            className="flex items-center px-6 py-2 rounded-md bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors"
          >
            Finalize Meet
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}