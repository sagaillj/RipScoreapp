import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { Droplets, Dumbbell, Brain, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityType {
  id: string;
  type: 'pool' | 'weights' | 'mental' | 'dryland' | 'meet';
  title: string;
  time: string;
  description: string;
  intensity?: 'low' | 'medium' | 'high';
}

interface DaySchedule {
  date: Date;
  activities: ActivityType[];
}

interface WeeklyScheduleProps {
  weekStart: Date;
}

// Fake data generator for the weekly schedule
const generateWeeklySchedule = (weekStart: Date): DaySchedule[] => {
  const days: DaySchedule[] = [];
  
  // Generate schedule for Monday through Sunday
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    
    // Different schedule based on day of week
    const activities: ActivityType[] = [];
    
    // Monday, Wednesday, Friday - Pool and weights
    if (i === 0 || i === 2 || i === 4) {
      activities.push({
        id: `pool-${i}`,
        type: 'pool',
        title: 'Pool Training',
        time: '6:00 AM - 8:00 AM',
        description: 'Focus on technique and dive progression',
        intensity: i === 0 ? 'medium' : i === 2 ? 'high' : 'medium'
      });
      
      if (i === 0 || i === 4) {
        activities.push({
          id: `weights-${i}`,
          type: 'weights',
          title: 'Weight Training',
          time: '4:00 PM - 5:30 PM',
          description: 'Core and leg strength focus',
          intensity: 'medium'
        });
      }
    }
    
    // Tuesday, Thursday - Dryland and mental training
    if (i === 1 || i === 3) {
      activities.push({
        id: `dryland-${i}`,
        type: 'dryland',
        title: 'Dryland Training',
        time: '4:00 PM - 5:30 PM',
        description: 'Mobility, flexibility, and dry board work',
        intensity: i === 1 ? 'low' : 'medium'
      });
      
      activities.push({
        id: `mental-${i}`,
        type: 'mental',
        title: 'Mental Training',
        time: '6:00 PM - 7:00 PM',
        description: 'Visualization and mental preparation',
        intensity: 'low'
      });
    }
    
    // Saturday - Meet
    if (i === 5) {
      activities.push({
        id: `meet-${i}`,
        type: 'meet',
        title: 'Dual Meet vs Stanford',
        time: '10:00 AM - 2:00 PM',
        description: 'Home pool, competition day'
      });
    }
    
    // Sunday - Rest
    // (no activities)
    
    days.push({ date, activities });
  }
  
  return days;
};

export function WeeklySchedule({ weekStart }: WeeklyScheduleProps) {
  const schedule = generateWeeklySchedule(weekStart);
  const today = new Date();
  
  // Function to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pool':
        return <Droplets className="h-4 w-4" />;
      case 'weights':
        return <Dumbbell className="h-4 w-4" />;
      case 'mental':
        return <Brain className="h-4 w-4" />;
      case 'dryland':
        return <Clock className="h-4 w-4" />;
      case 'meet':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Function to get color for activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'pool':
        return 'border-blue-400 bg-blue-50 dark:bg-blue-950';
      case 'weights':
        return 'border-purple-400 bg-purple-50 dark:bg-purple-950';
      case 'mental':
        return 'border-green-400 bg-green-50 dark:bg-green-950';
      case 'dryland':
        return 'border-amber-400 bg-amber-50 dark:bg-amber-950';
      case 'meet':
        return 'border-red-400 bg-red-50 dark:bg-red-950';
      default:
        return 'border-gray-400 bg-gray-50 dark:bg-gray-900';
    }
  };
  
  // Function to get text for intensity
  const getIntensityText = (intensity?: 'low' | 'medium' | 'high') => {
    switch (intensity) {
      case 'low':
        return <span className="text-emerald-600 dark:text-emerald-400">Low Intensity</span>;
      case 'medium':
        return <span className="text-amber-600 dark:text-amber-400">Medium Intensity</span>;
      case 'high':
        return <span className="text-red-600 dark:text-red-400">High Intensity</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-4">
        {schedule.map((day, index) => {
          const isToday = isSameDay(today, day.date);
          
          return (
            <div key={index} className={cn(
              "flex flex-col border rounded-lg p-2",
              isToday ? "border-primary bg-primary/5" : "border-muted"
            )}>
              <div className={cn(
                "text-center py-1 rounded-md mb-2",
                isToday ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <div className="text-xs font-medium">
                  {format(day.date, "EEE")}
                </div>
                <div className="text-sm font-bold">
                  {format(day.date, "d")}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                {day.activities.length > 0 ? (
                  day.activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className={cn(
                        "text-xs p-1.5 rounded border-l-4",
                        getActivityColor(activity.type)
                      )}
                    >
                      <div className="flex items-center gap-1 font-medium">
                        {getActivityIcon(activity.type)}
                        {activity.title}
                      </div>
                      <div className="mt-1 opacity-80">
                        {activity.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-center py-3 text-muted-foreground">Rest Day</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Activity details for the selected day - could be expanded in the future */}
      <div className="mt-6 pt-4 border-t border-muted">
        <h3 className="text-lg font-medium mb-3">Today's Schedule</h3>
        
        <div className="space-y-4">
          {schedule.find(day => isSameDay(day.date, today))?.activities.map((activity) => (
            <div 
              key={activity.id}
              className={cn(
                "p-4 rounded-lg border-l-4",
                getActivityColor(activity.type)
              )}
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-white dark:bg-gray-800">
                    {getActivityIcon(activity.type)}
                  </div>
                  <h4 className="font-medium">{activity.title}</h4>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.time}
                </div>
              </div>
              
              <p className="mt-2 text-sm">
                {activity.description}
              </p>
              
              {activity.intensity && (
                <div className="mt-2 text-xs font-medium">
                  {getIntensityText(activity.intensity)}
                </div>
              )}
            </div>
          ))}
          
          {!(schedule.find(day => isSameDay(day.date, today))?.activities.length) && (
            <div className="text-center py-6 text-muted-foreground">
              No scheduled activities for today. Rest and recovery are important parts of training!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}