import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MeetWizard } from '@/components/meet/MeetWizard';
import { Layers, Settings, Play, Users, Award } from 'lucide-react';

// Define Meet Runner Data types
export interface MeetEvent {
  id: string;
  name: string;
  order: number;
  isSelected: boolean;
}

export interface MeetParticipant {
  id: string;
  name: string;
  team: string;
  dives: Array<{
    id: string;
    number: string;
    name: string;
    difficulty: number;
    score?: number;
    isCompleted?: boolean;
  }>;
}

export interface MeetJudge {
  id?: string;
  name?: string;
}

export interface MeetSettings {
  useAIAnnouncing: boolean;
  remoteJudging: boolean;
  autoAdvance: boolean;
  eventCombinations: string[][];
  liveScoring?: boolean;
  liveUrl?: string;
}

export interface MeetData {
  id: string;
  name: string;
  location: string;
  date: Date;
  events: MeetEvent[];
  participants: MeetParticipant[];
  judges: {
    count?: number;
    names?: string[];
  } | MeetJudge[];
  settings: MeetSettings;
}

// Define Meet Runner phases
type MeetRunnerPhase = 'select' | 'configure' | 'run' | 'results';

export default function MeetRunnerPage() {
  const [selectedMeet, setSelectedMeet] = useState<MeetData | null>(null);
  const [phase, setPhase] = useState<MeetRunnerPhase>('select');
  
  // Function to handle selecting a meet
  const handleSelectMeet = (meet: MeetData) => {
    setSelectedMeet(meet);
    setPhase('configure');
  };
  
  // Function to reset and go back to meet selection
  const handleReset = () => {
    setSelectedMeet(null);
    setPhase('select');
  };
  
  // Function to render the current phase
  const renderPhase = () => {
    switch (phase) {
      case 'select':
        return <MeetWizard onSelectMeet={handleSelectMeet} />;
      
      case 'configure':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--color-text-post)]">
                Configure Meet: {selectedMeet?.name}
              </h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
              >
                Back to Meet Selection
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Events Configuration */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                  <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)] flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
                    <h3 className="font-medium text-[var(--color-text-post)]">Events</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {selectedMeet?.events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-background-post)]"
                        >
                          <div className="flex items-center">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] mr-3">
                              {event.order}
                            </div>
                            <div>
                              <div className="font-medium text-[var(--color-text-post)]">{event.name}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={event.isSelected}
                                className="sr-only peer"
                                onChange={() => {
                                  // Logic to toggle event selection
                                  if (selectedMeet) {
                                    const updatedEvents = selectedMeet.events.map(e => 
                                      e.id === event.id ? { ...e, isSelected: !e.isSelected } : e
                                    );
                                    setSelectedMeet({ ...selectedMeet, events: updatedEvents });
                                  }
                                }}
                              />
                              <div className="w-11 h-6 bg-[var(--color-background-post)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-post)]"></div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Event Combinations */}
                {selectedMeet?.settings.eventCombinations && selectedMeet.settings.eventCombinations.length > 0 && (
                  <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                    <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)] flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
                      <h3 className="font-medium text-[var(--color-text-post)]">Event Combinations</h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        {selectedMeet.settings.eventCombinations.map((combination, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-background-post)]"
                          >
                            <h4 className="text-sm font-medium text-[var(--color-muted-post)] mb-2">Combination {index + 1}</h4>
                            <div className="flex flex-wrap gap-2">
                              {combination.map(eventId => {
                                const event = selectedMeet.events.find(e => e.id === eventId);
                                return event ? (
                                  <span
                                    key={eventId}
                                    className="inline-flex rounded-full bg-[var(--color-accent-post)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-accent-post)]"
                                  >
                                    {event.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings Panel */}
              <div className="space-y-6">
                <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                  <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)] flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
                    <h3 className="font-medium text-[var(--color-text-post)]">Meet Settings</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="ai-announcing"
                          type="checkbox"
                          checked={selectedMeet?.settings.useAIAnnouncing}
                          onChange={() => {
                            if (selectedMeet) {
                              setSelectedMeet({
                                ...selectedMeet,
                                settings: {
                                  ...selectedMeet.settings,
                                  useAIAnnouncing: !selectedMeet.settings.useAIAnnouncing
                                }
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="ai-announcing" className="font-medium text-[var(--color-text-post)]">
                          AI Meet Announcing
                        </label>
                        <p className="text-sm text-[var(--color-muted-post)]">
                          Automatically announce divers, dives, and scores
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remote-judging"
                          type="checkbox"
                          checked={selectedMeet?.settings.remoteJudging}
                          onChange={() => {
                            if (selectedMeet) {
                              setSelectedMeet({
                                ...selectedMeet,
                                settings: {
                                  ...selectedMeet.settings,
                                  remoteJudging: !selectedMeet.settings.remoteJudging
                                }
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="remote-judging" className="font-medium text-[var(--color-text-post)]">
                          Remote Judging
                        </label>
                        <p className="text-sm text-[var(--color-muted-post)]">
                          Judges use their own devices for scoring
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="auto-advance"
                          type="checkbox"
                          checked={selectedMeet?.settings.autoAdvance}
                          onChange={() => {
                            if (selectedMeet) {
                              setSelectedMeet({
                                ...selectedMeet,
                                settings: {
                                  ...selectedMeet.settings,
                                  autoAdvance: !selectedMeet.settings.autoAdvance
                                }
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-accent-post)]"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="auto-advance" className="font-medium text-[var(--color-text-post)]">
                          Auto-advance Divers
                        </label>
                        <p className="text-sm text-[var(--color-muted-post)]">
                          Automatically advance to the next diver after scoring
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Summary */}
                <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
                  <div className="bg-[var(--color-background-post)] p-4 border-b border-[var(--color-border-post)] flex items-center">
                    <Award className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
                    <h3 className="font-medium text-[var(--color-text-post)]">Meet Summary</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)]">Judges</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {Array.isArray(selectedMeet?.judges)
                          ? selectedMeet?.judges.length
                          : selectedMeet?.judges.count} judge{(Array.isArray(selectedMeet?.judges)
                              ? selectedMeet?.judges.length !== 1
                              : selectedMeet?.judges.count !== 1) ? 's' : ''}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)]">Participants</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {selectedMeet?.participants.length} diver{selectedMeet?.participants.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)]">Selected Events</div>
                      <div className="font-medium text-[var(--color-text-post)]">
                        {selectedMeet?.events.filter(e => e.isSelected).length} of {selectedMeet?.events.length}
                      </div>
                    </div>
                    
                    {selectedMeet?.settings.liveScoring && selectedMeet.settings.liveUrl && (
                      <div>
                        <div className="text-sm text-[var(--color-muted-post)]">Live Scoring URL</div>
                        <div className="font-medium text-[var(--color-accent-post)] truncate">
                          {selectedMeet.settings.liveUrl}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Start Meet Button */}
                <button
                  onClick={() => setPhase('run')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent2-post)] px-4 py-3 text-white hover:bg-[var(--color-accent2-post)]/90 transition"
                >
                  <Play className="h-5 w-5" />
                  <span className="font-medium">Start Meet</span>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'run':
        // Placeholder for the actual meet runner interface
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--color-text-post)]">
                Running Meet: {selectedMeet?.name}
              </h2>
              <div className="space-x-4">
                <button
                  onClick={() => setPhase('configure')}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
                >
                  Back to Configuration
                </button>
                <button
                  onClick={() => setPhase('results')}
                  className="px-4 py-2 rounded-lg bg-[var(--color-accent-post)] text-white hover:bg-[var(--color-accent-post)]/90 transition-colors"
                >
                  View Results
                </button>
              </div>
            </div>
            
            <div className="p-8 text-center border border-dashed border-[var(--color-border-post)] rounded-xl">
              <Play className="h-12 w-12 mx-auto text-[var(--color-accent-post)]" />
              <h3 className="mt-4 text-xl font-medium text-[var(--color-text-post)]">Meet Runner Interface</h3>
              <p className="mt-2 text-[var(--color-muted-post)]">
                This is a placeholder for the Meet Runner Interface. <br />
                It will include dive scoring, announcements, and real-time results.
              </p>
            </div>
          </div>
        );
      
      case 'results':
        // Placeholder for the results interface
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--color-text-post)]">
                Meet Results: {selectedMeet?.name}
              </h2>
              <button
                onClick={() => setPhase('run')}
                className="px-4 py-2 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
              >
                Back to Meet Runner
              </button>
            </div>
            
            <div className="p-8 text-center border border-dashed border-[var(--color-border-post)] rounded-xl">
              <Award className="h-12 w-12 mx-auto text-[var(--color-accent-post)]" />
              <h3 className="mt-4 text-xl font-medium text-[var(--color-text-post)]">Meet Results Interface</h3>
              <p className="mt-2 text-[var(--color-muted-post)]">
                This is a placeholder for the Meet Results Interface. <br />
                It will display final standings, individual scores, and provide options for exporting results.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-post)]">
            Meet Runner
          </h1>
          <p className="mt-1 text-lg text-[var(--color-muted-post)]">
            Configure and manage your diving meets
          </p>
        </div>
        
        {renderPhase()}
      </div>
    </DashboardLayout>
  );
}