import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { getQueryFn } from '@/lib/queryClient';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  Clipboard, 
  BarChart3,
  ArrowLeft 
} from 'lucide-react';
import { format } from 'date-fns';

interface Meet {
  id: number;
  name: string;
  date: string;
  location: string;
  status: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isHome?: boolean;
  teamId?: number;
}

interface Team {
  id: number;
  name: string;
  mascot?: string;
  division?: string;
  logoUrl?: string;
}

interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

interface Diver {
  id: number;
  firstName: string;
  lastName: string;
  year?: string;
  gender?: string;
  status?: string;
  teamId: number;
}

interface Judge {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  certified?: boolean;
}

const MeetPage = () => {
  const { id } = useParams();
  const meetId = parseInt(id as string);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch meet data
  const { data: meet, isLoading: meetLoading } = useQuery<Meet>({
    queryKey: ['/api/meets', meetId],
    queryFn: getQueryFn(`/api/meets/${meetId}`),
    enabled: !!meetId,
  });
  
  // Fetch home team info
  const { data: homeTeam, isLoading: homeTeamLoading } = useQuery<Team>({
    queryKey: ['/api/teams', meet?.teamId],
    queryFn: getQueryFn(meet?.teamId ? `/api/teams/${meet.teamId}` : null),
    enabled: !!meet?.teamId,
  });
  
  // Fetch away team info based on the opponent field from the season_meets join table
  // This would require a separate endpoint, for now we'll show a placeholder
  const awayTeam = {
    id: 0,
    name: meet?.name?.includes('vs') ? meet.name.split('vs')[1]?.trim() : 'Opponent',
    mascot: 'Tigers',
    division: 'D1'
  };
  
  // Fetch divers from both teams
  const { data: homeTeamDivers = [], isLoading: diversLoading } = useQuery<Diver[]>({
    queryKey: ['/api/teams', meet?.teamId, 'divers'],
    queryFn: getQueryFn(meet?.teamId ? `/api/teams/${meet.teamId}/divers` : null),
    enabled: !!meet?.teamId,
  });
  
  // For now, mock judges data
  const judges: Judge[] = [
    { id: 1, firstName: 'John', lastName: 'Smith', certified: true },
    { id: 2, firstName: 'Jane', lastName: 'Doe', certified: true },
    { id: 3, firstName: 'Robert', lastName: 'Johnson', certified: false },
    { id: 4, firstName: 'Maria', lastName: 'Garcia', certified: true },
    { id: 5, firstName: 'David', lastName: 'Wilson', certified: true },
  ];
  
  // Return to the previous page
  const goBack = () => {
    window.history.back();
  };
  
  if (meetLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!meet) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-2">Meet Not Found</h2>
          <p className="text-gray-500 mb-4">The meet you're looking for doesn't exist or has been removed.</p>
          <Button onClick={goBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Schedule
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{meet.name || 'Meet Details'}</h1>
          <Badge 
            className={`ml-3 ${
              meet.status === 'completed' ? 'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100' : 
              meet.status === 'upcoming' ? 'bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 
              'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
            }`}
          >
            {meet.status === 'completed' ? 'Completed' : 
             meet.status === 'upcoming' ? 'Upcoming' : 
             'In Progress'}
          </Badge>
        </div>
        
        {/* Meet info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Date & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <span>{meet.date ? format(new Date(meet.date), 'MMMM d, yyyy') : 'Date TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{meet.startTime || 'Time TBD'}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{meet.location || 'Location TBD'}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>
                  {homeTeam?.name || 'Home Team'} vs {awayTeam?.name || 'Away Team'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="divelists">Dive Lists</TabsTrigger>
            <TabsTrigger value="judges">Judges</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team Card */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {homeTeam?.logoUrl && (
                      <img src={homeTeam.logoUrl} alt={homeTeam.name} className="w-8 h-8 mr-2 rounded-full" />
                    )}
                    {homeTeam?.name || 'Home Team'}
                    <Badge className="ml-2 bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100">Home</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Coach</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm">HC</span>
                      </div>
                      <div>
                        <p className="font-medium">Head Coach</p>
                        <p className="text-sm text-gray-500">Contact info</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Divers ({homeTeamDivers.length})</h4>
                    <div className="space-y-2">
                      {homeTeamDivers.length > 0 ? (
                        homeTeamDivers.map(diver => (
                          <div key={diver.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <span>{diver.firstName} {diver.lastName}</span>
                            <Badge className={`${
                              diver.status === 'approved' ? 'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100' : 
                              'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                            }`}>
                              {diver.status === 'approved' ? 'List Approved' : 'Pending'}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No divers registered</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Away Team Card */}
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {awayTeam?.name || 'Away Team'}
                    <Badge className="ml-2 bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100">Away</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Coach</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm">AC</span>
                      </div>
                      <div>
                        <p className="font-medium">Away Coach</p>
                        <p className="text-sm text-gray-500">Contact info</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Divers</h4>
                    <p className="text-gray-500">Away team divers will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Meet Description */}
            {meet.description && (
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{meet.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Dive Lists Tab */}
          <TabsContent value="divelists">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clipboard className="h-5 w-5 mr-2" />
                  Dive Lists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  Dive lists for this meet will be displayed here once submitted.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Judges Tab */}
          <TabsContent value="judges">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Judges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {judges.length > 0 ? (
                  <div className="space-y-2">
                    {judges.map(judge => (
                      <div key={judge.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span>{judge.firstName.charAt(0)}{judge.lastName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{judge.firstName} {judge.lastName}</p>
                            <p className="text-sm text-gray-500">{judge.email || 'No email provided'}</p>
                          </div>
                        </div>
                        <Badge className={judge.certified ? 
                          'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-100' : 
                          'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
                        }>
                          {judge.certified ? 'Certified' : 'Not Certified'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    No judges have been assigned to this meet yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meet.status === 'completed' ? (
                  <p>Meet results will be displayed here.</p>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Results will be available after the meet is completed.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MeetPage;