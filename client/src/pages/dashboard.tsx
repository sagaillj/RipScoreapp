import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, TrendingUp, Award, Users, FileText, Timer, Target, Brain, Sparkles, BarChart2, CheckCircle, Calculator, Star, Zap, Medal, Flag, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TeamAchievementBadges, AchievementBadge, TeamAchievementBadgesDemo } from "@/components/team/TeamAchievementBadges";

// Sample data
const upcomingMeet = {
  name: "Spring Championships",
  date: "May 15, 2025",
  location: "University Aquatic Center",
  daysUntil: 9
};

const teamPerformance = {
  totalPoints: 287,
  improvement: "+23%",
  newDives: 12
};

// Coach Dashboard Component
const CoachDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-post)]">Coach Dashboard</h1>
          <p className="text-[var(--color-muted-post)]">
            Here's an overview of your team's performance and upcoming events.
          </p>
        </div>
        <Button 
          className="bg-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/90 mt-4 md:mt-0 transition-colors"
        >
          <Timer className="mr-2 h-4 w-4" /> Run Meet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <Calendar className="mr-2 h-5 w-5 text-[var(--color-accent-post)]" /> 
              Upcoming Meet
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
            <Badge variant="secondary" className="bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]">
              {upcomingMeet.daysUntil} days until meet
            </Badge>
          </CardFooter>
        </Card>

        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <TrendingUp className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" /> 
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-text-post)]">{teamPerformance.totalPoints}</div>
                <div className="text-xs text-[var(--color-muted-post)]">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-success-post)]">{teamPerformance.improvement}</div>
                <div className="text-xs text-[var(--color-muted-post)]">Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-accent2-post)]">{teamPerformance.newDives}</div>
                <div className="text-xs text-[var(--color-muted-post)]">New Dives</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <CheckCircle className="mr-2 h-5 w-5 text-[var(--color-success-post)]" /> 
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-[var(--color-border-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]">
                <Users className="mr-2 h-4 w-4" /> Manage Teams
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-[var(--color-border-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]">
                <Award className="mr-2 h-4 w-4" /> View Athletes
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-[var(--color-border-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]">
                <Calendar className="mr-2 h-4 w-4" /> Schedule Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Achievement Badges Section */}
      <div className="mb-8">
        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader>
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <Award className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" />
              Team Achievement Badges
            </CardTitle>
            <CardDescription className="text-[var(--color-muted-post)]">
              Track your team's accomplishments and work toward new achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamAchievementBadgesDemo />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)] lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-post)]">Upcoming Season Timeline</CardTitle>
            <CardDescription className="text-[var(--color-muted-post)]">Track important dates and meets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pt-6">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--color-border-post)]"></div>
              {[
                { date: "May 15", event: "Spring Championships", location: "University Aquatic Center", type: "meet" },
                { date: "May 22", event: "Team Practice", location: "Community Pool", type: "practice" },
                { date: "June 5", event: "Regional Qualifiers", location: "State Aquatic Center", type: "meet" },
                { date: "June 18", event: "Summer Invitational", location: "Olympic Training Center", type: "meet" }
              ].map((event, i) => (
                <div key={i} className="relative flex mb-6 last:mb-0 items-start">
                  <div className={`absolute left-8 top-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full ${
                    event.type === 'meet' ? 'bg-[var(--color-accent2-post)]' : 'bg-[var(--color-accent-post)]'
                  }`}></div>
                  <div className="pr-4 w-16 font-medium text-[var(--color-muted-post)]">{event.date}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--color-text-post)]">{event.event}</p>
                    <p className="text-[var(--color-muted-post)] text-sm">{event.location}</p>
                  </div>
                  <Badge variant={event.type === 'meet' ? 'default' : 'secondary'} className={
                    event.type === 'meet' 
                      ? 'bg-[var(--color-accent2-post)]/10 text-[var(--color-accent2-post)]' 
                      : 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                  }>
                    {event.type === 'meet' ? 'Meet' : 'Practice'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[var(--color-accent-post)] to-[var(--color-accent2-post)] text-white">
            <CardTitle>Team Highlights</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">Season Goals</span>
                  <span className="text-sm text-[var(--color-muted-post)]">65%</span>
                </div>
                <Progress value={65} className="h-2 bg-[var(--color-border-post)]" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">New Dives Mastered</span>
                  <span className="text-sm text-[var(--color-muted-post)]">42%</span>
                </div>
                <Progress value={42} className="h-2 bg-[var(--color-border-post)]" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">Team Attendance</span>
                  <span className="text-sm text-[var(--color-muted-post)]">89%</span>
                </div>
                <Progress value={89} className="h-2 bg-[var(--color-border-post)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Diver Dashboard Component 
const DiverDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-post)]">Diver Dashboard</h1>
          <p className="text-[var(--color-muted-post)]">
            Track your performance and prepare for upcoming meets.
          </p>
        </div>
        <Badge className="bg-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/90 text-white px-3 py-1 text-sm mt-4 md:mt-0">
          <Target className="mr-2 h-4 w-4" /> 6 weeks until Regionals
        </Badge>
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

        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <Sparkles className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" /> 
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-post)]">
                Based on your recent performance, we recommend:
              </p>
              <div className="flex items-center">
                <div className="bg-[var(--color-accent2-post)]/10 p-1.5 rounded mr-3">
                  <Award className="h-4 w-4 text-[var(--color-accent2-post)]" />
                </div>
                <p className="text-sm text-[var(--color-muted-post)]">Focus on entries for your forward dives</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="text-[var(--color-accent2-post)] px-0">
              Get detailed insights
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-post)]">Recent Performance</CardTitle>
            <CardDescription className="text-[var(--color-muted-post)]">Your scores from the last meet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dive: "303B", name: "Reverse 1.5 Tuck", dd: 2.1, score: 7.0 },
                { dive: "105C", name: "Forward 2.5 Tuck", dd: 2.4, score: 6.5 },
                { dive: "405C", name: "Inward 2.5 Tuck", dd: 2.7, score: 7.5 },
                { dive: "203B", name: "Back 1.5 Tuck", dd: 1.9, score: 8.0 }
              ].map((dive, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[var(--color-border-post)] font-mono">
                        {dive.dive}
                      </Badge>
                      <span className="font-medium text-[var(--color-text-post)]">{dive.name}</span>
                    </div>
                    <div className="text-xs text-[var(--color-muted-post)] mt-1">DD: {dive.dd}</div>
                  </div>
                  <div className="text-xl font-bold text-[var(--color-text-post)]">{dive.score.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader>
            <CardTitle className="text-[var(--color-text-post)]">Your Goals</CardTitle>
            <CardDescription className="text-[var(--color-muted-post)]">Track your progress toward season targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">Qualify for Nationals</span>
                  <span className="text-sm text-[var(--color-muted-post)]">65%</span>
                </div>
                <Progress value={65} className="h-2 bg-[var(--color-border-post)]" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">Master Reverse 2.5</span>
                  <span className="text-sm text-[var(--color-muted-post)]">30%</span>
                </div>
                <Progress value={30} className="h-2 bg-[var(--color-border-post)]" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">Average Score {'>'}7.0</span>
                  <span className="text-sm text-[var(--color-muted-post)]">82%</span>
                </div>
                <Progress value={82} className="h-2 bg-[var(--color-border-post)]" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-[var(--color-text-post)]">Consistent Entries</span>
                  <span className="text-sm text-[var(--color-muted-post)]">50%</span>
                </div>
                <Progress value={50} className="h-2 bg-[var(--color-border-post)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Judge Dashboard Component
const JudgeDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-post)]">Judge Dashboard</h1>
          <p className="text-[var(--color-muted-post)]">
            Access your judging assignments and meet information.
          </p>
        </div>
        <Button 
          className="bg-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/90 mt-4 md:mt-0 transition-colors"
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Judge Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <Calendar className="mr-2 h-5 w-5 text-[var(--color-accent-post)]" /> 
              Next Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <h3 className="text-lg font-semibold text-[var(--color-text-post)]">{upcomingMeet.name}</h3>
            <div className="mt-3 flex items-center text-[var(--color-muted-post)]">
              <Clock className="mr-2 h-4 w-4" />
              <span>{upcomingMeet.date} • {upcomingMeet.location}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex space-x-2 w-full">
              <Button variant="outline" className="flex-1 border-[var(--color-border-post)] text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]">
                Details
              </Button>
              <Button className="flex-1 bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">
                Accept
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[var(--color-text-post)]">
              <BarChart2 className="mr-2 h-5 w-5 text-[var(--color-accent2-post)]" /> 
              Judging Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-text-post)]">24</div>
                <div className="text-xs text-[var(--color-muted-post)]">Meets Judged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-accent-post)]">487</div>
                <div className="text-xs text-[var(--color-muted-post)]">Dives Scored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-accent2-post)]">4.7</div>
                <div className="text-xs text-[var(--color-muted-post)]">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
        <CardHeader>
          <CardTitle className="text-[var(--color-text-post)]">Upcoming Assignments</CardTitle>
          <CardDescription className="text-[var(--color-muted-post)]">Your schedule for the next 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[
              { 
                meet: "Spring Championships", 
                date: "May 15, 2025", 
                location: "University Aquatic Center",
                status: "confirmed",
                type: "Regional"
              },
              { 
                meet: "Summer Invitational", 
                date: "June 18, 2025", 
                location: "Olympic Training Center",
                status: "pending",
                type: "Invitational"
              },
              { 
                meet: "State Qualifiers", 
                date: "July 10, 2025", 
                location: "State Aquatic Center",
                status: "confirmed",
                type: "State"
              },
            ].map((assignment, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-start space-x-4">
                  <div className="bg-[var(--color-background-post)] rounded-md p-2.5 text-center min-w-[60px]">
                    <div className="text-xs text-[var(--color-muted-post)]">
                      {assignment.date.split(', ')[0].split(' ')[0]}
                    </div>
                    <div className="text-lg font-bold text-[var(--color-text-post)]">
                      {assignment.date.split(', ')[0].split(' ')[1]}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-post)]">{assignment.meet}</h4>
                    <p className="text-sm text-[var(--color-muted-post)]">{assignment.location}</p>
                    <div className="flex items-center mt-1">
                      <Badge className={`
                        ${assignment.status === 'confirmed' 
                          ? 'bg-[var(--color-success-post)]/10 text-[var(--color-success-post)]' 
                          : 'bg-amber-400/10 text-amber-400'}
                      `}>
                        {assignment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </Badge>
                      <span className="mx-2 text-[var(--color-border-post)]">•</span>
                      <span className="text-xs text-[var(--color-muted-post)]">{assignment.type}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-[var(--color-border-post)] text-[var(--color-text-post)]">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for user info
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
        setUserName(user.name);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  }, []);

  // Role-specific dashboard content
  const renderRoleDashboard = () => {
    switch (userRole) {
      case 'coach':
        return <CoachDashboard />;
      case 'diver':
        return <DiverDashboard />;
      case 'judge':
        return <JudgeDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  if (!userRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-post)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - RipScore.app</title>
        <meta 
          name="description" 
          content="Access your personalized dashboard for dive meet management, scoring, and performance tracking on RipScore." 
        />
      </Helmet>
      
      <DashboardLayout>
        {renderRoleDashboard()}
      </DashboardLayout>
    </>
  );
}