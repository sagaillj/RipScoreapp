import React from 'react';
import { TeamAchievements } from '@/components/achievements/TeamAchievements';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function TeamAchievementsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto py-8 px-4">
        <TeamAchievements />
      </div>
    </PageWrapper>
  );
}