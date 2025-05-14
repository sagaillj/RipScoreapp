import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ChevronUp, ChevronDown, TrendingUp, Users, Award, Calendar } from 'lucide-react';

// Mock data for the charts
const teamPerformanceData = [
  { month: 'Jan', score: 220 },
  { month: 'Feb', score: 240 },
  { month: 'Mar', score: 235 },
  { month: 'Apr', score: 260 },
  { month: 'May', score: 275 },
  { month: 'Jun', score: 268 },
  { month: 'Jul', score: 285 },
  { month: 'Aug', score: 290 },
  { month: 'Sep', score: 310 },
  { month: 'Oct', score: 320 },
  { month: 'Nov', score: 305 },
  { month: 'Dec', score: 340 },
];

const diverProgressData = [
  { name: 'Alex Johnson', dives: 42, avgScore: 7.8, improvement: 8 },
  { name: 'Sam Taylor', dives: 38, avgScore: 8.2, improvement: 12 },
  { name: 'Jess Williams', dives: 45, avgScore: 7.5, improvement: 5 },
  { name: 'Casey Smith', dives: 36, avgScore: 8.5, improvement: 15 },
  { name: 'Jordan Lee', dives: 40, avgScore: 7.9, improvement: 9 },
  { name: 'Taylor Ross', dives: 34, avgScore: 8.0, improvement: 7 },
  { name: 'Morgan Davis', dives: 39, avgScore: 7.6, improvement: 6 },
  { name: 'Riley Brown', dives: 41, avgScore: 8.3, improvement: 14 },
];

const diveTypePerformance = [
  { name: 'Forward', value: 85 },
  { name: 'Back', value: 72 },
  { name: 'Reverse', value: 78 },
  { name: 'Inward', value: 68 },
  { name: 'Twisting', value: 80 },
];

