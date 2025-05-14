import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Layers, 
  Award, 
  Calendar, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Target,
  Timer,
  TrendingUp,
  Brain,
  Archive,
  ListChecks,
  Video,
  Smile,
  Compass,
  Sparkles,
  PlaySquare,
  Mail,
  Phone,
  CreditCard,
  Bell,
  Share2,
  Clipboard,
  Upload
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/slider';

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  isPink?: boolean;
};

// Coach sidebar items based on site map
const coachItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Layers className="h-5 w-5" />,
    roles: ['coach'],
  },
  {
    name: 'Team',
    path: '/team',
    icon: <Users className="h-5 w-5" />,
    roles: ['coach'],
  },
  {
    name: 'Schedule',
    path: '/coach/schedule',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['coach'],
  },
  {
    name: 'Meet Runner',
    path: '/coach/meet-runner',
    icon: <FileText className="h-5 w-5" />,
    roles: ['coach'],
  },
  {
    name: 'Diving Data',
    path: '/analytics',
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ['coach'],
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['coach'],
  },
];

// Diver sidebar items based on site map
const diverItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Layers className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'AI Recommendations',
    path: '/recommendations',
    icon: <Sparkles className="h-5 w-5" />,
    roles: ['diver'],
    isPink: true,
  },
  {
    name: 'Meet Reviews',
    path: '/meet-reviews',
    icon: <PlaySquare className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'Team Stats',
    path: '/team-stats',
    icon: <Users className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'Mental Prep',
    path: '/mental',
    icon: <Brain className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'Archive',
    path: '/archive',
    icon: <Archive className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'Default Lists',
    path: '/lists',
    icon: <ListChecks className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'Goals',
    path: '/goals',
    icon: <Target className="h-5 w-5" />,
    roles: ['diver'],
  },
  {
    name: 'Dive Sheet',
    path: '/dives',
    icon: <FileText className="h-5 w-5" />,
    roles: ['diver'],
    isPink: true,
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: <Smile className="h-5 w-5" />,
    roles: ['diver'],
  },
];

// Judge sidebar items
const judgeItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Layers className="h-5 w-5" />,
    roles: ['judge'],
  },
  {
    name: 'Judge Panel',
    path: '/judge',
    icon: <BarChart2 className="h-5 w-5" />,
    roles: ['judge'],
    isPink: true,
  },
  {
    name: 'Meets',
    path: '/meets',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['judge'],
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['judge'],
  },
];

