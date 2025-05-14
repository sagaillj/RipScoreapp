import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Send, PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Placeholder data - in a real application, this would come from API
const mockDivers = [
  { id: 1, name: "Emma Johnson" },
  { id: 2, name: "Michael Chen" },
  { id: 3, name: "Sarah Williams" },
  { id: 4, name: "David Rodriguez" },
  { id: 5, name: "Jessica Kim" }
];

const mockMeets = [
  { id: 1, name: "Dual Meet vs Stanford", date: new Date('2025-05-15') },
  { id: 2, name: "Conference Championships", date: new Date('2025-06-20') }
];

const eventTypes = [
  { id: 1, name: "1m Springboard" },
  { id: 2, name: "3m Springboard" },
  { id: 3, name: "Platform" }
];

export function DiveSheetRequest() {
  const { toast } = useToast();

  // Form state
  const [meetId, setMeetId] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [message, setMessage] = useState<string>("");
  const [selectedDivers, setSelectedDivers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Toggle select all divers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedDivers(mockDivers.map(diver => diver.id));
    } else {
      setSelectedDivers([]);
    }
  };
  
  // Toggle individual diver selection
  const handleSelectDiver = (diverId: number, checked: boolean) => {
    if (checked) {
      setSelectedDivers(prev => [...prev, diverId]);
    } else {
      setSelectedDivers(prev => prev.filter(id => id !== diverId));
      setSelectAll(false);
    }
  };
  
  // Check if all divers are selected
  const allSelected = selectedDivers.length === mockDivers.length;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!meetId || !eventId || !dueDate || selectedDivers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would send the request to your backend
    toast({
      title: "Request Sent",
      description: `Dive sheet request sent to ${selectedDivers.length} divers.`,
    });
    
    // Reset form
    setMeetId("");
    setEventId("");
    setDueDate(undefined);
    setMessage("");
    setSelectedDivers([]);
    setSelectAll(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Meet Selection */}
      <div className="space-y-2">
        <Label htmlFor="meet-select">Meet</Label>
        <Select value={meetId} onValueChange={setMeetId}>
          <SelectTrigger id="meet-select">
            <SelectValue placeholder="Select a meet" />
          </SelectTrigger>
          <SelectContent>
            {mockMeets.map(meet => (
              <SelectItem key={meet.id} value={meet.id.toString()}>
                {meet.name} ({format(meet.date, 'MMM d, yyyy')})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Event Selection */}
      <div className="space-y-2">
        <Label htmlFor="event-select">Event</Label>
        <Select value={eventId} onValueChange={setEventId}>
          <SelectTrigger id="event-select">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map(event => (
              <SelectItem key={event.id} value={event.id.toString()}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Due Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="due-date">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
              id="due-date"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          Set a deadline for divers to submit their dive sheets
        </p>
      </div>
      
      {/* Additional Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Add instructions or notes for divers..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      
      {/* Diver Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Select Divers</Label>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all" 
              checked={allSelected} 
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Select All
            </label>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto p-2 space-y-2">
            {mockDivers.map(diver => (
              <div key={diver.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                <Checkbox 
                  id={`diver-${diver.id}`} 
                  checked={selectedDivers.includes(diver.id)}
                  onCheckedChange={(checked) => handleSelectDiver(diver.id, checked as boolean)}
                />
                <label
                  htmlFor={`diver-${diver.id}`}
                  className="text-sm leading-none cursor-pointer flex-1"
                >
                  {diver.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Selected {selectedDivers.length} of {mockDivers.length} divers
        </div>
      </div>
      
      {/* Submit Button */}
      <Button type="submit" className="w-full">
        <Send className="mr-2 h-4 w-4" />
        Send Dive Sheet Request
      </Button>
    </form>
  );
}