const boardPerformance = [
  { name: '1m Springboard', value: 82 },
  { name: '3m Springboard', value: 76 },
  { name: 'Platform', value: 70 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

// Mock data for the radar chart
const skillsData = [
  { subject: 'Entry', A: 85, B: 70, fullMark: 100 },
  { subject: 'Height', A: 78, B: 82, fullMark: 100 },
  { subject: 'Distance', A: 65, B: 75, fullMark: 100 },
  { subject: 'Form', A: 90, B: 68, fullMark: 100 },
  { subject: 'Takeoff', A: 72, B: 80, fullMark: 100 },
  { subject: 'Approach', A: 85, B: 75, fullMark: 100 },
];

// Mock data for competition comparison
const competitionData = [
  { name: 'Tennessee Invitational', team: 320, opponents: 305 },
  { name: 'SEC Championships', team: 340, opponents: 335 },
  { name: 'NCAA Regionals', team: 355, opponents: 345 },
  { name: 'Dual Meet - Alabama', team: 310, opponents: 290 },
  { name: 'Dual Meet - Florida', team: 315, opponents: 330 },
  { name: 'Spring Invitational', team: 325, opponents: 315 },
];

// Mock data for scatter plot
const diveComplexityData = [
  { difficulty: 1.4, score: 7.0, attempt: 8 },
  { difficulty: 1.6, score: 7.5, attempt: 7 },
  { difficulty: 1.9, score: 7.2, attempt: 6 },
  { difficulty: 2.1, score: 6.8, attempt: 5 },
  { difficulty: 2.2, score: 8.1, attempt: 9 },
  { difficulty: 2.4, score: 8.3, attempt: 10 },
  { difficulty: 2.5, score: 6.9, attempt: 4 },
  { difficulty: 2.6, score: 7.8, attempt: 8 },
  { difficulty: 2.8, score: 7.2, attempt: 6 },
  { difficulty: 3.0, score: 6.5, attempt: 3 },
  { difficulty: 3.1, score: 7.4, attempt: 5 },
  { difficulty: 3.2, score: 8.0, attempt: 7 },
  { difficulty: 3.4, score: 7.5, attempt: 4 },
  { difficulty: 3.5, score: 6.7, attempt: 3 },
];

// Opportunity areas based on scoring
const opportunityAreas = [
  { area: 'Back Dive Entries', currentScore: 6.8, potentialScore: 8.5, gap: 1.7 },
  { area: 'Twist Consistency', currentScore: 7.2, potentialScore: 8.9, gap: 1.7 },
  { area: 'Reverse Form', currentScore: 7.0, potentialScore: 8.6, gap: 1.6 },
  { area: 'Height on 3m', currentScore: 7.5, potentialScore: 8.8, gap: 1.3 },
  { area: 'Platform Takeoffs', currentScore: 7.3, potentialScore: 8.4, gap: 1.1 },
  { area: 'Inward Positioning', currentScore: 7.6, potentialScore: 8.5, gap: 0.9 },
];

// Top performing divers
const topDivers = [
  { name: 'Alex Johnson', diveType: 'Forward 2½ Somersault Pike', score: 8.7 },
  { name: 'Sam Taylor', diveType: 'Back 1½ Somersault with 2½ Twists', score: 8.5 },
  { name: 'Casey Smith', diveType: 'Reverse 2½ Somersault Tuck', score: 8.4 },
  { name: 'Riley Brown', diveType: 'Inward 1½ Somersault Pike', score: 8.3 },
];

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-card-post)] p-3 border border-[var(--color-border-post)] rounded-md shadow-md">
        <p className="text-[var(--color-text-post)] font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('year');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-post)]">Diving Analytics</h1>
            <p className="text-[var(--color-muted-post)]">
              Comprehensive insights into team and individual diver performance
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className={selectedTimeRange === 'month' ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]' : ''} onClick={() => setSelectedTimeRange('month')}>
              Month
            </Badge>
            <Badge variant="outline" className={selectedTimeRange === 'quarter' ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]' : ''} onClick={() => setSelectedTimeRange('quarter')}>
              Quarter
            </Badge>
            <Badge variant="outline" className={selectedTimeRange === 'year' ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]' : ''} onClick={() => setSelectedTimeRange('year')}>
              Year
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-muted-post)]">Team Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-[var(--color-text-post)]">8.1</div>
                <div className="flex items-center text-xs text-green-500">
                  <ChevronUp className="h-3 w-3" />
                  <span>12%</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted-post)] mt-1">vs previous period</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-muted-post)]">Total Dives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-[var(--color-text-post)]">315</div>
                <div className="flex items-center text-xs text-green-500">
                  <ChevronUp className="h-3 w-3" />
                  <span>8%</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted-post)] mt-1">vs previous period</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-muted-post)]">Competitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-[var(--color-text-post)]">6</div>
                <div className="flex items-center text-xs text-green-500">
                  <ChevronUp className="h-3 w-3" />
                  <span>20%</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted-post)] mt-1">vs previous period</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-muted-post)]">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-[var(--color-text-post)]">67%</div>
                <div className="flex items-center text-xs text-red-500">
                  <ChevronDown className="h-3 w-3" />
                  <span>5%</span>
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted-post)] mt-1">vs previous period</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="team" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="team">Team Analysis</TabsTrigger>
            <TabsTrigger value="divers">Diver Performance</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
          </TabsList>
          
          {/* Team Analysis Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Team Performance Trend</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Average score progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={teamPerformanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="var(--color-muted-post)" />
                        <YAxis stroke="var(--color-muted-post)" domain={[200, 350]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          name="Team Score"
                          stroke="#FF6384"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Performance by Dive Type</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Average scores across different dive categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={diveTypePerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {diveTypePerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Dive Distribution by Board</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Performance metrics across different boards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={boardPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="var(--color-muted-post)" />
                        <YAxis stroke="var(--color-muted-post)" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Performance Score" radius={[4, 4, 0, 0]}>
                          {boardPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index + 3 % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Team Skill Breakdown</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Comparison of key performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={skillsData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" stroke="var(--color-muted-post)" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--color-muted-post)" />
                        <Radar name="This Season" dataKey="A" stroke="#FF6384" fill="#FF6384" fillOpacity={0.6} />
                        <Radar name="Last Season" dataKey="B" stroke="#36A2EB" fill="#36A2EB" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Diver Performance Tab */}
          <TabsContent value="divers" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Diver Performance Metrics</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Individual analysis of key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={diverProgressData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis type="number" stroke="var(--color-muted-post)" />
                        <YAxis dataKey="name" type="category" stroke="var(--color-muted-post)" width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="avgScore" name="Average Score" fill="#FF6384" />
                        <Bar dataKey="improvement" name="Improvement %" fill="#36A2EB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Dive Complexity vs. Score</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Analyzing performance across varying difficulty levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="difficulty" 
                          type="number" 
                          name="Difficulty" 
                          stroke="var(--color-muted-post)"
                          domain={[1.2, 3.6]} 
                          label={{ value: 'Difficulty', position: 'insideBottom', offset: -5, fill: 'var(--color-muted-post)' }}
                        />
                        <YAxis 
                          dataKey="score" 
                          type="number" 
                          name="Score" 
                          stroke="var(--color-muted-post)" 
                          domain={[6, 9]}
                          label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-post)' }}
                        />
                        <ZAxis 
                          dataKey="attempt" 
                          type="number" 
                          name="Attempts" 
                          range={[50, 500]} 
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Scatter name="Dive Performance" data={diveComplexityData} fill="#FFCE56" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Top Performing Dives</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Highest scoring dives by individual divers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDivers.map((diver, index) => (
                      <div 
                        key={index} 
                        className="flex items-center p-3 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-post)] to-[var(--color-accent2-post)] flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-4 flex-grow">
                          <p className="font-medium text-[var(--color-text-post)]">{diver.name}</p>
                          <p className="text-xs text-[var(--color-muted-post)]">{diver.diveType}</p>
                        </div>
                        <div className="text-lg font-semibold text-[var(--color-accent2-post)]">{diver.score}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)] lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Performance Improvement Opportunities</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Areas with highest potential for score improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={opportunityAreas}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        barGap={0}
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="area" 
                          stroke="var(--color-muted-post)"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis stroke="var(--color-muted-post)" domain={[0, 10]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                        <Bar dataKey="currentScore" name="Current Score" fill="#36A2EB" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="potentialScore" name="Potential Score" fill="#FF6384" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunityAreas.slice(0, 3).map((opportunity, index) => (
                <Card key={index} className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md font-medium text-[var(--color-text-post)]">{opportunity.area}</CardTitle>
                      <Badge className="bg-[var(--color-accent2-post)]">+{opportunity.gap.toFixed(1)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-muted-post)]">Current</span>
                        <span className="text-[var(--color-muted-post)]">Potential</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-[var(--color-text-post)]">{opportunity.currentScore.toFixed(1)}</span>
                        <span className="text-[var(--color-accent2-post)]">{opportunity.potentialScore.toFixed(1)}</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--color-background-post)] rounded-full mt-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-[var(--color-accent-post)]/80 to-[var(--color-accent2-post)]/80 rounded-full"
                          style={{ width: `${(opportunity.currentScore / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-[var(--color-muted-post)] flex items-start">
                      <Info className="h-4 w-4 mr-2 mt-0.5 text-[var(--color-accent-post)]" />
                      <span>Focus on {index === 0 ? 'entry mechanics and vertical alignment' : index === 1 ? 'consistent rotation and body position' : 'height and form throughout execution'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Competitions Tab */}
          <TabsContent value="competitions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Competition Performance</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Team scores compared to opponents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={competitionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--color-muted-post)"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis stroke="var(--color-muted-post)" domain={[280, 360]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="team" name="Team Score" fill="#FF6384" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="opponents" name="Opponents' Score" fill="#36A2EB" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--color-card-post)] border-[var(--color-border-post)]">
                <CardHeader>
                  <CardTitle className="text-[var(--color-text-post)]">Competition Insights</CardTitle>
                  <CardDescription className="text-[var(--color-muted-post)]">Key takeaways from recent competitions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                        <h3 className="font-semibold text-[var(--color-text-post)]">Strengths</h3>
                      </div>
                      <ul className="ml-7 space-y-1 list-disc text-sm text-[var(--color-muted-post)]">
                        <li>Forward dives consistently score above conference average</li>
                        <li>Team shows exceptional performance in 1m springboard events</li>
                        <li>Senior divers outperforming previous season by 12%</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50">
                      <div className="flex items-center mb-2">
                        <Users className="h-5 w-5 mr-2 text-[var(--color-accent-post)]" />
                        <h3 className="font-semibold text-[var(--color-text-post)]">Competition Analysis</h3>
                      </div>
                      <ul className="ml-7 space-y-1 list-disc text-sm text-[var(--color-muted-post)]">
                        <li>Florida and Alabama showing strong improvements in platform events</li>
                        <li>SEC competition increasing in difficulty levels across all events</li>
                        <li>Need to improve back and reverse dives to remain competitive</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 mr-2 text-[var(--color-accent2-post)]" />
                        <h3 className="font-semibold text-[var(--color-text-post)]">Upcoming Focus</h3>
                      </div>
                      <ul className="ml-7 space-y-1 list-disc text-sm text-[var(--color-muted-post)]">
                        <li>Nationals preparation focused on consistency in higher DD dives</li>
                        <li>Training emphasis on stronger entries and height optimization</li>
                        <li>Individual coaching plans updated based on recent performance data</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}