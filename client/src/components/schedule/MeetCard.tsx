import React from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MeetCardProps {
  title: string;
  date: Date;
  location: string;
  isHighlighted?: boolean;
}

export function MeetCard({ title, date, location, isHighlighted = false }: MeetCardProps) {
  // Format date and time
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(date, 'h:mm a');
  
  // Check if this meet is today
  const isToday = new Date().toDateString() === date.toDateString();
  
  return (
    <motion.div
      className={cn(
        "border rounded-lg overflow-hidden h-full transition-all",
        isHighlighted ? "border-primary" : "border-muted",
        isToday ? "shadow-md" : ""
      )}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      layout
    >
      {/* Top section with title and highlighted status */}
      <div className={cn(
        "px-4 py-3 flex items-center justify-between",
        isHighlighted ? "bg-primary/10" : "bg-muted/30"
      )}>
        <h3 className="font-semibold">{title}</h3>
        {isHighlighted && (
          <div className="flex items-center text-primary">
            <Trophy className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Championship</span>
          </div>
        )}
      </div>
      
      {/* Meet details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formattedTime}</span>
        </div>
        
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
      
      {/* Card actions */}
      <div className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Details
        </Button>
        {isToday && (
          <Button size="sm" className="flex-1">
            Run Meet
          </Button>
        )}
      </div>
      
      {/* Today indicator */}
      {isToday && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-bl-md">
            Today
          </div>
        </div>
      )}
    </motion.div>
  );
}