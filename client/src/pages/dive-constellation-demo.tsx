import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DiveProgressConstellation } from '@/components/dive/DiveProgressConstellation';
import { ArrowLeft, ArrowRight, Video, Mic, FileText, Star, MessageSquare } from 'lucide-react';

// Sample dive data
const initialDives = [
  {
    id: 'dive-1',
    number: '101C',
    name: 'Forward Dive, Tuck',
    difficulty: 1.2,
    isCompleted: true,
    score: 8.5,
    recentlyCompleted: false
  },
  {
    id: 'dive-2',
    number: '201C',
    name: 'Back Dive, Tuck',
    difficulty: 1.5,
    isCompleted: true,
    score: 7.0,
    recentlyCompleted: false
  },
  {
    id: 'dive-3',
    number: '301C',
    name: 'Reverse Dive, Tuck',
    difficulty: 1.6,
    isCompleted: true,
    score: 7.5,
    recentlyCompleted: true
  },
  {
    id: 'dive-4',
    number: '401C',
    name: 'Inward Dive, Tuck',
    difficulty: 1.7,
    isCompleted: false,
    score: 0,
    recentlyCompleted: false
  },
  {
    id: 'dive-5',
    number: '5132D',
    name: 'Forward 1½ Somersaults with 1 Twist, Free',
    difficulty: 2.2,
    isCompleted: false,
    score: 0,
    recentlyCompleted: false
  },
  {
    id: 'dive-6',
    number: '203B',
    name: 'Back 1½ Somersaults, Pike',
    difficulty: 2.3,
    isCompleted: false,
    score: 0,
    recentlyCompleted: false
  },
  {
    id: 'dive-7',
    number: '403C',
    name: 'Inward 1½ Somersaults, Tuck',
    difficulty: 2.4,
    isCompleted: false,
    score: 0,
    recentlyCompleted: false
  },
  {
    id: 'dive-8',
    number: '105B',
    name: 'Forward 2½ Somersaults, Pike',
    difficulty: 2.6,
    isCompleted: false,
    score: 0,
    recentlyCompleted: false
  }
];

