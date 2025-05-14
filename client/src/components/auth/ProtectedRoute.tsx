import React, { useEffect, useState } from 'react';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  component: React.ComponentType;
  path?: string;
  roleRequired?: UserRole;
}

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  roleRequired 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if the user is authenticated
    const storedUserJson = localStorage.getItem('user');
    
    if (storedUserJson) {
      try {
        const storedUser = JSON.parse(storedUserJson) as StoredUser;
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // If role is required, check if user has that role
        if (roleRequired) {
          setIsAuthorized(storedUser.role === roleRequired);
        } else {
          setIsAuthorized(true);
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        setIsAuthenticated(false);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAuthorized(false);
    }
  }, [roleRequired]);
  
  // Show loading state while checking authentication
  if (isAuthenticated === null || isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  }
  
  // Redirect to appropriate dashboard if not authorized for this role
  if (isAuthorized === false && user) {
    // Redirect to the proper dashboard based on user's role
    if (user.role === 'coach') {
      return <Redirect to="/coach/dashboard" />;
    } else if (user.role === 'diver') {
      return <Redirect to="/diver/dashboard" />;
    } else {
      return <Redirect to="/dashboard" />;
    }
  }
  
  // Render the protected component if authenticated and authorized
  return <Component />;
};