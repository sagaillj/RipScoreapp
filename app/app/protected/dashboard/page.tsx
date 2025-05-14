'use client';

import React from 'react';
import { useAuth } from '../../../components/auth/auth-provider';

export default function DashboardPage() {
  const { authState } = useAuth();
  const user = authState.user;

  // Role-specific dashboard content
  const renderRoleDashboard = () => {
    switch (user?.role) {
      case 'coach':
        return <CoachDashboard user={user} />;
      case 'diver':
        return <DiverDashboard user={user} />;
      case 'judge':
        return <JudgeDashboard user={user} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-aqua border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Your {user.role} dashboard</p>
      </div>

      {renderRoleDashboard()}
    </>
  );
}

// Coach Dashboard Component
function CoachDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Your Teams" 
          value="2" 
          description="Active teams under your coaching"
          icon="👥"
          linkText="Manage Teams"
          linkHref="/app/protected/teams"
        />
        <DashboardCard 
          title="Next Meet" 
          value="May 15" 
          description="Regional Championship at Aquatic Center"
          icon="🏊"
          linkText="View Details"
          linkHref="/app/protected/meets/upcoming"
        />
        <DashboardCard 
          title="Divers" 
          value="12" 
          description="Athletes registered under your teams"
          icon="🤿"
          linkText="View All Divers"
          linkHref="/app/protected/divers"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-medium">Upcoming Meets</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
              <div>
                <div className="font-medium text-foreground">Regional Championship {i}</div>
                <div className="text-sm text-muted-foreground">May {10 + i}, 2023 • Aquatic Center</div>
              </div>
              <button className="rounded-md bg-aqua px-3 py-1 text-sm text-white hover:bg-aqua/90">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Diver Dashboard Component
function DiverDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Your Team" 
          value="Gold Dolphins" 
          description="Coach: Sarah Wilson"
          icon="🏊"
          linkText="Team Profile"
          linkHref="/app/protected/team-profile"
        />
        <DashboardCard 
          title="Next Competition" 
          value="May 15" 
          description="Regional Championship at Aquatic Center"
          icon="🏆"
          linkText="View Details"
          linkHref="/app/protected/meets/upcoming"
        />
        <DashboardCard 
          title="Your DD" 
          value="2.6" 
          description="Average Degree of Difficulty"
          icon="📊"
          linkText="View Stats"
          linkHref="/app/protected/stats"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-medium">Your Recent Dives</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
              <div>
                <div className="font-medium text-foreground">Forward 2½ Somersault Pike</div>
                <div className="text-sm text-muted-foreground">Score: {7.5 + i/10} • DD: 2.8</div>
              </div>
              <div className="text-lg font-semibold text-success">
                {(7.5 + i/10) * 2.8}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Judge Dashboard Component
function JudgeDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Active Meets" 
          value="2" 
          description="Currently assigned to judge"
          icon="⚖️"
          linkText="View Assignments"
          linkHref="/app/protected/judge/assignments"
        />
        <DashboardCard 
          title="Next Session" 
          value="Today" 
          description="Regional Championship - Platform Diving"
          icon="📅"
          linkText="Begin Judging"
          linkHref="/app/protected/judge/1"
          actionButton={true}
        />
        <DashboardCard 
          title="Scores Submitted" 
          value="145" 
          description="Total scores submitted this season"
          icon="📊"
          linkText="View History"
          linkHref="/app/protected/judge/history"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-medium">Upcoming Assignments</h2>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
              <div>
                <div className="font-medium text-foreground">Regional Championship - Session {i}</div>
                <div className="text-sm text-muted-foreground">May {10 + i}, 2023 • Aquatic Center</div>
              </div>
              <button className="rounded-md bg-orange px-3 py-1 text-sm text-white hover:bg-orange/90">
                Begin
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Shared Dashboard Card Component
function DashboardCard({ 
  title, 
  value, 
  description, 
  icon, 
  linkText,
  linkHref,
  actionButton = false 
}: { 
  title: string;
  value: string;
  description: string;
  icon: string;
  linkText: string;
  linkHref: string;
  actionButton?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full bg-primary/10 p-2 text-xl">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">
        <a
          href={linkHref}
          className={`inline-block rounded-md ${
            actionButton 
              ? 'bg-aqua text-white hover:bg-aqua/90' 
              : 'bg-muted text-foreground hover:bg-muted/80'
          } px-3 py-1.5 text-sm font-medium transition-colors`}
        >
          {linkText}
        </a>
      </div>
    </div>
  );
}