export default function DiveConstellationDemo() {
  const [dives, setDives] = useState(initialDives);
  const [selectedDive, setSelectedDive] = useState(dives[0]);
  const [feedback, setFeedback] = useState<Record<string, string>>({
    'dive-1': 'Good extension on entry. Work on tighter tuck position.',
    'dive-2': 'Needs more height. Watch your head position on takeoff.',
    'dive-3': 'Much improved from last practice. Good vertical entry.'
  });
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(true);

  // Function to handle dive click in constellation
  const handleDiveClick = (dive: any) => {
    setSelectedDive(dive);
    setShowFeedbackPanel(true);
  };

  // Function to handle completing the next dive
  const completeDive = () => {
    const firstUncompletedIndex = dives.findIndex(dive => !dive.isCompleted);
    if (firstUncompletedIndex !== -1) {
      const updatedDives = [...dives];
      
      // Mark previously recent as not recent
      updatedDives.forEach(dive => {
        if (dive.recentlyCompleted) {
          dive.recentlyCompleted = false;
        }
      });
      
      // Complete the first uncompleted dive with a random score
      updatedDives[firstUncompletedIndex] = {
        ...updatedDives[firstUncompletedIndex],
        isCompleted: true,
        recentlyCompleted: true,
        score: Math.floor(Math.random() * 30 + 55) / 10 // Random score between 5.5 and 8.5
      };
      
      setDives(updatedDives);
      setSelectedDive(updatedDives[firstUncompletedIndex]);
    }
  };

  // Function to reset all dives
  const resetDives = () => {
    setDives(initialDives);
    setSelectedDive(initialDives[0]);
  };

  // Function to add feedback for a dive
  const addFeedback = (diveId: string, text: string) => {
    setFeedback(prev => ({
      ...prev,
      [diveId]: text
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-post)]">
            Dive Progress Constellation
          </h1>
          <p className="mt-2 text-lg text-[var(--color-muted-post)]">
            Interactive visualization of dive progression and performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main constellation visualization */}
          <div className="lg:col-span-2 rounded-xl bg-[var(--color-card-post)] p-2 shadow-md">
            <DiveProgressConstellation 
              dives={dives} 
              width={800} 
              height={500} 
              animate={true}
              onDiveClick={handleDiveClick} 
            />
            
            {/* Controls for demo */}
            <div className="flex justify-between mt-4 px-4">
              <button
                onClick={resetDives}
                className="px-4 py-2 rounded-md bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
              >
                Reset All
              </button>
              
              <button
                onClick={completeDive}
                className="px-4 py-2 rounded-md bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors flex items-center"
                disabled={dives.every(dive => dive.isCompleted)}
              >
                <Star className="h-4 w-4 mr-2" />
                Complete Next Dive
              </button>
            </div>
          </div>
          
          {/* Dive details and feedback panel */}
          <div className="lg:col-span-1">
            {showFeedbackPanel && selectedDive && (
              <div className="space-y-6">
                {/* Dive Details Card */}
                <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[var(--color-text-post)] mb-4">
                    Dive Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)]">Dive Number</div>
                      <div className="text-2xl font-bold text-[var(--color-text-post)] flex items-center">
                        {selectedDive.number}
                        <span className="ml-2 text-sm font-normal bg-[var(--color-background-post)] px-2 py-1 rounded text-[var(--color-accent-post)]">
                          DD: {selectedDive.difficulty.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-[var(--color-muted-post)]">Name</div>
                      <div className="text-lg font-medium text-[var(--color-text-post)]">
                        {selectedDive.name}
                      </div>
                    </div>
                    
                    {selectedDive.isCompleted && (
                      <div>
                        <div className="text-sm text-[var(--color-muted-post)]">Score</div>
                        <div className="text-2xl font-bold text-[var(--color-accent2-post)]">
                          {selectedDive.score.toFixed(1)}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-[var(--color-border-post)] flex justify-between">
                      <button className="flex items-center text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button className="flex items-center text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors">
                        Next
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Coach Feedback & Media Section */}
                <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[var(--color-text-post)] mb-4">
                    Coach Feedback
                  </h2>
                  
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <button className="flex flex-col items-center justify-center p-3 rounded-md bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-accent-post)] transition-colors">
                      <Video className="h-5 w-5 mb-1" />
                      <span className="text-xs">Video</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 rounded-md bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-accent-post)] transition-colors">
                      <Mic className="h-5 w-5 mb-1" />
                      <span className="text-xs">Voice</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 rounded-md bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-accent-post)] transition-colors">
                      <FileText className="h-5 w-5 mb-1" />
                      <span className="text-xs">Notes</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 rounded-md bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-accent-post)] transition-colors">
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span className="text-xs">Chat</span>
                    </button>
                  </div>
                  
                  {feedback[selectedDive.id] ? (
                    <>
                      <div className="text-sm text-[var(--color-muted-post)] mb-2">
                        Text Feedback
                      </div>
                      <div className="p-4 rounded-md bg-[var(--color-background-post)] text-[var(--color-text-post)]">
                        {feedback[selectedDive.id]}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-[var(--color-muted-post)]">
                      {selectedDive.isCompleted ? 
                        'No feedback recorded yet.' : 
                        'Feedback will be available after the dive is completed.'}
                    </div>
                  )}
                  
                  {selectedDive.isCompleted && (
                    <div className="mt-4">
                      <textarea
                        placeholder="Add your feedback here..."
                        className="w-full p-3 rounded-md bg-[var(--color-background-post)] border border-[var(--color-border-post)] text-[var(--color-text-post)] placeholder:text-[var(--color-muted-post)]"
                        rows={3}
                        value={feedback[selectedDive.id] || ''}
                        onChange={(e) => addFeedback(selectedDive.id, e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          className="px-3 py-1.5 text-sm rounded-md bg-[var(--color-accent-post)] text-white hover:bg-[var(--color-accent-post)]/90 transition-colors"
                          onClick={() => addFeedback(selectedDive.id, feedback[selectedDive.id] || 'Great improvement! Keep working on your technique.')}
                        >
                          Save Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}