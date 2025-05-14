import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Helmet } from 'react-helmet';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  AlertTriangle,
  PlusCircle, 
  Search, 
  Users, 
  ChevronDown, 
  Edit, 
  Trash2, 
  PenSquare,
  Mail,
  UserPlus,
  School,
  Trophy,
  Calendar,
  Info,
  MoreHorizontal,
  Bell,
  Settings,
  LogOut,
  Archive,
  Camera,
  Upload,
  Crown,
  User,
  FileText,
  Award,
  BadgeCheck,
  GanttChart,
  Settings2,
  Minus as MinusIcon,
  Plus,
  Plus as PlusIcon
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Mock teams data
// Define interfaces for our data models
interface Team {
  id: number;
  name: string;
  mascot: string;
  division: string;
  address: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface Diver {
  id: number;
  teamId: number;
  firstName: string;
  lastName: string;
  status: string;
  gender: string;
  gradYear: number | string; // In the mock data it's a number, but may come as string
  age: number;
  avgScore: string | number; // In the mock data it's a string, but may be treated as number
  email?: string;
  isCaptain?: boolean;
  [key: string]: any; // This allows any string key to be accessed
}

const mockTeams = [
  { 
    id: 1, 
    name: 'Gold Dolphins', 
    coachName: 'John Smith',
    mascot: 'Dolphins',
    division: 'Division I',
    address: '1200 West Lake Blvd, Austin, TX 78746' 
  },
  { 
    id: 2, 
    name: 'Blue Waves', 
    coachName: 'John Smith',
    mascot: 'Waves',
    division: 'Division II',
    address: '500 East Side Ave, Austin, TX 78702' 
  },
  { 
    id: 3, 
    name: 'Eagle Divers', 
    coachName: 'John Smith',
    mascot: 'Eagles',
    division: 'Division II',
    address: '800 North Hills Dr, Austin, TX 78731' 
  },
];

// Mock divers data
const mockDiversData = [
  { id: 1, firstName: 'Emma', lastName: 'Johnson', gradYear: 2025, teamId: 1, age: 17, gender: 'Female', avgScore: '8.2', email: 'emma.johnson@example.com', status: 'active', isCaptain: true },
  { id: 2, firstName: 'Michael', lastName: 'Smith', gradYear: 2024, teamId: 2, age: 18, gender: 'Male', avgScore: '7.9', email: 'michael.smith@example.com', status: 'active', isCaptain: false },
  { id: 3, firstName: 'Sophia', lastName: 'Williams', gradYear: 2026, teamId: 1, age: 16, gender: 'Female', avgScore: '8.5', email: 'sophia.williams@example.com', status: 'active', isCaptain: false },
  { id: 4, firstName: 'David', lastName: 'Brown', gradYear: 2025, teamId: 3, age: 17, gender: 'Male', avgScore: '7.8', email: 'david.brown@example.com', status: 'active', isCaptain: true },
  { id: 5, firstName: 'Olivia', lastName: 'Davis', gradYear: 2027, teamId: 2, age: 15, gender: 'Female', avgScore: '8.3', email: 'olivia.davis@example.com', status: 'active', isCaptain: false },
  { id: 6, firstName: 'Jackson', lastName: 'Miller', gradYear: 2024, teamId: 1, age: 18, gender: 'Male', avgScore: '8.1', email: 'jackson.miller@example.com', status: 'active', isCaptain: false },
  { id: 7, firstName: 'Isabella', lastName: 'Wilson', gradYear: 2026, teamId: 1, age: 16, gender: 'Female', avgScore: '8.4', email: 'isabella.wilson@example.com', status: 'active' },
  { id: 8, firstName: 'Lucas', lastName: 'Moore', gradYear: 2025, teamId: 1, age: 17, gender: 'Male', avgScore: '7.6', email: 'lucas.moore@example.com', status: 'active' },
];

// Team switcher component
const TeamSwitcher = ({ teams, currentTeamId, onTeamChange, onAddTeam }: { 
  teams: any[], 
  currentTeamId: number,
  onTeamChange: (teamId: number) => void,
  onAddTeam: () => void
}) => {
  // This component should be as simple as possible to avoid rendering issues
  // We'll use a very simple state for dropdown toggle
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            id="team-dropdown-trigger"
            variant="ghost" 
            className="invisible absolute opacity-0 pointer-events-auto"
            aria-label="Open team selection dropdown"
          >
            Select Team
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-[300px] p-0 bg-[var(--color-card-post)]" 
          side="bottom"
          align="start"
          alignOffset={-450}
          sideOffset={-10}
        >
          <div className="p-2 border-b border-[var(--color-border-post)]">
            <Input 
              placeholder="Search teams..." 
              className="border-[var(--color-border-post)]"
            />
          </div>
          
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-[var(--color-muted-post)]">
              Your Teams
            </div>
            
            <div className="max-h-[250px] overflow-y-auto">
              {teams.map((team) => (
                <DropdownMenuItem 
                  key={team.id} 
                  className={`px-3 py-2 flex items-center cursor-pointer hover:bg-[var(--color-background-post)]/50 h-auto ${
                    currentTeamId === team.id ? 'bg-[var(--color-accent-post)]/10' : ''
                  }`}
                  onSelect={() => { onTeamChange(team.id); setIsOpen(false); }}
                >
                  <div className="h-8 w-8 rounded-md bg-[var(--color-accent-post)]/10 flex items-center justify-center mr-3">
                    <School className="h-4 w-4 text-[var(--color-accent-post)]" />
                  </div>
                  <div>
                    <div className={`font-medium ${currentTeamId === team.id ? 'text-[var(--color-accent-post)]' : 'text-[var(--color-text-post)]'}`}>
                      {team.name}
                    </div>
                    <div className="text-xs text-[var(--color-muted-post)]">
                      {team.mascot}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator className="my-1" />
              
              <DropdownMenuItem 
                className="px-3 py-2 flex items-center cursor-pointer h-auto"
                onSelect={() => { onAddTeam(); setIsOpen(false); }}
              >
                <div className="h-8 w-8 rounded-md border border-dashed border-[var(--color-border-post)] flex items-center justify-center mr-3">
                  <PlusCircle className="h-4 w-4 text-[var(--color-muted-post)]" />
                </div>
                <div>
                  <div className="font-medium text-[var(--color-text-post)]">Add New Team</div>
                  <div className="text-xs text-[var(--color-muted-post)]">Create a new team to manage</div>
                </div>
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Stats card component
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <Card className="border-[var(--color-border-post)] bg-[var(--color-card-post)]">
    <CardContent className="p-6 flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-[var(--color-accent-post)]/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[var(--color-muted-post)]">{label}</p>
        <p className="text-2xl font-bold text-[var(--color-text-post)]">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default function Team() {
  // Initialize the toast hook
  const { toast } = useToast();
  // State for selected team
  const [currentTeamId, setCurrentTeamId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for new diver dialog
  const [diverDialogOpen, setDiverDialogOpen] = useState(false);
  
  // State for edit diver dialog
  const [editDiverDialogOpen, setEditDiverDialogOpen] = useState(false);
  const [editingDiver, setEditingDiver] = useState<any>(null);
  
  // State for add team dialog
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  
  // State for delete confirmation dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [diverToDelete, setDiverToDelete] = useState<any>(null);
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // State to force re-renders
  const [forceUpdate, setForceUpdate] = useState({});
  
  // State for view type - default to card view
  const [viewType, setViewType] = useState<'list' | 'card'>('card');
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' | null }>({
    key: 'name',
    direction: null
  });
  
  // State for team settings dialog
  const [teamSettingsOpen, setTeamSettingsOpen] = useState(false);
  
  // State for divers data
  const [divers, setDivers] = useState(mockDiversData);
  
  // Load divers from API - will implement when database schema is ready
  const { data: diversData = [], isLoading: isLoadingDivers } = useQuery<any[]>({
    queryKey: ['/api/teams', currentTeamId, 'divers'],
    staleTime: 60000, // 1 minute
    enabled: false // Temporarily disable until database is ready
  });
  
  // Fetch teams data from API
  const { data: teamsData = [], isLoading: isLoadingTeams } = useQuery<any[]>({
    queryKey: ['/api/teams'],
    staleTime: 60000, // 1 minute
  });

  // Fallback to mock data if no teams loaded yet - temporary while we build
  const teams = (teamsData && Array.isArray(teamsData) && teamsData.length > 0) 
    ? teamsData 
    : JSON.parse(JSON.stringify(mockTeams));
    
  // Load team images from API data
  useEffect(() => {
    if (teamsData && Array.isArray(teamsData) && teamsData.length > 0) {
      const team = teamsData.find((t: any) => t.id === currentTeamId);
      if (team) {
        // Reset the logo and banner URLs for the new team 
        // This ensures we don't show the previous team's images
        setTeamLogoUrl(null);
        setTeamBannerUrl(null);
        
        // Then set the new team's logo and banner if they exist
        if (team.logoUrl) setTeamLogoUrl(team.logoUrl);
        if (team.bannerUrl) setTeamBannerUrl(team.bannerUrl);
        
        // ALWAYS preserve the default app accent colors
        // Never change them as requested by the user
        setPrimaryColor(DEFAULT_PRIMARY_COLOR);
        setSecondaryColor(DEFAULT_SECONDARY_COLOR);
        
        // Ensure document CSS variables are always set to defaults
        document.documentElement.style.setProperty('--color-accent-post', DEFAULT_PRIMARY_COLOR);
        document.documentElement.style.setProperty('--color-accent2-post', DEFAULT_SECONDARY_COLOR);
      }
    }
  }, [teamsData, currentTeamId]);
  
  // Get current team - make sure this is defined before teamFormData
  // Using useMemo to cache the current team and prevent unnecessary re-renders
  const currentTeam = React.useMemo(() => {
    return teams.find((team: any) => team.id === currentTeamId) || teams[0];
  }, [teams, currentTeamId]);
  
  // State for images
  const [teamBannerUrl, setTeamBannerUrl] = useState<string | null>(null);
  const [teamLogoUrl, setTeamLogoUrl] = useState<string | null>(null);
  
  // Mutation for saving team images (logo/banner)
  const saveTeamImageMutation = useMutation({
    mutationFn: async (data: { type: 'logo' | 'banner'; imageUrl: string }) => {
      const payload = data.type === 'logo' 
        ? { logoUrl: data.imageUrl } 
        : { bannerUrl: data.imageUrl };
      
      const res = await apiRequest('PATCH', `/api/teams/${currentTeamId}`, payload);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      // Update UI immediately for better user experience
      if (variables.type === 'logo') {
        setTeamLogoUrl(variables.imageUrl);
      } else {
        setTeamBannerUrl(variables.imageUrl);
      }
      
      // Show success toast
      toast({
        title: "Image Saved",
        description: `Team ${variables.type === 'logo' ? 'logo' : 'banner'} updated successfully`
      });
      
      // Then refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Image",
        description: error.message || "Failed to save image",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for saving diver profile image
  const saveDiverImageMutation = useMutation({
    mutationFn: async (data: { diverId: number; imageUrl: string }) => {
      const res = await apiRequest('PATCH', `/api/divers/${data.diverId}`, {
        imageUrl: data.imageUrl
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save diver image');
      }
      return await res.json();
    },
    onSuccess: (_, variables) => {
      // Update UI immediately for better user experience
      setDiverImages(prev => ({
        ...prev,
        [variables.diverId]: variables.imageUrl
      }));
      
      // Show success toast
      toast({
        title: "Image Saved",
        description: "Diver profile image updated successfully"
      });
      
      // Then refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/teams', currentTeamId, 'divers'] });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Image",
        description: error.message || "Failed to save diver image",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for updating diver profile data
  const updateDiverMutation = useMutation({
    mutationFn: async (data: { diverId: number; diverData: any }) => {
      const res = await apiRequest('PATCH', `/api/divers/${data.diverId}`, data.diverData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update diver');
      }
      return await res.json();
    },
    onSuccess: (_, variables) => {
      // Update local state immediately for better UX
      setDivers(prev => prev.map(diver => 
        diver.id === variables.diverId 
          ? { ...diver, ...variables.diverData } 
          : diver
      ));
      
      // Close edit dialog immediately after local update
      setEditDiverDialogOpen(false);
      setEditingDiver(null);
      
      // Show success message
      toast({
        title: "Diver Updated",
        description: "The diver has been updated successfully"
      });
      
      // Then invalidate queries to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/teams', currentTeamId, 'divers'] });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Diver",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Mutation for deleting a diver
  const deleteDiverMutation = useMutation({
    mutationFn: async (diverId: number) => {
      console.log("Deleting diver with ID:", diverId);
      try {
        const res = await apiRequest('DELETE', `/api/divers/${diverId}`);
        const data = await res.json();
        console.log("Delete response:", data);
        return data;
      } catch (error) {
        console.error("Error deleting diver:", error);
        throw error;
      }
    },
    onSuccess: (_, diverId) => {
      // Update local state first for immediate UI feedback
      setDivers(prevDivers => prevDivers.filter(d => d.id !== diverId));
      
      // Also remove diver's image if it exists
      if (diverImages[diverId]) {
        setDiverImages(prev => {
          const updated = {...prev};
          delete updated[diverId];
          return updated;
        });
      }
      
      // Close dialog and clean up state
      setDeleteDialogOpen(false);
      setDiverToDelete(null);
      
      // Then refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/teams', currentTeamId, 'divers'] });
      
      // Show success message
      toast({
        title: "Diver Deleted",
        description: "The diver has been successfully deleted"
      });
    },
    onError: (error: any) => {
      console.error("Delete mutation error handler:", error);
      
      // Display error toast
      toast({
        title: "Error Deleting Diver",
        description: error.message || "There was a problem deleting the diver",
        variant: "destructive"
      });
      
      // Always close dialog and clean state to prevent UI from freezing
      setDeleteDialogOpen(false);
      setDiverToDelete(null);
      
      // Refresh data to ensure UI is in sync with server
      queryClient.invalidateQueries({ queryKey: ['/api/teams', currentTeamId, 'divers'] });
    }
  });
  
  // Mutation for adding a new diver
  const addDiverMutation = useMutation({
    mutationFn: async (diverData: any) => {
      console.log("Adding diver with data:", diverData);
      try {
        const res = await apiRequest('POST', '/api/divers', diverData);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to add diver");
        }
        return data;
      } catch (error) {
        console.error("Error adding diver:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate cached diver data
      queryClient.invalidateQueries({ queryKey: ['/api/teams', currentTeamId, 'divers'] });
      setDiverDialogOpen(false);
      toast({
        title: "Diver Added",
        description: "New diver has been added to your team"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Diver",
        description: error.message || "There was an error adding the diver",
        variant: "destructive"
      });
    }
  });
  const [diverImages, setDiverImages] = useState<{[key: number]: string}>({});
  
  // State for tab selection
  const [activeTab, setActiveTab] = useState("team");
  
  // State for color pickers - using constants for default colors to maintain consistency
  const DEFAULT_PRIMARY_COLOR = '#E11D48'; // Pink - var(--color-accent-post)
  const DEFAULT_SECONDARY_COLOR = '#7C3AED'; // Purple - var(--color-accent2-post)
  
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_SECONDARY_COLOR);
  const [showColorPicker, setShowColorPicker] = useState<'primary' | 'secondary' | null>(null);
  
  // State for crop functionality
  const [cropMode, setCropMode] = useState<'banner' | 'logo' | 'diver' | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  
  // Initialize form data after currentTeam is defined
  const initialFormData = {
    teamName: currentTeam.name,
    mascot: currentTeam.mascot,
    division: currentTeam.division,
    address: currentTeam.address,
    primaryColor: DEFAULT_PRIMARY_COLOR, // Always use default colors
    secondaryColor: DEFAULT_SECONDARY_COLOR
  };
  
  // Form states for team settings
  const [teamFormData, setTeamFormData] = useState(initialFormData);
  
  // Update form data when team changes
  useEffect(() => {
    const selected = teams.find((t: Team) => t.id === currentTeamId) || teams[0];
    setTeamFormData({
      teamName: selected.name,
      mascot: selected.mascot,
      division: selected.division,
      address: selected.address,
      primaryColor,
      secondaryColor
    });
  }, [currentTeamId, teams, primaryColor, secondaryColor]);
  
  // Sort and filter divers based on selected team and search query
  const filteredDivers = React.useMemo(() => {
    // First filter the divers
    const filtered = divers
      .filter(diver => diver.teamId === currentTeamId)
      .filter(diver => {
        if (!searchQuery) return true;
        const fullName = `${diver.firstName} ${diver.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
    
    // Then sort them if a sort config is active
    if (sortConfig.direction) {
      return [...filtered].sort((a, b) => {
        let aValue: any = '';
        let bValue: any = '';
        
        // Special cases based on the field type
        if (sortConfig.key === 'name') {
          // Name combines firstName and lastName
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        } else if (sortConfig.key === 'avgScore') {
          // Make sure we're comparing numbers for average score
          aValue = typeof a.avgScore === 'string' ? parseFloat(a.avgScore) : (a.avgScore || 0);
          bValue = typeof b.avgScore === 'string' ? parseFloat(b.avgScore) : (b.avgScore || 0);
        } else if (sortConfig.key === 'gradYear') {
          // Make sure we're comparing numbers for grad year
          aValue = typeof a.gradYear === 'string' ? parseInt(a.gradYear) : (a.gradYear || 0);
          bValue = typeof b.gradYear === 'string' ? parseInt(b.gradYear) : (b.gradYear || 0);
        } else {
          aValue = a[sortConfig.key as keyof typeof a] || '';
          bValue = b[sortConfig.key as keyof typeof b] || '';
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [divers, currentTeamId, searchQuery, sortConfig]);
  
  // Function to handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };
  
  // Function to get sorting indicator
  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key || sortConfig.direction === null) {
      return null;
    }
    
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };
    
  // Calculate license usage - only count active divers
  const activeDivers = filteredDivers.filter(diver => diver.status === 'active');
  
  const licenseUsage = {
    totalLicenses: 10, // Example value - this would come from your backend
    usedLicenses: activeDivers.length, // Example value - this would come from your backend
  };
  
  // Note: currentTeam is already defined above
  
  // Handle opening edit diver dialog
  const handleEditDiver = (diver: any) => {
    setEditingDiver(diver);
    setEditDiverDialogOpen(true);
  };
  
  // Handle archiving a diver
  const handleArchiveDiver = (diver: any) => {
    // Update UI immediately for better user experience
    setDivers(prevDivers => 
      prevDivers.map(d => 
        d.id === diver.id ? { ...d, status: 'archived' } : d
      )
    );
    
    // Update in database
    updateDiverMutation.mutate({
      diverId: diver.id,
      diverData: {
        status: 'archived'
      }
    });
    
    toast({
      title: "Diver Archived",
      description: `${diver.firstName} ${diver.lastName} has been archived`
    });
    
    setEditDiverDialogOpen(false);
  };
  
  // Handle restoring a diver
  const handleRestoreDiver = (diver: any) => {
    // Update UI immediately for better user experience
    setDivers(prevDivers => 
      prevDivers.map(d => 
        d.id === diver.id ? { ...d, status: 'active' } : d
      )
    );
    
    // Update in database
    updateDiverMutation.mutate({
      diverId: diver.id,
      diverData: {
        status: 'active'
      }
    });
    
    toast({
      title: "Diver Restored",
      description: `${diver.firstName} ${diver.lastName} has been restored`
    });
    
    setEditDiverDialogOpen(false);
  };
  
  // Handle initiating permanent delete
  const handleInitiateDelete = (diver: any) => {
    setDiverToDelete(diver);
    setDeleteDialogOpen(true);
    setEditDiverDialogOpen(false);
  };
  
  // Handle permanently deleting a diver
  const handlePermanentDelete = () => {
    if (diverToDelete) {
      try {
        // First update UI for immediate feedback
        const diverId = diverToDelete.id;
        
        // Only use the mutation to delete the diver
        // All UI updates handled in the mutation callbacks
        deleteDiverMutation.mutate(diverId);
      } catch (error) {
        console.error("Error when deleting diver:", error);
        setDeleteDialogOpen(false);
        toast({
          title: "Error",
          description: "There was a problem deleting the diver",
          variant: "destructive"
        });
      }
    }
  };
  
  // Image upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo' | 'diver', diverId?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // Set image to edit and enter crop mode
      setImageToEdit(result);
      setCropMode(type); // Now supporting all types including 'diver'
      
      // For direct updates (without crop UI for now)
      switch (type) {
        case 'banner':
          if (cropMode === null) { // If we're not using the crop UI yet
            setTeamBannerUrl(result);
            // Save to database
            saveTeamImageMutation.mutate({
              type: 'banner',
              imageUrl: result
            });
          }
          break;
        case 'logo':
          if (cropMode === null) { // If we're not using the crop UI yet
            setTeamLogoUrl(result);
            // Save to database
            saveTeamImageMutation.mutate({
              type: 'logo',
              imageUrl: result
            });
          }
          break;
        case 'diver':
          if (diverId !== undefined) {
            setDiverImages(prev => ({
              ...prev,
              [diverId]: result
            }));
            
            // Save to database
            saveDiverImageMutation.mutate({
              diverId: diverId,
              imageUrl: result
            });
          }
          break;
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };
  
  // Handle image zoom
  const handleZoomChange = (value: number) => {
    setImageZoom(value);
  };
  
  // Handle image position
  const handleImageDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only drag on left mouse button
    
    setImagePosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };
  
  // Save edited image after cropping
  const handleSaveEditedImage = () => {
    if (!imageToEdit) return;
    
    // Here we would apply actual cropping transformations with the zoom and position
    // For now we just save the original image
    
    if (cropMode === 'banner') {
      setTeamBannerUrl(imageToEdit);
      // Save to database
      saveTeamImageMutation.mutate({
        type: 'banner',
        imageUrl: imageToEdit
      });
      toast({
        title: "Banner updated",
        description: "Team banner has been updated successfully"
      });
    } else if (cropMode === 'logo') {
      setTeamLogoUrl(imageToEdit);
      // Save to database
      saveTeamImageMutation.mutate({
        type: 'logo',
        imageUrl: imageToEdit
      });
      toast({
        title: "Logo updated",
        description: "Team logo has been updated successfully"
      });
    } else if (cropMode === 'diver' && editingDiver) {
      // Save diver profile image
      setDiverImages(prev => ({
        ...prev,
        [editingDiver.id]: imageToEdit
      }));
      
      // Save to database
      saveDiverImageMutation.mutate({
        diverId: editingDiver.id,
        imageUrl: imageToEdit
      });
      
      toast({
        title: "Photo updated",
        description: "Diver profile picture has been updated successfully"
      });
    }
    
    // Reset cropping state
    setCropMode(null);
    setImageToEdit(null);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };
  
  // Cancel image editing
  const handleCancelImageEdit = () => {
    setCropMode(null);
    setImageToEdit(null);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };
  
  // Save team settings
  // Create a mutation for updating team settings
  const updateTeamMutation = useMutation({
    mutationFn: async (teamData: any) => {
      const res = await apiRequest('PATCH', `/api/teams/${currentTeamId}`, teamData);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate the teams query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
    }
  });
  
  // Mutation for deleting a team
  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const res = await apiRequest('DELETE', `/api/teams/${teamId}`);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate teams query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      // Switch to another team after deletion
      if (teams.length > 1) {
        const remainingTeams = teams.filter((t: Team) => t.id !== currentTeamId);
        if (remainingTeams.length > 0) {
          setCurrentTeamId(remainingTeams[0].id);
        }
      }
      toast({
        title: "Team Deleted",
        description: "The team has been permanently deleted"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Team",
        description: error.message || "There was an error deleting the team",
        variant: "destructive"
      });
    }
  });

  const handleSaveTeamSettings = () => {
    // Get values directly from the form
    const teamName = teamFormData.teamName;
    
    // Always maintain the default pink and purple accent colors
    // Don't let the user change them
    const teamData = {
      name: teamName,
      mascot: teamFormData.mascot,
      division: teamFormData.division,
      address: teamFormData.address,
      primaryColor: DEFAULT_PRIMARY_COLOR, // Always use default pink
      secondaryColor: DEFAULT_SECONDARY_COLOR, // Always use default purple
      bannerUrl: teamBannerUrl,
      logoUrl: teamLogoUrl
    };
    
    // Use the mutation to update the team in the database
    updateTeamMutation.mutate(teamData);
    
    // Close dialog and show success toast regardless of API response
    // This gives better UX when network issues occur
    toast({
      title: "Team Updated",
      description: "Team settings have been saved successfully"
    });
    
    // Close dialog immediately
    setTeamSettingsOpen(false);
  };
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>{currentTeam.name} - RipScore</title>
      </Helmet>
      
      {/* Team Banner */}
      <div className="relative mb-8 rounded-xl overflow-hidden border border-[var(--color-border-post)] h-48 bg-[var(--color-background-post)]">
        {/* Banner Image */}
        {teamBannerUrl ? (
          <div className="absolute inset-0">
            <img 
              src={teamBannerUrl} 
              alt="Team Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors">
              {/* Upload overlay for replacing image removed */}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-post)]/10 to-[var(--color-accent2-post)]/10">
            {/* Placeholder content when no banner exists */}
            <div className="absolute inset-0 flex items-center justify-center text-[var(--color-muted-post)]">
              <div className="text-center">
                <Camera className="h-10 w-10 mx-auto mb-2 opacity-70" />
                <p className="text-sm font-medium">Add Team Banner</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Team settings gear icon */}
        <button 
          className="absolute top-4 right-4 bg-black/40 rounded-full p-2 cursor-pointer hover:bg-black/60 transition-all z-10 opacity-70 hover:opacity-100"
          onClick={() => {
            // Get the current selected team
            const selected = teams.find((t: Team) => t.id === currentTeamId) || teams[0];
            // Update form data with current team info
            setTeamFormData({
              teamName: selected.name,
              mascot: selected.mascot,
              division: selected.division,
              address: selected.address,
              primaryColor: primaryColor,
              secondaryColor: secondaryColor
            });
            setTeamSettingsOpen(true);
          }}
          aria-label="Open team settings"
        >
          <Settings className="h-5 w-5 text-white" />
        </button>
        
        {/* Team info with semi-transparent box background */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
          <div className="flex gap-3 bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg">
            {/* Team Logo */}
            <div className="relative group">
              <div className="h-16 w-16 rounded-full border-2 border-[var(--color-border-post)] overflow-hidden flex items-center justify-center bg-[var(--color-accent-post)]/10">
                {teamLogoUrl ? (
                  <img 
                    src={teamLogoUrl} 
                    alt="Team Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <School className="h-8 w-8 text-[var(--color-accent-post)]" />
                )}
              </div>
            </div>
            
            {/* Team name and mascot */}
            <div className="flex-1 relative">
              <h1 className="text-2xl font-bold text-white flex items-center">
                {currentTeam.name}
                <button 
                  id="team-name-dropdown-button"
                  className="ml-1 bg-transparent border-none p-0 cursor-pointer z-20" 
                  onClick={(e) => {
                    e.preventDefault();
                    // Instead of using a global function, we'll interact with the state directly
                    document.getElementById('team-dropdown-trigger')?.click();
                  }}
                >
                  <ChevronDown className="h-5 w-5 text-white/80" />
                </button>
              </h1>
              <p className="text-white/80">{currentTeam.mascot}</p>
              
              <TeamSwitcher 
                teams={teams}
                currentTeamId={currentTeamId}
                onTeamChange={setCurrentTeamId}
                onAddTeam={() => setAddTeamDialogOpen(true)}
              />
            </div>
          </div>
          
          {/* License Usage Bar with 50% opacity background - moved down and to the right */}
          <div className="relative group mr-2 mb-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-md px-2 py-1 border border-[var(--color-border-post)]">
              <div className="flex items-center text-xs font-medium">
                <span className="text-white/80 mr-2">Divers:</span>
                <span className="text-white">{licenseUsage.usedLicenses}/{licenseUsage.totalLicenses}</span>
              </div>
              <div className="w-24 h-1.5 bg-[var(--color-border-post)] rounded-full overflow-hidden mt-1">
                <div 
                  className={`h-full ${licenseUsage.usedLicenses >= licenseUsage.totalLicenses ? 'bg-red-500' : 'bg-[var(--color-accent-post)]'}`}
                  style={{ width: `${(licenseUsage.usedLicenses / licenseUsage.totalLicenses) * 100}%` }}
                />
              </div>
            </div>
            
            {/* License info popup */}
            <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-[var(--color-card-post)] rounded-md border border-[var(--color-border-post)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <h4 className="text-sm font-medium text-[var(--color-text-post)] mb-2">License Usage</h4>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-[var(--color-muted-post)]">Active Divers</span>
                <span className="text-[var(--color-text-post)]">{licenseUsage.usedLicenses}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-[var(--color-muted-post)]">Total Licenses</span>
                <span className="text-[var(--color-text-post)]">{licenseUsage.totalLicenses}</span>
              </div>
              <div className="w-full h-2 bg-[var(--color-border-post)] rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${licenseUsage.usedLicenses >= licenseUsage.totalLicenses ? 'bg-red-500' : 'bg-[var(--color-accent-post)]'}`}
                  style={{ width: `${(licenseUsage.usedLicenses / licenseUsage.totalLicenses) * 100}%` }}
                />
              </div>
              {licenseUsage.usedLicenses >= licenseUsage.totalLicenses && (
                <div className="text-right">
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-xs text-[var(--color-accent-post)]"
                  >
                    Purchase more licenses
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Settings Dialog */}
      {/* LinkedIn-style Image Crop Dialog */}
      <Dialog open={cropMode !== null} onOpenChange={(isOpen) => !isOpen && handleCancelImageEdit()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit photo</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="border-b border-[var(--color-border-post)] mb-4">
              <div className="flex space-x-10 mb-[-1px]">
                <div className="border-b-2 border-[var(--color-accent-post)] pb-2 font-medium text-[var(--color-accent-post)]">
                  Crop
                </div>
                <div className="text-[var(--color-muted-post)] pb-2 cursor-pointer hover:text-[var(--color-text-post)]">
                  Filter
                </div>
                <div className="text-[var(--color-muted-post)] pb-2 cursor-pointer hover:text-[var(--color-text-post)]">
                  Adjust
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {imageToEdit && (
                <div 
                  className="w-full lg:w-2/3 h-80 overflow-hidden relative border border-[var(--color-border-post)] rounded-md"
                  onMouseMove={handleImageDrag}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={imageToEdit} 
                      alt={cropMode === 'logo' ? 'Team Logo' : cropMode === 'banner' ? 'Team Banner' : 'Diver Photo'} 
                      className="max-w-full max-h-full"
                      style={{
                        transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                        transformOrigin: 'center',
                        objectFit: 'contain'
                      }}
                      draggable={false}
                    />
                    
                    {/* Circular crop overlay for diver photos */}
                    {cropMode === 'diver' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 rounded-full border-2 border-white" />
                      </div>
                    )}
                    
                    {/* Square crop overlay for logos */}
                    {cropMode === 'logo' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-white" />
                      </div>
                    )}
                    
                    {/* Wide rectangle crop overlay for banners */}
                    {cropMode === 'banner' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-32 border-2 border-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="w-full lg:w-1/3 space-y-6">
                <div className="flex justify-center space-x-4">
                  <button 
                    className="w-8 h-8 rounded-full bg-[var(--color-background-post)] border border-[var(--color-border-post)] flex items-center justify-center"
                    onClick={() => {
                      setImageZoom(1);
                      setImagePosition({ x: 0, y: 0 });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-post)]">
                      <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"></path>
                      <path d="M12 7v10"></path>
                      <path d="M7 12h10"></path>
                    </svg>
                  </button>
                  <button 
                    className="w-8 h-8 rounded-full bg-[var(--color-background-post)] border border-[var(--color-border-post)] flex items-center justify-center"
                    onClick={() => {
                      setImagePosition({ x: 0, y: 0 });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-post)]">
                      <path d="M21 2v6h-6"></path>
                      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                      <path d="M3 22v-6h6"></path>
                      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-[var(--color-text-post)]">Zoom</p>
                  <Slider 
                    min={1} 
                    max={3} 
                    step={0.1} 
                    value={[imageZoom]} 
                    onValueChange={(value) => handleZoomChange(value[0])}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-[var(--color-text-post)]">Straighten</p>
                  <Slider 
                    min={-45} 
                    max={45} 
                    step={1} 
                    value={[0]} 
                    className="w-full"
                    // Currently just a UI element with no function
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex justify-between items-center sm:justify-between">
            <div className="flex items-center">
              <span className="flex items-center text-sm text-[var(--color-muted-post)] mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {cropMode === 'diver' ? 'Team Only' : 'Anyone'}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancelImageEdit}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                onClick={handleSaveEditedImage}
              >
                Save photo
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={teamSettingsOpen} onOpenChange={setTeamSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Settings</DialogTitle>
            <DialogDescription>
              Manage your team information and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="mt-2">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="info">Team Info</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="licenses">Licenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input 
                    id="team-name" 
                    value={teamFormData.teamName || ''} 
                    onChange={(e) => setTeamFormData({...teamFormData, teamName: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="mascot">Mascot</Label>
                  <Input 
                    id="mascot" 
                    value={teamFormData.mascot} 
                    onChange={(e) => setTeamFormData({...teamFormData, mascot: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="team-division">Team Division or Type</Label>
                  <Select 
                    value={teamFormData.division} 
                    onValueChange={(value) => setTeamFormData({...teamFormData, division: value})}
                  >
                    <SelectTrigger id="team-division">
                      <SelectValue placeholder="Select division or type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Division I">Division I</SelectItem>
                      <SelectItem value="Division II">Division II</SelectItem>
                      <SelectItem value="Division III">Division III</SelectItem>
                      <SelectItem value="NJCAA">NJCAA</SelectItem>
                      <SelectItem value="club/AAU">Club/AAU</SelectItem>
                      <SelectItem value="Highschool">Highschool</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="team-address">Address</Label>
                  <Input 
                    id="team-address" 
                    value={teamFormData.address} 
                    onChange={(e) => setTeamFormData({...teamFormData, address: e.target.value})}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="branding" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="block mb-2">Team Logo</Label>
                  <div className="relative group w-40 h-40 mx-auto rounded-full border-2 border-dashed border-[var(--color-border-post)] overflow-hidden flex items-center justify-center bg-[var(--color-accent-post)]/10">
                    {teamLogoUrl ? (
                      <img 
                        src={teamLogoUrl} 
                        alt="Team Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <School className="h-16 w-16 text-[var(--color-muted-post)]" />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-xs">Upload Logo</span>
                      </div>
                    </div>
                    
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      aria-label="Upload team logo"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                  </div>
                  <p className="text-xs text-center text-[var(--color-muted-post)] mt-2">Recommended: Square image, at least 200x200px</p>
                </div>
                
                <div>
                  <Label className="block mb-2">Team Banner</Label>
                  <div className="relative group h-40 rounded border-2 border-dashed border-[var(--color-border-post)] overflow-hidden flex items-center justify-center bg-[var(--color-accent-post)]/10">
                    {teamBannerUrl ? (
                      <img 
                        src={teamBannerUrl} 
                        alt="Team Banner" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-[var(--color-muted-post)]">
                        <Camera className="h-16 w-16 mx-auto mb-2" />
                        <span>No banner uploaded</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-xs">Upload Banner</span>
                      </div>
                    </div>
                    
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      aria-label="Upload team banner"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                    />
                  </div>
                  <p className="text-xs text-center text-[var(--color-muted-post)] mt-2">Recommended: 1200x300px landscape image</p>
                </div>
              </div>
              
              <div className="grid gap-6 mt-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-post)]">Team Colors</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-4">
                      <ColorPicker 
                        value={teamFormData.primaryColor} 
                        onChange={(value) => {
                          setPrimaryColor(value);
                          setTeamFormData({...teamFormData, primaryColor: value});
                        }}
                        imageUrl={teamLogoUrl}
                        label="Primary Color"
                      />
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-full rounded-lg border border-[var(--color-border-post)] overflow-hidden">
                        <div className="h-full" style={{ backgroundColor: teamFormData.primaryColor }}></div>
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-muted-post)]">Primary Brand Color</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <ColorPicker 
                        value={teamFormData.secondaryColor} 
                        onChange={(value) => {
                          setSecondaryColor(value);
                          setTeamFormData({...teamFormData, secondaryColor: value});
                        }}
                        imageUrl={teamLogoUrl}
                        label="Secondary Color"
                      />
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-full rounded-lg border border-[var(--color-border-post)] overflow-hidden">
                        <div className="h-full" style={{ backgroundColor: teamFormData.secondaryColor }}></div>
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-muted-post)]">Secondary Brand Color</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-[var(--color-border-post)] rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Brand Preview</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: teamFormData.primaryColor }}>
                      <div className="h-20 flex items-center justify-center text-white font-semibold">Primary</div>
                    </div>
                    <div className="rounded-lg overflow-hidden bg-gradient-to-r" style={{ 
                      backgroundImage: `linear-gradient(to right, ${teamFormData.primaryColor}, ${teamFormData.secondaryColor})` 
                    }}>
                      <div className="h-20 flex items-center justify-center text-white font-semibold">Gradient</div>
                    </div>
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: teamFormData.secondaryColor }}>
                      <div className="h-20 flex items-center justify-center text-white font-semibold">Secondary</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="licenses" className="space-y-4">
              <div className="p-6 rounded-lg border border-[var(--color-border-post)] bg-[var(--color-card-post)]">
                <h3 className="text-lg font-semibold text-white mb-4">License Usage</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-white">Active Divers</span>
                  <span className="text-sm font-medium text-white">{licenseUsage.usedLicenses}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-white">Total Licenses</span>
                  <span className="text-sm font-medium text-white">{licenseUsage.totalLicenses}</span>
                </div>
                <div className="w-full h-3 bg-[var(--color-border-post)] rounded-full overflow-hidden mb-5">
                  <div 
                    className={`h-full ${licenseUsage.usedLicenses >= licenseUsage.totalLicenses ? 'bg-red-500' : 'bg-[var(--color-accent-post)]'}`}
                    style={{ width: `${(licenseUsage.usedLicenses / licenseUsage.totalLicenses) * 100}%` }}
                  />
                </div>
                
                <div className="py-4 border-t border-[var(--color-border-post)]">
                  <h4 className="text-base font-semibold text-white mb-2">License Information</h4>
                  <p className="text-sm text-white/80 mb-4">
                    Your team is on the <span className="text-[var(--color-accent-post)] font-semibold">Gold</span> plan with 10 diver licenses. 
                    <br />License renewal date: <span className="text-white font-medium">May 15, 2026</span>
                  </p>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-sm h-9 text-white border-white/20 hover:bg-white/10"
                    >
                      View Billing History
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90 text-sm h-9"
                    >
                      Purchase More Licenses
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-end w-full">
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600 hover:bg-red-50/10"
                    onClick={() => {
                      // Open the delete team confirmation modal instead of using window.confirm
                      setTeamSettingsOpen(false);
                      setDeleteConfirmText('');
                      setDeleteTeamDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Team
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => setTeamSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                onClick={handleSaveTeamSettings}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={addTeamDialogOpen} onOpenChange={setAddTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a New Team</DialogTitle>
            <DialogDescription>
              Enter your team information to get started.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input id="team-name" placeholder="e.g., Gold Dolphins" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-name">School Name</Label>
              <Input id="school-name" placeholder="e.g., West Lake High School" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="team-division">Team Division</Label>
              <Select>
                <SelectTrigger id="team-division">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="division1">Division I</SelectItem>
                  <SelectItem value="division2">Division II</SelectItem>
                  <SelectItem value="division3">Division III</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
              onClick={() => setAddTeamDialogOpen(false)}
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Space for margin after banner */}
      <div className="mb-6"></div>
      
      <div className="bg-[var(--color-card-post)] rounded-xl border border-[var(--color-border-post)] mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="p-4 flex flex-col md:flex-row justify-between md:items-center border-b border-[var(--color-border-post)]">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <div className="w-auto">
                <TabsList className="bg-[var(--color-background-post)]/40 border border-[var(--color-border-post)]">
                  <TabsTrigger 
                    value="team" 
                    className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-[var(--color-text-post)]"
                  >
                    Team
                  </TabsTrigger>
                  <TabsTrigger 
                    value="meets" 
                    className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-[var(--color-text-post)]"
                  >
                    Meets
                  </TabsTrigger>
                  <TabsTrigger 
                    value="practices" 
                    className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-[var(--color-text-post)]"
                  >
                    Practices
                  </TabsTrigger>
                </TabsList>
              </div>
            
            {/* View toggle - only show in team tab */}
            {activeTab === "team" && (
              <div className="flex items-center bg-[var(--color-background-post)]/40 rounded-md p-1 border border-[var(--color-border-post)]">
                <button
                  className={`px-2 py-1 rounded-sm transition-colors ${
                    viewType === 'card' 
                      ? 'bg-pink-600/10 text-pink-600' 
                      : 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]'
                  }`}
                  onClick={() => setViewType('card')}
                  aria-label="Card view"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5C4 4.44772 4.44772 4 5 4H9C9.55228 4 10 4.44772 10 5V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 5C14 4.44772 14.4477 4 15 4H19C19.5523 4 20 4.44772 20 5V9C20 9.55228 19.5523 10 19 10H15C14.4477 10 14 9.55228 14 9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 15C4 14.4477 4.44772 14 5 14H9C9.55228 14 10 14.4477 10 15V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  className={`px-2 py-1 rounded-sm transition-colors ${
                    viewType === 'list' 
                      ? 'bg-pink-600/10 text-pink-600' 
                      : 'text-[var(--color-muted-post)] hover:text-[var(--color-text-post)]'
                  }`}
                  onClick={() => setViewType('list')}
                  aria-label="List view"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 gap-2">
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-post)]" />
              <Input 
                placeholder={activeTab === "team" ? "Search divers..." : 
                            activeTab === "meets" ? "Search meets..." : 
                            "Search practices..."}
                className="pl-10 border-[var(--color-border-post)] bg-[#121a2d] text-[var(--color-text-post)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={diverDialogOpen} onOpenChange={setDiverDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                  disabled={licenseUsage.usedLicenses >= licenseUsage.totalLicenses}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {activeTab === "team" ? "Add Diver" : 
                   activeTab === "meets" ? "Add Meet" : 
                   "Add Practice"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === "team" ? "Add a New Diver" : 
                     activeTab === "meets" ? "Add a New Meet" : 
                     "Add a New Practice"}
                  </DialogTitle>
                  <DialogDescription>
                    {activeTab === "team" 
                      ? "Enter the diver's information below to add them to your team."
                      : activeTab === "meets" 
                        ? "Enter the meet information below to add it to your schedule."
                        : "Enter the practice information below to add it to your schedule."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="e.g., John" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="e.g., Smith" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="e.g., john@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="grad-year">Graduation Year</Label>
                      <Select>
                        <SelectTrigger id="grad-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                          <SelectItem value="2028">2028</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="e.g., 16" min="1" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="text-[var(--color-muted-post)]"
                    onClick={() => setDiverDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                    onClick={() => {
                      // Get values from form fields
                      const firstName = (document.getElementById('first-name') as HTMLInputElement)?.value;
                      const lastName = (document.getElementById('last-name') as HTMLInputElement)?.value;
                      const email = (document.getElementById('email') as HTMLInputElement)?.value;
                      const gradYear = (document.getElementById('grad-year') as HTMLSelectElement)?.value;
                      const age = (document.getElementById('age') as HTMLInputElement)?.value;
                      const gender = (document.getElementById('gender') as HTMLSelectElement)?.value;
                      
                      // Validate required fields
                      if (!firstName || !lastName) {
                        toast({
                          title: "Missing Information",
                          description: "First name and last name are required",
                          variant: "destructive"
                        });
                        return;
                      }
                      
                      // Create diver data
                      const diverData = {
                        teamId: currentTeamId,
                        firstName,
                        lastName,
                        email: email || undefined,
                        gradYear: gradYear || undefined,
                        age: age ? parseInt(age) : undefined,
                        gender: gender || undefined,
                        status: 'active'
                      };
                      
                      // Add to database
                      addDiverMutation.mutate(diverData);
                    }}
                  >
                    Add Diver
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
          <TabsContent value="team" className="mt-0">
            {viewType === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-post)] bg-[var(--color-background-post)]/50">
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)] cursor-pointer hover:text-[var(--color-accent-post)]"
                    onClick={() => requestSort('name')}
                  >
                    Name{getSortIndicator('name')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)] cursor-pointer hover:text-[var(--color-accent-post)]"
                    onClick={() => requestSort('gradYear')}
                  >
                    Grad Year{getSortIndicator('gradYear')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)] cursor-pointer hover:text-[var(--color-accent-post)]"
                    onClick={() => requestSort('age')}
                  >
                    Age{getSortIndicator('age')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)] cursor-pointer hover:text-[var(--color-accent-post)]"
                    onClick={() => requestSort('gender')}
                  >
                    Gender{getSortIndicator('gender')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)] cursor-pointer hover:text-[var(--color-accent-post)]"
                    onClick={() => requestSort('avgScore')}
                  >
                    Avg. Score{getSortIndicator('avgScore')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--color-muted-post)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-post)]">
                {filteredDivers.map((diver) => (
                  <tr 
                    key={diver.id} 
                    className={`cursor-pointer transition-colors ${
                      diver.status === 'archived' 
                        ? 'opacity-70 bg-[var(--color-background-post)]/10 hover:bg-[var(--color-background-post)]/20' 
                        : diver.isCaptain
                          ? 'bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-amber-400'
                          : 'hover:bg-[var(--color-background-post)]/30'
                    }`}
                    onClick={() => handleEditDiver(diver)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative mr-3 flex-shrink-0 group">
                          <div className="h-8 w-8 rounded-full bg-[var(--color-background-post)]/70 border border-[var(--color-border-post)] overflow-hidden flex items-center justify-center">
                            {diverImages[diver.id] ? (
                              <img 
                                src={diverImages[diver.id]} 
                                alt={`${diver.firstName} ${diver.lastName}`} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              // Display first letter of first name as placeholder
                              <span className={`text-sm font-medium ${diver.status === 'archived' ? 'text-[var(--color-muted-post)]' : 'text-[var(--color-text-post)]'}`}>
                                {diver.firstName.charAt(0)}
                              </span>
                            )}
                            
                            {/* Hover overlay for upload */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Upload className="h-3 w-3 text-white" />
                            </div>
                            
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              accept="image/*"
                              aria-label={`Upload headshot for ${diver.firstName} ${diver.lastName}`}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleFileUpload(e, 'diver', diver.id)}
                            />
                          </div>
                        </div>
                        <div className={`font-medium ${
                          diver.status === 'archived' 
                            ? 'text-[var(--color-muted-post)]' 
                            : diver.isCaptain 
                              ? 'text-amber-500' 
                              : 'text-[var(--color-text-post)]'
                        }`}>
                          <div className="flex items-center">
                            {diver.firstName} {diver.lastName}
                            {diver.isCaptain && (
                              <Badge className="ml-2 bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200">
                                <Crown className="h-3 w-3 mr-1 text-amber-500" />
                                Team Captain
                              </Badge>
                            )}
                            {diver.status === 'archived' && <span className="ml-2 text-xs text-amber-500">(Archived)</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-muted-post)]">{diver.gradYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-muted-post)]">{diver.age}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-muted-post)]">{diver.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${diver.status === 'archived' ? 'text-[var(--color-muted-post)]' : 'text-[var(--color-accent-post)]'}`}>
                        {diver.avgScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDiver(diver)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Diver Profile</span>
                            </DropdownMenuItem>
                            
                            {diver.status === 'active' ? (
                              <DropdownMenuItem 
                                className="text-amber-500 hover:text-amber-600"
                                onClick={() => handleArchiveDiver(diver)}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Archive Diver</span>
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuItem 
                                  className="text-green-500 hover:text-green-600"
                                  onClick={() => handleRestoreDiver(diver)}
                                >
                                  <Archive className="mr-2 h-4 w-4 rotate-180" />
                                  <span>Restore Diver</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleInitiateDelete(diver)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete Permanently</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredDivers.length === 0 && (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-background-post)]/50 flex items-center justify-center mb-3">
                  <Info className="h-6 w-6 text-[var(--color-muted-post)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--color-text-post)]">No divers found</h3>
                <p className="mt-1 text-sm text-[var(--color-muted-post)]">
                  Get started by adding your first diver to this team.
                </p>
                <div className="mt-4">
                  <Button 
                    className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                    onClick={() => setDiverDialogOpen(true)}
                    disabled={licenseUsage.usedLicenses >= licenseUsage.totalLicenses}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Your First Diver
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {filteredDivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredDivers.map((diver) => (
                  <div 
                    key={diver.id}
                    className={`relative rounded-lg border overflow-hidden transition-all cursor-pointer h-96 ${
                      diver.status === 'archived' 
                        ? 'border-[var(--color-border-post)]/30 opacity-70' 
                        : diver.isCaptain
                          ? 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                          : 'border-[var(--color-border-post)] hover:shadow-md'
                    }`}
                    onClick={() => handleEditDiver(diver)}
                  >
                    {/* Card background with diver image or gradient */}
                    <div className="absolute inset-0">
                      {diverImages[diver.id] ? (
                        <img 
                          src={diverImages[diver.id]} 
                          alt={`${diver.firstName} ${diver.lastName}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-accent-post)]/20 to-[var(--color-accent2-post)]/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10rem] font-medium opacity-20 text-[var(--color-accent-post)]">
                              {diver.firstName.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${
                        diver.status === 'archived' 
                          ? 'from-black/90 via-black/60 to-black/40' 
                          : 'from-black/90 via-black/40 to-transparent'
                      }`}></div>
                    </div>
                    
                    {/* Upload control */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
                      {/* Status badge */}
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        diver.status === 'active' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {diver.status.charAt(0).toUpperCase() + diver.status.slice(1)}
                      </div>
                      
                      {/* Action menu */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 bg-black/40 hover:bg-black/60 text-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDiver(diver)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Diver Profile</span>
                            </DropdownMenuItem>
                            
                            {diver.status === 'active' ? (
                              <DropdownMenuItem 
                                className="text-amber-500 hover:text-amber-600"
                                onClick={() => handleArchiveDiver(diver)}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Archive Diver</span>
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuItem 
                                  className="text-green-500 hover:text-green-600"
                                  onClick={() => handleRestoreDiver(diver)}
                                >
                                  <Archive className="mr-2 h-4 w-4 rotate-180" />
                                  <span>Restore Diver</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleInitiateDelete(diver)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete Permanently</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Card content - positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <div>
                        <div>
                          {diver.isCaptain && (
                            <Badge className="mb-1 bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200">
                              <Crown className="h-3 w-3 mr-1 text-amber-500" />
                              Team Captain
                            </Badge>
                          )}
                          
                          <h3 className="font-semibold text-lg text-white">
                            {diver.firstName} {diver.lastName}
                          </h3>
                          <p className="text-white/70 text-sm">Class of {diver.gradYear}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Upload functionality removed from card view as requested */}
                    <input 
                      id={`diver-photo-${diver.id}`}
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      aria-label={`Upload photo for ${diver.firstName} ${diver.lastName}`}
                      onChange={(e) => handleFileUpload(e, 'diver', diver.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-background-post)]/50 flex items-center justify-center mb-3">
                  <Info className="h-6 w-6 text-[var(--color-muted-post)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--color-text-post)]">No divers found</h3>
                <p className="mt-1 text-sm text-[var(--color-muted-post)]">
                  Get started by adding your first diver to this team.
                </p>
                <div className="mt-4">
                  <Button 
                    className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                    onClick={() => setDiverDialogOpen(true)}
                    disabled={licenseUsage.usedLicenses >= licenseUsage.totalLicenses}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Your First Diver
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
          </TabsContent>
          
          <TabsContent value="meets" className="mt-0">
            <div className="p-6">
              <div className="text-center py-8 border border-dashed border-[var(--color-border-post)] rounded-lg bg-[var(--color-background-post)]/20">
                <h3 className="text-lg font-medium text-[var(--color-text-post)] mb-2">No Meets Scheduled</h3>
                <p className="text-[var(--color-muted-post)] max-w-md mx-auto mb-4">
                  You haven't added any meets for this team yet. Click the button below to add your first meet.
                </p>
                <Button className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Meet
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="practices" className="mt-0">
            <div className="p-6">
              <div className="text-center py-8 border border-dashed border-[var(--color-border-post)] rounded-lg bg-[var(--color-background-post)]/20">
                <h3 className="text-lg font-medium text-[var(--color-text-post)] mb-2">No Practices Scheduled</h3>
                <p className="text-[var(--color-muted-post)] max-w-md mx-auto mb-4">
                  You haven't set up any practices for this team yet. Click the button below to add your first practice.
                </p>
                <Button className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Practice
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Permanently Delete Diver</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The diver and all associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          {diverToDelete && (
            <div className="py-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-[var(--color-accent-post)]/10 flex items-center justify-center">
                  {diverImages[diverToDelete.id] ? (
                    <img
                      src={diverImages[diverToDelete.id]}
                      alt={`${diverToDelete.firstName} ${diverToDelete.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-[var(--color-accent-post)]">
                      {diverToDelete.firstName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{diverToDelete.firstName} {diverToDelete.lastName}</p>
                  <p className="text-sm text-[var(--color-muted-post)]">
                    {diverToDelete.gender === 'male' ? 'Male' : 'Female'} • {diverToDelete.gradYear}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handlePermanentDelete}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Team Confirmation Dialog */}
      <Dialog open={deleteTeamDialogOpen} onOpenChange={setDeleteTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Team</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the team 
              <span className="font-semibold"> {currentTeam?.name} </span> 
              and all associated data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">To confirm, type "delete" below:</p>
              <Input 
                value={deleteConfirmText} 
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'delete' to confirm"
                className="border-red-200 focus-visible:ring-red-400"
              />
            </div>
            
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                Warning: Deleting this team will remove all divers, meets, and other data associated with it.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDeleteTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteConfirmText !== 'delete'}
              onClick={() => {
                if (deleteConfirmText === 'delete') {
                  // Delete the team
                  deleteTeamMutation.mutate(currentTeamId);
                  // Close the dialog
                  setDeleteTeamDialogOpen(false);
                }
              }}
            >
              Delete Team Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit diver dialog */}
      {editingDiver && (
        <Dialog open={editDiverDialogOpen} onOpenChange={setEditDiverDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Diver Profile
                {editingDiver.status === 'archived' && <span className="ml-2 text-xs text-amber-500">(Archived)</span>}
              </DialogTitle>
              <DialogDescription>
                Manage {editingDiver.firstName} {editingDiver.lastName}'s profile and settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-border-post)] bg-[var(--color-background-post)]">
                {diverImages[editingDiver.id] ? (
                  <img
                    src={diverImages[editingDiver.id]}
                    alt={`${editingDiver.firstName} ${editingDiver.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--color-accent-post)]/10">
                    <span className="text-2xl font-medium text-[var(--color-accent-post)]">
                      {editingDiver.firstName.charAt(0)}
                    </span>
                  </div>
                )}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => {
                    // Trigger the file input programmatically
                    const fileInput = document.getElementById(`diver-profile-photo-${editingDiver.id}`);
                    if (fileInput) fileInput.click();
                  }}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input 
                  id={`diver-profile-photo-${editingDiver.id}`}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  aria-label={`Upload photo for ${editingDiver.firstName} ${editingDiver.lastName}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    setImageToEdit(URL.createObjectURL(file));
                    setCropMode('diver');
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input id="edit-first-name" defaultValue={editingDiver.firstName} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input id="edit-last-name" defaultValue={editingDiver.lastName} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="edit-email">Email</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-6 text-xs px-2 py-0 text-blue-500 border-blue-200 hover:bg-blue-50/10"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle send/resend invite logic
                        toast({
                          title: "Invite Sent",
                          description: `An invite has been sent to ${editingDiver.email}`,
                          variant: "default"
                        });
                      }}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Send Invite
                    </Button>
                  </div>
                  <Input id="edit-email" type="email" defaultValue={editingDiver.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-grad-year">Graduation Year</Label>
                  <Select defaultValue={editingDiver.gradYear.toString()}>
                    <SelectTrigger id="edit-grad-year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-dob">Date of Birth</Label>
                  <Input 
                    id="edit-dob" 
                    type="date"
                    defaultValue="2008-01-01" // This would come from the diver's actual DOB
                  />
                  <p className="text-xs text-[var(--color-muted-post)]">We'll calculate age automatically</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select defaultValue={editingDiver.gender.toLowerCase()}>
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
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="captain-status"
                  className="h-4 w-4 rounded border-[var(--color-border-post)] text-[var(--color-accent-post)] focus:ring-[var(--color-accent-post)]"
                  defaultChecked={editingDiver.isCaptain}
                  onChange={(e) => {
                    setEditingDiver({
                      ...editingDiver,
                      isCaptain: e.target.checked
                    });
                  }}
                />
                <div className="grid gap-0.5">
                  <Label htmlFor="captain-status" className="font-medium">Team Captain</Label>
                  <p className="text-[0.8rem] text-[var(--color-muted-post)]">
                    Designate this diver as a team captain. Captains will appear with a gold highlight in the roster.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div>
                {editingDiver.status === 'active' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleArchiveDiver(editingDiver)}
                    className="text-amber-500 hover:text-amber-600 border-amber-500 hover:border-amber-600 hover:bg-amber-50/10"
                  >
                    <Archive className="h-4 w-4 mr-2" /> Archive Diver
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleRestoreDiver(editingDiver)}
                      className="text-green-500 hover:text-green-600 border-green-500 hover:border-green-600 hover:bg-green-50/10"
                    >
                      <Archive className="h-4 w-4 mr-2 rotate-180" /> Restore Diver
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleInitiateDelete(editingDiver)}
                      className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600 hover:bg-red-50/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                    </Button>
                  </div>
                )}
              </div>
              <Button 
                className="bg-[var(--color-accent-post)] hover:bg-[var(--color-accent-post)]/90"
                onClick={() => {
                  try {
                    // Get values from form fields
                    const firstName = (document.getElementById('edit-first-name') as HTMLInputElement)?.value || "";
                    const lastName = (document.getElementById('edit-last-name') as HTMLInputElement)?.value || "";
                    const email = (document.getElementById('edit-email') as HTMLInputElement)?.value || "";
                    const gradYear = (document.getElementById('edit-grad-year') as HTMLInputElement)?.value || "";
                    
                    // Save changes directly to state for immediate UI update
                    setDivers(prev => 
                      prev.map(d => 
                        d.id === editingDiver.id 
                          ? {...d, firstName, lastName, email, 
                             // Convert gradYear to number to match type
                             gradYear: gradYear ? parseInt(gradYear) : d.gradYear} 
                          : d
                      )
                    );
                    
                    // Close dialog immediately for better UX
                    setEditDiverDialogOpen(false);
                    
                    // Show success message and clear editing state
                    toast({
                      title: "Changes Saved",
                      description: "Diver profile has been updated successfully"
                    });
                    
                    // Save to database after UI updates
                    updateDiverMutation.mutate({
                      diverId: editingDiver.id,
                      diverData: {
                        firstName,
                        lastName,
                        email,
                        // Convert gradYear to number to match type
                        gradYear: gradYear ? parseInt(gradYear) : editingDiver.gradYear
                      }
                    });
                  } catch (error) {
                    console.error("Error saving diver:", error);
                    toast({
                      title: "Error Saving",
                      description: "There was a problem saving the diver information",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}