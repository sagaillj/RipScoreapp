import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeasonSetupWizardProps {
  initialStartDate: Date | null;
  initialChampionshipDate: Date | null;
  onComplete: (startDate: Date, championshipDate: Date) => void;
  onCancel: () => void;
}

export function SeasonSetupWizard({
  initialStartDate,
  initialChampionshipDate,
  onComplete,
  onCancel
}: SeasonSetupWizardProps) {
  // State
  const [step, setStep] = useState<'start-date' | 'championship-date'>('start-date');
  const [seasonStartDate, setSeasonStartDate] = useState<Date | undefined>(
    initialStartDate ? new Date(initialStartDate) : undefined
  );
  const [championshipDate, setChampionshipDate] = useState<Date | undefined>(
    initialChampionshipDate ? new Date(initialChampionshipDate) : undefined
  );
  
  // Function to handle completion
  const handleComplete = () => {
    if (seasonStartDate && championshipDate) {
      onComplete(seasonStartDate, championshipDate);
    }
  };
  
  // Function to go to next step
  const handleNextStep = () => {
    if (step === 'start-date' && seasonStartDate) {
      setStep('championship-date');
    }
  };
  
  // Function to go to previous step
  const handlePreviousStep = () => {
    if (step === 'championship-date') {
      setStep('start-date');
    }
  };
  
  return (
    <Card className="w-full mb-8 border-primary/30">
      <CardHeader>
        <CardTitle>Season Setup Wizard</CardTitle>
        <CardDescription>
          Configure your season schedule to help with planning and periodization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger 
              value="start-date" 
              onClick={() => setStep('start-date')}
              disabled={step === 'start-date'}
            >
              1. Season Start Date
            </TabsTrigger>
            <TabsTrigger 
              value="championship-date" 
              onClick={() => setStep('championship-date')}
              disabled={step === 'championship-date' || !seasonStartDate}
            >
              2. Championship Meet Date
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="start-date" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">When does your season begin?</h3>
              <p className="text-muted-foreground mb-4">
                Select the first day of official practices or team activities.
              </p>
              
              <div className="flex flex-col items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !seasonStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {seasonStartDate ? format(seasonStartDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={seasonStartDate}
                      onSelect={(date) => date && setSeasonStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="championship-date" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">When is your championship meet?</h3>
              <p className="text-muted-foreground mb-4">
                Select the date of your most important end-of-season competition.
              </p>
              
              <div className="flex flex-col items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !championshipDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {championshipDate ? format(championshipDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={championshipDate}
                      onSelect={(date) => date && setChampionshipDate(date)}
                      disabled={(date) => (
                        seasonStartDate ? date < seasonStartDate : false
                      )}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 'start-date' ? (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : (
          <Button variant="outline" onClick={handlePreviousStep}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        
        {step === 'start-date' ? (
          <Button 
            onClick={handleNextStep}
            disabled={!seasonStartDate}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleComplete}
            disabled={!championshipDate}
          >
            Complete Setup
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}