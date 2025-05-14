'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/app');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-midnight">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-aqua border-t-transparent"></div>
    </div>
  );
}