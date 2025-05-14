import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { SeasonCycle, SeasonMeet, Season } from '@/types';

interface SeasonTimelineProps {
  season: Season;
}

export function SeasonTimeline({ season }: SeasonTimelineProps) {
  const [currentCycle, setCurrentCycle] = useState<SeasonCycle | null>(null);
  
  // Fetch season cycles
  const { 
    data: cycles = [],
    isLoading: cyclesLoading,
  } = useQuery<SeasonCycle[]>({
    queryKey: ['/api/seasons', season.id, 'cycles'],
    queryFn: getQueryFn(`/api/seasons/${season.id}/cycles`),
  });
  
  // Fetch season meets
  const { 
    data: meets = [],
    isLoading: meetsLoading,
  } = useQuery<SeasonMeet[]>({
    queryKey: ['/api/seasons', season.id, 'meets'],
    queryFn: getQueryFn(`/api/seasons/${season.id}/meets`),
  });

  // Determine the current cycle based on the current date
  useEffect(() => {
    if (cycles.length > 0) {
      const now = new Date();
      const currentCycle = cycles.find(cycle => {
        const startDate = new Date(cycle.startDate);
        const endDate = new Date(cycle.endDate);
        return isWithinInterval(now, { start: startDate, end: endDate });
      });
      
      setCurrentCycle(currentCycle || null);
    }
  }, [cycles]);

  if (cyclesLoading || meetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (cycles.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--color-muted-post)]">No season cycles defined yet.</p>
      </div>
    );
  }

  // Sort cycles by start date
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Filter out meets without dates and sort by date
  const validMeets = meets.filter(meet => meet.meet && meet.meet.date);
  const sortedMeets = [...validMeets].sort((a, b) => 
    new Date(a.meet.date).getTime() - new Date(b.meet.date).getTime()
  );

  // Helper function to get cycle color
  const getCycleColor = (type: string) => {
    switch (type) {
      case 'preseason':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'regular':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'postseason':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'offseason':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  // Calculate the total timeline width based on first and last cycle
  const startDate = new Date(sortedCycles[0].startDate);
  const endDate = new Date(sortedCycles[sortedCycles.length - 1].endDate);
  const totalDuration = endDate.getTime() - startDate.getTime();

  return (
    <div className="space-y-8">
      {/* Current cycle indicator */}
      {currentCycle && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 capitalize">
            Current Phase: {currentCycle.type}
          </h3>
          <p className="text-green-600">
            {format(new Date(currentCycle.startDate), "MMMM d, yyyy")} to {format(new Date(currentCycle.endDate), "MMMM d, yyyy")}
          </p>
        </div>
      )}

      {/* Season timeline */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-4">Season Timeline</h3>
        
        <div className="relative pb-12 overflow-x-auto">
          {/* Timeline track */}
          <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 rounded"></div>
          
          {/* Cycle segments */}
          <div className="relative min-w-[800px]">
            {sortedCycles.map((cycle, index) => {
              const cycleStart = new Date(cycle.startDate);
              const cycleEnd = new Date(cycle.endDate);
              const cycleDuration = cycleEnd.getTime() - cycleStart.getTime();
              const cycleWidth = (cycleDuration / totalDuration) * 100;
              const cycleOffset = ((cycleStart.getTime() - startDate.getTime()) / totalDuration) * 100;
              
              return (
                <div 
                  key={index}
                  className={`absolute h-2 rounded ${getCycleColor(cycle.type).split(' ')[0]}`}
                  style={{
                    top: '2rem',
                    left: `${cycleOffset}%`,
                    width: `${cycleWidth}%`,
                  }}
                >
                  <div 
                    className={`absolute -top-8 ${index % 2 === 0 ? '' : 'translate-y-16'} transform -translate-x-1/2 px-2 py-1 rounded border ${getCycleColor(cycle.type)}`}
                    style={{ left: '50%' }}
                  >
                    <span className="text-xs font-medium capitalize whitespace-nowrap">{cycle.type}</span>
                  </div>
                  
                  <div 
                    className="absolute top-4 transform -translate-x-1/2 text-xs text-gray-500"
                    style={{ left: '0%' }}
                  >
                    {format(cycleStart, "MMM d")}
                  </div>
                  
                  {index === sortedCycles.length - 1 && (
                    <div 
                      className="absolute top-4 transform -translate-x-1/2 text-xs text-gray-500"
                      style={{ left: '100%' }}
                    >
                      {format(cycleEnd, "MMM d")}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Meet markers */}
            {sortedMeets.map((seasonMeet, index) => {
              // Skip if meet data is incomplete
              if (!seasonMeet.meet || !seasonMeet.meet.date) return null;
              
              const meetDate = new Date(seasonMeet.meet.date);
              const meetOffset = ((meetDate.getTime() - startDate.getTime()) / totalDuration) * 100;
              
              // Skip if meet is outside our timeline
              if (meetOffset < 0 || meetOffset > 100) return null;
              
              return (
                <div 
                  key={`meet-${index}`}
                  className="absolute transform -translate-x-1/2"
                  style={{
                    top: '1.75rem',
                    left: `${meetOffset}%`,
                  }}
                >
                  <div className={`h-3 w-3 rounded-full bg-[var(--color-accent2-post)] border-2 border-white`}></div>
                  <div 
                    className={`absolute ${index % 3 === 0 ? '-top-16' : index % 3 === 1 ? 'top-6' : 'top-12'} transform -translate-x-1/2 px-2 py-1 rounded bg-white shadow-sm border border-gray-200 z-10`}
                    style={{ left: '50%' }}
                  >
                    <div className="text-xs font-medium whitespace-nowrap">{seasonMeet.opponent}</div>
                    <div className="text-[10px] text-gray-500 whitespace-nowrap">
                      {format(meetDate, "MMM d")} • {seasonMeet.isHome ? 'Home' : 'Away'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Upcoming meets */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Upcoming Meets</h3>
        
        {sortedMeets.length === 0 ? (
          <p className="text-[var(--color-muted-post)]">No meets scheduled yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMeets.slice(0, 3).map((seasonMeet, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">vs {seasonMeet.opponent}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${seasonMeet.isHome ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {seasonMeet.isHome ? 'Home' : 'Away'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {format(new Date(seasonMeet.meet.date), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-600">
                  {seasonMeet.startTime ? `Start time: ${seasonMeet.startTime}` : 'Time TBD'}
                </p>
                <p className="text-xs mt-2 capitalize text-gray-500">
                  {seasonMeet.cycleType}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}