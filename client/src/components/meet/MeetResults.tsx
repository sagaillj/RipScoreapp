import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Medal, 
  Mail, 
  FileText, 
  BarChart2, 
  Download, 
  Share2, 
  Printer,
  Award,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { MeetData } from '@/pages/coach/meet-runner';

interface MeetResultsProps {
  meet: MeetData;
  onPrevious: () => void;
  onDone: () => void;
}

interface EventResults {
  eventId: string;
  eventName: string;
  results: DiverResult[];
}

interface DiverResult {
  diverId: string;
  diverName: string;
  team: string;
  totalScore: number;
  diveScores: {
    diveId: string;
    diveNumber: string;
    diveName: string;
    difficulty: number;
    scores: number[];
    total: number;
  }[];
}

// Mock results data for prototype
const mockResults: EventResults[] = [
  {
    eventId: '1',
    eventName: 'Boys 1m Springboard',
    results: [
      {
        diverId: 'diver-1-2',
        diverName: 'Michael Chen',
        team: 'Westside Prep',
        totalScore: 184.5,
        diveScores: [
          {
            diveId: 'dive-1',
            diveNumber: '103B',
            diveName: 'Forward 1½ Somersaults, Pike',
            difficulty: 1.5,
            scores: [7.0, 7.5, 7.0],
            total: 32.25
          },
          {
            diveId: 'dive-2',
            diveNumber: '203B',
            diveName: 'Back 1½ Somersaults, Pike',
            difficulty: 1.6,
            scores: [8.0, 7.5, 8.0],
            total: 37.6
          },
          {
            diveId: 'dive-3',
            diveNumber: '303B',
            diveName: 'Reverse 1½ Somersaults, Pike',
            difficulty: 1.7,
            scores: [6.5, 7.0, 6.5],
            total: 34.0
          },
        ]
      },
      {
        diverId: 'diver-1-1',
        diverName: 'Emma Johnson',
        team: 'Central High School',
        totalScore: 172.8,
        diveScores: [
          {
            diveId: 'dive-1',
            diveNumber: '101C',
            diveName: 'Forward Dive, Tuck',
            difficulty: 1.2,
            scores: [8.0, 8.0, 7.5],
            total: 28.8
          },
          {
            diveId: 'dive-2',
            diveNumber: '201C',
            diveName: 'Back Dive, Tuck',
            difficulty: 1.5,
            scores: [7.0, 7.5, 7.0],
            total: 32.25
          },
          {
            diveId: 'dive-3',
            diveNumber: '301C',
            diveName: 'Reverse Dive, Tuck',
            difficulty: 1.6,
            scores: [7.5, 7.0, 7.5],
            total: 35.2
          },
        ]
      },
      {
        diverId: 'diver-1-3',
        diverName: 'Sophia Rodriguez',
        team: 'Oak Ridge Academy',
        totalScore: 163.2,
        diveScores: [
          {
            diveId: 'dive-1',
            diveNumber: '105C',
            diveName: 'Forward 2½ Somersaults, Tuck',
            difficulty: 2.2,
            scores: [6.5, 6.0, 6.5],
            total: 42.9
          },
          {
            diveId: 'dive-2',
            diveNumber: '205C',
            diveName: 'Back 2½ Somersaults, Tuck',
            difficulty: 2.3,
            scores: [5.5, 5.0, 5.5],
            total: 36.8
          },
          {
            diveId: 'dive-3',
            diveNumber: '305C',
            diveName: 'Reverse 2½ Somersaults, Tuck',
            difficulty: 2.4,
            scores: [5.0, 5.0, 4.5],
            total: 34.8
          },
        ]
      },
    ]
  },
  {
    eventId: '2',
    eventName: 'Girls 1m Springboard',
    results: [
      {
        diverId: 'diver-2-1',
        diverName: 'Olivia Wilson',
        team: 'Central High School',
        totalScore: 189.6,
        diveScores: [
          {
            diveId: 'dive-1',
            diveNumber: '101B',
            diveName: 'Forward Dive, Pike',
            difficulty: 1.3,
            scores: [8.5, 8.0, 8.5],
            total: 32.5
          },
          {
            diveId: 'dive-2',
            diveNumber: '201B',
            diveName: 'Back Dive, Pike',
            difficulty: 1.6,
            scores: [8.0, 8.0, 7.5],
            total: 37.6
          },
          {
            diveId: 'dive-3',
            diveNumber: '301B',
            diveName: 'Reverse Dive, Pike',
            difficulty: 1.7,
            scores: [7.5, 7.0, 7.5],
            total: 37.4
          },
        ]
      },
      {
        diverId: 'diver-2-2',
        diverName: 'Hannah Kim',
        team: 'Westside Prep',
        totalScore: 180.0,
        diveScores: [
          {
            diveId: 'dive-1',
            diveNumber: '103C',
            diveName: 'Forward 1½ Somersaults, Tuck',
            difficulty: 1.4,
            scores: [7.5, 7.0, 7.5],
            total: 30.8
          },
          {
            diveId: 'dive-2',
            diveNumber: '203C',
            diveName: 'Back 1½ Somersaults, Tuck',
            difficulty: 1.5,
            scores: [7.0, 7.5, 7.0],
            total: 32.25
          },
          {
            diveId: 'dive-3',
            diveNumber: '303C',
            diveName: 'Reverse 1½ Somersaults, Tuck',
            difficulty: 1.6,
            scores: [7.5, 7.0, 7.0],
            total: 34.4
          },
        ]
      },
    ]
  }
];

