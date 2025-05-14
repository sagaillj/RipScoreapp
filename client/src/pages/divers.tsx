import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  PlusCircle, 
  Search, 
  Users, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Filter,
  UserPlus
} from 'lucide-react';
import { Label } from '@/components/ui/label';

// Mock teams data
const mockTeams = [
  { id: 1, name: 'Gold Dolphins' },
  { id: 2, name: 'Blue Waves' },
  { id: 3, name: 'Eagle Divers' },
];

// Mock divers data
const mockDivers = [
  { id: 1, name: 'Emma Johnson', team: 'Gold Dolphins', teamId: 1, age: 17, gender: 'Female', avgScore: '8.2' },
  { id: 2, name: 'Michael Smith', team: 'Blue Waves', teamId: 2, age: 18, gender: 'Male', avgScore: '7.9' },
  { id: 3, name: 'Sophia Williams', team: 'Gold Dolphins', teamId: 1, age: 16, gender: 'Female', avgScore: '8.5' },
  { id: 4, name: 'David Brown', team: 'Eagle Divers', teamId: 3, age: 17, gender: 'Male', avgScore: '7.8' },
  { id: 5, name: 'Olivia Davis', team: 'Blue Waves', teamId: 2, age: 15, gender: 'Female', avgScore: '8.3' },
];

export default function Divers() {
  // State for selected team
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  
  // State for new diver dialog
  const [diverDialogOpen, setDiverDialogOpen] = useState(false);
  
  // State for edit diver dialog
  const [editDiverDialogOpen, setEditDiverDialogOpen] = useState(false);
  const [editingDiver, setEditingDiver] = useState<any>(null);
  
  // Filter divers based on selected team
  const filteredDivers = selectedTeam 
    ? mockDivers.filter(diver => diver.teamId === selectedTeam)
    : mockDivers;
    
  // Calculate license usage
  const licenseUsage = {
    totalLicenses: 10, // Example value - this would come from your backend
    usedLicenses: mockDivers.length, // Example value - this would come from your backend
  };
  
  // Handle opening edit diver dialog
  const handleEditDiver = (diver: any) => {
    setEditingDiver(diver);
    setEditDiverDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Athletes - RipScore</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-post)]">Athletes</h1>
        <p className="text-[var(--color-muted-post)]">Manage your divers across all teams</p>
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Team Selector */}
          <Select value={selectedTeam?.toString()} onValueChange={(value) => setSelectedTeam(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-full md:w-[200px] bg-[var(--color-card-post)] border-[var(--color-border-post)]">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {mockTeams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Search */}
          <div className="relative w-full md:w-[250px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-post)]" />
            <Input 
              placeholder="Search divers..." 
              className="pl-10 bg-[var(--color-card-post)] border-[var(--color-border-post)]" 
            />
          </div>
        </div>
        
        <Dialog open={diverDialogOpen} onOpenChange={setDiverDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Diver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add a New Diver</DialogTitle>
              <DialogDescription>
                Enter the diver's information below to add them to your team.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., John Smith" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="e.g., 16" min="1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="team">Team</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDiverDialogOpen(false)}>Cancel</Button>
              <Button className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">Add Diver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-xl border border-[var(--color-border-post)] bg-[var(--color-card-post)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-post)] bg-[var(--color-background-post)]/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">Avg. Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-post)]">
              {filteredDivers.map((diver) => (
                <tr 
                  key={diver.id} 
                  className="hover:bg-[var(--color-background-post)]/30 cursor-pointer transition-colors"
                  onClick={() => handleEditDiver(diver)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-[var(--color-text-post)]">{diver.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--color-muted-post)]">{diver.team}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--color-muted-post)]">{diver.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--color-muted-post)]">{diver.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--color-accent-post)]">{diver.avgScore}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-[var(--color-border-post)] hover:bg-[var(--color-background-post)]/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDiver(diver);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between border-t border-[var(--color-border-post)] px-4 py-3">
          <div className="flex items-center text-sm text-[var(--color-muted-post)]">
            <p>Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDivers.length}</span> of <span className="font-medium">{filteredDivers.length}</span> results</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled 
              className="border-[var(--color-border-post)]"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[var(--color-border-post)]"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      
      {/* Edit Diver Dialog */}
      <Dialog open={editDiverDialogOpen} onOpenChange={setEditDiverDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Diver</DialogTitle>
            <DialogDescription>
              Update the diver's information.
            </DialogDescription>
          </DialogHeader>
          
          {editingDiver && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingDiver.name} 
                  onChange={(e) => setEditingDiver({...editingDiver, name: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-age">Age</Label>
                  <Input 
                    id="edit-age" 
                    type="number" 
                    value={editingDiver.age}
                    onChange={(e) => setEditingDiver({...editingDiver, age: parseInt(e.target.value)})}
                    min="1" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select value={editingDiver.gender.toLowerCase()} onValueChange={(value) => setEditingDiver({...editingDiver, gender: value})}>
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-team">Team</Label>
                <Select 
                  value={editingDiver.teamId.toString()} 
                  onValueChange={(value) => {
                    const teamId = parseInt(value);
                    const team = mockTeams.find(t => t.id === teamId)?.name || '';
                    setEditingDiver({...editingDiver, teamId, team});
                  }}
                >
                  <SelectTrigger id="edit-team">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Diver
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-[var(--color-border-post)]"
                onClick={() => setEditDiverDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}