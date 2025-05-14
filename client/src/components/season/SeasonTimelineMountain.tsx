import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { SeasonCycle, SeasonMeet, Season } from '@/types';

interface SeasonTimelineProps {
  season: Season;
}

export function SeasonTimelineMountain({ season }: SeasonTimelineProps) {
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
        return '#7CED8F'; // Light green
      case 'regular':
        return '#4FBA65'; // Medium green
      case 'postseason':
        return '#2D8B43'; // Dark green
      case 'offseason':
        return '#A6E9B4'; // Very light green
      default:
        return '#E0F0E3'; // Almost white green
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6 md:mb-10">Season Timeline</h2>
      
      <div className="relative h-80 w-full">
        {/* Mountain Background */}
        <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
          {/* Background color */}
          <rect x="0" y="0" width="1000" height="400" fill="#F9F6F0" />
          
          {/* Mountain range */}
          <g>
            {/* Preseason - small hill */}
            <path 
              d="M0,400 L0,300 Q50,280 100,290 T200,320 T300,300 L300,400 Z" 
              fill={getCycleColor('preseason')}
              stroke="#FFF"
              strokeWidth="2"
            />
            
            {/* Regular Season - medium mountains */}
            <path 
              d="M250,400 L250,280 Q300,220 350,210 T450,180 T550,250 L550,400 Z" 
              fill={getCycleColor('regular')}
              stroke="#FFF"
              strokeWidth="2"
            />
            
            {/* Postseason - highest peak */}
            <path 
              d="M500,400 L500,220 Q550,150 600,100 T700,180 T800,240 L800,400 Z" 
              fill={getCycleColor('postseason')}
              stroke="#FFF"
              strokeWidth="2"
            />
            
            {/* Offseason - gentle downslope */}
            <path 
              d="M750,400 L750,260 Q800,280 850,300 T950,340 T1000,350 L1000,400 Z" 
              fill={getCycleColor('offseason')}
              stroke="#FFF"
              strokeWidth="2"
            />
            
            {/* Snow caps on peaks */}
            <path 
              d="M590,110 Q600,105 610,110 T625,120 T640,110 L635,125 L615,130 L590,110" 
              fill="#FFFFFF"
              stroke="#F0F0F0"
              strokeWidth="1"
            />
            
            {/* Meet flags */}
            {sortedMeets.map((meet, index) => {
              if (!meet.meet || !meet.meet.date) return null;
              
              // Position flags along the mountain range based on cycle type
              let x = 0;
              let y = 0;
              
              switch(meet.cycleType) {
                case 'preseason':
                  x = 150 + (index * 30) % 100; // Spread them out in preseason section
                  y = 280 - (index * 15) % 20;  // Slight height variation
                  break;
                case 'regular':
                  x = 350 + (index * 40) % 150; // Spread them out in regular season
                  y = 210 - (index * 20) % 40;  // More height variation
                  break;
                case 'postseason':
                  x = 600 + (index * 40) % 150; // Spread them out in postseason
                  y = 120 - (index * 15) % 30;  // Highest elevation
                  break;
                case 'offseason':
                  x = 800 + (index * 30) % 150; // Spread them out in offseason
                  y = 300 - (index * 10) % 20;  // Lower elevation
                  break;
                default:
                  x = 500;
                  y = 250;
              }
              
              return (
                <g key={`flag-${index}`} className="cursor-pointer hover:opacity-90">
                  {/* Flag pole */}
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={x} 
                    y2={y + 30} 
                    stroke="#CC3333" 
                    strokeWidth="2" 
                  />
                  
                  {/* Flag */}
                  <polygon 
                    points={`${x},${y} ${x+20},${y+5} ${x},${y+10}`} 
                    fill="#CC3333" 
                  />
                  
                  {/* Tooltip with meet info - shown on hover */}
                  <g className="meet-tooltip" data-meet-id={meet.meetId}>
                    <rect 
                      x={x - 50} 
                      y={y - 50} 
                      width="100" 
                      height="40" 
                      rx="4" 
                      fill="white" 
                      stroke="#DDD"
                      strokeWidth="1"
                      fillOpacity="0.95"
                      className="shadow-md"
                    />
                    <text x={x} y={y - 35} textAnchor="middle" fontSize="12" fontWeight="500" fill="#333">
                      {meet.opponent || 'Meet'}
                    </text>
                    <text x={x} y={y - 20} textAnchor="middle" fontSize="10" fill="#666">
                      {meet.meet && meet.meet.date ? format(new Date(meet.meet.date), "MMM d, yyyy") : 'Date TBD'}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
          
          {/* Season cycle labels */}
          <text x="150" y="380" textAnchor="middle" fontSize="12" fontWeight="600" fill="#444">Preseason</text>
          <text x="400" y="380" textAnchor="middle" fontSize="12" fontWeight="600" fill="#444">Regular Season</text>
          <text x="650" y="380" textAnchor="middle" fontSize="12" fontWeight="600" fill="#444">Postseason</text>
          <text x="880" y="380" textAnchor="middle" fontSize="12" fontWeight="600" fill="#444">Offseason</text>
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-2 left-2 p-2 bg-white/80 rounded text-xs">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-red-600 mr-1"></div>
            <span>Meets</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white border border-gray-200 mr-1"></div>
            <span>Snow caps</span>
          </div>
        </div>
      </div>
      
      {/* Upcoming meets */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Upcoming Meets</h3>
        
        {sortedMeets.length === 0 ? (
          <p className="text-gray-600">No meets scheduled yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMeets.slice(0, 3).map((seasonMeet, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">vs {seasonMeet.opponent || 'TBD'}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${seasonMeet.isHome ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {seasonMeet.isHome ? 'Home' : 'Away'}
                  </span>
                </div>
                {seasonMeet.meet && seasonMeet.meet.date ? (
                  <p className="text-sm text-gray-600">
                    {format(new Date(seasonMeet.meet.date), "MMMM d, yyyy")}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Date TBD</p>
                )}
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