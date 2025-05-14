import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet';
import { PlusCircle, School, Edit, Eye, X, Users, Calendar, Trophy, Link, Trash2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Team, License } from '../types';

// Mock licenses data
const licenses: License[] = [
  {
    id: 'silver',
    name: 'Silver Tier',
    price: 499,
    description: 'Perfect for small teams with basic needs',
    includedDivers: 1,
    features: [
      'Basic diving analytics',
      'Score tracking',
      'Team management',
      'Limited competition features'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Tier',
    price: 999,
    description: 'Comprehensive features for competitive teams',
    includedDivers: 1,
    features: [
      'Advanced diving analytics',
      'Score tracking and historical data',
      'Full team management',
      'Complete competition features',
      'Premium support'
    ]
  }
];

// Mock teams data
const mockTeams: Team[] = [
  { 
    id: 1,
    name: 'Gold Dolphins',
    schoolUrl: 'westlakehigh.edu',
    logo: 'https://placehold.co/100x100?text=WHS',
    coachId: 1,
    division: 'Division I',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01'
  },
  { 
    id: 2,
    name: 'Blue Waves',
    schoolUrl: 'eastside.edu',
    logo: 'https://placehold.co/100x100?text=EA',
    coachId: 1,
    division: 'Division II',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01'
  },
  { 
    id: 3,
    name: 'Eagle Divers',
    schoolUrl: 'northernprep.edu',
    logo: 'https://placehold.co/100x100?text=NP',
    coachId: 1,
    division: 'Division I',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01'
  }
];

// Team Card Component
const TeamCard = ({ team, onEdit, onDelete }: { team: Team, onEdit: (team: Team) => void, onDelete: (teamId: number) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="overflow-hidden border border-[var(--color-border-post)] rounded-xl transition-all duration-200 hover:shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-r from-[var(--color-accent-post)]/50 to-[var(--color-accent2-post)]/30 h-2" />
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-border-post)] shadow-sm">
            {team.logo ? (
              <img src={team.logo} alt={`${team.name} logo`} className="max-w-full max-h-full object-contain" />
            ) : (
              <School className="w-10 h-10 text-[var(--color-muted-post)]" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-lg text-[var(--color-text-post)]">{team.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800">
                {team.division || 'Division I'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(team.id)} 
            className={`text-destructive hover:bg-destructive/10 transition-opacity self-end ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-[var(--color-accent-post)]" />
            <span className="text-sm text-[var(--color-text-post)]">{team.schoolUrl || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-accent-post)]" />
            <span className="text-sm text-[var(--color-text-post)]">12 divers</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-accent-post)]" />
            <span className="text-sm text-[var(--color-text-post)]">3 upcoming meets</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--color-accent-post)]" />
            <span className="text-sm text-[var(--color-text-post)]">8 achievements</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between border-t border-[var(--color-border-post)] bg-[var(--color-background-post)]/50">
        <Button 
          onClick={() => onEdit(team)} 
          variant="outline" 
          size="sm" 
          className="border-[var(--color-accent-post)] text-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/10"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Team
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-[var(--color-accent-post)] text-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/10"
        >
          <Users className="w-4 h-4 mr-2" />
          Manage Divers
        </Button>
      </CardFooter>
    </Card>
  );
};

// License Selection Component
const LicenseSelector = ({ 
  selectedLicense, 
  setSelectedLicense, 
  additionalDivers, 
  setAdditionalDivers
}: { 
  selectedLicense: string, 
  setSelectedLicense: (id: string) => void,
  additionalDivers: number,
  setAdditionalDivers: (count: number) => void
}) => {
  return (
    <div className="space-y-6">
      <RadioGroup value={selectedLicense} onValueChange={setSelectedLicense}>
        {licenses.map((license) => (
          <div 
            key={license.id} 
            className={`relative flex flex-col rounded-lg border p-5 cursor-pointer transition-colors ${
              selectedLicense === license.id 
                ? 'border-[var(--color-accent-post)] shadow-md bg-[var(--color-accent-post)]/5' 
                : 'border-[var(--color-border-post)] hover:border-[var(--color-accent-post)]/50'
            }`}
            onClick={() => setSelectedLicense(license.id)}
          >
            <RadioGroupItem 
              value={license.id} 
              id={license.id} 
              className="absolute right-4 top-4" 
            />
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-lg text-[var(--color-text-post)]">{license.name}</h3>
                <p className="text-sm text-[var(--color-muted-post)]">{license.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[var(--color-accent-post)]">${license.price}</div>
                <div className="text-xs text-[var(--color-muted-post)]">One-time payment</div>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-sm font-medium text-[var(--color-text-post)]">Features:</span>
              <ul className="mt-2 space-y-2">
                {license.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-center gap-2 text-[var(--color-text-post)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-post)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 text-sm text-[var(--color-text-post)]">
              <span className="font-medium">Includes:</span> {license.includedDivers} diver
            </div>
          </div>
        ))}
      </RadioGroup>
      
      <div className="p-5 rounded-xl border border-[var(--color-border-post)]">
        <h3 className="font-medium text-[var(--color-text-post)]">Additional Divers</h3>
        <p className="text-sm text-[var(--color-muted-post)] mb-4">Add more divers to your license at $99 each</p>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAdditionalDivers(Math.max(0, additionalDivers - 1))}
            disabled={additionalDivers === 0}
            className="border-[var(--color-border-post)] h-9 w-9 p-0"
          >
            -
          </Button>
          <span className="font-medium text-[var(--color-text-post)]">{additionalDivers} additional divers</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAdditionalDivers(additionalDivers + 1)}
            className="border-[var(--color-border-post)] h-9 w-9 p-0"
          >
            +
          </Button>
        </div>
        
        {additionalDivers > 0 && (
          <div className="text-sm mt-4 text-[var(--color-accent-post)]">
            Cost for additional divers: ${additionalDivers * 99}
          </div>
        )}
      </div>
      
      <div className="rounded-xl border border-[var(--color-border-post)] overflow-hidden">
        <div className="p-4 bg-[var(--color-background-post)]">
          <h3 className="font-medium text-lg text-[var(--color-text-post)]">Order Summary</h3>
        </div>
        <div className="p-4">
          <div className="flex justify-between text-[var(--color-text-post)]">
            <div className="font-medium">License</div>
            <div>
              ${selectedLicense === 'silver' ? 499 : 999}
            </div>
          </div>
          {additionalDivers > 0 && (
            <div className="flex justify-between mt-2 text-[var(--color-text-post)]">
              <div className="font-medium">Additional Divers ({additionalDivers})</div>
              <div>${additionalDivers * 99}</div>
            </div>
          )}
          <Separator className="my-3" />
          <div className="flex justify-between font-bold text-[var(--color-text-post)]">
            <div>Total</div>
            <div className="text-[var(--color-accent-post)]">
              ${selectedLicense === 'silver' ? 499 + (additionalDivers * 99) : 999 + (additionalDivers * 99)}
            </div>
          </div>
        </div>
        <div className="p-4 bg-[var(--color-background-post)] border-t border-[var(--color-border-post)]">
          <Button className="w-full bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">
            Purchase & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Team Information Form Component
const TeamInfoForm = ({ 
  schoolUrl, 
  setSchoolUrl,
  schoolName,
  setSchoolName,
  teamName,
  setTeamName,
  onFetchSchoolInfo
}: { 
  schoolUrl: string,
  setSchoolUrl: (url: string) => void,
  schoolName: string,
  setSchoolName: (name: string) => void,
  teamName: string,
  setTeamName: (name: string) => void,
  onFetchSchoolInfo: () => void
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-4 p-4 bg-[var(--color-background-post)] rounded-lg border border-[var(--color-border-post)]">
        <div className="flex items-center gap-2 text-[var(--color-accent-post)]">
          <School className="h-5 w-5" />
          <h3 className="font-medium">School Information</h3>
        </div>
        <p className="text-xs text-[var(--color-muted-post)] mt-1">
          Enter your school information to create a new team
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="school-url" className="text-[var(--color-text-post)]">School Website URL</Label>
          <div className="flex mt-1 gap-2">
            <Input 
              id="school-url" 
              value={schoolUrl} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolUrl(e.target.value)}
              placeholder="e.g., harvard.edu" 
              className="border-[var(--color-border-post)]"
            />
            <Button 
              type="button" 
              onClick={onFetchSchoolInfo}
              className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
            >
              Fetch Info
            </Button>
          </div>
          <p className="text-xs text-[var(--color-muted-post)] mt-1">
            Enter your school's website to automatically fetch information
          </p>
        </div>
        
        <div>
          <Label htmlFor="school-name" className="text-[var(--color-text-post)]">School Name</Label>
          <Input 
            id="school-name" 
            value={schoolName} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value)}
            placeholder="e.g., Harvard University" 
            className="mt-1 border-[var(--color-border-post)]"
          />
        </div>
        
        <div>
          <Label htmlFor="team-name" className="text-[var(--color-text-post)]">Team Name</Label>
          <Input 
            id="team-name" 
            value={teamName} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
            placeholder="e.g., Harvard Crimson Divers" 
            className="mt-1 border-[var(--color-border-post)]"
          />
        </div>
        
        <div>
          <Label htmlFor="team-division" className="text-[var(--color-text-post)]">Team Division</Label>
          <div className="grid grid-cols-3 gap-3 mt-1">
            {['Division I', 'Division II', 'Division III'].map((division) => (
              <Button
                key={division}
                type="button"
                variant="outline"
                className={`border-[var(--color-border-post)] ${
                  teamName.includes(division) 
                    ? 'bg-[var(--color-accent-post)]/10 border-[var(--color-accent-post)] text-[var(--color-accent-post)]' 
                    : 'hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)]'
                }`}
              >
                {division}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Teams() {
  // State for teams data
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  
  // State for add team dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'license' | 'team-info'>('license');
  const [selectedLicense, setSelectedLicense] = useState<string>('silver');
  const [additionalDivers, setAdditionalDivers] = useState(0);
  
  // Team info form state
  const [schoolUrl, setSchoolUrl] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [teamName, setTeamName] = useState('');
  
  // Edit team dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
  
  // License usage state
  const [licenseUsage, setLicenseUsage] = useState({
    totalLicenses: 5, // Example value - this would come from your backend
    usedLicenses: 3,  // Example value - this would come from your backend
  });
  
  // Handle adding a new team
  const handleAddTeam = () => {
    // Here you would normally submit the form data to your API
    // For now, let's just add a simple mock object to the teams list
    
    const newTeam: Team = {
      id: teams.length + 1,
      name: teamName || 'New Team',
      schoolUrl: schoolUrl,
      logo: undefined, // In real implementation, this would be fetched or uploaded
      coachId: 1, // Assuming current logged in coach id is 1
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTeams([...teams, newTeam]);
    
    // Reset form and close dialog
    setSchoolUrl('');
    setSchoolName('');
    setTeamName('');
    setSelectedLicense('silver');
    setAdditionalDivers(0);
    setCurrentStep('license');
    setAddDialogOpen(false);
  };
  
  // Handle starting delete process
  const handleDeleteTeamStart = (teamId: number) => {
    setTeamToDelete(teamId);
    setDeleteDialogOpen(true);
  };
  
  // Handle confirming team deletion
  const handleDeleteTeamConfirm = () => {
    if (teamToDelete === null) return;
    
    // In a real implementation, you would delete the team via API
    const updatedTeams = teams.filter(team => team.id !== teamToDelete);
    setTeams(updatedTeams);
    
    // Reset delete state and close dialog
    setTeamToDelete(null);
    setDeleteDialogOpen(false);
  };
  
  // Handle edit team
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setEditDialogOpen(true);
  };
  
  // Handle updating a team
  const handleUpdateTeam = () => {
    if (!editingTeam) return;
    
    // In a real implementation, you would update the team via API
    const updatedTeams = teams.map(team => 
      team.id === editingTeam.id ? editingTeam : team
    );
    
    setTeams(updatedTeams);
    setEditDialogOpen(false);
    setEditingTeam(null);
  };
  
  // Handle fetch school info
  const handleFetchSchoolInfo = () => {
    // In a real implementation, you would fetch school info from your API
    // For now, let's just set some mock data based on the URL
    if (schoolUrl.includes('harvard')) {
      setSchoolName('Harvard University');
      setTeamName('Harvard Crimson Divers');
    } else if (schoolUrl.includes('stanford')) {
      setSchoolName('Stanford University');
      setTeamName('Stanford Cardinal Diving');
    } else {
      setSchoolName('Unknown University');
      setTeamName('Unknown Divers');
    }
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Teams - RipScore</title>
      </Helmet>
      
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-post)]">Manage Your Teams</h1>
          <p className="text-[var(--color-muted-post)]">Create and manage your diving teams</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add a New Team</DialogTitle>
              <DialogDescription>
                Choose a license and enter your team information to get started.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={currentStep} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="license" 
                  onClick={() => setCurrentStep('license')}
                  disabled={currentStep === 'license'}
                >
                  1. Choose License
                </TabsTrigger>
                <TabsTrigger 
                  value="team-info" 
                  onClick={() => setCurrentStep('team-info')}
                  disabled={currentStep === 'team-info' ? false : true}
                >
                  2. Team Information
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="license" className="pt-4">
                <LicenseSelector 
                  selectedLicense={selectedLicense}
                  setSelectedLicense={setSelectedLicense}
                  additionalDivers={additionalDivers}
                  setAdditionalDivers={setAdditionalDivers}
                />
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={() => setCurrentStep('team-info')}
                    className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="team-info" className="pt-4">
                <TeamInfoForm 
                  schoolUrl={schoolUrl}
                  setSchoolUrl={setSchoolUrl}
                  schoolName={schoolName}
                  setSchoolName={setSchoolName}
                  teamName={teamName}
                  setTeamName={setTeamName}
                  onFetchSchoolInfo={handleFetchSchoolInfo}
                />
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('license')}
                    className="border-[var(--color-border-post)] hover:bg-[var(--color-background-post)]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={handleAddTeam}
                    className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                  >
                    Create Team
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Team</DialogTitle>
              <DialogDescription>
                Update your team information
              </DialogDescription>
            </DialogHeader>
            
            {editingTeam && (
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-team-name">Team Name</Label>
                  <Input 
                    id="edit-team-name" 
                    value={editingTeam.name} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTeam({...editingTeam, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-school-url">School URL</Label>
                  <Input 
                    id="edit-school-url" 
                    value={editingTeam.schoolUrl || ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTeam({...editingTeam, schoolUrl: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-division">Division</Label>
                  <Input 
                    id="edit-division" 
                    value={editingTeam.division || ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTeam({...editingTeam, division: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-logo">Logo URL</Label>
                  <Input 
                    id="edit-logo" 
                    value={editingTeam.logo || ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTeam({...editingTeam, logo: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateTeam}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* License Usage Info */}
      <div className="mb-6 p-4 bg-[var(--color-card-post)] rounded-lg border border-[var(--color-border-post)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--color-accent-post)]/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-[var(--color-accent-post)]" />
          </div>
          <div>
            <h3 className="font-medium text-[var(--color-text-post)]">Diver License Usage</h3>
            <p className="text-sm text-[var(--color-muted-post)]">
              {licenseUsage.usedLicenses} of {licenseUsage.totalLicenses} licenses used
            </p>
          </div>
        </div>
        <div className="w-48 h-2 bg-[var(--color-border-post)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-accent-post)]" 
            style={{ width: `${(licenseUsage.usedLicenses / licenseUsage.totalLicenses) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard 
            key={team.id} 
            team={team} 
            onEdit={handleEditTeam} 
            onDelete={handleDeleteTeamStart} 
          />
        ))}
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Confirm Team Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-[var(--color-muted-post)]">
              Any divers associated with this team will need to be reassigned or they will lose access to the platform.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeamConfirm}>
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}