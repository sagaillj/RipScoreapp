'use client';

import React, { useState, Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useAuth } from '../auth/auth-provider';
import { UserRole } from '../../lib/types';

// Helper to format pathname into page title
const getPageTitle = (pathname: string) => {
  // Remove /app/ prefix and capitalize
  const path = pathname.replace(/^\/app\//, '');
  
  if (path === 'dashboard') return 'Dashboard';
  
  // Handle nested routes like /app/meets/new
  if (path.includes('/')) {
    const segments = path.split('/');
    if (segments[0] === 'meets' && segments[1] === 'new') {
      return 'New Meet';
    }
    if (segments[0] === 'roster' && segments.length > 1) {
      return 'Diver Profile';
    }
    if (segments[0] === 'meets' && segments.length > 1) {
      return 'Meet Details';
    }
  }
  
  // Format routes with hyphens
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function TopBar() {
  const { authState, logout, switchRole } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Role badge colors
  const roleBadgeColors: Record<UserRole, string> = {
    coach: 'bg-success/20 text-success',
    diver: 'bg-aqua/20 text-aqua',
    judge: 'bg-orange/20 text-orange',
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Page Title */}
        <h1 className="text-xl font-semibold">{getPageTitle(pathname || '')}</h1>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex h-9 items-center rounded-full border border-border bg-background px-2 hover:bg-muted">
              <span className="mr-2 text-sm">{authState.user?.name}</span>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${roleBadgeColors[authState.user?.role || 'diver']}`}>
                {authState.user?.role}
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card p-1 shadow-lg">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">{authState.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{authState.user?.email}</p>
                </div>
                
                <div className="h-px bg-border my-1"></div>
                
                {/* Role Switcher for Development */}
                <div className="px-2 py-1.5">
                  <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                    Development
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => switchRole('coach')}
                      className={`rounded px-2 py-1 text-xs ${
                        authState.user?.role === 'coach'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted/40 text-muted-foreground hover:bg-success/10 hover:text-success'
                      }`}
                    >
                      Coach
                    </button>
                    <button
                      onClick={() => switchRole('diver')}
                      className={`rounded px-2 py-1 text-xs ${
                        authState.user?.role === 'diver'
                          ? 'bg-aqua/20 text-aqua'
                          : 'bg-muted/40 text-muted-foreground hover:bg-aqua/10 hover:text-aqua'
                      }`}
                    >
                      Diver
                    </button>
                    <button
                      onClick={() => switchRole('judge')}
                      className={`rounded px-2 py-1 text-xs ${
                        authState.user?.role === 'judge'
                          ? 'bg-orange/20 text-orange'
                          : 'bg-muted/40 text-muted-foreground hover:bg-orange/10 hover:text-orange'
                      }`}
                    >
                      Judge
                    </button>
                  </div>
                </div>
                
                <div className="h-px bg-border my-1"></div>
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => logout()}
                      className={`w-full rounded px-2 py-1.5 text-left text-sm ${
                        active ? 'bg-destructive/10 text-destructive' : 'text-foreground'
                      }`}
                    >
                      Log out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}