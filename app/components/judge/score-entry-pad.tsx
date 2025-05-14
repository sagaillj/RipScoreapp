'use client';

import React, { useState } from 'react';
import { Dive } from '../../lib/types';

interface ScoreEntryPadProps {
  dive?: Dive;
  onScoreSubmit: (score: number) => void;
  isSubmitting?: boolean;
}

export function ScoreEntryPad({ dive, onScoreSubmit, isSubmitting = false }: ScoreEntryPadProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  
  // Score options (0.5 to 10 with 0.5 increments)
  const scoreOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 0.5);
  
  const handleScoreSelect = (score: number) => {
    setSelectedScore(score);
  };
  
  const handleSubmit = () => {
    if (selectedScore !== null) {
      onScoreSubmit(selectedScore);
      setSelectedScore(null); // Reset after submission
    }
  };
  
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      {/* Dive Information */}
      {dive ? (
        <div className="mb-4">
          <h3 className="text-lg font-medium">{dive.name}</h3>
          <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded bg-muted/40 px-2 py-1">
              <span className="text-muted-foreground">Dive #:</span>{' '}
              <span className="font-medium">{dive.number}</span>
            </div>
            <div className="rounded bg-muted/40 px-2 py-1">
              <span className="text-muted-foreground">DD:</span>{' '}
              <span className="font-medium">{dive.difficulty.toFixed(1)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-md bg-muted/40 p-4 text-center text-muted-foreground">
          <p>Waiting for next dive</p>
        </div>
      )}

      {/* Current Score Display */}
      <div className="mb-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Your Score</div>
          <div className="text-5xl font-bold">
            {selectedScore !== null ? selectedScore.toFixed(1) : '—'}
          </div>
        </div>
      </div>

      {/* Score Buttons Grid */}
      <div className="grid grid-cols-5 gap-2">
        {scoreOptions.map((score) => (
          <button
            key={score}
            onClick={() => handleScoreSelect(score)}
            className={`rounded-md p-2 text-center font-medium transition-colors
              ${
                selectedScore === score
                  ? 'bg-aqua text-white'
                  : 'border border-border bg-card hover:bg-muted'
              }
              ${score <= 4 ? 'border-error/30 hover:border-error/50' : ''}
              ${score > 4 && score <= 7 ? 'border-orange/30 hover:border-orange/50' : ''}
              ${score > 7 ? 'border-success/30 hover:border-success/50' : ''}
            `}
            disabled={isSubmitting}
          >
            {score.toFixed(1)}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedScore === null || isSubmitting || !dive}
        className="mt-4 w-full rounded-md bg-aqua px-4 py-3 font-medium text-white hover:bg-aqua/90 focus:outline-none focus:ring-2 focus:ring-aqua/50 disabled:bg-slate/50 disabled:text-white/70"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            Submitting...
          </div>
        ) : (
          'Submit Score'
        )}
      </button>
    </div>
  );
}