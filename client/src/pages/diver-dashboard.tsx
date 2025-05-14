import { useState } from "react";
import { Helmet } from "react-helmet";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DiveProgressMatrix } from "@/components/dive/DiveProgressMatrix";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Target, 
  Brain, 
  Award, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Users, 
  MessageCircle,
  FileText,
  CheckCircle
} from "lucide-react";

export default function DiverDashboardPage() {
  // Sample data
  const upcomingMeet = {
    name: "Spring Championships",
    date: "May 15, 2025",
    location: "University Aquatic Center",
    daysUntil: 9
  };

  const personalStats = {
    totalDives: 8,
    completedDives: 5,
    averageScore: 7.2,
    bestDive: "Forward 1.5 Pike",
    improvementRate: "+18%"
  };
  
  const todoItems = [
    {
      id: 1,
      task: "Practice reverse dive sequences",
      dueDate: "2025-05-12",
      priority: "high"
    },
    {
      id: 2,
      task: "Submit meet registration form",
      dueDate: "2025-05-10",
      priority: "high"
    },
    {
      id: 3,
      task: "Review video feedback on inward dives",
      dueDate: "2025-05-15",
      priority: "medium"
    }
  ];
  
  const practiceSchedule = [
    {
      id: 1,
      day: "Monday",
      startTime: "3:30 PM",
      endTime: "5:30 PM",
      location: "Main Pool"
    },
    {
      id: 2,
      day: "Wednesday",
      startTime: "3:30 PM",
      endTime: "5:30 PM",
      location: "Main Pool"
    },
    {
      id: 3,
      day: "Friday",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
      location: "Main Pool"
    }
  ];
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-[var(--color-destructive-post)]";
      case "medium": return "text-[var(--color-warning-post)]";
      default: return "text-[var(--color-accent-post)]";
    }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Diver Dashboard | RipScore</title>
      </Helmet>

      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-post)]">Diver Dashboard</h1>
            <p className="text-[var(--color-muted-post)]">
              Track your performance and prepare for upcoming events.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Badge className="bg-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/90 text-white px-3 py-1 text-sm">
              <Target className="mr-2 h-4 w-4" /> 6 weeks until Regionals
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <Calendar className="mr-2 h-5 w-5 text-[var(--color-accent-post)]" /> 
                Next Competition
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <h3 className="text-lg font-semibold text-[var(--color-text-post)]">{upcomingMeet.name}</h3>
              <div className="mt-3 flex items-center text-[var(--color-muted-post)]">
                <Clock className="mr-2 h-4 w-4" />
                <span>{upcomingMeet.date} • {upcomingMeet.location}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[var(--color-muted-post)]">Dive Sheet Status</span>
                  <Badge className="bg-amber-400/10 text-amber-400">In Progress</Badge>
                </div>
                <Progress value={60} className="h-2 bg-[var(--color-border-post)]" />
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <TrendingUp className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" /> 
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-text-post)]">{personalStats.totalDives}</div>
                  <div className="text-xs text-[var(--color-muted-post)]">Total Dives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-accent-post)]">{personalStats.averageScore}</div>
                  <div className="text-xs text-[var(--color-muted-post)]">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-success-post)]">{personalStats.improvementRate}</div>
                  <div className="text-xs text-[var(--color-muted-post)]">Progress</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="link" className="text-[var(--color-accent2-post)] px-0">
                View detailed stats <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <Brain className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" /> 
                Daily Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-[var(--color-accent2-post)]/10 p-1.5 rounded mr-3">
                    <FileText className="h-4 w-4 text-[var(--color-accent2-post)]" />
                  </div>
                  <div>
                    <h4 className="text-[var(--color-text-post)] font-medium">Complete Dive List</h4>
                    <p className="text-xs text-[var(--color-muted-post)]">Finalize your dives for Spring Championships</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[var(--color-accent-post)]/10 p-1.5 rounded mr-3">
                    <Target className="h-4 w-4 text-[var(--color-accent-post)]" />
                  </div>
                  <div>
                    <h4 className="text-[var(--color-text-post)] font-medium">Practice Visualization</h4>
                    <p className="text-xs text-[var(--color-muted-post)]">10 minutes of mental prep for reverse 1.5</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="link" className="text-[var(--color-accent2-post)] px-0">View all tasks</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Dive Collection Section */}
        <div className="mb-8">
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader>
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <Award className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" />
                Your Dive Collection
              </CardTitle>
              <CardDescription className="text-[var(--color-muted-post)]">
                Unlock and master new dives to add to your collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiveProgressMatrix />
            </CardContent>
          </Card>
        </div>

        {/* Schedule and To-Do Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Practice Schedule */}
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <Clock className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
                Practice Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {practiceSchedule.map(practice => (
                <div key={practice.id} className="flex items-center justify-between p-3 border rounded-lg border-[var(--color-border-post)]">
                  <div>
                    <h4 className="font-medium text-[var(--color-text-post)]">{practice.day}</h4>
                    <p className="text-xs text-[var(--color-muted-post)]">{practice.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--color-text-post)]">{practice.startTime} - {practice.endTime}</p>
                    <Badge variant="outline" className="mt-1 text-xs bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)] border-none">
                      {practice.day === "Monday" ? "Today" : "Upcoming"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full border-[var(--color-border-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]">
                View Full Calendar
              </Button>
            </CardFooter>
          </Card>
          
          {/* To-Do Items */}
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <CheckCircle className="h-5 w-5 mr-2 text-[var(--color-accent2-post)]" />
                To-Do List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todoItems.map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg border-[var(--color-border-post)]">
                  <div className="w-5 h-5 border border-[var(--color-border-post)] rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-text-post)]">{item.task}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </span>
                      <span className="text-xs text-[var(--color-muted-post)] ml-2">
                        Due: {formatDate(item.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full border-[var(--color-border-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]">
                Add New Task
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Coach Messages Section */}
        <div className="mb-8">
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader>
              <CardTitle className="flex items-center text-[var(--color-text-post)]">
                <MessageCircle className="h-5 w-5 mr-2 text-[var(--color-accent2-post)]" />
                Coach Messages
              </CardTitle>
              <CardDescription className="text-[var(--color-muted-post)]">
                Recent feedback and notes from your coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2 p-3 border rounded-lg border-[var(--color-border-post)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[var(--color-accent-post)]/20 rounded-full mr-2 flex items-center justify-center">
                          <Users className="h-4 w-4 text-[var(--color-accent-post)]" />
                        </div>
                        <h4 className="font-medium text-[var(--color-text-post)]">Coach Johnson</h4>
                      </div>
                      <span className="text-xs text-[var(--color-muted-post)]">
                        {i === 1 ? "Today" : i === 2 ? "Yesterday" : "May 3, 2025"}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-post)]">
                      {i === 1 
                        ? "Great job on your inward dives today! Keep focusing on your entry angle."
                        : i === 2 
                          ? "Don't forget to submit your availability for the upcoming meet."
                          : "Your reverse dive technique is improving. Let's work more on your takeoff next practice."}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button size="sm" className="bg-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/90 transition-colors">
                Send Message to Coach
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)] lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-[var(--color-text-post)]">Recent Performance</CardTitle>
              <CardDescription className="text-[var(--color-muted-post)]">Your scores from the last meet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { dive: "303B", name: "Reverse 1.5 Tuck", dd: 2.1, score: 7.0 },
                  { dive: "105C", name: "Forward 2.5 Tuck", dd: 2.4, score: 6.5 },
                  { dive: "203C", name: "Back 1.5 Pike", dd: 1.9, score: 7.5 },
                  { dive: "403B", name: "Inward 1.5 Tuck", dd: 2.2, score: 6.0 }
                ].map((dive, i) => (
                  <div key={i} className="flex items-center p-3 border rounded-lg border-[var(--color-border-post)]">
                    <div className="w-16 text-center mr-4">
                      <Badge className="bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]">{dive.dive}</Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[var(--color-text-post)]">{dive.name}</h4>
                      <p className="text-xs text-[var(--color-muted-post)]">DD: {dive.dd}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold ${
                        dive.score >= 7.0 
                          ? 'text-[var(--color-success-post)]' 
                          : dive.score >= 6.0 
                            ? 'text-[var(--color-warning-post)]' 
                            : 'text-[var(--color-destructive-post)]'
                      }`}>
                        {dive.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[var(--color-accent-post)] to-[var(--color-accent2-post)] text-white">
              <CardTitle>Team Updates</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="rounded-full bg-[var(--color-accent2-post)]/10 p-2 flex-shrink-0 mr-3">
                    <Users className="h-5 w-5 text-[var(--color-accent2-post)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-post)]">New Team Member</h4>
                    <p className="text-xs text-[var(--color-muted-post)]">Emma joined the team yesterday</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-[var(--color-accent-post)]/10 p-2 flex-shrink-0 mr-3">
                    <Award className="h-5 w-5 text-[var(--color-accent-post)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-post)]">Team Achievement</h4>
                    <p className="text-xs text-[var(--color-muted-post)]">Perfect attendance last week</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="rounded-full bg-[var(--color-success-post)]/10 p-2 flex-shrink-0 mr-3">
                    <MessageCircle className="h-5 w-5 text-[var(--color-success-post)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-post)]">Coach Update</h4>
                    <p className="text-xs text-[var(--color-muted-post)]">Added new practice videos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}