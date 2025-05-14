import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DiveProgressConstellation from '@/components/dive/DiveProgressConstellation';
import { Dive } from '@shared/schema';
import { diveData, DiveGroup } from '@/lib/dive-data';

// Create more realistic dive names from the dive data
const generateMockDives = (): Dive[] => {
  // Select a subset of dives from different groups
  const selectedDives = [
    // Forward dives
    diveData.find(d => d.code === '101A'),
    diveData.find(d => d.code === '102B'),
    diveData.find(d => d.code === '103C'),
    // Back dives
    diveData.find(d => d.code === '201A'),
    diveData.find(d => d.code === '202C'),
    // Reverse dive
    diveData.find(d => d.code === '301B'),
    // Inward dive
    diveData.find(d => d.code === '401A'),
    // Twisting dive
    diveData.find(d => d.code === '5121D'),
  ].filter(Boolean);
  
  // Convert to Dive type
  return selectedDives.map((d, i) => ({
    id: i + 1,
    meetId: 1,
    diverId: 1,
    number: i + 1,
    name: d!.name,
    difficulty: d!.difficulty.threeMeter!.toString(),
    completed: i < 3 ? true : false, // First 3 dives are completed
    createdAt: new Date(),
  } as unknown as Dive));
};

export default function DiveProgressDemoPage() {
  const [dives, setDives] = useState<Dive[]>(generateMockDives());
  const [currentDiveId, setCurrentDiveId] = useState<number>(3); // Start at 3rd dive
  const [viewMode, setViewMode] = useState<'all' | 'completed' | 'current'>('all');
  const [boardHeight, setBoardHeight] = useState<1 | 3>(3);
  
  const handleDiveSelect = (dive: Dive) => {
    setCurrentDiveId(dive.id);
  };
  
  const handleCompleteDive = () => {
    setDives(dives.map(dive => 
      dive.id === currentDiveId ? { ...dive, completed: true } : dive
    ));
    
    // Advance to next dive if available
    const currentIndex = dives.findIndex(dive => dive.id === currentDiveId);
    if (currentIndex < dives.length - 1) {
      setCurrentDiveId(dives[currentIndex + 1].id);
    }
  };
  
  const handleResetDives = () => {
    setDives(generateMockDives().map((dive, i) => ({
      ...dive,
      completed: i < 3 ? true : false // First 3 dives are completed
    })));
    setCurrentDiveId(3);
  };
  
  // Get the current dive object
  const currentDive = dives.find(dive => dive.id === currentDiveId);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1120] to-[#0F172A] text-white p-4 md:p-8">
      <Helmet>
        <title>Official DD Sheet Visualization | RipScore</title>
        <meta name="description" content="Interactive visualization of dive progress based on the official DD sheet" />
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Official DD Sheet Visualization</h1>
        <p className="text-[#8A9BA8] mb-8">
          Interactive visualization of dive progress mapped to the official DD sheet, showing all possible dives and highlighting completed ones
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#131C2E] border-[#2D3748] text-white h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Dive DD Sheet Visualization</CardTitle>
                  <CardDescription className="text-[#8A9BA8] mt-1">
                    Based on the official Degree of Difficulty (DD) sheet
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={boardHeight.toString()}
                    onValueChange={(value) => setBoardHeight(parseInt(value) as 1 | 3)}
                  >
                    <SelectTrigger className="w-[120px] bg-[#1E293B] border-[#2D3748] text-white">
                      <SelectValue placeholder="Board Height" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-[#2D3748] text-white">
                      <SelectItem value="1">1 Meter</SelectItem>
                      <SelectItem value="3">3 Meter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full mb-6">
                  <TabsList className="bg-[#0F172A] border border-[#2D3748]">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
                      onClick={() => setViewMode('all')}
                    >
                      All Dives
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
                      onClick={() => setViewMode('completed')}
                    >
                      Completed Only
                    </TabsTrigger>
                    <TabsTrigger 
                      value="current" 
                      className="data-[state=active]:bg-[#2D3748] data-[state=active]:text-white"
                      onClick={() => setViewMode('current')}
                    >
                      Current Path
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4 border-none p-0">
                    {/* Main constellation component */}
                    <DiveProgressConstellation 
                      dives={dives}
                      currentDiveId={currentDiveId}
                      onSelectDive={handleDiveSelect}
                      className="h-[500px]"
                      viewMode={viewMode}
                      boardHeight={boardHeight}
                    />
                  </TabsContent>
                  <TabsContent value="completed" className="mt-4 border-none p-0">
                    <DiveProgressConstellation 
                      dives={dives}
                      currentDiveId={currentDiveId}
                      onSelectDive={handleDiveSelect}
                      className="h-[500px]"
                      viewMode={viewMode}
                      boardHeight={boardHeight}
                    />
                  </TabsContent>
                  <TabsContent value="current" className="mt-4 border-none p-0">
                    <DiveProgressConstellation 
                      dives={dives}
                      currentDiveId={currentDiveId}
                      onSelectDive={handleDiveSelect}
                      className="h-[500px]"
                      viewMode={viewMode}
                      boardHeight={boardHeight}
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="flex flex-wrap justify-center mt-4 gap-3">
                  <Button 
                    onClick={handleCompleteDive}
                    disabled={currentDive?.completed === true}
                    className="bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE] hover:opacity-90 border-none"
                  >
                    Complete Current Dive
                  </Button>
                  <Button 
                    onClick={handleResetDives}
                    variant="outline"
                    className="border-[#2D3748]"
                  >
                    Reset Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-[#131C2E] border-[#2D3748] text-white">
              <CardHeader>
                <CardTitle>Current Dive Details</CardTitle>
                <CardDescription className="text-[#8A9BA8]">
                  Information about the currently selected dive
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentDive ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1E293B] rounded-lg border border-[#2D3748]">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#0F172A] border border-[#2D3748] flex items-center justify-center text-center">
                          <span className="text-sm font-bold">
                            {/* Extract dive code from name */}
                            {currentDive.name.replace(/ /g, '').substring(0, 5)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold">{currentDive.name}</h3>
                          <p className="text-sm text-[#8A9BA8]">
                            Status: {currentDive.completed ? 
                              <span className="text-green-400">Completed</span> : 
                              <span className="text-yellow-400">In Progress</span>
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#0F172A] p-3 rounded border border-[#2D3748]">
                          <p className="text-[#8A9BA8]">Difficulty</p>
                          <p className="font-semibold">{currentDive.difficulty}</p>
                        </div>
                        <div className="bg-[#0F172A] p-3 rounded border border-[#2D3748]">
                          <p className="text-[#8A9BA8]">Number</p>
                          <p className="font-semibold">{currentDive.number}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-[#2D3748] overflow-hidden">
                      <div className="bg-[#1E293B] px-4 py-2 border-b border-[#2D3748]">
                        <h4 className="font-medium">Progress</h4>
                      </div>
                      <div className="p-4">
                        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#FF5CB3] to-[#FF9CEE]"
                            style={{ 
                              width: `${(dives.filter(dive => dive.completed).length / dives.length) * 100}%`,
                              transition: 'width 1s'
                            }}
                          />
                        </div>
                        <p className="text-sm text-[#8A9BA8] mt-2">
                          {dives.filter(dive => dive.completed).length} of {dives.length} dives completed
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#8A9BA8] mt-4">
                      Click on any node in the visualization to select a different dive. 
                      Complete the current dive to advance to the next one.
                    </p>
                  </div>
                ) : (
                  <p className="text-[#8A9BA8]">No dive selected</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-[#131C2E] border-[#2D3748] text-white mt-6">
              <CardHeader>
                <CardTitle>DD Sheet Visualization Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#8A9BA8]">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Based on the official Degree of Difficulty (DD) sheet</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Organizes dives by their group (Forward, Back, Reverse, Inward, Twisting)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Position within groups determined by somersaults and twists</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Node size and color indicates completion status</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Shows difficulty as distance from center</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Connects completed dives with animated gradient lines</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#FF5CB3]">•</span>
                    <span>Hover for detailed dive information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}