export function MeetResults({ meet, onPrevious, onDone }: MeetResultsProps) {
  const [selectedEventId, setSelectedEventId] = useState(mockResults[0]?.eventId || '');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  
  // Get the selected event results
  const selectedEvent = mockResults.find(event => event.eventId === selectedEventId);
  
  // Function to publish results
  const publishResults = () => {
    setIsPublishing(true);
    // Simulate publishing process
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
    }, 2000);
  };
  
  // Team standings
  const teamStandings = mockResults.reduce((standings, event) => {
    event.results.forEach(result => {
      if (!standings[result.team]) {
        standings[result.team] = 0;
      }
      
      // Add points based on placement (1st = 9, 2nd = 7, 3rd = 6, etc.)
      const placement = event.results.findIndex(r => r.diverId === result.diverId);
      const points = placement === 0 ? 9 : placement === 1 ? 7 : placement === 2 ? 6 : 
                    placement === 3 ? 5 : placement === 4 ? 4 : placement === 5 ? 3 : 
                    placement === 6 ? 2 : placement === 7 ? 1 : 0;
      
      standings[result.team] += points;
    });
    
    return standings;
  }, {} as Record<string, number>);
  
  // Sort team standings
  const sortedTeamStandings = Object.entries(teamStandings)
    .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
    .map(([team, points]) => ({ team, points }));

  return (
    <div className="space-y-8">
      <button
        onClick={onPrevious}
        className="flex items-center text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meet Runner
      </button>
      
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-post)]">
          Meet Results: {meet.name}
        </h2>
        <p className="mt-2 text-[var(--color-muted-post)]">
          Review and publish the results of the completed meet.
        </p>
      </div>
      
      {/* Final Meet Status */}
      <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-post)]">
            Meet Status
          </h3>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPublished 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {isPublished ? 'Published' : 'Ready to Publish'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-md bg-[var(--color-background-post)] p-4">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
              <span className="font-medium text-[var(--color-text-post)]">Events</span>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text-post)]">
              {mockResults.length}
            </div>
            <div className="text-xs text-[var(--color-muted-post)] mt-1">
              All events completed
            </div>
          </div>
          
          <div className="rounded-md bg-[var(--color-background-post)] p-4">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
              <span className="font-medium text-[var(--color-text-post)]">Participants</span>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text-post)]">
              {mockResults.reduce((count, event) => count + event.results.length, 0)}
            </div>
            <div className="text-xs text-[var(--color-muted-post)] mt-1">
              From {Object.keys(teamStandings).length} teams
            </div>
          </div>
          
          <div className="rounded-md bg-[var(--color-background-post)] p-4">
            <div className="flex items-center mb-2">
              <Medal className="h-5 w-5 mr-2 text-[var(--color-accent2-post)]" />
              <span className="font-medium text-[var(--color-text-post)]">Top Team</span>
            </div>
            <div className="text-lg font-bold text-[var(--color-text-post)] truncate">
              {sortedTeamStandings[0]?.team || 'N/A'}
            </div>
            <div className="text-xs text-[var(--color-muted-post)] mt-1">
              {sortedTeamStandings[0]?.points || 0} points
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <button 
            onClick={() => setSignatureModalOpen(true)}
            className="flex items-center px-4 py-2 rounded-md bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/20 transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" />
            Referee Sign-off
          </button>
          
          <button className="flex items-center px-4 py-2 rounded-md bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/20 transition-colors">
            <Mail className="mr-2 h-4 w-4" />
            Email Results
          </button>
          
          <button className="flex items-center px-4 py-2 rounded-md bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/20 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </button>
          
          <button className="flex items-center px-4 py-2 rounded-md bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/20 transition-colors">
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </button>
          
          <button className="flex items-center px-4 py-2 rounded-md bg-[var(--color-background-post)] text-[var(--color-text-post)] hover:bg-[var(--color-border-post)]/20 transition-colors">
            <Printer className="mr-2 h-4 w-4" />
            Print Results
          </button>
        </div>
      </div>
      
      {/* Team Standings */}
      <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
          Team Standings
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-post)]">
                <th className="pb-3 font-medium text-[var(--color-muted-post)]">Rank</th>
                <th className="pb-3 font-medium text-[var(--color-muted-post)]">Team</th>
                <th className="pb-3 font-medium text-[var(--color-muted-post)] text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeamStandings.map((team, index) => (
                <tr 
                  key={team.team}
                  className="border-b border-[var(--color-border-post)]/50 last:border-0"
                >
                  <td className="py-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      index === 0 
                        ? 'bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)]' 
                        : index === 1
                          ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                          : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)]'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 font-medium text-[var(--color-text-post)]">{team.team}</td>
                  <td className="py-3 text-right font-bold text-[var(--color-text-post)]">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Event Results */}
      <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-post)] mb-4">
          Event Results
        </h3>
        
        {/* Event tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {mockResults.map(event => (
            <button
              key={event.eventId}
              onClick={() => setSelectedEventId(event.eventId)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                selectedEventId === event.eventId
                  ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                  : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]'
              }`}
            >
              {event.eventName}
            </button>
          ))}
        </div>
        
        {selectedEvent ? (
          <div>
            {/* Event standings */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-post)]">
                    <th className="pb-3 font-medium text-[var(--color-muted-post)]">Place</th>
                    <th className="pb-3 font-medium text-[var(--color-muted-post)]">Diver</th>
                    <th className="pb-3 font-medium text-[var(--color-muted-post)]">Team</th>
                    <th className="pb-3 font-medium text-[var(--color-muted-post)] text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEvent.results.map((result, index) => (
                    <tr 
                      key={result.diverId}
                      className="border-b border-[var(--color-border-post)]/50 last:border-0"
                    >
                      <td className="py-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                          index === 0 
                            ? 'bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)]' 
                            : index === 1
                              ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                              : 'bg-[var(--color-background-post)] text-[var(--color-muted-post)]'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-[var(--color-text-post)]">{result.diverName}</td>
                      <td className="py-3 text-[var(--color-muted-post)]">{result.team}</td>
                      <td className="py-3 text-right font-bold text-[var(--color-text-post)]">{result.totalScore.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Detailed dive scores for selected diver */}
            <div className="mt-8">
              <h4 className="font-medium text-[var(--color-text-post)] mb-3">
                Individual Dive Scores
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedEvent.results[0].diveScores.map((dive) => (
                  <div 
                    key={dive.diveId}
                    className="rounded-md bg-[var(--color-background-post)] p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-[var(--color-text-post)]">
                        {dive.diveNumber}
                      </div>
                      <div className="px-2 py-0.5 rounded-md bg-[var(--color-background-post)]/80 text-[var(--color-muted-post)] text-xs">
                        DD: {dive.difficulty.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--color-muted-post)] mt-1">
                      {dive.diveName}
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--color-muted-post)]">Scores</span>
                        <span className="font-medium text-[var(--color-text-post)]">
                          {dive.scores.join(' - ')}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--color-muted-post)]">Total</span>
                        <span className="font-bold text-[var(--color-text-post)]">
                          {dive.total.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-[var(--color-muted-post)]">
            No event selected
          </div>
        )}
      </div>
      
      {/* Meet Analytics */}
      <div className="rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-post)]">
            Meet Analytics
          </h3>
          
          <button className="text-sm text-[var(--color-accent-post)] hover:underline">
            View Detailed Analytics
          </button>
        </div>
        
        <div className="text-center py-8 flex flex-col items-center">
          <BarChart2 className="h-12 w-12 text-[var(--color-muted-post)]" />
          <p className="mt-4 text-[var(--color-muted-post)]">
            Detailed analytics will be available here
          </p>
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
        
        {isPublished ? (
          <button
            onClick={onDone}
            className="flex items-center px-6 py-2 rounded-md bg-[var(--color-accent-post)] text-white hover:bg-[var(--color-accent-post)]/90 transition-colors"
          >
            Done
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={publishResults}
            disabled={isPublishing}
            className={`flex items-center px-6 py-2 rounded-md ${
              isPublishing 
                ? 'bg-[var(--color-accent2-post)]/50 text-white cursor-not-allowed'
                : 'bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors'
            }`}
          >
            {isPublishing ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Publishing...
              </>
            ) : (
              <>
                Publish Results
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Sign-off Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-[var(--color-card-post)] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[var(--color-text-post)]">Referee Sign-off</h2>
            <p className="mt-2 text-[var(--color-muted-post)]">
              Please enter the referee's name to officially sign off on meet results.
            </p>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-[var(--color-muted-post)]">
                Referee Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-[var(--color-border-post)] bg-[var(--color-background-post)] px-3 py-2 text-[var(--color-text-post)]"
                placeholder="Enter referee name"
              />
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSignatureModalOpen(false)}
                className="px-4 py-2 text-[var(--color-muted-post)] hover:text-[var(--color-text-post)] transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={() => setSignatureModalOpen(false)}
                className="px-4 py-2 rounded-md bg-[var(--color-accent2-post)] text-white hover:bg-[var(--color-accent2-post)]/90 transition-colors"
              >
                Sign and Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}