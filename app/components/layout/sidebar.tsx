'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../auth/auth-provider';
import { UserRole } from '../../lib/types';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  TrophyIcon,
  ClipboardIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/app/dashboard',
    icon: HomeIcon,
    roles: ['coach', 'diver', 'judge'],
  },
  // Coach-specific routes
  {
    name: 'Roster',
    href: '/app/roster',
    icon: UsersIcon,
    roles: ['coach'],
  },
  {
    name: 'Meets',
    href: '/app/meets',
    icon: TrophyIcon,
    roles: ['coach'],
  },
  {
    name: 'Schedule',
    href: '/app/schedule',
    icon: CalendarIcon,
    roles: ['coach'],
  },
  {
    name: 'Analytics',
    href: '/app/analytics',
    icon: ChartBarIcon,
    roles: ['coach'],
  },
  {
    name: 'Settings',
    href: '/app/settings',
    icon: CogIcon,
    roles: ['coach'],
  },
  // Diver-specific routes
  {
    name: 'My Dives',
    href: '/app/my-dives',
    icon: ClipboardIcon,
    roles: ['diver'],
  },
  {
    name: 'Performance',
    href: '/app/performance',
    icon: ArrowTrendingUpIcon,
    roles: ['diver'],
  },
  {
    name: 'Goals',
    href: '/app/goals',
    icon: LightBulbIcon,
    roles: ['diver'],
  },
  {
    name: 'Archive',
    href: '/app/archive',
    icon: ArchiveBoxIcon,
    roles: ['diver'],
  },
  {
    name: 'Team',
    href: '/app/team',
    icon: UserGroupIcon,
    roles: ['diver'],
  },
  // Judge route is shown elsewhere
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { authState } = useAuth();
  const pathname = usePathname();
  const userRole = authState.user?.role;

  if (!userRole) return null;

  // Filter navigation based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <nav
      className={`relative flex flex-col overflow-y-auto bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <div className="flex items-center justify-center">
          {!collapsed && (
            <div className="text-lg font-bold text-white">
              <span className="text-aqua">Rip</span>Score.app
            </div>
          )}
          {collapsed && <span className="text-lg font-bold text-aqua">R</span>}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 transition-colors ${
                  pathname === item.href
                    ? 'bg-sidebar-accent/10 text-sidebar-accent'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/5 hover:text-sidebar-accent'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    pathname === item.href ? 'text-sidebar-accent' : 'text-sidebar-foreground'
                  }`}
                />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}

          {/* Special case for Judge - show link to judge interface */}
          {userRole === 'judge' && (
            <li>
              <Link
                href="/app/judge"
                className={`flex items-center rounded-md px-3 py-2 transition-colors ${
                  pathname === '/app/judge'
                    ? 'bg-sidebar-accent/10 text-sidebar-accent'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/5 hover:text-sidebar-accent'
                }`}
              >
                <ClipboardIcon
                  className={`h-5 w-5 flex-shrink-0 ${
                    pathname === '/app/judge' ? 'text-sidebar-accent' : 'text-sidebar-foreground'
                  }`}
                />
                {!collapsed && <span className="ml-3">Score Dives</span>}
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-sidebar-accent p-1.5 text-sidebar-accent-foreground shadow-md hover:bg-sidebar-accent/90 focus:outline-none"
      >
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </button>
    </nav>
  );
}