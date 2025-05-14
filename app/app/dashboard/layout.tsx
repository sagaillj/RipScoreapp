import React from 'react';
import ProtectedLayout from '../protected/layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}