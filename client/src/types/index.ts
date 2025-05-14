export type UserRole = 'coach' | 'diver' | 'judge';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Team {
  id: number;
  name: string;
  logo?: string;
  schoolUrl?: string;
  coachId: number;
  division?: string;
  createdAt: string;
  updatedAt: string;
}

export interface License {
  id: string;
  name: string;
  price: number;
  description: string;
  includedDivers: number;
  features: string[];
}

export interface Diver {
  id: number;
  name: string;
  email?: string;
  teamId: number;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeInfo {
  success: boolean;
  error?: string;
  college?: {
    name: string;
    logo?: string;
    division?: string;
    coachName?: string;
    coachPhoto?: string;
    coachBio?: string;
    numberOfDivers?: number;
  };
  team?: {
    roster: {
      name: string;
      year: string;
      position: string;
    }[];
    schedule: {
      date: string;
      opponent: string;
      location: string;
    }[];
  };
}