// Combine all sidebar items
const sidebarItems: SidebarItem[] = [
  ...coachItems,
  ...diverItems,
  ...judgeItems,
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>("Tennessee Volunteers");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Get sidebar state from localStorage, default to true if not found
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState !== null ? savedState === 'true' : true;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  
  // Image editing states
  const [cropMode, setCropMode] = useState<'profile' | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
  }, [isSidebarOpen]);
  
  useEffect(() => {
    // Check localStorage for user info
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
        setUserName(user.name);
        // Check if user has profile image stored
        const profileImage = localStorage.getItem('userProfileImage');
        if (profileImage) {
          setUserProfileImage(profileImage);
        }
        // In a real app, we would fetch the team name from the backend
        // For now, we'll use a hardcoded value
        setTeamName("Tennessee Volunteers");
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  }, []);
  
  // Image editing handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageToEdit(event.target.result as string);
        setCropMode('profile');
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setImagePosition({
      x: imagePosition.x + deltaX,
      y: imagePosition.y + deltaY
    });
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  const handleZoomChange = (value: number) => {
    setImageZoom(value);
  };
  
  const handleSaveProfileImage = () => {
    // In a real app, we would upload the cropped image to the server
    // For now, we'll just save it to localStorage
    localStorage.setItem('userProfileImage', imageToEdit || '');
    setUserProfileImage(imageToEdit);
    setCropMode(null);
  };
  
  const handleCancelImageEdit = () => {
    setCropMode(null);
    setImageToEdit(null);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const filteredItems = sidebarItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!userRole) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="dashboard flex h-screen bg-[var(--color-background-post)]">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed left-4 top-4 z-50 rounded-full bg-[var(--color-accent-post)] p-2 text-white shadow-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
      


      {/* Sidebar - reduced padding for compact appearance */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform bg-[var(--color-card-post)] text-white transition-all duration-300 ease-in-out shadow-xl md:relative flex flex-col h-full ${
          isSidebarOpen 
            ? 'translate-x-0 w-40 p-3' 
            : 'md:w-10 md:translate-x-0 -translate-x-full'
        }`}
      >
        {/* Desktop sidebar toggle - HubSpot style - centered */}
        <button
          className="absolute -right-2.5 top-1/2 transform -translate-y-1/2 z-50 h-5 w-5 items-center justify-center rounded-full border border-[var(--color-border-post)] bg-[var(--color-card-post)] text-[var(--color-muted-post)] shadow-sm transition-all duration-150 hover:text-[var(--color-text-post)] hidden md:flex"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronRight className="h-3 w-3 rotate-180" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
        <div className={`mb-4 flex items-center justify-center transition-all duration-200 ${!isSidebarOpen && 'mt-3'}`}>
          {isSidebarOpen ? (
            <span className="text-2xl font-bold whitespace-nowrap pl-3">
              <span className="text-[var(--color-accent-post)]">Rip</span>
              <span className="text-[var(--color-text-post)]">Score</span>
              <span className="text-[var(--color-accent2-post)]">.</span>
            </span>
          ) : (
            <span className="text-2xl font-bold">
              <span className="text-[var(--color-accent-post)]">R</span>
              <span className="text-[var(--color-accent2-post)]">.</span>
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          {filteredItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`group flex items-center rounded-lg text-sm ${
                  isActive
                    ? 'bg-[var(--color-accent-post)]/10 text-[var(--color-accent-post)]'
                    : item.isPink
                      ? 'text-[var(--color-accent2-post)] hover:bg-[var(--color-accent2-post)]/20 hover:text-[var(--color-accent2-post)]'
                      : 'text-[var(--color-muted-post)] hover:bg-[var(--color-accent-post)]/10 hover:text-[var(--color-text-post)]'
                } ${isSidebarOpen ? 'py-2 pl-3' : 'h-10 justify-center'}`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                {isSidebarOpen ? (
                  <>
                    <div className="w-6 flex items-center justify-center">
                      <span className={item.isPink ? 'text-[var(--color-accent2-post)]' : ''}>
                        {item.icon}
                      </span>
                    </div>
                    <span className="ml-2 whitespace-nowrap">{item.name}</span>
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <span className={item.isPink ? 'text-[var(--color-accent2-post)]' : ''}>
                      {item.icon}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User profile card - moved to bottom of sidebar with mt-auto */}
        <div className={`mt-auto mb-0 rounded-xl overflow-hidden bg-[#141f38] border border-[var(--color-border-post)] shadow-sm ${!isSidebarOpen && 'md:mx-auto md:w-8'} cursor-pointer`}
          onClick={() => setShowProfileModal(true)}
        >
          <div className="relative h-10 bg-gradient-to-r from-[var(--color-accent-post)] to-[var(--color-accent2-post)] p-2">
            <div className={`h-8 w-8 overflow-hidden rounded-full border-2 border-[var(--color-accent2-post)] bg-[var(--color-card-post)] ${
              isSidebarOpen 
                ? 'absolute -bottom-4 left-3' 
                : 'absolute -bottom-4 left-1/2 transform -translate-x-1/2'
            }`}>
              {userProfileImage ? (
                <img 
                  src={userProfileImage}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-bold">
                  {isSidebarOpen 
                    ? userName?.charAt(0) || '?' 
                    : (userName?.split(' ').map(n => n.charAt(0)).join('') || '?')}
                </div>
              )}
            </div>
          </div>
          
          {isSidebarOpen ? (
            <div className="p-3 pt-5">
              <div className="flex flex-col mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-text-post)] text-sm">{userName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering profile modal
                      handleLogout();
                    }}
                    className="rounded-md bg-[var(--color-background-post)] p-1.5 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)]/80 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Team name with smaller font, clickable */}
                <div 
                  className="text-xs text-[var(--color-muted-post)] mt-1 cursor-pointer hover:text-[var(--color-accent-post)] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering profile modal
                    // Show team switcher (we'll implement this later)
                    setShowTeamSwitcher(true);
                  }}
                >
                  {teamName}
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-5 pb-2 flex flex-col items-center justify-center w-full">
              <div className="flex justify-center mb-1">
                <div className="text-[11px] font-medium text-center text-[var(--color-accent-post)]">
                  {userName?.split(' ').map(n => n.charAt(0)).join('') || '?'}
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering profile modal
                    handleLogout();
                  }}
                  className="rounded-full bg-[var(--color-background-post)] p-1 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)]/80 transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </div>

      {/* Team Switcher Modal */}
      {showTeamSwitcher && (
        <Dialog open={showTeamSwitcher} onOpenChange={setShowTeamSwitcher}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Switch Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 my-4">
              {/* This would be a list of teams from the API */}
              <div 
                className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setTeamName("Tennessee Volunteers");
                  setShowTeamSwitcher(false);
                }}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold mr-3">T</div>
                  <div>
                    <p className="font-medium">Tennessee Volunteers</p>
                    <p className="text-xs text-gray-500">NCAA Division I</p>
                  </div>
                </div>
                {teamName === "Tennessee Volunteers" && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
              </div>
              
              <div 
                className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setTeamName("Union College Bulldogs");
                  setShowTeamSwitcher(false);
                }}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-3">U</div>
                  <div>
                    <p className="font-medium">Union College Bulldogs</p>
                    <p className="text-xs text-gray-500">NCAA Division III</p>
                  </div>
                </div>
                {teamName === "Union College Bulldogs" && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-[var(--color-card-post)] rounded-xl max-w-2xl w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[var(--color-muted-post)] hover:bg-[var(--color-background-post)] hover:text-[var(--color-text-post)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center mb-6">
              <div className="relative group h-16 w-16 overflow-hidden rounded-full bg-[var(--color-background-post)] mr-4 flex items-center justify-center">
                {userProfileImage ? (
                  <img 
                    src={userProfileImage}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
                    {userName?.charAt(0) || '?'}
                  </div>
                )}
                
                {/* Hover overlay for upload */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  aria-label="Upload profile photo"
                  onChange={handleFileUpload}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-post)]">{userName}</h2>
                <p className="text-[var(--color-muted-post)]">{teamName}</p>
                <p className="text-sm capitalize text-[var(--color-muted-post)]">{userRole}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-[var(--color-text-post)] mb-2">Contact Information</h3>
                  <div className="rounded-md border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50 p-4">
                    <div className="flex items-start mb-3">
                      <Mail className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Email</div>
                        <div className="text-[var(--color-text-post)]">coach@tennessee.edu</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Phone</div>
                        <div className="text-[var(--color-text-post)]">(555) 123-4567</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-[var(--color-text-post)] mb-2">Billing Information</h3>
                  <div className="rounded-md border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50 p-4">
                    <div className="flex items-start mb-3">
                      <CreditCard className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Plan</div>
                        <div className="text-[var(--color-text-post)]">Gold ($999/year)</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Next billing date</div>
                        <div className="text-[var(--color-text-post)]">August 15, 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-[var(--color-text-post)] mb-2">Teams & Divers</h3>
                  <div className="rounded-md border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50 p-4">
                    <div className="flex items-start mb-3">
                      <Users className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Teams</div>
                        <div className="text-[var(--color-text-post)]">1 (Tennessee Volunteers)</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Divers</div>
                        <div className="text-[var(--color-text-post)]">12 (8 licenses remaining)</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-[var(--color-text-post)] mb-2">Notifications & Referrals</h3>
                  <div className="rounded-md border border-[var(--color-border-post)] bg-[var(--color-background-post)]/50 p-4">
                    <div className="flex items-start mb-3">
                      <Bell className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Email Notifications</div>
                        <div className="text-[var(--color-text-post)]">Enabled</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Share2 className="h-5 w-5 mt-0.5 mr-3 text-[var(--color-muted-post)]" />
                      <div>
                        <div className="text-xs text-[var(--color-muted-post)]">Referral Code</div>
                        <div className="text-[var(--color-text-post)]">TENN25</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded-md px-4 py-2 bg-[var(--color-accent-post)] text-white hover:bg-[var(--color-accent-post)]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Crop Dialog */}
      <Dialog open={cropMode !== null} onOpenChange={(isOpen) => !isOpen && handleCancelImageEdit()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile Photo</DialogTitle>
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
                  onMouseDown={(e) => {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={handleImageDrag}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={imageToEdit} 
                      alt="Profile" 
                      className="max-w-full max-h-full"
                      style={{
                        transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                        transformOrigin: 'center',
                        objectFit: 'contain'
                      }}
                      draggable={false}
                    />
                    
                    {/* Circular crop overlay for profile photo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full border-2 border-white" />
                    </div>
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
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex justify-between items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={handleCancelImageEdit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfileImage}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}