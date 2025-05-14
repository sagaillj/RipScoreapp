// User role type
export type UserRole = 'coach' | 'diver' | 'judge';

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  // Include other properties based on schema
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Team interface
export interface Team {
  id: number;
  name: string;
  code: string;
  coachId: number;
}

// Diver interface
export interface Diver {
  id: number;
  userId: number;
  teamId: number;
  age: number;
  gender: string;
  user?: User;
  team?: Team;
}

// Meet interface
export interface Meet {
  id: number;
  name: string;
  location: string;
  date: Date;
  status: 'upcoming' | 'active' | 'completed';
  createdBy: number;
}

// Dive interface
export interface Dive {
  id: number;
  meetId: number;
  diverId: number;
  number: number;
  name: string;
  difficulty: number;
  completed: boolean;
}

// Score interface
export interface Score {
  id: number;
  diveId: number;
  judgeId: number;
  score: number;
}

// Meet Participant interface
export interface MeetParticipant {
  meetId: number;
  diverId: number;
}

// Meet Judge interface
export interface MeetJudge {
  meetId: number;
  judgeId: number;
}