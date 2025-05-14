export type UserRole = 'coach' | 'diver' | 'judge' | 'admin';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: number;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  coachId: number;
  createdAt: string;
}

export interface Season {
  id: number;
  teamId: number;
  name: string;
  startYear: number;
  endYear: number;
  status: 'active' | 'archived';
  createdBy: number;
  createdAt: string;
}

export interface SeasonCycle {
  id: number;
  seasonId: number;
  type: 'preseason' | 'regular' | 'postseason' | 'offseason';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Meet {
  id: number;
  name: string;
  location: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
  createdBy: number;
  createdAt: string;
}

export interface SeasonMeet {
  id: number;
  seasonId: number;
  meetId: number;
  opponent: string;
  isHome: boolean;
  cycleType: 'preseason' | 'regular' | 'postseason' | 'offseason';
  startTime: string;
  createdAt: string;
  meet: Meet;
}

export interface PracticeSchedule {
  id: number;
  seasonId: number;
  name: string;
  type: 'weightroom' | 'dryland' | 'diving' | 'mental' | 'other';
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

export interface MeetItinerary {
  id: number;
  seasonId: number;
  name: string;
  isDefault: boolean;
  details: any;
  createdAt: string;
}