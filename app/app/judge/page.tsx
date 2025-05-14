'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/auth/auth-provider';
import { Meet } from '../../lib/types';

// Mock active meets for judging
const mockMeets: Meet[] = [
  {
    id: 1,
    name: 'State Championships',
    location: 'Aquatic Center, Springfield',
    date: new Date('2025-05-15'),
    status: 'active',
    createdBy: 1
  },
  {
    id: 2,
    name: 'Regional Qualifiers',
    location: 'University Pool, Riverside',
    date: new Date('2025-04-28'),
    status: 'active',
    createdBy: 1
  }
];

export default function JudgePage() {
  const { authState } = useAuth();
  const [activeMeets, setActiveMeets] = useState<Meet[]>(mockMeets);
  const [isLoading, setIsLoading] = useState(false);

  // This would fetch data from the API in production
  useEffect(() => {
    // Fetch active meets where this judge is assigned
    // const fetchActiveMeets = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch(`/api/judges/${authState.user?.id}/meets?status=active`);
    //     if (response.ok) {
    //       const data = await response.json();
    //       setActiveMeets(data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching meets:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    
    // if (authState.user?.id) {
    //   fetchActiveMeets();
    // }
  }, [authState.user?.id]);

  if (!authState.user || authState.user.role !== 'judge') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <div className="rounded-lg bg-error/10 p-4 text-center text-error">
          <h2 className="mb-2 text-xl font-bold">Access Denied</h2>
          <p>Only judges can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Judge Panel</h1>
        <p className="mt-1 text-muted-foreground">
          Select an active meet to begin scoring dives.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-aqua border-t-transparent"></div>
        </div>
      ) : activeMeets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {activeMeets.map((meet) => (
            <Link
              key={meet.id}
              href={`/app/judge/${meet.id}`}
              className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-aqua/70 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold group-hover:text-aqua">
                  {meet.name}
                </h3>
                <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                  ACTIVE
                </span>
              </div>
              <div className="mb-3 text-sm text-muted-foreground">
                <div className="mb-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {meet.location}
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(meet.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="mt-auto rounded-md bg-aqua/10 p-2 text-center text-sm font-medium text-aqua group-hover:bg-aqua/20">
                Start Judging
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No Active Meets</h3>
          <p className="mt-2 text-muted-foreground">
            You are not assigned to judge any active meets at this time.
          </p>
        </div>
      )}
    </div>
  );
}