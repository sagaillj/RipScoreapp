import React, { useMemo } from 'react';
import { differenceInDays, addDays, format, isBefore, isAfter, isSameDay } from 'date-fns';
import { Activity, Timer, BarChart, Heart, Dumbbell, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseVisualizerProps {
  startDate: Date;
  championshipDate: Date;
}

export function PhaseVisualizer({ startDate, championshipDate }: PhaseVisualizerProps) {
  // Calculate current position in the season
  const today = new Date();
  const totalDays = differenceInDays(championshipDate, startDate);
  
  // Determine training phase and objectives
  const trainingPhase = useMemo(() => {
    if (isBefore(today, startDate)) {
      return {
        name: "Off-Season Preparation",
        objectives: [
          { icon: <Activity className="h-5 w-5" />, text: "Build aerobic base" },
          { icon: <Timer className="h-5 w-5" />, text: "Technical foundations" },
          { icon: <Heart className="h-5 w-5" />, text: "Mental preparation" }
        ],
        intensityPercentage: 60,
        description: "Focus on building a strong foundation through aerobic training, technical work, and mental preparation before the season begins."
      };
    } else if (isAfter(today, championshipDate) || isSameDay(today, championshipDate)) {
      return {
        name: "Recovery & Reflection",
        objectives: [
          { icon: <Heart className="h-5 w-5" />, text: "Active recovery" },
          { icon: <BarChart className="h-5 w-5" />, text: "Season analysis" },
          { icon: <Activity className="h-5 w-5" />, text: "Maintain fitness" }
        ],
        intensityPercentage: 40,
        description: "Focus on recovery while maintaining a base level of fitness. Review the season, celebrate achievements, and plan for next year."
      };
    } else {
      // Divide season into phases
      const oneQuarter = addDays(startDate, Math.floor(totalDays / 4));
      const halfway = addDays(startDate, Math.floor(totalDays / 2));
      const threeQuarters = addDays(startDate, Math.floor((totalDays / 4) * 3));
      
      if (isBefore(today, oneQuarter)) {
        return {
          name: "Adaptation Phase",
          objectives: [
            { icon: <Dumbbell className="h-5 w-5" />, text: "Strength building" },
            { icon: <Droplets className="h-5 w-5" />, text: "Technique refinement" },
            { icon: <Timer className="h-5 w-5" />, text: "Volume focus" }
          ],
          intensityPercentage: 70,
          description: "Building strength and working on technique. Focus on higher volume training with moderate intensity to build a solid base for the season."
        };
      } else if (isBefore(today, halfway)) {
        return {
          name: "Development Phase",
          objectives: [
            { icon: <Timer className="h-5 w-5" />, text: "Conditioning work" },
            { icon: <Droplets className="h-5 w-5" />, text: "Dive progression" },
            { icon: <Activity className="h-5 w-5" />, text: "Increased intensity" }
          ],
          intensityPercentage: 80,
          description: "Increase training intensity while maintaining volume. Focus on developing dive consistency and expanding the dive repertoire."
        };
      } else if (isBefore(today, threeQuarters)) {
        return {
          name: "Competition Phase",
          objectives: [
            { icon: <BarChart className="h-5 w-5" />, text: "Performance monitoring" },
            { icon: <Timer className="h-5 w-5" />, text: "Meet simulation" },
            { icon: <Heart className="h-5 w-5" />, text: "Mental toughness" }
          ],
          intensityPercentage: 85,
          description: "Focus on meet preparation and competition strategies. Simulate competition environments and refine mental preparation techniques."
        };
      } else {
        return {
          name: "Peak Performance Phase",
          objectives: [
            { icon: <Droplets className="h-5 w-5" />, text: "Dive perfection" },
            { icon: <Heart className="h-5 w-5" />, text: "Visualization" },
            { icon: <Timer className="h-5 w-5" />, text: "Reduced volume" }
          ],
          intensityPercentage: 90,
          description: "Reduce overall training volume while maintaining high intensity. Focus on perfecting competition dives and mental preparation for championships."
        };
      }
    }
  }, [startDate, championshipDate, today, totalDays]);
  
  // Calculate how far along we are in the current phase
  const getPhaseProgress = () => {
    // This is a simplified calculation - would need to be updated with actual phase boundaries
    return Math.min(100, Math.random() * 100); // Placeholder logic
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{trainingPhase.name}</h3>
          <p className="text-muted-foreground mt-1">{trainingPhase.description}</p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-muted/30 px-4 py-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Recommended Intensity</div>
          <div className="mt-1 w-36 h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${trainingPhase.intensityPercentage}%` }}
            />
          </div>
          <div className="mt-1 text-sm font-medium text-right">{trainingPhase.intensityPercentage}%</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trainingPhase.objectives.map((objective, index) => (
          <div key={index} className="flex items-center p-3 bg-muted/20 rounded-lg">
            <div className="flex-shrink-0 mr-3">
              {objective.icon}
            </div>
            <div className="text-sm">{objective.text}</div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-muted">
        <h4 className="text-sm font-medium mb-2">Phase Progress</h4>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${getPhaseProgress()}%` }}
          />
        </div>
      </div>
    </div>
  );
}