import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  Loader2, 
  School, 
  User, 
  Users, 
  Link as LinkIcon, 
  CalendarDays,
  AlertCircle 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the response type from the scraping API
interface CollegeInfo {
  success: boolean;
  college: {
    name: string;
    url: string;
    logo: string;
    division: string;
    coachName: string;
    coachPhoto?: string;
    coachBio?: string;
    numberOfDivers: number;
  };
  team?: {
    roster: Array<{
      name: string;
      year: string;
      position: string;
    }>;
    schedule: Array<{
      date: string;
      opponent: string;
      location: string;
    }>;
  };
  error?: string;
}

export default function FancyWizardTest() {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collegeInfo, setCollegeInfo] = useState<CollegeInfo | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a college website URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the protocol if none is specified
      const formattedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      
      const res = await apiRequest('POST', '/api/scrape-college', { url: formattedUrl });
      const data = await res.json();
      
      if (res.ok) {
        setCollegeInfo(data);
        toast({
          title: "Success!",
          description: "College information scraped successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to scrape college information",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // We no longer need the generic handleEdit function since we're updating specific fields
  // with direct setCollegeInfo calls in the JSX onChange handlers

  return (
    <PageWrapper>
      <div className="container mx-auto py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">College Information Wizard</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Enter College URL</CardTitle>
              <CardDescription>
                Enter the URL of your college's website, and we'll automatically extract relevant information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="url">College Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      placeholder="https://example.edu"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        "Fetch Info"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {collegeInfo && collegeInfo.success && collegeInfo.college ? (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>College Information</CardTitle>
                <CardDescription>
                  Here's what we found. You can edit any field if needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-32 h-32 flex items-center justify-center border rounded-lg overflow-hidden bg-white">
                      {collegeInfo.college.logo ? (
                        <img 
                          src={collegeInfo.college.logo} 
                          alt={`${collegeInfo.college.name} logo`} 
                          className="max-w-full max-h-full object-contain" 
                        />
                      ) : (
                        <School className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="college-name">School Name</Label>
                          <Input
                            id="college-name"
                            value={collegeInfo.college.name || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollegeInfo({
                              ...collegeInfo,
                              college: {
                                ...collegeInfo.college,
                                name: e.target.value
                              }
                            })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="logo-url">Logo URL</Label>
                          <Input
                            id="logo-url"
                            value={collegeInfo.college.logo || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollegeInfo({
                              ...collegeInfo,
                              college: {
                                ...collegeInfo.college,
                                logo: e.target.value
                              }
                            })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="division">Division</Label>
                          <Input
                            id="division"
                            value={collegeInfo.college.division || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollegeInfo({
                              ...collegeInfo,
                              college: {
                                ...collegeInfo.college,
                                division: e.target.value
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                      <User className="h-5 w-5" />
                      Coach Information
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start mb-4">
                      {collegeInfo.college.coachPhoto && (
                        <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center border rounded-lg overflow-hidden bg-white">
                          <img 
                            src={collegeInfo.college.coachPhoto} 
                            alt={`Coach ${collegeInfo.college.coachName}`} 
                            className="max-w-full max-h-full object-cover" 
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="coach-name">Coach Name</Label>
                            <Input
                              id="coach-name"
                              value={collegeInfo.college.coachName || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollegeInfo({
                                ...collegeInfo,
                                college: {
                                  ...collegeInfo.college,
                                  coachName: e.target.value
                                }
                              })}
                            />
                          </div>
                          
                          {collegeInfo.college.coachBio && (
                            <div>
                              <Label htmlFor="coach-bio">Coach Bio</Label>
                              <Textarea
                                id="coach-bio"
                                value={collegeInfo.college.coachBio || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCollegeInfo({
                                  ...collegeInfo,
                                  college: {
                                    ...collegeInfo.college,
                                    coachBio: e.target.value
                                  }
                                })}
                                rows={4}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {collegeInfo.team && collegeInfo.team.roster.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5" />
                        Team Roster ({collegeInfo.college.numberOfDivers} Divers)
                      </h3>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>Position</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {collegeInfo.team.roster.map((member, index) => (
                              <TableRow key={index}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.year}</TableCell>
                                <TableCell>{member.position}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  
                  {collegeInfo.team && collegeInfo.team.schedule.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <CalendarDays className="h-5 w-5" />
                        Schedule
                      </h3>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Opponent</TableHead>
                              <TableHead>Location</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {collegeInfo.team.schedule.map((event, index) => (
                              <TableRow key={index}>
                                <TableCell>{event.date}</TableCell>
                                <TableCell>{event.opponent}</TableCell>
                                <TableCell>{event.location}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Continue with this information
                </Button>
              </CardFooter>
            </Card>
          ) : collegeInfo && !collegeInfo.success && (
            <Card className="mt-8 border-red-300">
              <CardHeader className="bg-red-50 text-red-800">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error Fetching Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{collegeInfo.error || "Failed to extract information from the provided URL."}</p>
                <p className="mt-2">Please check the URL and try again, or enter the information manually.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}