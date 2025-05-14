'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '../../lib/types';

// Sample user data for development
const sampleUsers: Record<UserRole, User> = {
  coach: {
    id: 1,
    name: 'John Smith',
    email: 'coach@example.com',
    role: 'coach',
  },
  diver: {
    id: 2,
    name: 'Emma Johnson',
    email: 'diver@example.com',
    role: 'diver',
  },
  judge: {
    id: 3,
    name: 'Robert Davis',
    email: 'judge@example.com',
    role: 'judge',
  },
};

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth context interface
interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // For development/testing only
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Check if user is already logged in
  useEffect(() => {
    // In production, this would verify a session or JWT token
    const checkAuth = async () => {
      try {
        // For development, we'll check localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // In production, this would make an API call to authenticate
    try {
      // For development, we'll simulate a successful login
      // with a 500ms delay to mimic network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Accept any username/password combination as valid
      // Default to a coach role if not specified in email
      let role: UserRole = 'coach';
      
      // Try to extract role from email, if it follows our pattern
      if (email.includes('@')) {
        const emailPrefix = email.split('@')[0];
        if (['coach', 'diver', 'judge'].includes(emailPrefix)) {
          role = emailPrefix as UserRole;
        }
      }
      
      // Use the predefined user for the selected role
      const user = sampleUsers[role];
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update auth state
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    
    // Reset auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Development-only function to switch between user roles
  const switchRole = (role: UserRole) => {
    const user = sampleUsers[role];
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update auth state
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}