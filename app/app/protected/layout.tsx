'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/auth-provider';
import { Sidebar } from '../../components/layout/sidebar';
import { TopBar } from '../../components/layout/topbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/app/login');
    }
  }, [authState, router]);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-aqua border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything while redirect happens
  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}