'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/auth/auth-provider';

export default function AppPage() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading) {
      if (authState.isAuthenticated) {
        router.push('/app/dashboard');
      } else {
        router.push('/app/login');
      }
    }
  }, [authState, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-midnight">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-aqua border-t-transparent"></div>
    </div>
  );
}