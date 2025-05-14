import { useState } from 'react';
import { PlusCircle, MinusCircle, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Mic, Users, FastForward, ChevronUp, ChevronDown } from 'lucide-react';
import { MeetData, MeetSettings as MeetSettingsType, MeetEvent } from '@/pages/coach/meet-runner';
import { Checkbox } from '@/components/ui/checkbox';

interface MeetSettingsProps {
  meet: MeetData;
  onPrevious: () => void;
  onNext: (settings: MeetSettingsType) => void;
}

export function MeetSettings({ meet, onPrevious, onNext }: MeetSettingsProps) {
  const [selectedEvents, setSelectedEvents] = useState<MeetEvent[]>(
    meet.events.filter(event => event.isSelected)
  );
  
  const [settings, setSettings] = useState<MeetSettingsType>({
    ...meet.settings
  });
  
  const [eventCombinations, setEventCombinations] = useState<string[][]>(
    meet.settings.eventCombinations.length > 0 
      ? meet.settings.eventCombinations 
      : [[]]
  );
  
  // Function to toggle event selection
  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => {
      const isSelected = prev.some(e => e.id === eventId);
      
      if (isSelected) {
        return prev.filter(e => e.id !== eventId);
      } else {
        const event = meet.events.find(e => e.id === eventId);
        if (event) {
          return [...prev, event];
        }
      }
      
      return prev;
    });
  };
  
  // Function to handle setting changes
  const handleSettingChange = (key: keyof MeetSettingsType, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Function to add combination
  const addCombination = () => {
    setEventCombinations(prev => [...prev, []]);
  };
  
  // Function to remove combination
  const removeCombination = (index: number) => {
    setEventCombinations(prev => prev.filter((_, i) => i !== index));
  };
  
  // Function to toggle event in combination
  const toggleEventInCombination = (combinationIndex: number, eventId: string) => {
    setEventCombinations(prev => {
      const newCombinations = [...prev];
      const combination = [...newCombinations[combinationIndex]];
      
      const eventIndex = combination.indexOf(eventId);
      if (eventIndex === -1) {
        combination.push(eventId);
      } else {
        combination.splice(eventIndex, 1);
      }
      
      newCombinations[combinationIndex] = combination;
      return newCombinations;
    });
  };
  
  // Function to handle form submission
  const handleSubmit = () => {
    const updatedSettings: MeetSettingsType = {
      ...settings,
      eventCombinations
    };
    
    onNext(updatedSettings);
  };

  return (
    <div className="space-y-8">
      <button
        onClick={onPrevious}
        className="flex items-center text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meet Selection
      </button>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-post)]">
          Meet Settings: {meet.name}
        </h2>
        
        {/* Event Selection */}
        <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
            Events
          </h3>
          
          <div className="space-y-4">
            {meet.events.map((event) => (
              <div 
                key={event.id}
                className="flex items-center"
              >
                <Checkbox 
                  id={`event-${event.id}`}
                  checked={selectedEvents.some(e => e.id === event.id)}
                  onCheckedChange={() => toggleEvent(event.id)}
                  className="mr-3"
                />
                <label 
                  htmlFor={`event-${event.id}`}
                  className="text-[var(--color-text-post)] cursor-pointer"
                >
                  {event.name}
                </label>
              </div>
            ))}
            
            {selectedEvents.length === 0 && (
              <div className="text-center py-4 text-[var(--color-muted-post)]">
                Select at least one event to continue
              </div>
            )}
          </div>
        </div>
        
        {/* Judging Configuration */}
        <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
            Judging Configuration
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Checkbox 
                id="remote-judging"
                checked={settings.remoteJudging}
                onCheckedChange={(checked) => 
                  handleSettingChange('remoteJudging', checked === true)
                }
                className="mr-3"
              />
              <div>
                <label 
                  htmlFor="remote-judging"
                  className="text-[var(--color-text-post)] cursor-pointer font-medium flex items-center"
                >
                  <Users className="mr-2 h-4 w-4 text-[var(--color-accent-post)]" />
                  Enable Remote Judging
                </label>
                <p className="text-sm text-[var(--color-muted-post)] mt-1">
                  Allow judges to score dives from their own devices
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-[var(--color-text-post)] font-medium mb-2">
              Judges for this Meet
            </div>
            
            {meet.judges.length > 0 ? (
              <div className="space-y-2">
                {meet.judges.map((judge) => (
                  <div 
                    key={judge.id}
                    className="flex items-center justify-between p-3 rounded-md bg-[var(--color-background-post)]"
                  >
                    <span>{judge.name}</span>
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
              <div className="flex flex-col items-center justify-center p-6 rounded-md border border-dashed border-[var(--color-border-post)]">
                <Users className="h-10 w-10 text-[var(--color-muted-post)]" />
                <p className="mt-2 text-[var(--color-muted-post)]">
                  No judges added yet
                </p>
                <button className="mt-4 text-sm font-medium text-[var(--color-accent-post)] hover:underline">
                  Add Judges
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Announcing */}
        <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
            AI Announcer Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Checkbox 
                id="ai-announcing"
                checked={settings.useAIAnnouncing}
                onCheckedChange={(checked) => 
                  handleSettingChange('useAIAnnouncing', checked === true)
                }
                className="mr-3"
              />
              <div>
                <label 
                  htmlFor="ai-announcing"
                  className="text-[var(--color-text-post)] cursor-pointer font-medium flex items-center"
                >
                  <Mic className="mr-2 h-4 w-4 text-[var(--color-accent2-post)]" />
                  Use AI Meet Announcing
                </label>
                <p className="text-sm text-[var(--color-muted-post)] mt-1">
                  Automatically announce divers, dives, and scores
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Checkbox 
                id="auto-advance"
                checked={settings.autoAdvance}
                onCheckedChange={(checked) => 
                  handleSettingChange('autoAdvance', checked === true)
                }
                className="mr-3"
              />
              <div>
                <label 
                  htmlFor="auto-advance"
                  className="text-[var(--color-text-post)] cursor-pointer font-medium flex items-center"
                >
                  <FastForward className="mr-2 h-4 w-4 text-[var(--color-accent-post)]" />
                  Auto-Advance to Next Diver
                </label>
                <p className="text-sm text-[var(--color-muted-post)] mt-1">
                  Automatically move to the next diver after scores are entered
                </p>
              </div>
            </div>
          </div>
          
          {settings.useAIAnnouncing && (
            <div className="mt-6 p-4 rounded-md bg-[var(--color-background-post)] border border-[var(--color-border-post)]">
              <div className="text-[var(--color-text-post)] font-medium mb-2 flex items-center">
                <Mic className="mr-2 h-4 w-4" />
                AI Announcer Test
              </div>
              <p className="text-sm text-[var(--color-muted-post)]">
                Test the AI announcer to hear how it will sound during the meet.
              </p>
              <button className="mt-4 text-sm font-medium text-white bg-[var(--color-accent-post)] rounded-md px-3 py-1.5 hover:bg-[var(--color-accent-post)]/90 transition-colors">
                Test Announcer
              </button>
            </div>
          )}
        </div>
        
        {/* Event Order and Combinations */}
        <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
            Event Order & Combinations
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-[var(--color-text-post)] mb-3">Event Order</h4>
              <div className="space-y-2">
                {selectedEvents
                  .sort((a, b) => a.order - b.order)
                  .map((event, index) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between bg-[var(--color-background-post)] rounded-md p-3"
                    >
                      <span className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        {event.name}
                      </span>
                      <div className="flex gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => {/* Implement order change logic */}}
                          className={`p-1 rounded-md ${
                            index === 0
                              ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed'
                              : 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/10'
                          }`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          disabled={index === selectedEvents.length - 1}
                          onClick={() => {/* Implement order change logic */}}
                          className={`p-1 rounded-md ${
                            index === selectedEvents.length - 1
                              ? 'text-[var(--color-muted-post)]/50 cursor-not-allowed'
                              : 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/10'
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[var(--color-text-post)]">Event Combinations</h4>
                <button
                  onClick={addCombination}
                  className="flex items-center text-sm text-[var(--color-accent-post)] hover:text-[var(--color-accent-post)]/90 transition-colors"
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add Combination
                </button>
              </div>
              
              {eventCombinations.length > 0 ? (
                <div className="space-y-4">
                  {eventCombinations.map((combination, index) => (
                    <div
                      key={index}
                      className="border border-[var(--color-border-post)] rounded-md p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-[var(--color-text-post)]">
                          Combination {index + 1}
                        </h5>
                        <button
                          onClick={() => removeCombination(index)}
                          className="text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center"
                          >
                            <Checkbox
                              id={`combo-${index}-event-${event.id}`}
                              checked={combination.includes(event.id)}
                              onCheckedChange={() => 
                                toggleEventInCombination(index, event.id)
                              }
                              className="mr-3"
                            />
                            <label
                              htmlFor={`combo-${index}-event-${event.id}`}
                              className="text-sm text-[var(--color-text-post)] cursor-pointer"
                            >
                              {event.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-sm text-[var(--color-muted-post)]">
                        These events will be run simultaneously
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center border border-dashed border-[var(--color-border-post)] rounded-md p-6">
                  <p className="text-[var(--color-muted-post)]">
                    No event combinations created
                  </p>
                  <button
                    onClick={addCombination}
                    className="mt-3 text-sm text-[var(--color-accent-post)] hover:underline"
                  >
                    Create Combination
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 mt-8 border-t border-[var(--color-border-post)]">
        <button
          onClick={onPrevious}
          className="flex items-center px-4 py-2 text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={selectedEvents.length === 0}
          className={`flex items-center px-6 py-2 rounded-md text-white ${
            selectedEvents.length === 0
              ? 'bg-[var(--color-accent2-post)]/50 cursor-not-allowed'
              : 'bg-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/90 transition-colors'
          }`}
        >
          Next
          <ChevronRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}