'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/auth-provider';
import { ScoreEntryPad } from '../../../components/judge/score-entry-pad';
import { Dive } from '../../../lib/types';

// Mock data for active dive
const mockActiveDive: Dive = {
  id: 101,
  meetId: 1,
  diverId: 2,
  number: 3,
  name: 'Forward 2½ Somersaults Pike',
  difficulty: 2.3,
  completed: false,
};

// Mock diver info
const mockDiverInfo = {
  name: 'Emma Johnson',
  team: 'Dolphins',
  age: 17,
};

export default function JudgeMeetPage({ params }: { params: { meetId: string } }) {
  const { authState } = useAuth();
  const [activeDive, setActiveDive] = useState<Dive | null>(mockActiveDive);
  const [diverInfo, setDiverInfo] = useState(mockDiverInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [scoringEnabled, setScoringEnabled] = useState(true);

  // In production, we would fetch the meet and active dive information
  // based on the meetId from params
  const meetId = params.meetId;

  const handleScoreSubmit = async (score: number) => {
    setIsSubmitting(true);
    
    try {
      // In production, this would be an API call
      // await fetch(`/api/scores`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     diveId: activeDive?.id,
      //     judgeId: authState.user?.id,
      //     score
      //   })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful submission
      setLastScore(score);
      setScoringEnabled(false);
      
      // Simulate getting the next dive after a delay
      setTimeout(() => {
        // This would come from the server in production
        setLastScore(null);
        setScoringEnabled(true);
      }, 5000);
    } catch (error) {
      console.error('Error submitting score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="mx-auto max-w-xl p-4">
      <div className="mb-6 rounded-lg bg-midnight p-4 text-white">
        <h1 className="mb-2 text-2xl font-bold">Judge Scoring Panel</h1>
        <p className="text-slate">
          Meet ID: {meetId} • Judge: {authState.user.name}
        </p>
      </div>

      {/* Diver Information */}
      {activeDive && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">{diverInfo.name}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded bg-muted/40 px-3 py-2">
              <span className="text-muted-foreground">Team:</span>{' '}
              <span className="font-medium">{diverInfo.team}</span>
            </div>
            <div className="rounded bg-muted/40 px-3 py-2">
              <span className="text-muted-foreground">Age:</span>{' '}
              <span className="font-medium">{diverInfo.age}</span>
            </div>
          </div>
        </div>
      )}

      {/* Last Score Notification */}
      {lastScore !== null && (
        <div className="mb-6 rounded-lg bg-success/10 p-4 text-center">
          <p className="text-sm text-success">Score submitted successfully</p>
          <p className="text-3xl font-bold text-success">{lastScore.toFixed(1)}</p>
          <p className="mt-2 text-sm">Waiting for next diver...</p>
        </div>
      )}

      {/* Score Entry Pad */}
      {scoringEnabled ? (
        <ScoreEntryPad
          dive={activeDive || undefined}
          onScoreSubmit={handleScoreSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="mb-2 h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Score Submitted</h3>
          <p className="mt-1 text-muted-foreground">
            Waiting for the next dive to be announced
          </p>
        </div>
      )}
    </div>
  );
}