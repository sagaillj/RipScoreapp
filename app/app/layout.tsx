import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import { Providers } from '../components/shared/providers';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RipScore.app - Dive Scoring Platform',
  description: 'Professional diving competition scoring and management platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}