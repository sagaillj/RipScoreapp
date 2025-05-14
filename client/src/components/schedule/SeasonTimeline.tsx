import React, { useMemo } from 'react';
import { differenceInDays, addDays, format, isBefore, isAfter, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SeasonTimelineProps {
  startDate: Date;
  championshipDate: Date;
}

export function SeasonTimeline({ startDate, championshipDate }: SeasonTimelineProps) {
  // Calculate current position in the season
  const today = new Date();
  const totalDays = differenceInDays(championshipDate, startDate);
  const daysElapsed = differenceInDays(
    isBefore(today, startDate) ? startDate : 
    isAfter(today, championshipDate) ? championshipDate : today, 
    startDate
  );
  
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  // Determine season phase
  const seasonPhase = useMemo(() => {
    if (isBefore(today, startDate)) {
      return "pre-season";
    } else if (isAfter(today, championshipDate) || isSameDay(today, championshipDate)) {
      return "post-season";
    } else {
      // Divide season into 3 phases: Early, Mid, Late
      const oneThird = addDays(startDate, Math.floor(totalDays / 3));
      const twoThirds = addDays(startDate, Math.floor((totalDays / 3) * 2));
      
      if (isBefore(today, oneThird)) {
        return "early-season";
      } else if (isBefore(today, twoThirds)) {
        return "mid-season";
      } else {
        return "championship-phase";
      }
    }
  }, [startDate, championshipDate, today, totalDays]);
  
  // Get color and label based on season phase
  const getPhaseDetails = (phase: string) => {
    switch (phase) {
      case "pre-season":
        return { color: "bg-blue-200", label: "Pre-Season" };
      case "early-season":
        return { color: "bg-green-200", label: "Early Season" };
      case "mid-season":
        return { color: "bg-yellow-200", label: "Mid-Season" };
      case "championship-phase":
        return { color: "bg-orange-200", label: "Championship Phase" };
      case "post-season":
        return { color: "bg-purple-200", label: "Post-Season" };
      default:
        return { color: "bg-gray-200", label: "Unknown" };
    }
  };
  
  const { color, label } = getPhaseDetails(seasonPhase);
  
  // Create phase markers
  const phases = [
    { 
      position: 0, 
      label: "Season Start", 
      date: startDate,
      active: seasonPhase === "pre-season" || seasonPhase === "early-season" 
    },
    { 
      position: 33.3, 
      label: "Early Season", 
      date: addDays(startDate, Math.floor(totalDays / 3)),
      active: seasonPhase === "early-season" || seasonPhase === "mid-season"
    },
    { 
      position: 66.7, 
      label: "Mid-Season", 
      date: addDays(startDate, Math.floor((totalDays / 3) * 2)),
      active: seasonPhase === "mid-season" || seasonPhase === "championship-phase"
    },
    { 
      position: 100, 
      label: "Championship", 
      date: championshipDate,
      active: seasonPhase === "championship-phase" || seasonPhase === "post-season"
    }
  ];
  
  return (
    <div className="relative pt-8 pb-12">
      {/* Current phase indicator */}
      <div className="absolute -top-2 left-0 right-0 flex justify-center">
        <div className={cn(
          "px-4 py-1 rounded-full text-sm font-medium", 
          color
        )}>
          {label}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {/* Phase markers */}
      <div className="relative h-20 mt-1">
        {phases.map((phase, index) => (
          <div 
            key={index}
            className="absolute transform -translate-x-1/2"
            style={{ left: `${phase.position}%` }}
          >
            <div className={cn(
              "w-4 h-4 rounded-full mx-auto transform -translate-y-2 border-2",
              phase.active ? "bg-primary border-primary" : "bg-muted border-muted-foreground"
            )} />
            <div className="text-xs font-medium text-center mt-1">
              {phase.label}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {format(phase.date, "MMM d")}
            </div>
          </div>
        ))}
      </div>
      
      {/* Today marker */}
      {percentage > 0 && percentage < 100 && (
        <div 
          className="absolute top-0 transform -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-1 h-8 bg-primary/80 rounded-full" />
          <div className="text-xs font-medium mt-1 text-center">Today</div>
        </div>
      )}
    </div>
  );
}