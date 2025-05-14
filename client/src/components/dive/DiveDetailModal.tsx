import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, Video, Save, Calendar, Medal, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiveDetailProps {
  isOpen: boolean;
  onClose: () => void;
  dive: {
    number: string;
    name: string;
    positions: string[];
    dd1m: number | string;
    dd3m: number | string;
    rarity?: string;
  };
  boardType: '1m' | '3m';
  completedPositions: string[];
}

export function DiveDetailModal({ 
  isOpen, 
  onClose, 
  dive, 
  boardType, 
  completedPositions 
}: DiveDetailProps) {
  const [notes, setNotes] = useState("Type your notes about this dive here...");
  const [activeTab, setActiveTab] = useState("details");
  
  // Calculate stats
  const dd = boardType === '1m' ? dive.dd1m : dive.dd3m;
  const isFullyCompleted = completedPositions.length === dive.positions.length;
  const isPartiallyCompleted = completedPositions.length > 0;
  const completionPercentage = Math.round((completedPositions.length / dive.positions.length) * 100);
  
  // Mock data - would come from API in production
  const meetHistory = [
    {
      meetName: "State Championships",
      date: "2024-04-15",
      score: 7.5,
      position: "B",
      place: 3
    },
    {
      meetName: "Regional Qualifier",
      date: "2024-03-02",
      score: 6.8,
      position: "A",
      place: 5
    },
    {
      meetName: "Winter Invitational",
      date: "2024-01-18",
      score: 7.2,
      position: "B",
      place: 2
    }
  ];
  
  // Get badge color by position
  const getPositionColor = (position: string) => {
    if (completedPositions.includes(position)) {
      return "bg-primary text-primary-foreground";
    }
    return "bg-secondary text-secondary-foreground";
  };
  
  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-500";
    if (score >= 6.5) return "text-blue-500";
    if (score >= 5) return "text-amber-500";
    return "text-red-500";
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{dive.number} - {dive.name}</DialogTitle>
              <DialogDescription>
                Difficulty: <span className="font-medium">{dd}</span> • Board: <span className="font-medium">{boardType === '1m' ? '1-meter' : '3-meter'}</span>
              </DialogDescription>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {dive.positions.map(position => (
                <Badge key={position} variant="secondary" className={cn(getPositionColor(position))}>
                  Position {position}
                </Badge>
              ))}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="p-6 pt-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Completion</h3>
                    <p className="text-sm text-muted-foreground">
                      {isFullyCompleted 
                        ? "All positions mastered" 
                        : isPartiallyCompleted 
                          ? `${completedPositions.length}/${dive.positions.length} positions (${completionPercentage}%)` 
                          : "Not started yet"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Best Score</h3>
                    <p className="text-sm text-muted-foreground">
                      {meetHistory.length > 0 
                        ? `${Math.max(...meetHistory.map(m => m.score))} points (${formatDate(meetHistory[0].date)})` 
                        : "No competition scores yet"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Last Performed</h3>
                    <p className="text-sm text-muted-foreground">
                      {meetHistory.length > 0 
                        ? `${formatDate(meetHistory[0].date)} (${meetHistory[0].meetName})` 
                        : "Not performed in competition yet"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <h3 className="font-medium">Practice Count</h3>
                    <p className="text-sm text-muted-foreground">
                      24 times this season
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <Textarea 
                  className="min-h-[150px]" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Save className="h-4 w-4" />
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="video" className="pt-4">
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">No video uploaded yet</p>
                  <Button className="mt-3" size="sm">Upload Video</Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Upload videos of your dive to track your progress over time. Coaches can add comments and feedback.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <div className="space-y-4">
              {meetHistory.length > 0 ? (
                <Table>
                  <TableCaption>Competition history for Dive {dive.number}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Meet</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Place</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetHistory.map((meet, i) => (
                      <TableRow key={i}>
                        <TableCell>{formatDate(meet.date)}</TableCell>
                        <TableCell>{meet.meetName}</TableCell>
                        <TableCell>{meet.position}</TableCell>
                        <TableCell className={getScoreColor(meet.score)}>{meet.score}</TableCell>
                        <TableCell>{meet.place === 1 ? "🥇 1st" : meet.place === 2 ? "🥈 2nd" : meet.place === 3 ? "🥉 3rd" : `${meet.place}th`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No competition history for this dive yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="px-6 pb-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}